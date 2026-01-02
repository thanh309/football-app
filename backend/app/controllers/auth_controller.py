"""
AuthController - Authentication HTTP endpoints.
Thin controller that delegates to AuthService.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.services.auth_service import AuthService
from app.schemas.auth import (
    LoginRequest, RegisterRequest, AuthResponse, ChangePasswordRequest
)
from app.schemas.user import UserAccountResponse
from app.schemas.common import MessageResponse
from app.dependencies.auth import get_current_user
from app.models.user import UserAccount
from app.utils.security import create_access_token, create_refresh_token, verify_refresh_token

router = APIRouter()


def get_auth_service(db: AsyncSession = Depends(get_db)) -> AuthService:
    """Dependency to get AuthService instance."""
    return AuthService(db)


def user_to_response(user: UserAccount) -> UserAccountResponse:
    """Convert UserAccount model to response."""
    return UserAccountResponse(
        userId=user.user_id,
        username=user.username,
        email=user.email,
        passwordHash=user.password_hash,
        roles=user.roles,
        status=user.status.value,
        isVerified=user.is_verified,
        createdAt=user.created_at.isoformat(),
        updatedAt=user.updated_at.isoformat(),
        contactInfo=user.contact_info,
        location=user.location,
        latitude=user.latitude,
        longitude=user.longitude,
    )


@router.post("/login", response_model=AuthResponse)
async def login(
    data: LoginRequest,
    auth_service: AuthService = Depends(get_auth_service)
):
    """Authenticate user and return tokens."""
    try:
        user, access_token, refresh_token = await auth_service.login(
            data.username, data.password
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))
    
    return AuthResponse(
        accessToken=access_token,
        refreshToken=refresh_token,
        user=user_to_response(user),
    )


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(
    data: RegisterRequest,
    auth_service: AuthService = Depends(get_auth_service)
):
    """Register a new user."""
    try:
        user = await auth_service.register(
            username=data.username,
            email=data.email,
            password=data.password,
            roles=data.roles,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    
    # Create tokens
    access_token = create_access_token({"sub": user.user_id})
    refresh_token = create_refresh_token({"sub": user.user_id})
    
    return AuthResponse(
        accessToken=access_token,
        refreshToken=refresh_token,
        user=user_to_response(user),
    )


@router.post("/logout", response_model=MessageResponse)
async def logout(user: UserAccount = Depends(get_current_user)):
    """Logout current user."""
    return MessageResponse(message="Logged out successfully")


@router.post("/refresh", response_model=AuthResponse)
async def refresh_token(
    refresh_token: str,
    auth_service: AuthService = Depends(get_auth_service)
):
    """Refresh access token."""
    payload = verify_refresh_token(refresh_token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    
    user_id = payload.get("sub")
    user = await auth_service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    
    new_access_token = create_access_token({"sub": user.user_id})
    new_refresh_token = create_refresh_token({"sub": user.user_id})
    
    return AuthResponse(
        accessToken=new_access_token,
        refreshToken=new_refresh_token,
        user=user_to_response(user),
    )


@router.get("/me", response_model=UserAccountResponse)
async def get_current_user_profile(user: UserAccount = Depends(get_current_user)):
    """Get current user profile."""
    return user_to_response(user)


@router.put("/password", response_model=MessageResponse)
async def change_password(
    data: ChangePasswordRequest,
    user: UserAccount = Depends(get_current_user),
    auth_service: AuthService = Depends(get_auth_service)
):
    """Change user password."""
    try:
        await auth_service.change_password(user, data.currentPassword, data.newPassword)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    
    return MessageResponse(message="Password changed successfully")
