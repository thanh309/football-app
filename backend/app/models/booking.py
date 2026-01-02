"""
Booking request model.
"""
from datetime import datetime, date, time
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Text, Date, Time, DateTime, Enum as SQLEnum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.enums import BookingStatus

if TYPE_CHECKING:
    from app.models.field import FieldProfile, FieldCalendar
    from app.models.team import TeamProfile
    from app.models.user import UserAccount
    from app.models.match import MatchEvent


class BookingRequest(Base):
    """Booking request linking teams to fields."""
    __tablename__ = "booking_request"
    
    booking_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    field_id: Mapped[int] = mapped_column(ForeignKey("field_profile.field_id"), nullable=False, index=True)
    team_id: Mapped[int] = mapped_column(ForeignKey("team_profile.team_id"), nullable=False, index=True)
    requester_id: Mapped[int] = mapped_column(ForeignKey("user_account.user_id"), nullable=False, index=True)
    date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    start_time: Mapped[time] = mapped_column(Time, nullable=False)
    end_time: Mapped[time] = mapped_column(Time, nullable=False)
    status: Mapped[BookingStatus] = mapped_column(
        SQLEnum(BookingStatus), 
        nullable=False, 
        default=BookingStatus.PENDING
    )
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    processed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    
    # Relationships
    field: Mapped["FieldProfile"] = relationship("FieldProfile", back_populates="booking_requests")
    team: Mapped["TeamProfile"] = relationship("TeamProfile", back_populates="booking_requests")
    calendar_slot: Mapped[Optional["FieldCalendar"]] = relationship("FieldCalendar", back_populates="booking")
    match: Mapped[Optional["MatchEvent"]] = relationship("MatchEvent", back_populates="booking", uselist=False)
    
    def __repr__(self) -> str:
        return f"<BookingRequest(id={self.booking_id}, field={self.field_id}, team={self.team_id})>"
