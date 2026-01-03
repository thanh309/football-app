"""
NotificationController - Notification HTTP endpoints.
Thin controller that delegates to NotificationService.
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.services.notification_service import NotificationService
from app.schemas.notification import NotificationResponse
from app.schemas.common import MessageResponse
from app.dependencies.auth import get_current_user
from app.models.user import UserAccount

router = APIRouter()


def get_notification_service(db: AsyncSession = Depends(get_db)) -> NotificationService:
    return NotificationService(db)


@router.get("", response_model=List[NotificationResponse])
async def get_notifications(
    unread_only: bool = False,
    user: UserAccount = Depends(get_current_user),
    notification_service: NotificationService = Depends(get_notification_service)
):
    """Get user notifications."""
    notifications = await notification_service.get_notifications(user.user_id, unread_only)
    return [
        NotificationResponse(
            notificationId=n.notification_id,
            userId=n.user_id,
            type=n.type.value,
            title=n.title,
            message=n.message,
            relatedEntityId=n.related_entity_id,
            relatedEntityType=n.related_entity_type,
            isRead=n.is_read,
            createdAt=n.created_at.isoformat(),
        ) for n in notifications
    ]


@router.put("/{notification_id}/read", response_model=MessageResponse)
async def mark_as_read(
    notification_id: int,
    user: UserAccount = Depends(get_current_user),
    notification_service: NotificationService = Depends(get_notification_service)
):
    """Mark notification as read."""
    await notification_service.mark_as_read(notification_id)
    return MessageResponse(message="Marked as read")


@router.put("/mark-all-read", response_model=MessageResponse)
async def mark_all_read(
    user: UserAccount = Depends(get_current_user),
    notification_service: NotificationService = Depends(get_notification_service)
):
    """Mark all notifications as read."""
    count = await notification_service.mark_all_read(user.user_id)
    return MessageResponse(message=f"Marked {count} notifications as read")


# --- Notification Preferences ---
from pydantic import BaseModel
from typing import Optional
from sqlalchemy import select

class NotificationPreferencesResponse(BaseModel):
    """Notification preferences response."""
    preferenceId: int
    userId: int
    emailNotifications: bool
    pushNotifications: bool
    matchReminders: bool
    teamUpdates: bool
    bookingUpdates: bool
    communityUpdates: bool


class NotificationPreferencesUpdate(BaseModel):
    """Update notification preferences."""
    emailNotifications: Optional[bool] = None
    pushNotifications: Optional[bool] = None
    matchReminders: Optional[bool] = None
    teamUpdates: Optional[bool] = None
    bookingUpdates: Optional[bool] = None
    communityUpdates: Optional[bool] = None


@router.get("/preferences", response_model=NotificationPreferencesResponse)
async def get_preferences(
    user: UserAccount = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get notification preferences."""
    from app.models.notification import NotificationPreference
    
    result = await db.execute(
        select(NotificationPreference).where(NotificationPreference.user_id == user.user_id)
    )
    prefs = result.scalar_one_or_none()
    
    if not prefs:
        # Create default preferences
        prefs = NotificationPreference(
            user_id=user.user_id,
            email_notifications=True,
            push_notifications=True,
            match_reminders=True,
            team_updates=True,
            booking_updates=True,
            community_updates=True,
        )
        db.add(prefs)
        await db.commit()
    
    return NotificationPreferencesResponse(
        preferenceId=prefs.preference_id,
        userId=prefs.user_id,
        emailNotifications=prefs.email_notifications,
        pushNotifications=prefs.push_notifications,
        matchReminders=prefs.match_reminders,
        teamUpdates=prefs.team_updates,
        bookingUpdates=prefs.booking_updates,
        communityUpdates=prefs.community_updates,
    )


@router.put("/preferences", response_model=NotificationPreferencesResponse)
async def update_preferences(
    data: NotificationPreferencesUpdate,
    user: UserAccount = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update notification preferences."""
    from app.models.notification import NotificationPreference
    
    result = await db.execute(
        select(NotificationPreference).where(NotificationPreference.user_id == user.user_id)
    )
    prefs = result.scalar_one_or_none()
    
    if not prefs:
        prefs = NotificationPreference(user_id=user.user_id)
        db.add(prefs)
    
    update_data = data.model_dump(exclude_unset=True)
    field_mapping = {
        "emailNotifications": "email_notifications",
        "pushNotifications": "push_notifications",
        "matchReminders": "match_reminders",
        "teamUpdates": "team_updates",
        "bookingUpdates": "booking_updates",
        "communityUpdates": "community_updates",
    }
    
    for key, value in update_data.items():
        if key in field_mapping:
            setattr(prefs, field_mapping[key], value)
    
    await db.commit()
    
    return NotificationPreferencesResponse(
        preferenceId=prefs.preference_id,
        userId=prefs.user_id,
        emailNotifications=prefs.email_notifications,
        pushNotifications=prefs.push_notifications,
        matchReminders=prefs.match_reminders,
        teamUpdates=prefs.team_updates,
        bookingUpdates=prefs.booking_updates,
        communityUpdates=prefs.community_updates,
    )

