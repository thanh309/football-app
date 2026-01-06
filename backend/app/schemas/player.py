"""
Player profile schemas matching frontend PlayerProfile type.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class PlayerProfileBase(BaseModel):
    """Base player profile fields."""
    displayName: str
    position: Optional[str] = None
    skillLevel: Optional[int] = None
    bio: Optional[str] = None
    profileImage: Optional[str] = None
    dateOfBirth: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    preferredFoot: Optional[str] = None


class PlayerProfileCreate(PlayerProfileBase):
    """Player profile creation."""
    pass


class PlayerProfileUpdate(BaseModel):
    """Player profile update - all fields optional."""
    displayName: Optional[str] = None
    position: Optional[str] = None
    skillLevel: Optional[int] = None
    bio: Optional[str] = None
    profileImage: Optional[str] = None
    profileImageUrl: Optional[str] = None  # URL for new profile image
    removeProfileImage: Optional[bool] = False  # Flag to remove current profile image
    dateOfBirth: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    preferredFoot: Optional[str] = None


class PlayerProfileResponse(BaseModel):
    """Player profile response matching frontend PlayerProfile type."""
    playerId: int
    userId: int
    displayName: str
    position: Optional[str] = None
    skillLevel: Optional[int] = None
    bio: Optional[str] = None
    profileImage: Optional[str] = None
    dateOfBirth: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    preferredFoot: Optional[str] = None
    createdAt: str
    updatedAt: str
    
    class Config:
        from_attributes = True
