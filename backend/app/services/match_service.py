"""
MatchService - Match event business logic.
Maps to MatchController in class diagram.
"""
from typing import List, Optional
from datetime import datetime, date, time
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.match_repository import MatchRepository, InvitationRepository, AttendanceRepository
from app.repositories.team_repository import TeamRepository
from app.services.notification_service import NotificationService
from app.models.match import MatchEvent, MatchInvitation, AttendanceRecord, MatchResult
from app.models.enums import MatchStatus, Visibility, InvitationStatus, NotificationType

class MatchService:
    """Service handling match business logic."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
        self.match_repo = MatchRepository(db)
        self.invitation_repo = InvitationRepository(db)
        self.attendance_repo = AttendanceRepository(db)
        self.team_repo = TeamRepository(db)
        self.notification_service = NotificationService(db)
    
    async def create_match(
        self,
        host_team_id: int,
        match_date: date,
        start_time: time,
        end_time: time = None,
        field_id: int = None,
        visibility: Visibility = Visibility.PUBLIC,
        description: str = None,
    ) -> MatchEvent:
        """Create a new match event."""
        match = MatchEvent(
            host_team_id=host_team_id,
            match_date=match_date,
            start_time=start_time,
            end_time=end_time,
            field_id=field_id,
            visibility=visibility,
            description=description,
            status=MatchStatus.LOOKING_FOR_FIELD if not field_id else MatchStatus.SCHEDULED,
        )
        await self.match_repo.save(match)
        await self.match_repo.commit()
        return match
    
    async def get_match_by_id(self, match_id: int) -> Optional[MatchEvent]:
        """Get match by ID."""
        return await self.match_repo.find_by_id(match_id)
    
    async def get_matches_by_team(self, team_id: int) -> List[MatchEvent]:
        """Get matches for a team."""
        return await self.match_repo.find_by_team(team_id)
    
    async def update_match(self, match: MatchEvent, **kwargs) -> MatchEvent:
        """Update match event."""
        for key, value in kwargs.items():
            if hasattr(match, key) and value is not None:
                setattr(match, key, value)
        
        await self.match_repo.update(match)
        await self.match_repo.commit()
        return match
    
    async def cancel_match(self, match: MatchEvent) -> bool:
        """Cancel a match."""
        match.status = MatchStatus.CANCELLED
        await self.match_repo.update(match)
        await self.match_repo.commit()
        return True
    
    # --- Invitations ---
    
    async def send_invitation(
        self,
        match: MatchEvent,
        invited_team_id: int,
        message: str = None
    ) -> MatchInvitation:
        """Send match invitation."""
        invitation = MatchInvitation(
            match_id=match.match_id,
            inviting_team_id=match.host_team_id,
            invited_team_id=invited_team_id,
            status=InvitationStatus.PENDING,
            message=message,
        )
        await self.invitation_repo.save(invitation)
        
        # Notify invited team leader
        invited_team = await self.team_repo.find_by_id(invited_team_id)
        if invited_team:
            await self.notification_service.create_notification(
                user_id=invited_team.leader_id,
                notification_type=NotificationType.MATCH_INVITE,
                title="Match Invitation",
                message=f"You have been invited to a match.",
                related_entity_id=match.match_id,
                related_entity_type="Match"
            )
            
        await self.invitation_repo.commit()
        return invitation
    
    async def respond_to_invitation(
        self,
        invitation: MatchInvitation,
        accept: bool
    ) -> bool:
        """Accept or decline match invitation."""
        invitation.responded_at = datetime.utcnow()
        
        if accept:
            invitation.status = InvitationStatus.ACCEPTED
            # Update match with opponent
            match = await self.match_repo.find_by_id(invitation.match_id)
            if match:
                match.opponent_team_id = invitation.invited_team_id
                if match.status == MatchStatus.LOOKING_FOR_FIELD:
                    match.status = MatchStatus.SCHEDULED
                await self.match_repo.update(match)
        else:
            invitation.status = InvitationStatus.DECLINED
        
        await self.invitation_repo.update(invitation)
        await self.invitation_repo.commit()
        return True
    
    async def get_match_attendance(self, match_id: int) -> List[AttendanceRecord]:
        """Get attendance records for a match."""
        return await self.attendance_repo.find_by_match(match_id)
