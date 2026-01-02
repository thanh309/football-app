"""
Notification schemas matching frontend types.
"""
from typing import Optional
from pydantic import BaseModel


class NotificationResponse(BaseModel):
    """Notification response matching frontend Notification type."""
    notificationId: int
    userId: int
    type: str
    title: str
    message: str
    relatedEntityId: Optional[int] = None
    relatedEntityType: Optional[str] = None
    isRead: bool
    createdAt: str
    
    class Config:
        from_attributes = True


class NotificationPreferenceResponse(BaseModel):
    """Notification preference response matching frontend NotificationPreference type."""
    preferenceId: int
    userId: int
    notificationType: str
    isEnabled: bool
    pushEnabled: bool
    emailEnabled: bool
    createdAt: str
    updatedAt: str
    
    class Config:
        from_attributes = True


class NotificationPreferenceUpdate(BaseModel):
    """Notification preference update matching frontend UpdatePreferencesRequest."""
    notificationType: str
    isEnabled: Optional[bool] = None
    pushEnabled: Optional[bool] = None
    emailEnabled: Optional[bool] = None
