"""
TeamController - Team HTTP endpoints.
Thin controller that delegates to TeamService.
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.services.team_service import TeamService
from app.schemas.team import (
    TeamProfileResponse, TeamProfileCreate, TeamProfileUpdate,
    JoinRequestResponse, JoinRequestCreate
)
from app.schemas.common import MessageResponse
from app.dependencies.auth import get_current_user
from app.models.user import UserAccount
from app.repositories.player_repository import PlayerRepository
from app.repositories.team_repository import JoinRequestRepository

router = APIRouter()


def get_team_service(db: AsyncSession = Depends(get_db)) -> TeamService:
    return TeamService(db)


def team_to_response(team) -> TeamProfileResponse:
    return TeamProfileResponse(
        teamId=team.team_id,
        teamName=team.team_name,
        description=team.description,
        logoUrl=team.logo_url,
        leaderId=team.leader_id,
        status=team.status.value,
        rejectionReason=team.rejection_reason,
        location=team.location,
        latitude=team.latitude,
        longitude=team.longitude,
        skillLevel=team.skill_level,
        createdAt=team.created_at.isoformat(),
        updatedAt=team.updated_at.isoformat(),
    )


@router.post("", response_model=TeamProfileResponse, status_code=status.HTTP_201_CREATED)
async def create_team(
    data: TeamProfileCreate,
    user: UserAccount = Depends(get_current_user),
    team_service: TeamService = Depends(get_team_service)
):
    """Create a new team."""
    try:
        team = await team_service.create_team(
            leader_id=user.user_id,
            team_name=data.teamName,
            description=data.description,
            logo_url=data.logoUrl,
            location=data.location,
            latitude=data.latitude,
            longitude=data.longitude,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    
    return team_to_response(team)


@router.get("/my-teams", response_model=List[TeamProfileResponse])
async def get_my_teams(
    user: UserAccount = Depends(get_current_user),
    team_service: TeamService = Depends(get_team_service)
):
    """Get teams where current user is leader."""
    teams = await team_service.get_teams_by_leader(user.user_id)
    return [team_to_response(t) for t in teams]


@router.get("/{team_id}", response_model=TeamProfileResponse)
async def get_team(
    team_id: int,
    team_service: TeamService = Depends(get_team_service)
):
    """Get team by ID."""
    team = await team_service.get_team_by_id(team_id)
    if not team:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")
    return team_to_response(team)


@router.put("/{team_id}", response_model=TeamProfileResponse)
async def update_team(
    team_id: int,
    data: TeamProfileUpdate,
    user: UserAccount = Depends(get_current_user),
    team_service: TeamService = Depends(get_team_service)
):
    """Update team (leader only)."""
    team = await team_service.get_team_by_id(team_id)
    if not team:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")
    if team.leader_id != user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    updated = await team_service.update_team(team, **data.model_dump(exclude_unset=True))
    return team_to_response(updated)


@router.delete("/{team_id}", response_model=MessageResponse)
async def delete_team(
    team_id: int,
    user: UserAccount = Depends(get_current_user),
    team_service: TeamService = Depends(get_team_service)
):
    """Delete team (leader only)."""
    team = await team_service.get_team_by_id(team_id)
    if not team:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")
    if team.leader_id != user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    await team_service.delete_team(team)
    return MessageResponse(message="Team deleted")


# --- Join Requests ---

@router.get("/{team_id}/join-requests", response_model=List[JoinRequestResponse])
async def get_join_requests(
    team_id: int,
    user: UserAccount = Depends(get_current_user),
    team_service: TeamService = Depends(get_team_service)
):
    """Get pending join requests (leader only)."""
    team = await team_service.get_team_by_id(team_id)
    if not team or team.leader_id != user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    requests = await team_service.get_pending_requests(team_id)
    return [
        JoinRequestResponse(
            requestId=r.request_id,
            teamId=r.team_id,
            playerId=r.player_id,
            status=r.status.value,
            message=r.message,
            createdAt=r.created_at.isoformat(),
            processedAt=r.processed_at.isoformat() if r.processed_at else None,
        ) for r in requests
    ]


@router.post("/{team_id}/join-requests", response_model=JoinRequestResponse, status_code=status.HTTP_201_CREATED)
async def request_to_join(
    team_id: int,
    data: JoinRequestCreate,
    user: UserAccount = Depends(get_current_user),
    team_service: TeamService = Depends(get_team_service),
    db: AsyncSession = Depends(get_db)
):
    """Request to join a team."""
    player_repo = PlayerRepository(db)
    player = await player_repo.find_by_user_id(user.user_id)
    if not player:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Player profile required")
    
    try:
        request = await team_service.create_join_request(team_id, player.player_id, data.message)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    
    return JoinRequestResponse(
        requestId=request.request_id,
        teamId=request.team_id,
        playerId=request.player_id,
        status=request.status.value,
        message=request.message,
        createdAt=request.created_at.isoformat(),
        processedAt=None,
    )


@router.put("/join-requests/{request_id}/{action}", response_model=MessageResponse)
async def process_join_request(
    request_id: int,
    action: str,
    user: UserAccount = Depends(get_current_user),
    team_service: TeamService = Depends(get_team_service),
    db: AsyncSession = Depends(get_db)
):
    """Accept or reject join request."""
    if action not in ["accept", "reject"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid action")
    
    join_request_repo = JoinRequestRepository(db)
    request = await join_request_repo.find_by_id(request_id)
    if not request:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Request not found")
    
    team = await team_service.get_team_by_id(request.team_id)
    if not team or team.leader_id != user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    await team_service.process_join_request(request, action == "accept")
    return MessageResponse(message=f"Request {action}ed")
