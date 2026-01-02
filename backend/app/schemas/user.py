"""
User account schemas matching frontend UserAccount type.
"""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr

from app.models.enums import AccountStatus


class UserAccountBase(BaseModel):
    """Base user account fields."""
    username: str
    email: EmailStr
    roles: List[str]


class UserAccountCreate(UserAccountBase):
    """User account creation."""
    password: str


class UserAccountUpdate(BaseModel):
    """User account update - all fields optional."""
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    contactInfo: Optional[str] = None
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class UserAccountResponse(BaseModel):
    """User account response matching frontend UserAccount type."""
    userId: int
    username: str
    email: str
    passwordHash: str  # Note: In real API, this would be excluded
    roles: List[str]
    status: str
    isVerified: bool
    createdAt: str
    updatedAt: str
    contactInfo: Optional[str] = None
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    
    class Config:
        from_attributes = True
    
    @classmethod
    def from_orm_model(cls, user) -> "UserAccountResponse":
        """Convert ORM model to response, converting field names to camelCase."""
        return cls(
            userId=user.user_id,
            username=user.username,
            email=user.email,
            passwordHash=user.password_hash,
            roles=user.roles,
            status=user.status.value,
            isVerified=user.is_verified,
            createdAt=user.created_at.isoformat() if user.created_at else "",
            updatedAt=user.updated_at.isoformat() if user.updated_at else "",
            contactInfo=user.contact_info,
            location=user.location,
            latitude=user.latitude,
            longitude=user.longitude,
        )
