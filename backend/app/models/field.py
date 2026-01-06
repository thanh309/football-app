"""
Field-related models: FieldProfile, FieldCalendar, FieldPricingRule, CancellationPolicy, Amenity, FieldAmenity.
"""
from datetime import datetime, date, time
from decimal import Decimal
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, Text, Float, Integer, Boolean, Date, Time, DateTime, Numeric, Enum as SQLEnum, JSON, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.enums import FieldStatus, CalendarStatus

if TYPE_CHECKING:
    from app.models.user import UserAccount
    from app.models.booking import BookingRequest
    from app.models.match import MatchEvent
    from app.models.media import MediaAsset


class FieldProfile(Base):
    """Football field/stadium profile."""
    __tablename__ = "field_profile"
    
    field_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("user_account.user_id"), nullable=False, index=True)
    field_name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    location: Mapped[str] = mapped_column(String(500), nullable=False)
    latitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    longitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    default_price_per_hour: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    capacity: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    status: Mapped[FieldStatus] = mapped_column(
        SQLEnum(FieldStatus), 
        nullable=False, 
        default=FieldStatus.PENDING
    )
    rejection_reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, 
        nullable=False, 
        default=datetime.utcnow, 
        onupdate=datetime.utcnow
    )
    cover_image_id: Mapped[Optional[int]] = mapped_column(ForeignKey("media_asset.asset_id", ondelete="SET NULL"), nullable=True)
    
    # Relationships
    owner: Mapped["UserAccount"] = relationship("UserAccount", back_populates="owned_fields")
    cover_image: Mapped[Optional["MediaAsset"]] = relationship("MediaAsset", foreign_keys=[cover_image_id], lazy="joined")
    calendar_slots: Mapped[List["FieldCalendar"]] = relationship("FieldCalendar", back_populates="field", cascade="all, delete-orphan")
    pricing_rules: Mapped[List["FieldPricingRule"]] = relationship("FieldPricingRule", back_populates="field", cascade="all, delete-orphan")
    cancellation_policy: Mapped[Optional["CancellationPolicy"]] = relationship("CancellationPolicy", back_populates="field", uselist=False, cascade="all, delete-orphan")
    amenities: Mapped[List["FieldAmenity"]] = relationship("FieldAmenity", back_populates="field", cascade="all, delete-orphan")
    booking_requests: Mapped[List["BookingRequest"]] = relationship("BookingRequest", back_populates="field")
    matches: Mapped[List["MatchEvent"]] = relationship("MatchEvent", back_populates="field")
    
    def __repr__(self) -> str:
        return f"<FieldProfile(id={self.field_id}, name='{self.field_name}')>"


class FieldCalendar(Base):
    """Field availability slots."""
    __tablename__ = "field_calendar"
    
    calendar_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    field_id: Mapped[int] = mapped_column(ForeignKey("field_profile.field_id"), nullable=False, index=True)
    date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    start_time: Mapped[time] = mapped_column(Time, nullable=False)
    end_time: Mapped[time] = mapped_column(Time, nullable=False)
    status: Mapped[CalendarStatus] = mapped_column(
        SQLEnum(CalendarStatus), 
        nullable=False, 
        default=CalendarStatus.AVAILABLE
    )
    booking_id: Mapped[Optional[int]] = mapped_column(ForeignKey("booking_request.booking_id"), nullable=True)
    
    # Relationships
    field: Mapped["FieldProfile"] = relationship("FieldProfile", back_populates="calendar_slots")
    booking: Mapped[Optional["BookingRequest"]] = relationship("BookingRequest", back_populates="calendar_slot")
    
    def __repr__(self) -> str:
        return f"<FieldCalendar(field={self.field_id}, date={self.date}, status={self.status.value})>"


class FieldPricingRule(Base):
    """Time-based pricing rules for fields."""
    __tablename__ = "field_pricing_rule"
    
    pricing_rule_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    field_id: Mapped[int] = mapped_column(ForeignKey("field_profile.field_id"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    day_of_week: Mapped[Optional[List[str]]] = mapped_column(JSON, nullable=True)  # List of DayOfWeek values
    start_time: Mapped[time] = mapped_column(Time, nullable=False)
    end_time: Mapped[time] = mapped_column(Time, nullable=False)
    price_per_hour: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    priority: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, 
        nullable=False, 
        default=datetime.utcnow, 
        onupdate=datetime.utcnow
    )
    
    # Relationships
    field: Mapped["FieldProfile"] = relationship("FieldProfile", back_populates="pricing_rules")
    
    def __repr__(self) -> str:
        return f"<FieldPricingRule(field={self.field_id}, name='{self.name}')>"


class CancellationPolicy(Base):
    """Cancellation rules for fields."""
    __tablename__ = "cancellation_policy"
    
    policy_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    field_id: Mapped[int] = mapped_column(ForeignKey("field_profile.field_id"), unique=True, nullable=False, index=True)
    free_cancellation_hours: Mapped[int] = mapped_column(Integer, nullable=False, default=24)
    late_cancellation_penalty_percent: Mapped[Decimal] = mapped_column(Numeric(5, 2), nullable=False, default=Decimal("50.00"))
    no_show_penalty_percent: Mapped[Decimal] = mapped_column(Numeric(5, 2), nullable=False, default=Decimal("100.00"))
    refund_processing_days: Mapped[int] = mapped_column(Integer, nullable=False, default=7)
    policy_description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, 
        nullable=False, 
        default=datetime.utcnow, 
        onupdate=datetime.utcnow
    )
    
    # Relationships
    field: Mapped["FieldProfile"] = relationship("FieldProfile", back_populates="cancellation_policy")
    
    def __repr__(self) -> str:
        return f"<CancellationPolicy(field={self.field_id})>"


class Amenity(Base):
    """Lookup table for amenity types."""
    __tablename__ = "amenity"
    
    amenity_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    icon: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    
    # Relationships
    field_amenities: Mapped[List["FieldAmenity"]] = relationship("FieldAmenity", back_populates="amenity")
    
    def __repr__(self) -> str:
        return f"<Amenity(id={self.amenity_id}, name='{self.name}')>"


class FieldAmenity(Base):
    """Junction table linking fields to amenities."""
    __tablename__ = "field_amenity"
    
    field_amenity_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    field_id: Mapped[int] = mapped_column(ForeignKey("field_profile.field_id"), nullable=False, index=True)
    amenity_id: Mapped[int] = mapped_column(ForeignKey("amenity.amenity_id"), nullable=False, index=True)
    quantity: Mapped[Optional[int]] = mapped_column(Integer, nullable=True, default=1)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Relationships
    field: Mapped["FieldProfile"] = relationship("FieldProfile", back_populates="amenities")
    amenity: Mapped["Amenity"] = relationship("Amenity", back_populates="field_amenities")
    
    def __repr__(self) -> str:
        return f"<FieldAmenity(field={self.field_id}, amenity={self.amenity_id})>"
