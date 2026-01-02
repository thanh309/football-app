"""
MatchController - Match HTTP endpoints.
Thin controller that delegates to MatchService.
"""
from typing import List
from datetime import date, time
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.services.match_service import MatchService
from app.services.team_service import TeamService
from app.schemas.match import (
    MatchEventResponse, MatchEventCreate, MatchEventUpdate,
    MatchInvitationResponse, MatchInvitationCreate, AttendanceRecordResponse
)
from app.schemas.common import MessageResponse
from app.dependencies.auth import get_current_user
from app.models.user import UserAccount
from app.models.enums import Visibility
from app.repositories.match_repository import InvitationRepository

router = APIRouter()


def get_match_service(db: AsyncSession = Depends(get_db)) -> MatchService:
    return MatchService(db)


def get_team_service(db: AsyncSession = Depends(get_db)) -> TeamService:
    return TeamService(db)


def match_to_response(m) -> MatchEventResponse:
    return MatchEventResponse(
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
    )


@router.post("", response_model=MatchEventResponse, status_code=status.HTTP_201_CREATED)
async def create_match(
    data: MatchEventCreate,
    user: UserAccount = Depends(get_current_user),
    match_service: MatchService = Depends(get_match_service),
    team_service: TeamService = Depends(get_team_service)
):
    """Create a new match."""
    team = await team_service.get_team_by_id(data.hostTeamId)
    if not team or team.leader_id != user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    match = await match_service.create_match(
        host_team_id=data.hostTeamId,
        match_date=date.fromisoformat(data.matchDate),
        start_time=time.fromisoformat(data.startTime),
        end_time=time.fromisoformat(data.endTime) if data.endTime else None,
        field_id=data.fieldId,
        visibility=Visibility(data.visibility),
        description=data.description,
    )
    return match_to_response(match)


@router.get("/{match_id}", response_model=MatchEventResponse)
async def get_match(
    match_id: int,
    match_service: MatchService = Depends(get_match_service)
):
    """Get match by ID."""
    match = await match_service.get_match_by_id(match_id)
    if not match:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Match not found")
    return match_to_response(match)


@router.get("/team/{team_id}", response_model=List[MatchEventResponse])
async def get_matches_by_team(
    team_id: int,
    match_service: MatchService = Depends(get_match_service)
):
    """Get matches for a team."""
    matches = await match_service.get_matches_by_team(team_id)
    return [match_to_response(m) for m in matches]


@router.put("/{match_id}/cancel", response_model=MessageResponse)
async def cancel_match(
    match_id: int,
    user: UserAccount = Depends(get_current_user),
    match_service: MatchService = Depends(get_match_service),
    team_service: TeamService = Depends(get_team_service)
):
    """Cancel a match."""
    match = await match_service.get_match_by_id(match_id)
    if not match:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Match not found")
    
    team = await team_service.get_team_by_id(match.host_team_id)
    if not team or team.leader_id != user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    await match_service.cancel_match(match)
    return MessageResponse(message="Match cancelled")


@router.post("/{match_id}/invitations", response_model=MatchInvitationResponse, status_code=status.HTTP_201_CREATED)
async def send_invitation(
    match_id: int,
    data: MatchInvitationCreate,
    user: UserAccount = Depends(get_current_user),
    match_service: MatchService = Depends(get_match_service),
    team_service: TeamService = Depends(get_team_service)
):
    """Send match invitation."""
    match = await match_service.get_match_by_id(match_id)
    if not match:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Match not found")
    
    team = await team_service.get_team_by_id(match.host_team_id)
    if not team or team.leader_id != user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    invitation = await match_service.send_invitation(match, data.invitedTeamId, data.message)
    return MatchInvitationResponse(
        invitationId=invitation.invitation_id,
        matchId=invitation.match_id,
        invitingTeamId=invitation.inviting_team_id,
        invitedTeamId=invitation.invited_team_id,
        status=invitation.status.value,
        message=invitation.message,
        createdAt=invitation.created_at.isoformat(),
        respondedAt=None,
    )


@router.put("/invitations/{invitation_id}/{action}", response_model=MessageResponse)
async def respond_to_invitation(
    invitation_id: int,
    action: str,
    user: UserAccount = Depends(get_current_user),
    match_service: MatchService = Depends(get_match_service),
    team_service: TeamService = Depends(get_team_service),
    db: AsyncSession = Depends(get_db)
):
    """Accept or decline invitation."""
    if action not in ["accept", "decline"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid action")
    
    invitation_repo = InvitationRepository(db)
    invitation = await invitation_repo.find_by_id(invitation_id)
    if not invitation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invitation not found")
    
    team = await team_service.get_team_by_id(invitation.invited_team_id)
    if not team or team.leader_id != user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    await match_service.respond_to_invitation(invitation, action == "accept")
    return MessageResponse(message=f"Invitation {action}ed")


@router.get("/{match_id}/attendance", response_model=List[AttendanceRecordResponse])
async def get_attendance(
    match_id: int,
    match_service: MatchService = Depends(get_match_service)
):
    """Get match attendance."""
    records = await match_service.get_match_attendance(match_id)
    return [
        AttendanceRecordResponse(
            attendanceId=r.attendance_id,
            matchId=r.match_id,
            playerId=r.player_id,
            teamId=r.team_id,
            status=r.status.value,
            confirmedAt=r.confirmed_at.isoformat() if r.confirmed_at else None,
            confirmedBy=r.confirmed_by,
        ) for r in records
    ]
