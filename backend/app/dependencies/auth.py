"""
Authentication dependencies for FastAPI.
"""
from typing import Optional, List
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.user import UserAccount
from app.models.enums import AccountStatus, UserRole
from app.utils.security import verify_access_token

# OAuth2 scheme for token extraction
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)


async def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
) -> UserAccount:
    """
    Get the current authenticated user from JWT token.
    Raises 401 if token is invalid or user not found.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    if not token:
        raise credentials_exception
    
    payload = verify_access_token(token)
    if not payload:
        raise credentials_exception
    
    user_id: int = payload.get("sub")
    if user_id is None:
        raise credentials_exception
    
    # Fetch user from database
    result = await db.execute(
        select(UserAccount).where(UserAccount.user_id == user_id)
    )
    user = result.scalar_one_or_none()
    
    if user is None:
        raise credentials_exception
    
    # Check if user is active
    if user.status != AccountStatus.ACTIVE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Account is {user.status.value.lower()}"
        )
    
    return user


async def get_current_user_optional(
    token: Optional[str] = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
) -> Optional[UserAccount]:
    """
    Get the current authenticated user, or None if not authenticated.
    Does not raise exception for unauthenticated requests.
    """
    if not token:
        return None
    
    try:
        return await get_current_user(token, db)
    except HTTPException:
        return None


def require_role(*required_roles: str):
    """
    Dependency factory that checks if the user has any of the required roles.
    
    Usage:
        @router.get("/admin", dependencies=[Depends(require_role("Moderator"))])
        async def admin_only(user: UserAccount = Depends(get_current_user)):
            ...
    """
    async def role_checker(user: UserAccount = Depends(get_current_user)) -> UserAccount:
        user_roles = set(user.roles)
        required = set(required_roles)
        
        if not user_roles.intersection(required):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions"
            )
        return user
    
    return role_checker


# Pre-built role checkers for convenience
require_player = require_role(UserRole.PLAYER.value)
require_team_leader = require_role(UserRole.TEAM_LEADER.value)
require_field_owner = require_role(UserRole.FIELD_OWNER.value)
require_moderator = require_role(UserRole.MODERATOR.value)
