"""
Match-related schemas matching frontend types.
"""
from typing import Optional
from pydantic import BaseModel


# --- Match Event ---
class MatchEventCreate(BaseModel):
    """Match event creation matching frontend CreateMatchRequest."""
    hostTeamId: int
    matchDate: str
    startTime: str
    endTime: Optional[str] = None
    fieldId: Optional[int] = None
    visibility: str = "Public"
    description: Optional[str] = None


class MatchEventUpdate(BaseModel):
    """Match event update."""
    matchDate: Optional[str] = None
    startTime: Optional[str] = None
    endTime: Optional[str] = None
    fieldId: Optional[int] = None
    visibility: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None


class MatchEventResponse(BaseModel):
    """Match event response matching frontend MatchEvent type."""
    matchId: int
    hostTeamId: int
    opponentTeamId: Optional[int] = None
    fieldId: Optional[int] = None
    bookingId: Optional[int] = None
    matchDate: str
    startTime: str
    endTime: Optional[str] = None
    status: str
    visibility: str
    description: Optional[str] = None
    createdAt: str
    updatedAt: str
    
    class Config:
        from_attributes = True


# --- Match Invitation ---
class MatchInvitationCreate(BaseModel):
    """Match invitation creation matching frontend SendInvitationRequest."""
    invitedTeamId: int
    message: Optional[str] = None


class MatchInvitationResponse(BaseModel):
    """Match invitation response matching frontend MatchInvitation type."""
    invitationId: int
    matchId: int
    invitingTeamId: int
    invitedTeamId: int
    status: str
    message: Optional[str] = None
    createdAt: str
    respondedAt: Optional[str] = None
    
    class Config:
        from_attributes = True


# --- Attendance Record ---
class AttendanceUpdateRequest(BaseModel):
    """Attendance update request."""
    status: str


class AttendanceRecordResponse(BaseModel):
    """Attendance record response matching frontend AttendanceRecord type."""
    attendanceId: int
    matchId: int
    playerId: int
    userId: Optional[int] = None  # Added for frontend comparison with current user
    teamId: int
    status: str
    confirmedAt: Optional[str] = None
    confirmedBy: Optional[int] = None
    
    class Config:
        from_attributes = True


# --- Match Result ---
class MatchResultCreate(BaseModel):
    """Match result creation."""
    homeScore: int
    awayScore: int
    notes: Optional[str] = None


class MatchResultResponse(BaseModel):
    """Match result response matching frontend MatchResult type."""
    resultId: int
    matchId: int
    homeScore: int
    awayScore: int
    winnerId: Optional[int] = None
    notes: Optional[str] = None
    recordedBy: int
    createdAt: str
    
    class Config:
        from_attributes = True
