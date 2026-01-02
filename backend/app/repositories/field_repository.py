"""
Field and Calendar repositories.
"""
from typing import Optional, List
from datetime import date
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.repositories.base_repository import BaseRepository
from app.models.field import FieldProfile, FieldCalendar
from app.models.enums import FieldStatus


class FieldRepository(BaseRepository[FieldProfile]):
    """Repository for FieldProfile operations."""
    
    def __init__(self, db: AsyncSession):
        super().__init__(FieldProfile, db)
    
    async def find_by_id(self, field_id: int) -> Optional[FieldProfile]:
        """Find field by ID."""
        result = await self.db.execute(
            select(FieldProfile).where(FieldProfile.field_id == field_id)
        )
        return result.scalar_one_or_none()
    
    async def find_by_owner(self, owner_id: int) -> List[FieldProfile]:
        """Find fields by owner."""
        result = await self.db.execute(
            select(FieldProfile).where(FieldProfile.owner_id == owner_id)
        )
        return list(result.scalars().all())
    
    async def find_pending(self) -> List[FieldProfile]:
        """Find fields pending verification."""
        result = await self.db.execute(
            select(FieldProfile).where(FieldProfile.status == FieldStatus.PENDING)
        )
        return list(result.scalars().all())
    
    async def search(self, query: str = None, location: str = None, limit: int = 20) -> List[FieldProfile]:
        """Search fields by name/location."""
        stmt = select(FieldProfile).where(FieldProfile.status == FieldStatus.VERIFIED)
        
        if query:
            stmt = stmt.where(FieldProfile.field_name.ilike(f"%{query}%"))
        if location:
            stmt = stmt.where(FieldProfile.location.ilike(f"%{location}%"))
        
        result = await self.db.execute(stmt.limit(limit))
        return list(result.scalars().all())


class CalendarRepository(BaseRepository[FieldCalendar]):
    """Repository for FieldCalendar operations."""
    
    def __init__(self, db: AsyncSession):
        super().__init__(FieldCalendar, db)
    
    async def find_by_field(self, field_id: int, start_date: date = None, end_date: date = None) -> List[FieldCalendar]:
        """Find calendar slots for a field."""
        stmt = select(FieldCalendar).where(FieldCalendar.field_id == field_id)
        
        if start_date:
            stmt = stmt.where(FieldCalendar.date >= start_date)
        if end_date:
            stmt = stmt.where(FieldCalendar.date <= end_date)
        
        result = await self.db.execute(stmt.order_by(FieldCalendar.date, FieldCalendar.start_time))
        return list(result.scalars().all())
