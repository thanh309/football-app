"""
Match, Invitation, and Attendance repositories.
"""
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_

from app.repositories.base_repository import BaseRepository
from app.models.match import MatchEvent, MatchInvitation, AttendanceRecord
from app.models.enums import InvitationStatus


class MatchRepository(BaseRepository[MatchEvent]):
    """Repository for MatchEvent operations."""
    
    def __init__(self, db: AsyncSession):
        super().__init__(MatchEvent, db)
    
    async def find_by_id(self, match_id: int) -> Optional[MatchEvent]:
        """Find match by ID."""
        result = await self.db.execute(
            select(MatchEvent).where(MatchEvent.match_id == match_id)
        )
        return result.scalar_one_or_none()
    
    async def find_by_team(self, team_id: int) -> List[MatchEvent]:
        """Find matches where team is host or opponent."""
        result = await self.db.execute(
            select(MatchEvent)
            .where(or_(
                MatchEvent.host_team_id == team_id,
                MatchEvent.opponent_team_id == team_id
            ))
            .order_by(MatchEvent.match_date.desc())
        )
        return list(result.scalars().all())


class InvitationRepository(BaseRepository[MatchInvitation]):
    """Repository for MatchInvitation operations."""
    
    def __init__(self, db: AsyncSession):
        super().__init__(MatchInvitation, db)
    
    async def find_by_id(self, invitation_id: int) -> Optional[MatchInvitation]:
        """Find invitation by ID."""
        result = await self.db.execute(
            select(MatchInvitation).where(MatchInvitation.invitation_id == invitation_id)
        )
        return result.scalar_one_or_none()
    
    async def find_pending_by_team(self, team_id: int) -> List[MatchInvitation]:
        """Find pending invitations for a team."""
        result = await self.db.execute(
            select(MatchInvitation).where(
                MatchInvitation.invited_team_id == team_id,
                MatchInvitation.status == InvitationStatus.PENDING
            )
        )
        return list(result.scalars().all())


class AttendanceRepository(BaseRepository[AttendanceRecord]):
    """Repository for AttendanceRecord operations."""
    
    def __init__(self, db: AsyncSession):
        super().__init__(AttendanceRecord, db)
    
    async def find_by_match(self, match_id: int) -> List[AttendanceRecord]:
        """Find attendance records for a match."""
        result = await self.db.execute(
            select(AttendanceRecord).where(AttendanceRecord.match_id == match_id)
        )
        return list(result.scalars().all())
    
    async def find_by_player(self, player_id: int) -> List[AttendanceRecord]:
        """Find attendance records for a player."""
        result = await self.db.execute(
            select(AttendanceRecord).where(AttendanceRecord.player_id == player_id)
        )
        return list(result.scalars().all())


class ResultRepository(BaseRepository):
    """Repository for MatchResult operations."""
    
    def __init__(self, db: AsyncSession):
        from app.models.match import MatchResult
        super().__init__(MatchResult, db)
    
    async def find_by_match(self, match_id: int):
        """Find result for a match."""
        from app.models.match import MatchResult
        result = await self.db.execute(
            select(MatchResult).where(MatchResult.match_id == match_id)
        )
        return result.scalar_one_or_none()

