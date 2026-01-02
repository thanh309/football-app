"""
User and Session repositories.
"""
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.repositories.base_repository import BaseRepository
from app.models.user import UserAccount, Session


class UserRepository(BaseRepository[UserAccount]):
    """Repository for UserAccount operations."""
    
    def __init__(self, db: AsyncSession):
        super().__init__(UserAccount, db)
    
    async def find_by_username(self, username: str) -> Optional[UserAccount]:
        """Find user by username."""
        result = await self.db.execute(
            select(UserAccount).where(UserAccount.username == username)
        )
        return result.scalar_one_or_none()
    
    async def find_by_email(self, email: str) -> Optional[UserAccount]:
        """Find user by email."""
        result = await self.db.execute(
            select(UserAccount).where(UserAccount.email == email)
        )
        return result.scalar_one_or_none()
    
    async def find_by_id(self, user_id: int) -> Optional[UserAccount]:
        """Find user by ID."""
        result = await self.db.execute(
            select(UserAccount).where(UserAccount.user_id == user_id)
        )
        return result.scalar_one_or_none()


class SessionRepository(BaseRepository[Session]):
    """Repository for Session operations."""
    
    def __init__(self, db: AsyncSession):
        super().__init__(Session, db)
    
    async def find_by_user_id(self, user_id: int) -> Optional[Session]:
        """Find active session by user ID."""
        result = await self.db.execute(
            select(Session).where(Session.user_id == user_id)
        )
        return result.scalar_one_or_none()
    
    async def find_by_session_id(self, session_id: str) -> Optional[Session]:
        """Find session by session ID."""
        result = await self.db.execute(
            select(Session).where(Session.session_id == session_id)
        )
        return result.scalar_one_or_none()
