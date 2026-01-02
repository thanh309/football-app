"""
BookingService - Booking request business logic.
Maps to BookingController in class diagram.
"""
from typing import List, Optional
from datetime import datetime, date, time
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.booking_repository import BookingRepository
from app.repositories.field_repository import CalendarRepository
from app.models.booking import BookingRequest
from app.models.field import FieldCalendar
from app.models.enums import BookingStatus, CalendarStatus


class BookingService:
    """Service handling booking business logic."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
        self.booking_repo = BookingRepository(db)
        self.calendar_repo = CalendarRepository(db)
    
    async def create_booking(
        self,
        field_id: int,
        team_id: int,
        requester_id: int,
        booking_date: date,
        start_time: time,
        end_time: time,
        notes: str = None,
    ) -> BookingRequest:
        """Create a booking request."""
        booking = BookingRequest(
            field_id=field_id,
            team_id=team_id,
            requester_id=requester_id,
            date=booking_date,
            start_time=start_time,
            end_time=end_time,
            status=BookingStatus.PENDING,
            notes=notes,
        )
        await self.booking_repo.save(booking)
        await self.booking_repo.commit()
        return booking
    
    async def get_booking_by_id(self, booking_id: int) -> Optional[BookingRequest]:
        """Get booking by ID."""
        return await self.booking_repo.find_by_id(booking_id)
    
    async def get_bookings_by_field(
        self,
        field_id: int,
        status: BookingStatus = None
    ) -> List[BookingRequest]:
        """Get bookings for a field."""
        return await self.booking_repo.find_by_field(field_id, status)
    
    async def get_bookings_by_team(self, team_id: int) -> List[BookingRequest]:
        """Get bookings for a team."""
        return await self.booking_repo.find_by_team(team_id)
    
    async def approve_booking(self, booking: BookingRequest) -> bool:
        """Approve a booking request."""
        booking.status = BookingStatus.CONFIRMED
        booking.processed_at = datetime.utcnow()
        
        # Create calendar slot as booked
        calendar_slot = FieldCalendar(
            field_id=booking.field_id,
            date=booking.date,
            start_time=booking.start_time,
            end_time=booking.end_time,
            status=CalendarStatus.BOOKED,
            booking_id=booking.booking_id,
        )
        await self.calendar_repo.save(calendar_slot)
        
        await self.booking_repo.update(booking)
        await self.booking_repo.commit()
        return True
    
    async def reject_booking(self, booking: BookingRequest) -> bool:
        """Reject a booking request."""
        booking.status = BookingStatus.REJECTED
        booking.processed_at = datetime.utcnow()
        
        await self.booking_repo.update(booking)
        await self.booking_repo.commit()
        return True
    
    async def cancel_booking(self, booking: BookingRequest) -> bool:
        """Cancel a booking."""
        booking.status = BookingStatus.CANCELLED
        booking.processed_at = datetime.utcnow()
        
        await self.booking_repo.update(booking)
        await self.booking_repo.commit()
        return True
