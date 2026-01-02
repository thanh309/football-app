"""
Team, Roster, and JoinRequest repositories.
"""
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.repositories.base_repository import BaseRepository
from app.models.team import TeamProfile, TeamRoster, JoinRequest
from app.models.enums import TeamStatus, JoinRequestStatus


class TeamRepository(BaseRepository[TeamProfile]):
    """Repository for TeamProfile operations."""
    
    def __init__(self, db: AsyncSession):
        super().__init__(TeamProfile, db)
    
    async def find_by_id(self, team_id: int) -> Optional[TeamProfile]:
        """Find team by ID."""
        result = await self.db.execute(
            select(TeamProfile).where(TeamProfile.team_id == team_id)
        )
        return result.scalar_one_or_none()
    
    async def find_by_name(self, team_name: str) -> Optional[TeamProfile]:
        """Find team by name."""
        result = await self.db.execute(
            select(TeamProfile).where(TeamProfile.team_name == team_name)
        )
        return result.scalar_one_or_none()
    
    async def find_by_leader_id(self, leader_id: int) -> List[TeamProfile]:
        """Find teams by leader."""
        result = await self.db.execute(
            select(TeamProfile).where(TeamProfile.leader_id == leader_id)
        )
        return list(result.scalars().all())
    
    async def find_pending(self) -> List[TeamProfile]:
        """Find teams with pending verification."""
        result = await self.db.execute(
            select(TeamProfile).where(TeamProfile.status == TeamStatus.PENDING)
        )
        return list(result.scalars().all())
    
    async def search_by_name(self, name: str, limit: int = 20) -> List[TeamProfile]:
        """Search teams by name pattern."""
        result = await self.db.execute(
            select(TeamProfile)
            .where(TeamProfile.team_name.ilike(f"%{name}%"))
            .limit(limit)
        )
        return list(result.scalars().all())


class RosterRepository(BaseRepository[TeamRoster]):
    """Repository for TeamRoster operations."""
    
    def __init__(self, db: AsyncSession):
        super().__init__(TeamRoster, db)
    
    async def find_by_team(self, team_id: int) -> List[TeamRoster]:
        """Find roster entries by team."""
        result = await self.db.execute(
            select(TeamRoster).where(TeamRoster.team_id == team_id)
        )
        return list(result.scalars().all())
    
    async def find_by_player(self, player_id: int) -> List[TeamRoster]:
        """Find roster entries by player."""
        result = await self.db.execute(
            select(TeamRoster).where(TeamRoster.player_id == player_id)
        )
        return list(result.scalars().all())
    
    async def find_by_team_and_player(self, team_id: int, player_id: int) -> Optional[TeamRoster]:
        """Find specific roster entry."""
        result = await self.db.execute(
            select(TeamRoster).where(
                TeamRoster.team_id == team_id,
                TeamRoster.player_id == player_id
            )
        )
        return result.scalar_one_or_none()


class JoinRequestRepository(BaseRepository[JoinRequest]):
    """Repository for JoinRequest operations."""
    
    def __init__(self, db: AsyncSession):
        super().__init__(JoinRequest, db)
    
    async def find_by_id(self, request_id: int) -> Optional[JoinRequest]:
        """Find join request by ID."""
        result = await self.db.execute(
            select(JoinRequest).where(JoinRequest.request_id == request_id)
        )
        return result.scalar_one_or_none()
    
    async def find_pending_by_team(self, team_id: int) -> List[JoinRequest]:
        """Find pending requests for a team."""
        result = await self.db.execute(
            select(JoinRequest).where(
                JoinRequest.team_id == team_id,
                JoinRequest.status == JoinRequestStatus.PENDING
            )
        )
        return list(result.scalars().all())
    
    async def find_pending_by_player(self, player_id: int, team_id: int) -> Optional[JoinRequest]:
        """Find pending request for player to team."""
        result = await self.db.execute(
            select(JoinRequest).where(
                JoinRequest.player_id == player_id,
                JoinRequest.team_id == team_id,
                JoinRequest.status == JoinRequestStatus.PENDING
            )
        )
        return result.scalar_one_or_none()
