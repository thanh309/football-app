"""
Field-related schemas matching frontend types.
"""
from typing import Optional, List
from pydantic import BaseModel


# --- Field Profile ---
class FieldProfileCreate(BaseModel):
    """Field profile creation matching frontend CreateFieldRequest."""
    fieldName: str
    description: Optional[str] = None
    location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    defaultPricePerHour: float
    capacity: Optional[int] = None


class FieldProfileUpdate(BaseModel):
    """Field profile update."""
    fieldName: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    defaultPricePerHour: Optional[float] = None
    capacity: Optional[int] = None


class FieldProfileResponse(BaseModel):
    """Field profile response matching frontend FieldProfile type."""
    fieldId: int
    ownerId: int
    fieldName: str
    description: Optional[str] = None
    location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    defaultPricePerHour: float
    capacity: Optional[int] = None
    status: str
    rejectionReason: Optional[str] = None
    createdAt: str
    updatedAt: str
    
    class Config:
        from_attributes = True


# --- Field Calendar ---
class FieldCalendarResponse(BaseModel):
    """Field calendar slot response matching frontend FieldCalendar type."""
    calendarId: int
    fieldId: int
    date: str
    startTime: str
    endTime: str
    status: str
    bookingId: Optional[int] = None
    
    class Config:
        from_attributes = True


# --- Field Pricing Rule ---
class FieldPricingRuleCreate(BaseModel):
    """Pricing rule creation."""
    name: str
    dayOfWeek: Optional[List[str]] = None
    startTime: str
    endTime: str
    pricePerHour: float
    priority: int = 0
    isActive: bool = True


class FieldPricingRuleResponse(BaseModel):
    """Pricing rule response matching frontend FieldPricingRule type."""
    pricingRuleId: int
    fieldId: int
    name: str
    dayOfWeek: Optional[List[str]] = None
    startTime: str
    endTime: str
    pricePerHour: float
    priority: int
    isActive: bool
    createdAt: str
    updatedAt: str
    
    class Config:
        from_attributes = True


# --- Cancellation Policy ---
class CancellationPolicyResponse(BaseModel):
    """Cancellation policy response matching frontend CancellationPolicy type."""
    policyId: int
    fieldId: int
    freeCancellationHours: int
    lateCancellationPenaltyPercent: float
    noShowPenaltyPercent: float
    refundProcessingDays: int
    policyDescription: Optional[str] = None
    isActive: bool
    createdAt: str
    updatedAt: str
    
    class Config:
        from_attributes = True


# --- Amenity ---
class AmenityResponse(BaseModel):
    """Amenity response matching frontend Amenity type."""
    amenityId: int
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None
    isActive: bool
    
    class Config:
        from_attributes = True
