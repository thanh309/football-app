"""
Notification models: Notification, NotificationPreference.
"""
from datetime import datetime
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Text, Integer, Boolean, DateTime, Enum as SQLEnum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.enums import NotificationType

if TYPE_CHECKING:
    from app.models.user import UserAccount


class Notification(Base):
    """User notification for system events."""
    __tablename__ = "notification"
    
    notification_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user_account.user_id"), nullable=False, index=True)
    type: Mapped[NotificationType] = mapped_column(SQLEnum(NotificationType), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    related_entity_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    related_entity_type: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    is_read: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    
    # Relationships
    user: Mapped["UserAccount"] = relationship("UserAccount", back_populates="notifications")
    
    def __repr__(self) -> str:
        return f"<Notification(id={self.notification_id}, type={self.type.value})>"


class NotificationPreference(Base):
    """User preferences for notifications - global settings per user."""
    __tablename__ = "notification_preference"
    
    preference_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user_account.user_id"), nullable=False, unique=True, index=True)
    
    # Global notification settings
    email_notifications: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    push_notifications: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    
    # Category-specific settings
    match_reminders: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    team_updates: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    booking_updates: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    community_updates: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, 
        nullable=False, 
        default=datetime.utcnow, 
        onupdate=datetime.utcnow
    )
    
    def __repr__(self) -> str:
        return f"<NotificationPreference(user={self.user_id})>"
