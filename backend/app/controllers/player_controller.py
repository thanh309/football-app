"""
PlayerController - Player profile HTTP endpoints.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.repositories.player_repository import PlayerRepository
from app.schemas.player import PlayerProfileResponse, PlayerProfileUpdate
from app.dependencies.auth import get_current_user
from app.models.user import UserAccount

router = APIRouter()


def player_to_response(p) -> PlayerProfileResponse:
    return PlayerProfileResponse(
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
    )


@router.get("/profile", response_model=PlayerProfileResponse)
async def get_my_profile(
    user: UserAccount = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get current user's player profile."""
    player_repo = PlayerRepository(db)
    profile = await player_repo.find_by_user_id(user.user_id)
    
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Player profile not found")
    
    return player_to_response(profile)


@router.put("/profile", response_model=PlayerProfileResponse)
async def update_profile(
    data: PlayerProfileUpdate,
    user: UserAccount = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update player profile."""
    player_repo = PlayerRepository(db)
    profile = await player_repo.find_by_user_id(user.user_id)
    
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Player profile not found")
    
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        snake_key = ''.join(['_' + c.lower() if c.isupper() else c for c in key]).lstrip('_')
        if hasattr(profile, snake_key):
            setattr(profile, snake_key, value)
    
    await player_repo.update(profile)
    await player_repo.commit()
    
    return player_to_response(profile)


@router.get("/{player_id}", response_model=PlayerProfileResponse)
async def get_player(
    player_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get player by ID."""
    player_repo = PlayerRepository(db)
    profile = await player_repo.find_by_id(player_id)
    
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Player not found")
    
    return player_to_response(profile)


@router.get("/{player_id}/roster", response_model=list)
async def get_player_roster(
    player_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get player's team memberships."""
    from app.repositories.team_repository import RosterRepository
    from app.schemas.team import TeamRosterResponse
    
    roster_repo = RosterRepository(db)
    roster = await roster_repo.find_by_player(player_id)
    
    return [
        TeamRosterResponse(
            rosterId=r.roster_id,
            teamId=r.team_id,
            playerId=r.player_id,
            role=r.role.value,
            joinedAt=r.joined_at.isoformat(),
            isActive=r.is_active,
        ) for r in roster
    ]


@router.get("/user/{user_id}", response_model=PlayerProfileResponse)
async def get_player_by_user_id(
    user_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get player by user ID."""
    player_repo = PlayerRepository(db)
    profile = await player_repo.find_by_user_id(user_id)
    
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Player not found")
    
    return player_to_response(profile)


from typing import List
from app.schemas.match import MatchEventResponse

@router.get("/{player_id}/schedule", response_model=List[MatchEventResponse])
async def get_player_schedule(
    player_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get player's match schedule."""
    from app.repositories.team_repository import RosterRepository
    from app.repositories.match_repository import MatchRepository
    
    roster_repo = RosterRepository(db)
    match_repo = MatchRepository(db)
    
    # Get all teams player is a member of
    roster_entries = await roster_repo.find_by_player(player_id)
    team_ids = [r.team_id for r in roster_entries if r.is_active]
    
    # Get matches for all those teams
    all_matches = []
    for team_id in team_ids:
        matches = await match_repo.find_by_team(team_id)
        all_matches.extend(matches)
    
    # Remove duplicates and sort by date
    seen = set()
    unique_matches = []
    for m in all_matches:
        if m.match_id not in seen:
            seen.add(m.match_id)
            unique_matches.append(m)
    
    unique_matches.sort(key=lambda m: (m.match_date, m.start_time))
    
    return [
        MatchEventResponse(
            matchId=m.match_id,
            hostTeamId=m.host_team_id,
            opponentTeamId=m.opponent_team_id,
            fieldId=m.field_id,
            bookingId=m.booking_id,
            matchDate=m.match_date.isoformat(),
            startTime=m.start_time.isoformat(),
            endTime=m.end_time.isoformat() if m.end_time else None,
            status=m.status.value,
            visibility=m.visibility.value,
            description=m.description,
            createdAt=m.created_at.isoformat(),
            updatedAt=m.updated_at.isoformat(),
        ) for m in unique_matches
    ]
