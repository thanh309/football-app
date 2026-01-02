"""
Player profile model.
"""
from datetime import datetime, date
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, Text, Float, Integer, Date, DateTime, Enum as SQLEnum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.enums import PreferredFoot

if TYPE_CHECKING:
    from app.models.user import UserAccount
    from app.models.team import TeamRoster, JoinRequest
    from app.models.match import AttendanceRecord


class PlayerProfile(Base):
    """Player-specific profile information."""
    __tablename__ = "player_profile"
    
    player_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user_account.user_id"), unique=True, nullable=False, index=True)
    display_name: Mapped[str] = mapped_column(String(255), nullable=False)
    position: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    skill_level: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)  # 1-10
    bio: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    profile_image: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    date_of_birth: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    height: Mapped[Optional[float]] = mapped_column(Float, nullable=True)  # cm
    weight: Mapped[Optional[float]] = mapped_column(Float, nullable=True)  # kg
    preferred_foot: Mapped[Optional[PreferredFoot]] = mapped_column(
        SQLEnum(PreferredFoot), 
        nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, 
        nullable=False, 
        default=datetime.utcnow, 
        onupdate=datetime.utcnow
    )
    
    # Relationships
    user: Mapped["UserAccount"] = relationship("UserAccount", back_populates="player_profile")
    team_memberships: Mapped[List["TeamRoster"]] = relationship("TeamRoster", back_populates="player")
    join_requests: Mapped[List["JoinRequest"]] = relationship("JoinRequest", back_populates="player")
    attendance_records: Mapped[List["AttendanceRecord"]] = relationship("AttendanceRecord", back_populates="player")
    
    def __repr__(self) -> str:
        return f"<PlayerProfile(id={self.player_id}, name='{self.display_name}')>"
