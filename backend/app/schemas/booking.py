"""
Booking request schemas matching frontend types.
"""
from typing import Optional
from pydantic import BaseModel


class BookingRequestCreate(BaseModel):
    """Booking request creation matching frontend CreateBookingRequest."""
    fieldId: int
    teamId: int
    date: str
    startTime: str
    endTime: str
    notes: Optional[str] = None


class BookingRequestResponse(BaseModel):
    """Booking request response matching frontend BookingRequest type."""
    bookingId: int
    fieldId: int
    teamId: int
    requesterId: int
    date: str
    startTime: str
    endTime: str
    status: str
    notes: Optional[str] = None
    createdAt: str
    processedAt: Optional[str] = None
    
    class Config:
        from_attributes = True
