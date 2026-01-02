"""
Match-related models: MatchEvent, MatchInvitation, AttendanceRecord, MatchResult.
"""
from datetime import datetime, date, time
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, Text, Integer, Date, Time, DateTime, Enum as SQLEnum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.enums import MatchStatus, Visibility, InvitationStatus, AttendanceStatus

if TYPE_CHECKING:
    from app.models.team import TeamProfile
    from app.models.field import FieldProfile
    from app.models.booking import BookingRequest
    from app.models.player import PlayerProfile
    from app.models.user import UserAccount


class MatchEvent(Base):
    """Scheduled match event between teams."""
    __tablename__ = "match_event"
    
    match_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    host_team_id: Mapped[int] = mapped_column(ForeignKey("team_profile.team_id"), nullable=False, index=True)
    opponent_team_id: Mapped[Optional[int]] = mapped_column(ForeignKey("team_profile.team_id"), nullable=True, index=True)
    field_id: Mapped[Optional[int]] = mapped_column(ForeignKey("field_profile.field_id"), nullable=True, index=True)
    booking_id: Mapped[Optional[int]] = mapped_column(ForeignKey("booking_request.booking_id"), nullable=True)
    match_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    start_time: Mapped[time] = mapped_column(Time, nullable=False)
    end_time: Mapped[Optional[time]] = mapped_column(Time, nullable=True)
    status: Mapped[MatchStatus] = mapped_column(
        SQLEnum(MatchStatus), 
        nullable=False, 
        default=MatchStatus.PENDING_APPROVAL
    )
    visibility: Mapped[Visibility] = mapped_column(
        SQLEnum(Visibility), 
        nullable=False, 
        default=Visibility.PUBLIC
    )
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, 
        nullable=False, 
        default=datetime.utcnow, 
        onupdate=datetime.utcnow
    )
    
    # Relationships
    host_team: Mapped["TeamProfile"] = relationship("TeamProfile", back_populates="hosted_matches", foreign_keys=[host_team_id])
    opponent_team: Mapped[Optional["TeamProfile"]] = relationship("TeamProfile", back_populates="opponent_matches", foreign_keys=[opponent_team_id])
    field: Mapped[Optional["FieldProfile"]] = relationship("FieldProfile", back_populates="matches")
    booking: Mapped[Optional["BookingRequest"]] = relationship("BookingRequest", back_populates="match")
    invitations: Mapped[List["MatchInvitation"]] = relationship("MatchInvitation", back_populates="match", cascade="all, delete-orphan")
    attendance_records: Mapped[List["AttendanceRecord"]] = relationship("AttendanceRecord", back_populates="match", cascade="all, delete-orphan")
    result: Mapped[Optional["MatchResult"]] = relationship("MatchResult", back_populates="match", uselist=False, cascade="all, delete-orphan")
    
    def __repr__(self) -> str:
        return f"<MatchEvent(id={self.match_id}, host={self.host_team_id}, date={self.match_date})>"


class MatchInvitation(Base):
    """Match invitation sent between teams."""
    __tablename__ = "match_invitation"
    
    invitation_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    match_id: Mapped[int] = mapped_column(ForeignKey("match_event.match_id"), nullable=False, index=True)
    inviting_team_id: Mapped[int] = mapped_column(ForeignKey("team_profile.team_id"), nullable=False, index=True)
    invited_team_id: Mapped[int] = mapped_column(ForeignKey("team_profile.team_id"), nullable=False, index=True)
    status: Mapped[InvitationStatus] = mapped_column(
        SQLEnum(InvitationStatus), 
        nullable=False, 
        default=InvitationStatus.PENDING
    )
    message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    responded_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    
    # Relationships
    match: Mapped["MatchEvent"] = relationship("MatchEvent", back_populates="invitations")
    inviting_team: Mapped["TeamProfile"] = relationship("TeamProfile", back_populates="sent_invitations", foreign_keys=[inviting_team_id])
    invited_team: Mapped["TeamProfile"] = relationship("TeamProfile", back_populates="received_invitations", foreign_keys=[invited_team_id])
    
    def __repr__(self) -> str:
        return f"<MatchInvitation(id={self.invitation_id}, match={self.match_id})>"


class AttendanceRecord(Base):
    """Player attendance for match events."""
    __tablename__ = "attendance_record"
    
    attendance_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    match_id: Mapped[int] = mapped_column(ForeignKey("match_event.match_id"), nullable=False, index=True)
    player_id: Mapped[int] = mapped_column(ForeignKey("player_profile.player_id"), nullable=False, index=True)
    team_id: Mapped[int] = mapped_column(ForeignKey("team_profile.team_id"), nullable=False, index=True)
    status: Mapped[AttendanceStatus] = mapped_column(
        SQLEnum(AttendanceStatus), 
        nullable=False, 
        default=AttendanceStatus.PENDING
    )
    confirmed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    confirmed_by: Mapped[Optional[int]] = mapped_column(ForeignKey("user_account.user_id"), nullable=True)
    
    # Relationships
    match: Mapped["MatchEvent"] = relationship("MatchEvent", back_populates="attendance_records")
    player: Mapped["PlayerProfile"] = relationship("PlayerProfile", back_populates="attendance_records")
    
    def __repr__(self) -> str:
        return f"<AttendanceRecord(match={self.match_id}, player={self.player_id})>"


class MatchResult(Base):
    """Final outcome of a completed match."""
    __tablename__ = "match_result"
    
    result_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    match_id: Mapped[int] = mapped_column(ForeignKey("match_event.match_id"), unique=True, nullable=False, index=True)
    home_score: Mapped[int] = mapped_column(Integer, nullable=False)
    away_score: Mapped[int] = mapped_column(Integer, nullable=False)
    winner_id: Mapped[Optional[int]] = mapped_column(ForeignKey("team_profile.team_id"), nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    recorded_by: Mapped[int] = mapped_column(ForeignKey("user_account.user_id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    
    # Relationships
    match: Mapped["MatchEvent"] = relationship("MatchEvent", back_populates="result")
    
    def __repr__(self) -> str:
        return f"<MatchResult(match={self.match_id}, score={self.home_score}-{self.away_score})>"
