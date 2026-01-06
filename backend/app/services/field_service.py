"""
FieldService - Field management business logic.
Maps to FieldController in class diagram.
"""
from typing import List, Optional
from datetime import date, time, timedelta
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.field_repository import FieldRepository, CalendarRepository
from app.models.field import FieldProfile, FieldCalendar
from app.models.enums import FieldStatus, CalendarStatus


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
        """Get field calendar slots, generating AVAILABLE slots dynamically for missing entries."""
        # Get existing slots from database
        existing_slots = await self.calendar_repo.find_by_field(field_id, start_date, end_date)
        
        # If no date range specified, just return existing slots
        if not start_date or not end_date:
            return existing_slots
        
        # Helper function to check if a virtual slot overlaps with any existing slot
        def is_time_slot_taken(check_date: date, check_start: time, check_end: time) -> bool:
            for s in existing_slots:
                if s.date != check_date:
                    continue
                # Convert times to minutes for easier comparison
                slot_start_mins = s.start_time.hour * 60 + s.start_time.minute
                slot_end_mins = s.end_time.hour * 60 + s.end_time.minute
                check_start_mins = check_start.hour * 60 + check_start.minute
                check_end_mins = check_end.hour * 60 + check_end.minute
                
                # Check for overlap: slots overlap if one starts before the other ends
                # and ends after the other starts
                if slot_start_mins < check_end_mins and slot_end_mins > check_start_mins:
                    return True
            return False
        
        # Generate available slots for the date range (6AM to 10PM, 1-hour slots)
        result = list(existing_slots)
        current_date = start_date
        
        while current_date <= end_date:
            for hour in range(6, 22):  # 6AM to 10PM
                slot_start = time(hour, 0)
                slot_end = time(hour + 1, 0)
                
                # Only add if slot doesn't overlap with any existing slot
                if not is_time_slot_taken(current_date, slot_start, slot_end):
                    # Create a virtual slot with unique ID (not saved to DB)
                    # Generate unique negative ID based on date and hour
                    virtual_id = -(field_id * 1000000 + (current_date - start_date).days * 100 + hour)
                    virtual_slot = FieldCalendar(
                        calendar_id=virtual_id,
                        field_id=field_id,
                        date=current_date,
                        start_time=slot_start,
                        end_time=slot_end,
                        status=CalendarStatus.AVAILABLE,
                        booking_id=None,
                    )
                    result.append(virtual_slot)
            
            current_date += timedelta(days=1)
        
        # Sort by date and start time
        result.sort(key=lambda s: (s.date, s.start_time))
        return result
    
    async def search_fields(
        self,
        query: str = None,
        location: str = None,
        limit: int = 20
    ) -> List[FieldProfile]:
        """Search for verified fields."""
        return await self.field_repo.search(query, location, limit)

