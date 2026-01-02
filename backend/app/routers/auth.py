"""
Authentication router - handles login, register, logout, and password management.
Maps to frontend authService endpoints.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.user import UserAccount
from app.models.player import PlayerProfile
from app.models.enums import AccountStatus, UserRole
from app.schemas.auth import (
    LoginRequest, 
    RegisterRequest, 
    AuthResponse, 
    ChangePasswordRequest,
    RefreshTokenRequest,
    RefreshTokenResponse
)
from app.schemas.user import UserAccountResponse
from app.utils.security import (
    hash_password, 
    verify_password, 
    create_access_token, 
    create_refresh_token,
    verify_refresh_token
)
from app.dependencies.auth import get_current_user

router = APIRouter()


@router.post("/login", response_model=AuthResponse)
async def login(
    data: LoginRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Authenticate user and return tokens.
    Maps to: authService.login()
    """
    # Find user by username
    result = await db.execute(
        select(UserAccount).where(UserAccount.username == data.username)
    )
    user = result.scalar_one_or_none()
    
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    
    # Check account status
    if user.status != AccountStatus.ACTIVE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Account is {user.status.value.lower()}"
        )
    
    # Create tokens
    token_data = {"sub": user.user_id}
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)
    
    return AuthResponse(
        accessToken=access_token,
        refreshToken=refresh_token,
        user=UserAccountResponse.from_orm_model(user)
    )


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(
    data: RegisterRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Register a new user account.
    Maps to: authService.register()
    """
    # Check if username exists
    result = await db.execute(
        select(UserAccount).where(UserAccount.username == data.username)
    )
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Check if email exists
    result = await db.execute(
        select(UserAccount).where(UserAccount.email == data.email)
    )
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create user account
    user = UserAccount(
        username=data.username,
        email=data.email,
        password_hash=hash_password(data.password),
        roles=data.roles,
        status=AccountStatus.ACTIVE,  # Auto-activate for now (email verification mocked)
        is_verified=True
    )
    db.add(user)
    await db.flush()  # Get user_id
    
    # If user has Player role, create empty player profile
    if UserRole.PLAYER.value in data.roles:
        player_profile = PlayerProfile(
            user_id=user.user_id,
            display_name=data.username  # Default display name
        )
        db.add(player_profile)
    
    await db.commit()
    await db.refresh(user)
    
    # Create tokens
    token_data = {"sub": user.user_id}
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)
    
    return AuthResponse(
        accessToken=access_token,
        refreshToken=refresh_token,
        user=UserAccountResponse.from_orm_model(user)
    )


@router.post("/logout")
async def logout(user: UserAccount = Depends(get_current_user)):
    """
    Logout current user (client should clear tokens).
    Maps to: authService.logout()
    """
    # In a production system, you might invalidate the token in a blacklist
    # For now, we just return success and let the client clear tokens
    return {"message": "Successfully logged out"}


@router.post("/refresh", response_model=RefreshTokenResponse)
async def refresh_token(
    data: RefreshTokenRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Refresh access token using refresh token.
    Maps to: authService.refreshToken()
    """
    payload = verify_refresh_token(data.refreshToken)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
    
    user_id = payload.get("sub")
    
    # Verify user still exists and is active
    result = await db.execute(
        select(UserAccount).where(UserAccount.user_id == user_id)
    )
    user = result.scalar_one_or_none()
    
    if not user or user.status != AccountStatus.ACTIVE:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive"
        )
    
    # Create new access token
    token_data = {"sub": user.user_id}
    new_access_token = create_access_token(token_data)
    
    return RefreshTokenResponse(accessToken=new_access_token)


@router.get("/me", response_model=UserAccountResponse)
async def get_current_user_info(user: UserAccount = Depends(get_current_user)):
    """
    Get current authenticated user's info.
    Maps to: authService.getCurrentUser()
    """
    return UserAccountResponse.from_orm_model(user)


@router.put("/password")
async def change_password(
    data: ChangePasswordRequest,
    user: UserAccount = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Change user password.
    Maps to: authService.changePassword()
    """
    # Verify current password
    if not verify_password(data.currentPassword, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    # Update password
    user.password_hash = hash_password(data.newPassword)
    await db.commit()
    
    return {"message": "Password changed successfully"}
