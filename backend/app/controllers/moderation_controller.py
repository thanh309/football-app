"""
ModerationController - Moderation and admin HTTP endpoints.
Handles reports, team/field verification, user management.
"""
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel

from app.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import UserAccount
from app.models.moderation import Report, ModerationLog
from app.models.team import TeamProfile
from app.models.field import FieldProfile
from app.models.enums import (
    ReportContentType, ReportStatus, ModerationAction,
    TeamStatus, FieldStatus, UserRole
)

router = APIRouter()


# --- Response Schemas ---

class ReportResponse(BaseModel):
    reportId: int
    reporterId: int
    reportedUserId: Optional[int]
    contentId: Optional[int]
    contentType: str
    reason: str
    details: Optional[str]
    status: str
    createdAt: str
    resolvedAt: Optional[str]


class ReportCreate(BaseModel):
    reportedUserId: Optional[int] = None
    contentId: Optional[int] = None
    contentType: str
    reason: str
    details: Optional[str] = None


class ModerationLogResponse(BaseModel):
    logId: int
    moderatorId: int
    targetUserId: int
    action: str
    reason: str
    details: Optional[str]
    createdAt: str


class UserSummaryResponse(BaseModel):
    userId: int
    email: str
    fullName: str
    role: str
    isActive: bool
    createdAt: str


class VerificationDecision(BaseModel):
    approved: bool
    rejectionReason: Optional[str] = None


class UserRoleUpdate(BaseModel):
    role: str


class UserStatusUpdate(BaseModel):
    isActive: bool
    reason: str


# --- Helper Functions ---

def report_to_response(r: Report) -> ReportResponse:
    return ReportResponse(
        reportId=r.report_id,
        reporterId=r.reporter_id,
        reportedUserId=r.reported_user_id,
        contentId=r.content_id,
        contentType=r.content_type.value,
        reason=r.reason,
        details=r.details,
        status=r.status.value,
        createdAt=r.created_at.isoformat(),
        resolvedAt=r.resolved_at.isoformat() if r.resolved_at else None,
    )


async def require_moderator(user: UserAccount):
    """Check if user has moderator role."""
    if user.role != UserRole.MODERATOR:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Moderator access required")


# --- Report Endpoints ---

@router.post("/reports", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
async def create_report(
    data: ReportCreate,
    user: UserAccount = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new report."""
    report = Report(
        reporter_id=user.user_id,
        reported_user_id=data.reportedUserId,
        content_id=data.contentId,
        content_type=ReportContentType(data.contentType),
        reason=data.reason,
        details=data.details,
        status=ReportStatus.PENDING,
    )
    db.add(report)
    await db.commit()
    
    return report_to_response(report)


@router.get("/reports", response_model=List[ReportResponse])
async def get_reports(
    status_filter: Optional[str] = Query(None, alias="status"),
    limit: int = Query(50, le=100),
    user: UserAccount = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all reports (moderator only)."""
    await require_moderator(user)
    
    stmt = select(Report).order_by(Report.created_at.desc()).limit(limit)
    if status_filter:
        stmt = stmt.where(Report.status == ReportStatus(status_filter))
    
    result = await db.execute(stmt)
    reports = result.scalars().all()
    
    return [report_to_response(r) for r in reports]


@router.get("/reports/{report_id}", response_model=ReportResponse)
async def get_report(
    report_id: int,
    user: UserAccount = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get report by ID (moderator only)."""
    await require_moderator(user)
    
    result = await db.execute(select(Report).where(Report.report_id == report_id))
    report = result.scalar_one_or_none()
    
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")
    
    return report_to_response(report)


@router.put("/reports/{report_id}/resolve", response_model=ReportResponse)
async def resolve_report(
    report_id: int,
    action: str = Query(...),
    user: UserAccount = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Resolve a report (moderator only)."""
    await require_moderator(user)
    
    result = await db.execute(select(Report).where(Report.report_id == report_id))
    report = result.scalar_one_or_none()
    
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")
    
    report.status = ReportStatus.RESOLVED if action == "resolve" else ReportStatus.DISMISSED
    report.resolved_at = datetime.utcnow()
    await db.commit()
    
    return report_to_response(report)


# --- Team Verification Endpoints ---

@router.get("/teams/pending", response_model=List[dict])
async def get_pending_teams(
    user: UserAccount = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get teams pending verification (moderator only)."""
    await require_moderator(user)
    
    result = await db.execute(
        select(TeamProfile).where(TeamProfile.status == TeamStatus.PENDING)
    )
    teams = result.scalars().all()
    
    return [
        {
            "teamId": t.team_id,
            "teamName": t.team_name,
            "leaderId": t.leader_id,
            "description": t.description,
            "location": t.location,
            "createdAt": t.created_at.isoformat(),
        } for t in teams
    ]


@router.put("/teams/{team_id}/verify", response_model=dict)
async def verify_team(
    team_id: int,
    data: VerificationDecision,
    user: UserAccount = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Verify or reject a team (moderator only)."""
    await require_moderator(user)
    
    result = await db.execute(select(TeamProfile).where(TeamProfile.team_id == team_id))
    team = result.scalar_one_or_none()
    
    if not team:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")
    
    if data.approved:
        team.status = TeamStatus.VERIFIED
    else:
        team.status = TeamStatus.REJECTED
        team.rejection_reason = data.rejectionReason
    
    await db.commit()
    
    return {"message": f"Team {'verified' if data.approved else 'rejected'}"}


# --- Field Verification Endpoints ---

@router.get("/fields/pending", response_model=List[dict])
async def get_pending_fields(
    user: UserAccount = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get fields pending verification (moderator only)."""
    await require_moderator(user)
    
    result = await db.execute(
        select(FieldProfile).where(FieldProfile.status == FieldStatus.PENDING)
    )
    fields = result.scalars().all()
    
    return [
        {
            "fieldId": f.field_id,
            "fieldName": f.field_name,
            "ownerId": f.owner_id,
            "location": f.location,
            "description": f.description,
            "createdAt": f.created_at.isoformat(),
        } for f in fields
    ]


@router.put("/fields/{field_id}/verify", response_model=dict)
async def verify_field(
    field_id: int,
    data: VerificationDecision,
    user: UserAccount = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Verify or reject a field (moderator only)."""
    await require_moderator(user)
    
    result = await db.execute(select(FieldProfile).where(FieldProfile.field_id == field_id))
    field = result.scalar_one_or_none()
    
    if not field:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Field not found")
    
    if data.approved:
        field.status = FieldStatus.VERIFIED
    else:
        field.status = FieldStatus.REJECTED
        field.rejection_reason = data.rejectionReason
    
    await db.commit()
    
    return {"message": f"Field {'verified' if data.approved else 'rejected'}"}


# --- User Management Endpoints ---

@router.get("/users", response_model=List[UserSummaryResponse])
async def get_users(
    role: Optional[str] = Query(None),
    limit: int = Query(50, le=100),
    user: UserAccount = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all users (moderator only)."""
    await require_moderator(user)
    
    stmt = select(UserAccount).limit(limit)
    if role:
        stmt = stmt.where(UserAccount.role == UserRole(role))
    
    result = await db.execute(stmt)
    users = result.scalars().all()
    
    return [
        UserSummaryResponse(
            userId=u.user_id,
            email=u.email,
            fullName=u.full_name or "",
            role=u.role.value,
            isActive=u.is_active,
            createdAt=u.created_at.isoformat(),
        ) for u in users
    ]


@router.get("/users/{user_id}", response_model=UserSummaryResponse)
async def get_user_details(
    user_id: int,
    user: UserAccount = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get user details (moderator only)."""
    await require_moderator(user)
    
    result = await db.execute(select(UserAccount).where(UserAccount.user_id == user_id))
    target_user = result.scalar_one_or_none()
    
    if not target_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    return UserSummaryResponse(
        userId=target_user.user_id,
        email=target_user.email,
        fullName=target_user.full_name or "",
        role=target_user.role.value,
        isActive=target_user.is_active,
        createdAt=target_user.created_at.isoformat(),
    )


@router.put("/users/{user_id}/role", response_model=dict)
async def update_user_role(
    user_id: int,
    data: UserRoleUpdate,
    user: UserAccount = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update user role (moderator only)."""
    await require_moderator(user)
    
    result = await db.execute(select(UserAccount).where(UserAccount.user_id == user_id))
    target_user = result.scalar_one_or_none()
    
    if not target_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    target_user.role = UserRole(data.role)
    await db.commit()
    
    # Log the action
    log = ModerationLog(
        moderator_id=user.user_id,
        target_user_id=user_id,
        action=ModerationAction.ROLE_CHANGE,
        reason=f"Role changed to {data.role}",
    )
    db.add(log)
    await db.commit()
    
    return {"message": f"User role updated to {data.role}"}


@router.put("/users/{user_id}/suspend", response_model=dict)
async def suspend_user(
    user_id: int,
    data: UserStatusUpdate,
    user: UserAccount = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Suspend or activate a user (moderator only)."""
    await require_moderator(user)
    
    result = await db.execute(select(UserAccount).where(UserAccount.user_id == user_id))
    target_user = result.scalar_one_or_none()
    
    if not target_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    target_user.is_active = data.isActive
    
    # Log the action
    action = ModerationAction.ACTIVATE if data.isActive else ModerationAction.SUSPEND
    log = ModerationLog(
        moderator_id=user.user_id,
        target_user_id=user_id,
        action=action,
        reason=data.reason,
    )
    db.add(log)
    await db.commit()
    
    return {"message": f"User {'activated' if data.isActive else 'suspended'}"}


# --- Moderation Log Endpoints ---

@router.get("/logs", response_model=List[ModerationLogResponse])
async def get_moderation_logs(
    limit: int = Query(50, le=100),
    user: UserAccount = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get moderation action logs (moderator only)."""
    await require_moderator(user)
    
    result = await db.execute(
        select(ModerationLog).order_by(ModerationLog.created_at.desc()).limit(limit)
    )
    logs = result.scalars().all()
    
    return [
        ModerationLogResponse(
            logId=l.log_id,
            moderatorId=l.moderator_id,
            targetUserId=l.target_user_id,
            action=l.action.value,
            reason=l.reason,
            details=l.details,
            createdAt=l.created_at.isoformat(),
        ) for l in logs
    ]


@router.get("/logs/user/{user_id}", response_model=List[ModerationLogResponse])
async def get_user_moderation_logs(
    user_id: int,
    user: UserAccount = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get moderation logs for a specific user (moderator only)."""
    await require_moderator(user)
    
    result = await db.execute(
        select(ModerationLog)
        .where(ModerationLog.target_user_id == user_id)
        .order_by(ModerationLog.created_at.desc())
    )
    logs = result.scalars().all()
    
    return [
        ModerationLogResponse(
            logId=l.log_id,
            moderatorId=l.moderator_id,
            targetUserId=l.target_user_id,
            action=l.action.value,
            reason=l.reason,
            details=l.details,
            createdAt=l.created_at.isoformat(),
        ) for l in logs
    ]


# --- Dashboard Stats ---

@router.get("/stats", response_model=dict)
async def get_moderation_stats(
    user: UserAccount = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get moderation dashboard statistics (moderator only)."""
    await require_moderator(user)
    
    from sqlalchemy import func
    
    # Pending reports
    pending_reports = await db.execute(
        select(func.count(Report.report_id)).where(Report.status == ReportStatus.PENDING)
    )
    # Pending teams
    pending_teams = await db.execute(
        select(func.count(TeamProfile.team_id)).where(TeamProfile.status == TeamStatus.PENDING)
    )
    # Pending fields
    pending_fields = await db.execute(
        select(func.count(FieldProfile.field_id)).where(FieldProfile.status == FieldStatus.PENDING)
    )
    # Total users
    total_users = await db.execute(select(func.count(UserAccount.user_id)))
    
    return {
        "pendingReports": pending_reports.scalar() or 0,
        "pendingTeams": pending_teams.scalar() or 0,
        "pendingFields": pending_fields.scalar() or 0,
        "totalUsers": total_users.scalar() or 0,
    }
