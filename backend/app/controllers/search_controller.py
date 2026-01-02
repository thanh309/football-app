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
    q: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    limit: int = Query(20, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Search for teams."""
    team_service = TeamService(db)
    # Use the repository for search
    from app.repositories.team_repository import TeamRepository
    team_repo = TeamRepository(db)
    
    if q:
        teams = await team_repo.search_by_name(q, limit)
    else:
        teams = await team_repo.find_all(limit)
    
    # Filter to verified only
    teams = [t for t in teams if t.status == TeamStatus.VERIFIED]
    
    return [
        TeamProfileResponse(
            teamId=t.team_id,
            teamName=t.team_name,
            description=t.description,
            logoUrl=t.logo_url,
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
    q: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    limit: int = Query(20, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Search for fields."""
    field_service = FieldService(db)
    fields = await field_service.search_fields(q, location, limit)
    
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
    q: Optional[str] = Query(None),
    position: Optional[str] = Query(None),
    limit: int = Query(20, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Search for players."""
    player_repo = PlayerRepository(db)
    
    if position:
        players = await player_repo.search_by_position(position, limit)
    else:
        players = await player_repo.find_all(limit)
    
    return [
        PlayerProfileResponse(
            playerId=p.player_id,
            userId=p.user_id,
            displayName=p.display_name,
            position=p.position,
            skillLevel=p.skill_level,
            bio=p.bio,
            profileImage=p.profile_image,
            dateOfBirth=p.date_of_birth.isoformat() if p.date_of_birth else None,
            height=p.height,
            weight=p.weight,
            preferredFoot=p.preferred_foot.value if p.preferred_foot else None,
            createdAt=p.created_at.isoformat(),
            updatedAt=p.updated_at.isoformat(),
        ) for p in players
    ]
