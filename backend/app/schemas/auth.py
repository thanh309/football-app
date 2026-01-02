"""
Authentication schemas matching frontend authService types.
"""
from typing import List
from pydantic import BaseModel, EmailStr

from app.schemas.user import UserAccountResponse


class LoginRequest(BaseModel):
    """Login request matching frontend LoginRequest type."""
    username: str
    password: str


class RegisterRequest(BaseModel):
    """Registration request matching frontend RegisterRequest type."""
    username: str
    email: EmailStr
    password: str
    roles: List[str]


class AuthResponse(BaseModel):
    """Auth response matching frontend AuthResponse type."""
    accessToken: str
    refreshToken: str
    user: UserAccountResponse


class ChangePasswordRequest(BaseModel):
    """Change password request matching frontend ChangePasswordRequest type."""
    currentPassword: str
    newPassword: str


class RefreshTokenRequest(BaseModel):
    """Refresh token request."""
    refreshToken: str


class RefreshTokenResponse(BaseModel):
    """Refresh token response."""
    accessToken: str
