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
