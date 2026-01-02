"""
User and Session models.
"""
from datetime import datetime
from typing import Optional, List
from sqlalchemy import String, Text, Float, Boolean, DateTime, Enum as SQLEnum, JSON, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.enums import AccountStatus, UserRole


class UserAccount(Base):
    """User account for authentication and role management."""
    __tablename__ = "user_account"
    
    user_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    roles: Mapped[List[str]] = mapped_column(JSON, nullable=False, default=list)  # List of UserRole values
    status: Mapped[AccountStatus] = mapped_column(
        SQLEnum(AccountStatus), 
        nullable=False, 
        default=AccountStatus.PENDING
    )
    is_verified: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, 
        nullable=False, 
        default=datetime.utcnow, 
        onupdate=datetime.utcnow
    )
    contact_info: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    location: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    latitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    longitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    
    # Relationships
    sessions: Mapped[List["Session"]] = relationship("Session", back_populates="user", cascade="all, delete-orphan")
    player_profile: Mapped[Optional["PlayerProfile"]] = relationship("PlayerProfile", back_populates="user", uselist=False)
    led_teams: Mapped[List["TeamProfile"]] = relationship("TeamProfile", back_populates="leader", foreign_keys="TeamProfile.leader_id")
    owned_fields: Mapped[List["FieldProfile"]] = relationship("FieldProfile", back_populates="owner")
    posts: Mapped[List["Post"]] = relationship("Post", back_populates="author")
    comments: Mapped[List["Comment"]] = relationship("Comment", back_populates="author")
    reactions: Mapped[List["Reaction"]] = relationship("Reaction", back_populates="user")
    notifications: Mapped[List["Notification"]] = relationship("Notification", back_populates="user")
    
    def __repr__(self) -> str:
        return f"<UserAccount(id={self.user_id}, username='{self.username}')>"


class Session(Base):
    """User session for authentication state."""
    __tablename__ = "session"
    
    session_id: Mapped[str] = mapped_column(String(255), primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user_account.user_id"), nullable=False, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    expires_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    ip_address: Mapped[Optional[str]] = mapped_column(String(45), nullable=True)
    user_agent: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Relationships
    user: Mapped["UserAccount"] = relationship("UserAccount", back_populates="sessions")
    
    def __repr__(self) -> str:
        return f"<Session(id='{self.session_id[:8]}...', user_id={self.user_id})>"


# Forward references for type hints
from app.models.player import PlayerProfile
from app.models.team import TeamProfile
from app.models.field import FieldProfile
from app.models.social import Post, Comment, Reaction
from app.models.notification import Notification
