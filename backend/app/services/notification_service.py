"""
NotificationService - Notification business logic.
Maps to NotificationController in class diagram.
"""
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.notification_repository import NotificationRepository
from app.models.notification import Notification
from app.models.enums import NotificationType


class NotificationService:
    """Service handling notification business logic."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
        self.notification_repo = NotificationRepository(db)
    
    async def get_notifications(
        self,
        user_id: int,
        unread_only: bool = False
    ) -> List[Notification]:
        """Get notifications for a user."""
        return await self.notification_repo.find_by_user(user_id, unread_only)
    
    async def mark_as_read(self, notification_id: int) -> bool:
        """Mark notification as read."""
        await self.notification_repo.mark_as_read(notification_id)
        await self.notification_repo.commit()
        return True
    
    async def mark_all_read(self, user_id: int) -> int:
        """Mark all notifications as read."""
        count = await self.notification_repo.mark_all_read(user_id)
        await self.notification_repo.commit()
        return count
    
    async def create_notification(
        self,
        user_id: int,
        notification_type: NotificationType,
        title: str,
        message: str,
        related_entity_id: int = None,
        related_entity_type: str = None,
    ) -> Notification:
        """Create a new notification."""
        notification = Notification(
            user_id=user_id,
            type=notification_type,
            title=title,
            message=message,
            related_entity_id=related_entity_id,
            related_entity_type=related_entity_type,
        )
        await self.notification_repo.save(notification)
        await self.notification_repo.commit()
        return notification
