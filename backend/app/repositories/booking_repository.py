"""
Booking repository.
"""
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.repositories.base_repository import BaseRepository
from app.models.booking import BookingRequest
from app.models.enums import BookingStatus


class BookingRepository(BaseRepository[BookingRequest]):
    """Repository for BookingRequest operations."""
    
    def __init__(self, db: AsyncSession):
        super().__init__(BookingRequest, db)
    
    async def find_by_id(self, booking_id: int) -> Optional[BookingRequest]:
        """Find booking by ID."""
        result = await self.db.execute(
            select(BookingRequest).where(BookingRequest.booking_id == booking_id)
        )
        return result.scalar_one_or_none()
    
    async def find_by_field(self, field_id: int, status: BookingStatus = None) -> List[BookingRequest]:
        """Find bookings by field."""
        stmt = select(BookingRequest).where(BookingRequest.field_id == field_id)
        if status:
            stmt = stmt.where(BookingRequest.status == status)
        
        result = await self.db.execute(stmt.order_by(BookingRequest.created_at.desc()))
        return list(result.scalars().all())
    
    async def find_by_team(self, team_id: int) -> List[BookingRequest]:
        """Find bookings by team."""
        result = await self.db.execute(
            select(BookingRequest)
            .where(BookingRequest.team_id == team_id)
            .order_by(BookingRequest.created_at.desc())
        )
        return list(result.scalars().all())
    
    async def find_pending_by_field(self, field_id: int) -> List[BookingRequest]:
        """Find pending bookings for a field."""
        result = await self.db.execute(
            select(BookingRequest).where(
                BookingRequest.field_id == field_id,
                BookingRequest.status == BookingStatus.PENDING
            )
        )
        return list(result.scalars().all())
