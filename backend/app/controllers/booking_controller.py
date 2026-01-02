"""
BookingController - Booking HTTP endpoints.
Thin controller that delegates to BookingService.
"""
from typing import List, Optional
from datetime import date, time
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.services.booking_service import BookingService
from app.services.field_service import FieldService
from app.schemas.booking import BookingRequestResponse, BookingRequestCreate
from app.schemas.common import MessageResponse
from app.dependencies.auth import get_current_user
from app.models.user import UserAccount
from app.models.enums import BookingStatus

router = APIRouter()


def get_booking_service(db: AsyncSession = Depends(get_db)) -> BookingService:
    return BookingService(db)


def get_field_service(db: AsyncSession = Depends(get_db)) -> FieldService:
    return FieldService(db)


def booking_to_response(b) -> BookingRequestResponse:
    return BookingRequestResponse(
        bookingId=b.booking_id,
        fieldId=b.field_id,
        teamId=b.team_id,
        requesterId=b.requester_id,
        date=b.date.isoformat(),
        startTime=b.start_time.isoformat(),
        endTime=b.end_time.isoformat(),
        status=b.status.value,
        notes=b.notes,
        createdAt=b.created_at.isoformat(),
        processedAt=b.processed_at.isoformat() if b.processed_at else None,
    )


@router.post("", response_model=BookingRequestResponse, status_code=status.HTTP_201_CREATED)
async def create_booking(
    data: BookingRequestCreate,
    user: UserAccount = Depends(get_current_user),
    booking_service: BookingService = Depends(get_booking_service)
):
    """Create a booking request."""
    booking = await booking_service.create_booking(
        field_id=data.fieldId,
        team_id=data.teamId,
        requester_id=user.user_id,
        booking_date=date.fromisoformat(data.date),
        start_time=time.fromisoformat(data.startTime),
        end_time=time.fromisoformat(data.endTime),
        notes=data.notes,
    )
    return booking_to_response(booking)


@router.get("/{booking_id}", response_model=BookingRequestResponse)
async def get_booking(
    booking_id: int,
    booking_service: BookingService = Depends(get_booking_service)
):
    """Get booking by ID."""
    booking = await booking_service.get_booking_by_id(booking_id)
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")
    return booking_to_response(booking)


@router.get("/field/{field_id}", response_model=List[BookingRequestResponse])
async def get_bookings_by_field(
    field_id: int,
    status_filter: Optional[str] = Query(None, alias="status"),
    booking_service: BookingService = Depends(get_booking_service)
):
    """Get bookings for a field."""
    status_enum = BookingStatus(status_filter) if status_filter else None
    bookings = await booking_service.get_bookings_by_field(field_id, status_enum)
    return [booking_to_response(b) for b in bookings]


@router.get("/team/{team_id}", response_model=List[BookingRequestResponse])
async def get_bookings_by_team(
    team_id: int,
    booking_service: BookingService = Depends(get_booking_service)
):
    """Get bookings for a team."""
    bookings = await booking_service.get_bookings_by_team(team_id)
    return [booking_to_response(b) for b in bookings]


@router.put("/{booking_id}/approve", response_model=MessageResponse)
async def approve_booking(
    booking_id: int,
    user: UserAccount = Depends(get_current_user),
    booking_service: BookingService = Depends(get_booking_service),
    field_service: FieldService = Depends(get_field_service)
):
    """Approve booking (field owner only)."""
    booking = await booking_service.get_booking_by_id(booking_id)
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")
    
    field = await field_service.get_field_by_id(booking.field_id)
    if not field or field.owner_id != user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    await booking_service.approve_booking(booking)
    return MessageResponse(message="Booking approved")


@router.put("/{booking_id}/reject", response_model=MessageResponse)
async def reject_booking(
    booking_id: int,
    user: UserAccount = Depends(get_current_user),
    booking_service: BookingService = Depends(get_booking_service),
    field_service: FieldService = Depends(get_field_service)
):
    """Reject booking (field owner only)."""
    booking = await booking_service.get_booking_by_id(booking_id)
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")
    
    field = await field_service.get_field_by_id(booking.field_id)
    if not field or field.owner_id != user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    await booking_service.reject_booking(booking)
    return MessageResponse(message="Booking rejected")


@router.put("/{booking_id}/cancel", response_model=MessageResponse)
async def cancel_booking(
    booking_id: int,
    user: UserAccount = Depends(get_current_user),
    booking_service: BookingService = Depends(get_booking_service)
):
    """Cancel booking (requester only)."""
    booking = await booking_service.get_booking_by_id(booking_id)
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")
    
    if booking.requester_id != user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    await booking_service.cancel_booking(booking)
    return MessageResponse(message="Booking cancelled")
