"""
Notification repository.
"""
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update

from app.repositories.base_repository import BaseRepository
from app.models.notification import Notification


class NotificationRepository(BaseRepository[Notification]):
    """Repository for Notification operations."""
    
    def __init__(self, db: AsyncSession):
        super().__init__(Notification, db)
    
    async def find_by_user(self, user_id: int, unread_only: bool = False) -> List[Notification]:
        """Find notifications for a user."""
        stmt = select(Notification).where(Notification.user_id == user_id)
        
        if unread_only:
            stmt = stmt.where(Notification.is_read == False)
        
        result = await self.db.execute(stmt.order_by(Notification.created_at.desc()))
        return list(result.scalars().all())
    
    async def mark_as_read(self, notification_id: int) -> bool:
        """Mark notification as read."""
        await self.db.execute(
            update(Notification)
            .where(Notification.notification_id == notification_id)
            .values(is_read=True)
        )
        return True
    
    async def mark_all_read(self, user_id: int) -> int:
        """Mark all notifications as read for user."""
        result = await self.db.execute(
            update(Notification)
            .where(Notification.user_id == user_id, Notification.is_read == False)
            .values(is_read=True)
        )
        return result.rowcount
