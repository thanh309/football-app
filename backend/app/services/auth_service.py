"""
AuthService - Authentication business logic.
Maps to AuthController in class diagram.
"""
from typing import Optional, Tuple
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.user_repository import UserRepository, SessionRepository
from app.models.user import UserAccount, Session
from app.models.enums import AccountStatus, UserRole
from app.utils.security import hash_password, verify_password, create_access_token, create_refresh_token
from app.config import get_settings

settings = get_settings()


class AuthService:
    """Service handling authentication business logic."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
        self.user_repo = UserRepository(db)
        self.session_repo = SessionRepository(db)
    
    async def register(
        self,
        username: str,
        email: str,
        password: str,
        roles: list[str]
    ) -> UserAccount:
        """
        Register a new user.
        Validates uniqueness and creates account.
        """
        # Check username uniqueness
        existing = await self.user_repo.find_by_username(username)
        if existing:
            raise ValueError("Username already exists")
        
        # Check email uniqueness
        existing = await self.user_repo.find_by_email(email)
        if existing:
            raise ValueError("Email already registered")
        
        # Team Leader must also be a Player
        if UserRole.TEAM_LEADER.value in roles and UserRole.PLAYER.value not in roles:
            roles.append(UserRole.PLAYER.value)
        
        # Create user
        user = UserAccount(
            username=username,
            email=email,
            password_hash=hash_password(password),
            roles=roles,
            status=AccountStatus.ACTIVE,
            is_verified=True,  # Skip email verification for now
        )
        
        await self.user_repo.save(user)
        await self.db.flush()
        
        # Create Player Profile if role is Player
        if UserRole.PLAYER.value in roles:
            from app.models.player import PlayerProfile
            player_profile = PlayerProfile(
                user_id=user.user_id,
                display_name=username, # Default display name
                bio="New player",
                skill_level=5
            )
            # Use player repo from init or just use session directly? 
            # AuthService init has player_repo? No.
            # I should use session or add player_repo to init.
            # But simpler to just add to db.
            self.db.add(player_profile)
        
        await self.user_repo.commit()
        
        return user
    
    async def login(self, username: str, password: str) -> Tuple[UserAccount, str, str]:
        """
        Authenticate user and create tokens.
        Returns: (user, access_token, refresh_token)
        """
        user = await self.user_repo.find_by_username(username)
        
        if not user:
            raise ValueError("Invalid credentials")
        
        if not verify_password(password, user.password_hash):
            raise ValueError("Invalid credentials")
        
        if user.status != AccountStatus.ACTIVE:
            raise ValueError(f"Account is {user.status.value}")
        
        # Create tokens
        access_token = create_access_token({"sub": str(user.user_id)})
        refresh_token = create_refresh_token({"sub": str(user.user_id)})
        
        return user, access_token, refresh_token
    
    async def get_user_by_id(self, user_id: int) -> Optional[UserAccount]:
        """Get user by ID."""
        return await self.user_repo.find_by_id(user_id)
    
    async def change_password(
        self,
        user: UserAccount,
        current_password: str,
        new_password: str
    ) -> bool:
        """Change user password."""
        if not verify_password(current_password, user.password_hash):
            raise ValueError("Current password is incorrect")
        
        user.password_hash = hash_password(new_password)
        await self.user_repo.update(user)
        await self.user_repo.commit()
        
        return True
