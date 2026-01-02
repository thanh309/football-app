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
