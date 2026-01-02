"""
FieldService - Field management business logic.
Maps to FieldController in class diagram.
"""
from typing import List, Optional
from datetime import date
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.field_repository import FieldRepository, CalendarRepository
from app.models.field import FieldProfile, FieldCalendar
from app.models.enums import FieldStatus


class FieldService:
    """Service handling field business logic."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
        self.field_repo = FieldRepository(db)
        self.calendar_repo = CalendarRepository(db)
    
    async def create_field(
        self,
        owner_id: int,
        field_name: str,
        description: str = None,
        location: str = None,
        latitude: float = None,
        longitude: float = None,
        default_price_per_hour: float = 0,
        capacity: int = None,
    ) -> FieldProfile:
        """Create a new field."""
        field = FieldProfile(
            owner_id=owner_id,
            field_name=field_name,
            description=description,
            location=location,
            latitude=latitude,
            longitude=longitude,
            default_price_per_hour=default_price_per_hour,
            capacity=capacity,
            status=FieldStatus.PENDING,
        )
        await self.field_repo.save(field)
        await self.field_repo.commit()
        return field
    
    async def get_field_by_id(self, field_id: int) -> Optional[FieldProfile]:
        """Get field by ID."""
        return await self.field_repo.find_by_id(field_id)
    
    async def get_fields_by_owner(self, owner_id: int) -> List[FieldProfile]:
        """Get fields owned by user."""
        return await self.field_repo.find_by_owner(owner_id)
    
    async def update_field(self, field: FieldProfile, **kwargs) -> FieldProfile:
        """Update field profile."""
        for key, value in kwargs.items():
            if hasattr(field, key) and value is not None:
                setattr(field, key, value)
        
        await self.field_repo.update(field)
        await self.field_repo.commit()
        return field
    
    async def get_calendar(
        self,
        field_id: int,
        start_date: date = None,
        end_date: date = None
    ) -> List[FieldCalendar]:
        """Get field calendar slots."""
        return await self.calendar_repo.find_by_field(field_id, start_date, end_date)
    
    async def search_fields(
        self,
        query: str = None,
        location: str = None,
        limit: int = 20
    ) -> List[FieldProfile]:
        """Search for verified fields."""
        return await self.field_repo.search(query, location, limit)
