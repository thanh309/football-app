"""
Team-related models: TeamProfile, TeamRoster, JoinRequest, TeamWallet, TransactionLog.
"""
from datetime import datetime
from decimal import Decimal
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, Text, Float, Integer, Boolean, DateTime, Numeric, Enum as SQLEnum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.enums import TeamStatus, RosterRole, JoinRequestStatus, TransactionType

if TYPE_CHECKING:
    from app.models.user import UserAccount
    from app.models.player import PlayerProfile
    from app.models.match import MatchEvent, MatchInvitation
    from app.models.booking import BookingRequest
    from app.models.social import Post


class TeamProfile(Base):
    """Team entity with profile and verification status."""
    __tablename__ = "team_profile"
    
    team_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    team_name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    logo_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    leader_id: Mapped[int] = mapped_column(ForeignKey("user_account.user_id"), nullable=False, index=True)
    status: Mapped[TeamStatus] = mapped_column(
        SQLEnum(TeamStatus), 
        nullable=False, 
        default=TeamStatus.PENDING
    )
    rejection_reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    location: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    latitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    longitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    skill_level: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, 
        nullable=False, 
        default=datetime.utcnow, 
        onupdate=datetime.utcnow
    )
    
    # Relationships
    leader: Mapped["UserAccount"] = relationship("UserAccount", back_populates="led_teams", foreign_keys=[leader_id])
    roster: Mapped[List["TeamRoster"]] = relationship("TeamRoster", back_populates="team", cascade="all, delete-orphan")
    join_requests: Mapped[List["JoinRequest"]] = relationship("JoinRequest", back_populates="team", cascade="all, delete-orphan")
    wallet: Mapped[Optional["TeamWallet"]] = relationship("TeamWallet", back_populates="team", uselist=False, cascade="all, delete-orphan")
    hosted_matches: Mapped[List["MatchEvent"]] = relationship("MatchEvent", back_populates="host_team", foreign_keys="MatchEvent.host_team_id")
    opponent_matches: Mapped[List["MatchEvent"]] = relationship("MatchEvent", back_populates="opponent_team", foreign_keys="MatchEvent.opponent_team_id")
    sent_invitations: Mapped[List["MatchInvitation"]] = relationship("MatchInvitation", back_populates="inviting_team", foreign_keys="MatchInvitation.inviting_team_id")
    received_invitations: Mapped[List["MatchInvitation"]] = relationship("MatchInvitation", back_populates="invited_team", foreign_keys="MatchInvitation.invited_team_id")
    booking_requests: Mapped[List["BookingRequest"]] = relationship("BookingRequest", back_populates="team")
    posts: Mapped[List["Post"]] = relationship("Post", back_populates="team")
    
    def __repr__(self) -> str:
        return f"<TeamProfile(id={self.team_id}, name='{self.team_name}')>"


class TeamRoster(Base):
    """Junction table for team-player membership."""
    __tablename__ = "team_roster"
    
    roster_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    team_id: Mapped[int] = mapped_column(ForeignKey("team_profile.team_id"), nullable=False, index=True)
    player_id: Mapped[int] = mapped_column(ForeignKey("player_profile.player_id"), nullable=False, index=True)
    role: Mapped[RosterRole] = mapped_column(
        SQLEnum(RosterRole), 
        nullable=False, 
        default=RosterRole.MEMBER
    )
    joined_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    
    # Relationships
    team: Mapped["TeamProfile"] = relationship("TeamProfile", back_populates="roster")
    player: Mapped["PlayerProfile"] = relationship("PlayerProfile", back_populates="team_memberships")
    
    # Unique constraint
    __table_args__ = (
        # Composite unique constraint on team_id and player_id
        {"mysql_charset": "utf8mb4"},
    )
    
    def __repr__(self) -> str:
        return f"<TeamRoster(team={self.team_id}, player={self.player_id}, role={self.role.value})>"


class JoinRequest(Base):
    """Player request to join a team."""
    __tablename__ = "join_request"
    
    request_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    team_id: Mapped[int] = mapped_column(ForeignKey("team_profile.team_id"), nullable=False, index=True)
    player_id: Mapped[int] = mapped_column(ForeignKey("player_profile.player_id"), nullable=False, index=True)
    status: Mapped[JoinRequestStatus] = mapped_column(
        SQLEnum(JoinRequestStatus), 
        nullable=False, 
        default=JoinRequestStatus.PENDING
    )
    message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    processed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    
    # Relationships
    team: Mapped["TeamProfile"] = relationship("TeamProfile", back_populates="join_requests")
    player: Mapped["PlayerProfile"] = relationship("PlayerProfile", back_populates="join_requests")
    
    def __repr__(self) -> str:
        return f"<JoinRequest(id={self.request_id}, team={self.team_id}, player={self.player_id})>"


class TeamWallet(Base):
    """Team financial balance tracking."""
    __tablename__ = "team_wallet"
    
    wallet_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    team_id: Mapped[int] = mapped_column(ForeignKey("team_profile.team_id"), unique=True, nullable=False, index=True)
    balance: Mapped[Decimal] = mapped_column(Numeric(15, 2), nullable=False, default=Decimal("0.00"))
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, 
        nullable=False, 
        default=datetime.utcnow, 
        onupdate=datetime.utcnow
    )
    
    # Relationships
    team: Mapped["TeamProfile"] = relationship("TeamProfile", back_populates="wallet")
    transactions: Mapped[List["TransactionLog"]] = relationship("TransactionLog", back_populates="wallet", cascade="all, delete-orphan")
    
    def __repr__(self) -> str:
        return f"<TeamWallet(team={self.team_id}, balance={self.balance})>"


class TransactionLog(Base):
    """Financial transaction record for team wallets."""
    __tablename__ = "transaction_log"
    
    transaction_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    wallet_id: Mapped[int] = mapped_column(ForeignKey("team_wallet.wallet_id"), nullable=False, index=True)
    type: Mapped[TransactionType] = mapped_column(SQLEnum(TransactionType), nullable=False)
    amount: Mapped[Decimal] = mapped_column(Numeric(15, 2), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    category: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    created_by: Mapped[int] = mapped_column(ForeignKey("user_account.user_id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    
    # Relationships
    wallet: Mapped["TeamWallet"] = relationship("TeamWallet", back_populates="transactions")
    
    def __repr__(self) -> str:
        return f"<TransactionLog(id={self.transaction_id}, type={self.type.value}, amount={self.amount})>"
