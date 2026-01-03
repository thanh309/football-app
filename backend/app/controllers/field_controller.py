"""
FieldController - Field HTTP endpoints.
Thin controller that delegates to FieldService.
"""
from typing import List, Optional
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.services.field_service import FieldService
from app.schemas.field import (
    FieldProfileResponse, FieldProfileCreate, FieldProfileUpdate, FieldCalendarResponse
)
from app.dependencies.auth import get_current_user
from app.models.user import UserAccount

router = APIRouter()


def get_field_service(db: AsyncSession = Depends(get_db)) -> FieldService:
    return FieldService(db)


def field_to_response(f) -> FieldProfileResponse:
    return FieldProfileResponse(
        fieldId=f.field_id,
        ownerId=f.owner_id,
        fieldName=f.field_name,
        description=f.description,
        location=f.location,
        latitude=f.latitude,
        longitude=f.longitude,
        defaultPricePerHour=float(f.default_price_per_hour),
        capacity=f.capacity,
        status=f.status.value,
        rejectionReason=f.rejection_reason,
        createdAt=f.created_at.isoformat(),
        updatedAt=f.updated_at.isoformat(),
    )


@router.post("", response_model=FieldProfileResponse, status_code=status.HTTP_201_CREATED)
async def create_field(
    data: FieldProfileCreate,
    user: UserAccount = Depends(get_current_user),
    field_service: FieldService = Depends(get_field_service)
):
    """Create a new field."""
    field = await field_service.create_field(
        owner_id=user.user_id,
        field_name=data.fieldName,
        description=data.description,
        location=data.location,
        latitude=data.latitude,
        longitude=data.longitude,
        default_price_per_hour=data.defaultPricePerHour,
        capacity=data.capacity,
    )
    return field_to_response(field)


@router.get("/my-fields", response_model=List[FieldProfileResponse])
async def get_my_fields(
    user: UserAccount = Depends(get_current_user),
    field_service: FieldService = Depends(get_field_service)
):
    """Get fields owned by current user."""
    fields = await field_service.get_fields_by_owner(user.user_id)
    return [field_to_response(f) for f in fields]


@router.get("/{field_id}", response_model=FieldProfileResponse)
async def get_field(
    field_id: int,
    field_service: FieldService = Depends(get_field_service)
):
    """Get field by ID."""
    field = await field_service.get_field_by_id(field_id)
    if not field:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Field not found")
    return field_to_response(field)


@router.put("/{field_id}", response_model=FieldProfileResponse)
async def update_field(
    field_id: int,
    data: FieldProfileUpdate,
    user: UserAccount = Depends(get_current_user),
    field_service: FieldService = Depends(get_field_service)
):
    """Update field (owner only)."""
    field = await field_service.get_field_by_id(field_id)
    if not field:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Field not found")
    if field.owner_id != user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    update_data = data.model_dump(exclude_unset=True)
    
    # Map camelCase to snake_case for model update
    if "fieldName" in update_data:
        update_data["field_name"] = update_data.pop("fieldName")
    if "defaultPricePerHour" in update_data:
        update_data["default_price_per_hour"] = update_data.pop("defaultPricePerHour")
    if "pricingRules" in update_data: # If applicable
        pass
    if "rejectionReason" in update_data:
        update_data["rejection_reason"] = update_data.pop("rejectionReason")
        
    updated = await field_service.update_field(field, **update_data)
    return field_to_response(updated)


from app.schemas.common import MessageResponse

@router.delete("/{field_id}", response_model=MessageResponse)
async def delete_field(
    field_id: int,
    user: UserAccount = Depends(get_current_user),
    field_service: FieldService = Depends(get_field_service),
    db: AsyncSession = Depends(get_db)
):
    """Delete field (owner only)."""
    field = await field_service.get_field_by_id(field_id)
    if not field:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Field not found")
    if field.owner_id != user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    await db.delete(field)
    await db.commit()
    
    return MessageResponse(message="Field deleted")


@router.get("/{field_id}/calendar", response_model=List[FieldCalendarResponse])
async def get_calendar(
    field_id: int,
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    field_service: FieldService = Depends(get_field_service)
):
    """Get field calendar slots."""
    start = date.fromisoformat(start_date) if start_date else None
    end = date.fromisoformat(end_date) if end_date else None
    
    slots = await field_service.get_calendar(field_id, start, end)
    return [
        FieldCalendarResponse(
            calendarId=s.calendar_id,
            fieldId=s.field_id,
            date=s.date.isoformat(),
            startTime=s.start_time.isoformat(),
            endTime=s.end_time.isoformat(),
            status=s.status.value,
            bookingId=s.booking_id,
        ) for s in slots
    ]


from pydantic import BaseModel
from datetime import time as datetime_time

class CalendarBlockRequest(BaseModel):
    """Request to block a calendar slot."""
    date: str
    startTime: str
    endTime: str


@router.post("/{field_id}/calendar/block", response_model=FieldCalendarResponse, status_code=status.HTTP_201_CREATED)
async def block_calendar_slot(
    field_id: int,
    data: CalendarBlockRequest,
    user: UserAccount = Depends(get_current_user),
    field_service: FieldService = Depends(get_field_service),
    db: AsyncSession = Depends(get_db)
):
    """Block a calendar slot (field owner only)."""
    from app.models.field import FieldCalendar
    from app.models.enums import CalendarStatus
    from app.repositories.field_repository import FieldRepository
    
    field = await field_service.get_field_by_id(field_id)
    if not field:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Field not found")
    if field.owner_id != user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    slot = FieldCalendar(
        field_id=field_id,
        date=date.fromisoformat(data.date),
        start_time=datetime_time.fromisoformat(data.startTime),
        end_time=datetime_time.fromisoformat(data.endTime),
        status=CalendarStatus.BLOCKED,
    )
    
    field_repo = FieldRepository(db)
    await field_repo.add(slot)
    await field_repo.commit()
    
    return FieldCalendarResponse(
        calendarId=slot.calendar_id,
        fieldId=slot.field_id,
        date=slot.date.isoformat(),
        startTime=slot.start_time.isoformat(),
        endTime=slot.end_time.isoformat(),
        status=slot.status.value,
        bookingId=slot.booking_id,
    )


@router.put("/calendar/{calendar_id}/unblock", response_model=dict)
async def unblock_calendar_slot(
    calendar_id: int,
    user: UserAccount = Depends(get_current_user),
    field_service: FieldService = Depends(get_field_service),
    db: AsyncSession = Depends(get_db)
):
    """Unblock/delete a blocked calendar slot (field owner only)."""
    from sqlalchemy import select
    from app.models.field import FieldCalendar
    from app.models.enums import CalendarStatus
    
    result = await db.execute(
        select(FieldCalendar).where(FieldCalendar.calendar_id == calendar_id)
    )
    slot = result.scalar_one_or_none()
    
    if not slot:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Calendar slot not found")
    
    field = await field_service.get_field_by_id(slot.field_id)
    if not field or field.owner_id != user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    if slot.status != CalendarStatus.BLOCKED:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Can only unblock blocked slots")
    
    await db.delete(slot)
    await db.commit()
    
    return {"message": "Slot unblocked"}


# --- Field Pricing ---
from app.schemas.field import FieldPricingRuleResponse, FieldPricingRuleCreate, AmenityResponse


@router.get("/{field_id}/pricing", response_model=List[FieldPricingRuleResponse])
async def get_field_pricing(
    field_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get pricing rules for a field."""
    from sqlalchemy import select
    from app.models.field import FieldPricingRule
    
    result = await db.execute(
        select(FieldPricingRule).where(FieldPricingRule.field_id == field_id)
    )
    rules = result.scalars().all()
    
    return [
        FieldPricingRuleResponse(
            pricingRuleId=r.pricing_rule_id,
            fieldId=r.field_id,
            name=r.name,
            dayOfWeek=r.day_of_week.split(",") if r.day_of_week else None,
            startTime=r.start_time.isoformat(),
            endTime=r.end_time.isoformat(),
            pricePerHour=float(r.price_per_hour),
            priority=r.priority,
            isActive=r.is_active,
            createdAt=r.created_at.isoformat(),
            updatedAt=r.updated_at.isoformat(),
        ) for r in rules
    ]


@router.put("/{field_id}/pricing", response_model=List[FieldPricingRuleResponse])
async def update_field_pricing(
    field_id: int,
    rules: List[FieldPricingRuleCreate],
    user: UserAccount = Depends(get_current_user),
    field_service: FieldService = Depends(get_field_service),
    db: AsyncSession = Depends(get_db)
):
    """Update pricing rules for a field (replaces all rules)."""
    from sqlalchemy import select, delete
    from app.models.field import FieldPricingRule
    from datetime import time as datetime_time
    
    field = await field_service.get_field_by_id(field_id)
    if not field:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Field not found")
    if field.owner_id != user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    # Delete existing rules
    await db.execute(delete(FieldPricingRule).where(FieldPricingRule.field_id == field_id))
    
    # Create new rules
    new_rules = []
    for rule_data in rules:
        rule = FieldPricingRule(
            field_id=field_id,
            name=rule_data.name,
            day_of_week=",".join(rule_data.dayOfWeek) if rule_data.dayOfWeek else None,
            start_time=datetime_time.fromisoformat(rule_data.startTime),
            end_time=datetime_time.fromisoformat(rule_data.endTime),
            price_per_hour=rule_data.pricePerHour,
            priority=rule_data.priority,
            is_active=rule_data.isActive,
        )
        db.add(rule)
        new_rules.append(rule)
    
    await db.commit()
    
    return [
        FieldPricingRuleResponse(
            pricingRuleId=r.pricing_rule_id,
            fieldId=r.field_id,
            name=r.name,
            dayOfWeek=r.day_of_week.split(",") if r.day_of_week else None,
            startTime=r.start_time.isoformat(),
            endTime=r.end_time.isoformat(),
            pricePerHour=float(r.price_per_hour),
            priority=r.priority,
            isActive=r.is_active,
            createdAt=r.created_at.isoformat(),
            updatedAt=r.updated_at.isoformat(),
        ) for r in new_rules
    ]


# --- Amenities ---

@router.get("/amenities", response_model=List[AmenityResponse])
async def get_all_amenities(
    db: AsyncSession = Depends(get_db)
):
    """Get all available amenities."""
    from sqlalchemy import select
    from app.models.field import Amenity
    
    result = await db.execute(
        select(Amenity).where(Amenity.is_active == True)
    )
    amenities = result.scalars().all()
    
    return [
        AmenityResponse(
            amenityId=a.amenity_id,
            name=a.name,
            description=a.description,
            icon=a.icon,
            isActive=a.is_active,
        ) for a in amenities
    ]


@router.get("/{field_id}/amenities", response_model=List[AmenityResponse])
async def get_field_amenities(
    field_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get amenities for a field."""
    from sqlalchemy import select
    from app.models.field import FieldAmenity, Amenity
    
    result = await db.execute(
        select(Amenity)
        .join(FieldAmenity, FieldAmenity.amenity_id == Amenity.amenity_id)
        .where(FieldAmenity.field_id == field_id)
    )
    amenities = result.scalars().all()
    
    return [
        AmenityResponse(
            amenityId=a.amenity_id,
            name=a.name,
            description=a.description,
            icon=a.icon,
            isActive=a.is_active,
        ) for a in amenities
    ]


class FieldAmenityUpdateRequest(BaseModel):
    """Request to update field amenities."""
    amenityIds: List[int]


@router.put("/{field_id}/amenities", response_model=List[AmenityResponse])
async def update_field_amenities(
    field_id: int,
    data: FieldAmenityUpdateRequest,
    user: UserAccount = Depends(get_current_user),
    field_service: FieldService = Depends(get_field_service),
    db: AsyncSession = Depends(get_db)
):
    """Update amenities for a field."""
    from sqlalchemy import select, delete
    from app.models.field import FieldAmenity, Amenity
    
    field = await field_service.get_field_by_id(field_id)
    if not field:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Field not found")
    if field.owner_id != user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    # Delete existing field amenities
    await db.execute(delete(FieldAmenity).where(FieldAmenity.field_id == field_id))
    
    # Add new field amenities
    for amenity_id in data.amenityIds:
        field_amenity = FieldAmenity(field_id=field_id, amenity_id=amenity_id)
        db.add(field_amenity)
    
    await db.commit()
    
    # Return updated amenities
    result = await db.execute(
        select(Amenity)
        .join(FieldAmenity, FieldAmenity.amenity_id == Amenity.amenity_id)
        .where(FieldAmenity.field_id == field_id)
    )
    amenities = result.scalars().all()
    
    return [
        AmenityResponse(
            amenityId=a.amenity_id,
            name=a.name,
            description=a.description,
            icon=a.icon,
            isActive=a.is_active,
        ) for a in amenities
    ]
