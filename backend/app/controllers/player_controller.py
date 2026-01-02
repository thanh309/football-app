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
