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
    MatchInvitationResponse, MatchInvitationCreate, AttendanceRecordResponse,
    MatchResultCreate, MatchResultResponse
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


@router.put("/{match_id}", response_model=MatchEventResponse)
async def update_match(
    match_id: int,
    data: MatchEventUpdate,
    user: UserAccount = Depends(get_current_user),
    match_service: MatchService = Depends(get_match_service),
    team_service: TeamService = Depends(get_team_service)
):
    """Update match details."""
    from datetime import date, time
    from app.models.enums import Visibility, MatchStatus
    
    match = await match_service.get_match_by_id(match_id)
    if not match:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Match not found")
    
    team = await team_service.get_team_by_id(match.host_team_id)
    if not team or team.leader_id != user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    update_data = data.model_dump(exclude_unset=True)
    if "matchDate" in update_data:
        match.match_date = date.fromisoformat(update_data["matchDate"])
    if "startTime" in update_data:
        match.start_time = time.fromisoformat(update_data["startTime"])
    if "endTime" in update_data:
        match.end_time = time.fromisoformat(update_data["endTime"]) if update_data["endTime"] else None
    if "fieldId" in update_data:
        match.field_id = update_data["fieldId"]
    if "visibility" in update_data:
        match.visibility = Visibility(update_data["visibility"])
    if "description" in update_data:
        match.description = update_data["description"]
    if "status" in update_data:
        match.status = MatchStatus(update_data["status"])
    
    await match_service.update_match(match)
    return match_to_response(match)


@router.get("/team/{team_id}", response_model=List[MatchEventResponse])
async def get_matches_by_team(
    team_id: int,
    match_service: MatchService = Depends(get_match_service)
):
    """Get matches for a team."""
    matches = await match_service.get_matches_by_team(team_id)
    return [match_to_response(m) for m in matches]


@router.get("/team/{team_id}/invitations", response_model=List[MatchInvitationResponse])
async def get_team_invitations(
    team_id: int,
    user: UserAccount = Depends(get_current_user),
    team_service: TeamService = Depends(get_team_service),
    db: AsyncSession = Depends(get_db)
):
    """Get pending match invitations for a team."""
    team = await team_service.get_team_by_id(team_id)
    if not team or team.leader_id != user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    invitation_repo = InvitationRepository(db)
    invitations = await invitation_repo.find_pending_by_team(team_id)
    
    return [
        MatchInvitationResponse(
            invitationId=inv.invitation_id,
            matchId=inv.match_id,
            invitingTeamId=inv.inviting_team_id,
            invitedTeamId=inv.invited_team_id,
            status=inv.status.value,
            message=inv.message,
            createdAt=inv.created_at.isoformat(),
            respondedAt=inv.responded_at.isoformat() if inv.responded_at else None,
        ) for inv in invitations
    ]


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


from app.schemas.match import AttendanceUpdateRequest

@router.post("/{match_id}/attendance/confirm", response_model=AttendanceRecordResponse, status_code=status.HTTP_201_CREATED)
async def confirm_attendance(
    match_id: int,
    user: UserAccount = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Player confirms own attendance for a match."""
    from app.models.match import AttendanceRecord
    from app.models.enums import AttendanceStatus
    from app.repositories.match_repository import AttendanceRepository
    from app.repositories.player_repository import PlayerRepository
    from app.repositories.team_repository import RosterRepository
    from datetime import datetime
    
    player_repo = PlayerRepository(db)
    player = await player_repo.find_by_user_id(user.user_id)
    if not player:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Player profile required")
    
    # Check if player is in a team for this match
    roster_repo = RosterRepository(db)
    roster_entries = await roster_repo.find_by_player(player.player_id)
    
    match = await MatchService(db).get_match_by_id(match_id)
    if not match:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Match not found")
    
    # Find team_id for player in this match
    team_id = None
    for entry in roster_entries:
        if entry.team_id in [match.host_team_id, match.opponent_team_id]:
            team_id = entry.team_id
            break
    
    if not team_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a player in this match")
    
    attendance_repo = AttendanceRepository(db)
    
    # Check if already confirmed
    existing = await db.execute(
        select(AttendanceRecord).where(
            AttendanceRecord.match_id == match_id,
            AttendanceRecord.player_id == player.player_id
        )
    )
    record = existing.scalar_one_or_none()
    
    if record:
        record.status = AttendanceStatus.CONFIRMED
        record.confirmed_at = datetime.utcnow()
        record.confirmed_by = user.user_id
    else:
        record = AttendanceRecord(
            match_id=match_id,
            player_id=player.player_id,
            team_id=team_id,
            status=AttendanceStatus.CONFIRMED,
            confirmed_at=datetime.utcnow(),
            confirmed_by=user.user_id,
        )
        db.add(record)
    
    await db.commit()
    
    return AttendanceRecordResponse(
        attendanceId=record.attendance_id,
        matchId=record.match_id,
        playerId=record.player_id,
        teamId=record.team_id,
        status=record.status.value,
        confirmedAt=record.confirmed_at.isoformat() if record.confirmed_at else None,
        confirmedBy=record.confirmed_by,
    )


from sqlalchemy import select

@router.put("/{match_id}/attendance/{player_id}", response_model=AttendanceRecordResponse)
async def update_attendance(
    match_id: int,
    player_id: int,
    data: AttendanceUpdateRequest,
    user: UserAccount = Depends(get_current_user),
    team_service: TeamService = Depends(get_team_service),
    db: AsyncSession = Depends(get_db)
):
    """Update player attendance (team leader only)."""
    from app.models.match import AttendanceRecord
    from app.models.enums import AttendanceStatus
    from datetime import datetime
    
    match = await MatchService(db).get_match_by_id(match_id)
    if not match:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Match not found")
    
    # Check if user is leader of host or opponent team
    host_team = await team_service.get_team_by_id(match.host_team_id)
    opponent_team = await team_service.get_team_by_id(match.opponent_team_id) if match.opponent_team_id else None
    
    is_authorized = (host_team and host_team.leader_id == user.user_id) or \
                    (opponent_team and opponent_team.leader_id == user.user_id)
    if not is_authorized:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    result = await db.execute(
        select(AttendanceRecord).where(
            AttendanceRecord.match_id == match_id,
            AttendanceRecord.player_id == player_id
        )
    )
    record = result.scalar_one_or_none()
    
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Attendance record not found")
    
    record.status = AttendanceStatus(data.status)
    record.confirmed_at = datetime.utcnow()
    record.confirmed_by = user.user_id
    
    await db.commit()
    
    return AttendanceRecordResponse(
        attendanceId=record.attendance_id,
        matchId=record.match_id,
        playerId=record.player_id,
        teamId=record.team_id,
        status=record.status.value,
        confirmedAt=record.confirmed_at.isoformat() if record.confirmed_at else None,
        confirmedBy=record.confirmed_by,
    )


from pydantic import BaseModel

class BatchAttendanceItem(BaseModel):
    playerId: int
    status: str

class BatchAttendanceRequest(BaseModel):
    records: List[BatchAttendanceItem]


@router.post("/{match_id}/attendance/batch", response_model=List[AttendanceRecordResponse])
async def batch_update_attendance(
    match_id: int,
    data: BatchAttendanceRequest,
    user: UserAccount = Depends(get_current_user),
    team_service: TeamService = Depends(get_team_service),
    db: AsyncSession = Depends(get_db)
):
    """Batch update attendance records (team leader only)."""
    from app.models.match import AttendanceRecord
    from app.models.enums import AttendanceStatus
    from datetime import datetime
    
    match = await MatchService(db).get_match_by_id(match_id)
    if not match:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Match not found")
    
    host_team = await team_service.get_team_by_id(match.host_team_id)
    opponent_team = await team_service.get_team_by_id(match.opponent_team_id) if match.opponent_team_id else None
    
    is_authorized = (host_team and host_team.leader_id == user.user_id) or \
                    (opponent_team and opponent_team.leader_id == user.user_id)
    if not is_authorized:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    updated_records = []
    for item in data.records:
        result = await db.execute(
            select(AttendanceRecord).where(
                AttendanceRecord.match_id == match_id,
                AttendanceRecord.player_id == item.playerId
            )
        )
        record = result.scalar_one_or_none()
        
        if record:
            record.status = AttendanceStatus(item.status)
            record.confirmed_at = datetime.utcnow()
            record.confirmed_by = user.user_id
            updated_records.append(record)
    
    await db.commit()
    
    return [
        AttendanceRecordResponse(
            attendanceId=r.attendance_id,
            matchId=r.match_id,
            playerId=r.player_id,
            teamId=r.team_id,
            status=r.status.value,
            confirmedAt=r.confirmed_at.isoformat() if r.confirmed_at else None,
            confirmedBy=r.confirmed_by,
        ) for r in updated_records
    ]


class AttendanceStatsResponse(BaseModel):
    totalPlayers: int
    confirmed: int
    declined: int
    pending: int
    absent: int


@router.get("/{match_id}/attendance/stats", response_model=AttendanceStatsResponse)
async def get_attendance_stats(
    match_id: int,
    match_service: MatchService = Depends(get_match_service)
):
    """Get attendance statistics for a match."""
    records = await match_service.get_match_attendance(match_id)
    
    stats = {
        "confirmed": 0,
        "declined": 0,
        "pending": 0,
        "absent": 0,
    }
    
    for r in records:
        status_val = r.status.value.lower()
        if status_val in stats:
            stats[status_val] += 1
    
    return AttendanceStatsResponse(
        totalPlayers=len(records),
        confirmed=stats["confirmed"],
        declined=stats["declined"],
        pending=stats["pending"],
        absent=stats["absent"],
    )


# --- Match Results ---

def result_to_response(r) -> MatchResultResponse:
    """Convert result model to response."""
    return MatchResultResponse(
        resultId=r.result_id,
        matchId=r.match_id,
        homeScore=r.home_score,
        awayScore=r.away_score,
        winnerId=r.winner_id,
        notes=r.notes,
        recordedBy=r.recorded_by,
        createdAt=r.created_at.isoformat(),
    )


@router.post("/{match_id}/result", response_model=MatchResultResponse, status_code=status.HTTP_201_CREATED)
async def record_result(
    match_id: int,
    data: MatchResultCreate,
    user: UserAccount = Depends(get_current_user),
    match_service: MatchService = Depends(get_match_service),
    team_service: TeamService = Depends(get_team_service),
    db: AsyncSession = Depends(get_db)
):
    """Record match result."""
    from app.models.match import MatchResult
    
    match = await match_service.get_match_by_id(match_id)
    if not match:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Match not found")
    
    # Only host team leader or opponent team leader can record result
    host_team = await team_service.get_team_by_id(match.host_team_id)
    opponent_team = await team_service.get_team_by_id(match.opponent_team_id) if match.opponent_team_id else None
    
    is_authorized = (host_team and host_team.leader_id == user.user_id) or \
                    (opponent_team and opponent_team.leader_id == user.user_id)
    if not is_authorized:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    # Check if result already exists
    from app.repositories.match_repository import ResultRepository
    result_repo = ResultRepository(db)
    existing = await result_repo.find_by_match(match_id)
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Result already recorded")
    
    # Determine winner
    winner_id = None
    if data.homeScore > data.awayScore:
        winner_id = match.host_team_id
    elif data.awayScore > data.homeScore:
        winner_id = match.opponent_team_id
    
    result = MatchResult(
        match_id=match_id,
        home_score=data.homeScore,
        away_score=data.awayScore,
        winner_id=winner_id,
        notes=data.notes,
        recorded_by=user.user_id,
    )
    await result_repo.add(result)
    await result_repo.commit()
    
    return result_to_response(result)


@router.get("/{match_id}/result", response_model=MatchResultResponse)
async def get_result(
    match_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get match result."""
    from app.repositories.match_repository import ResultRepository
    
    result_repo = ResultRepository(db)
    result = await result_repo.find_by_match(match_id)
    
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Result not found")
    
    return result_to_response(result)

