"""
SearchController - Search HTTP endpoints.
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.services.team_service import TeamService
from app.services.field_service import FieldService
from app.repositories.player_repository import PlayerRepository
from app.schemas.team import TeamProfileResponse
from app.schemas.field import FieldProfileResponse
from app.schemas.player import PlayerProfileResponse
from app.models.enums import TeamStatus

router = APIRouter()


@router.get("/teams", response_model=List[TeamProfileResponse])
async def search_teams(
    query: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    minSkillLevel: Optional[int] = Query(None),
    maxSkillLevel: Optional[int] = Query(None),
    limit: int = Query(20, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Search for teams with filters."""
    from sqlalchemy import select
    from app.models.team import TeamProfile
    
    # Build query with filters
    stmt = select(TeamProfile).where(TeamProfile.status == TeamStatus.VERIFIED)
    
    if query:
        stmt = stmt.where(TeamProfile.team_name.ilike(f"%{query}%"))
    
    if location:
        stmt = stmt.where(TeamProfile.location.ilike(f"%{location}%"))
    
    if minSkillLevel is not None:
        stmt = stmt.where(TeamProfile.skill_level >= minSkillLevel)
    
    if maxSkillLevel is not None:
        stmt = stmt.where(TeamProfile.skill_level <= maxSkillLevel)
    
    stmt = stmt.limit(limit)
    
    result = await db.execute(stmt)
    teams = list(result.scalars().all())
    
    return [
        TeamProfileResponse(
            teamId=t.team_id,
            teamName=t.team_name,
            description=t.description,
            logoUrl=t.logo.storage_path if t.logo else None,
            leaderId=t.leader_id,
            status=t.status.value,
            rejectionReason=t.rejection_reason,
            location=t.location,
            latitude=t.latitude,
            longitude=t.longitude,
            skillLevel=t.skill_level,
            createdAt=t.created_at.isoformat(),
            updatedAt=t.updated_at.isoformat(),
        ) for t in teams
    ]


@router.get("/fields", response_model=List[FieldProfileResponse])
async def search_fields(
    query: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    minPrice: Optional[float] = Query(None),
    maxPrice: Optional[float] = Query(None),
    amenityIds: Optional[List[int]] = Query(None, alias="amenityIds[]"),
    limit: int = Query(20, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Search for fields with filters."""
    from sqlalchemy import select
    from app.models.field import FieldProfile, FieldAmenity
    from app.models.enums import FieldStatus
    
    # Build query with filters
    stmt = select(FieldProfile).where(FieldProfile.status == FieldStatus.VERIFIED)
    
    if query:
        stmt = stmt.where(FieldProfile.field_name.ilike(f"%{query}%"))
    
    if location:
        stmt = stmt.where(FieldProfile.location.ilike(f"%{location}%"))
    
    if minPrice is not None:
        stmt = stmt.where(FieldProfile.default_price_per_hour >= minPrice)
    
    if maxPrice is not None:
        stmt = stmt.where(FieldProfile.default_price_per_hour <= maxPrice)
    
    if amenityIds and len(amenityIds) > 0:
        # Fields that have ALL the specified amenities (AND logic)
        from sqlalchemy import func
        stmt = stmt.where(
            FieldProfile.field_id.in_(
                select(FieldAmenity.field_id)
                .where(FieldAmenity.amenity_id.in_(amenityIds))
                .group_by(FieldAmenity.field_id)
                .having(func.count(FieldAmenity.amenity_id) == len(amenityIds))
            )
        )
    
    stmt = stmt.limit(limit)
    
    result = await db.execute(stmt)
    fields = list(result.scalars().all())
    
    return [
        FieldProfileResponse(
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
        ) for f in fields
    ]


@router.get("/players", response_model=List[PlayerProfileResponse])
async def search_players(
    query: Optional[str] = Query(None),
    position: Optional[str] = Query(None),
    minSkillLevel: Optional[int] = Query(None),
    maxSkillLevel: Optional[int] = Query(None),
    limit: int = Query(20, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Search for players with filters."""
    from sqlalchemy import select
    from app.models.player import PlayerProfile
    
    # Build query with filters
    stmt = select(PlayerProfile)
    
    if query:
        stmt = stmt.where(PlayerProfile.display_name.ilike(f"%{query}%"))
    
    if position:
        stmt = stmt.where(PlayerProfile.position.ilike(f"%{position}%"))
    
    if minSkillLevel is not None:
        stmt = stmt.where(PlayerProfile.skill_level >= minSkillLevel)
    
    if maxSkillLevel is not None:
        stmt = stmt.where(PlayerProfile.skill_level <= maxSkillLevel)
    
    stmt = stmt.limit(limit)
    
    result = await db.execute(stmt)
    players = list(result.scalars().all())
    
    return [
        PlayerProfileResponse(
            playerId=p.player_id,
            userId=p.user_id,
            displayName=p.display_name,
            position=p.position,
            skillLevel=p.skill_level,
            bio=p.bio,
            profileImage=p.profile_image.storage_path if p.profile_image else None,
            dateOfBirth=p.date_of_birth.isoformat() if p.date_of_birth else None,
            height=p.height,
            weight=p.weight,
            preferredFoot=p.preferred_foot.value if p.preferred_foot else None,
            createdAt=p.created_at.isoformat(),
            updatedAt=p.updated_at.isoformat(),
        ) for p in players
    ]


from pydantic import BaseModel

class OwnerSearchResponse(BaseModel):
    """Field owner search response."""
    userId: int
    username: str
    location: Optional[str] = None
    isVerified: bool = True
    fieldCount: int
    createdAt: str


@router.get("/owners", response_model=List[OwnerSearchResponse])
async def search_owners(
    query: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    limit: int = Query(20, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Search for field owners."""
    from sqlalchemy import select, func
    from app.models.user import UserAccount
    from app.models.field import FieldProfile
    
    # Find users who own at least one field
    stmt = (
        select(
            UserAccount,
            func.count(FieldProfile.field_id).label("field_count")
        )
        .join(FieldProfile, FieldProfile.owner_id == UserAccount.user_id)
        .group_by(UserAccount.user_id)
        .having(func.count(FieldProfile.field_id) > 0)
    )
    
    if query:
        stmt = stmt.where(UserAccount.username.ilike(f"%{query}%"))
    
    if location:
        stmt = stmt.where(UserAccount.location.ilike(f"%{location}%"))
    
    stmt = stmt.limit(limit)
    
    result = await db.execute(stmt)
    rows = result.all()
    
    return [
        OwnerSearchResponse(
            userId=row[0].user_id,
            username=row[0].username,
            location=row[0].location,
            isVerified=row[0].is_verified,
            fieldCount=row[1] or 0,
            createdAt=row[0].created_at.isoformat(),
        ) for row in rows
    ]
