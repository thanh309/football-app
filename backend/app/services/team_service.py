"""
TeamService - Team management business logic.
Maps to TeamController in class diagram.
"""
from typing import List, Optional
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.team_repository import TeamRepository, RosterRepository, JoinRequestRepository
from app.repositories.player_repository import PlayerRepository
from app.models.team import TeamProfile, TeamRoster, JoinRequest
from app.models.enums import TeamStatus, RosterRole, JoinRequestStatus, UserRole


class TeamService:
    """Service handling team business logic."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
        self.team_repo = TeamRepository(db)
        self.roster_repo = RosterRepository(db)
        self.join_request_repo = JoinRequestRepository(db)
        self.player_repo = PlayerRepository(db)
    
    async def create_team(
        self,
        leader_id: int,
        team_name: str,
        description: str = None,
        location: str = None,
        latitude: float = None,
        longitude: float = None,
    ) -> TeamProfile:
        """Create a new team with the user as leader."""
        # Check name uniqueness
        existing = await self.team_repo.find_by_name(team_name)
        if existing:
            raise ValueError("Team name already exists")
        
        team = TeamProfile(
            team_name=team_name,
            description=description,
            leader_id=leader_id,
            status=TeamStatus.PENDING,
            location=location,
            latitude=latitude,
            longitude=longitude,
        )
        await self.team_repo.save(team)
        
        # Add leader to roster as Captain
        player = await self.player_repo.find_by_user_id(leader_id)
        if player:
            roster_entry = TeamRoster(
                team_id=team.team_id,
                player_id=player.player_id,
                role=RosterRole.CAPTAIN,
                is_active=True,
            )
            await self.roster_repo.save(roster_entry)
        
        await self.team_repo.commit()
        return team
    
    async def get_team_by_id(self, team_id: int) -> Optional[TeamProfile]:
        """Get team by ID."""
        return await self.team_repo.find_by_id(team_id)
    
    async def get_teams_by_leader(self, leader_id: int) -> List[TeamProfile]:
        """Get teams where user is leader."""
        return await self.team_repo.find_by_leader_id(leader_id)
    
    async def update_team(
        self,
        team: TeamProfile,
        team_name: str = None,
        description: str = None,
        **kwargs
    ) -> TeamProfile:
        """Update team profile."""
        if team_name and team_name != team.team_name:
            existing = await self.team_repo.find_by_name(team_name)
            if existing:
                raise ValueError("Team name already exists")
            team.team_name = team_name
        
        if description is not None:
            team.description = description
        
        for key, value in kwargs.items():
            if hasattr(team, key) and value is not None:
                setattr(team, key, value)
        
        await self.team_repo.update(team)
        await self.team_repo.commit()
        return team
    
    async def delete_team(self, team: TeamProfile) -> bool:
        """Delete a team."""
        await self.team_repo.delete(team)
        await self.team_repo.commit()
        return True
    
    # --- Join Requests ---
    
    async def create_join_request(
        self,
        team_id: int,
        player_id: int,
        message: str = None
    ) -> JoinRequest:
        """Create a join request."""
        # Check for existing pending request
        existing = await self.join_request_repo.find_pending_by_player(player_id, team_id)
        if existing:
            raise ValueError("You already have a pending request")
        
        join_request = JoinRequest(
            team_id=team_id,
            player_id=player_id,
            status=JoinRequestStatus.PENDING,
            message=message,
        )
        await self.join_request_repo.save(join_request)
        await self.join_request_repo.commit()
        return join_request
    
    async def get_pending_requests(self, team_id: int) -> List[JoinRequest]:
        """Get pending join requests for a team."""
        return await self.join_request_repo.find_pending_by_team(team_id)
    
    async def process_join_request(
        self,
        request: JoinRequest,
        approve: bool
    ) -> bool:
        """Approve or reject a join request."""
        request.processed_at = datetime.utcnow()
        
        if approve:
            request.status = JoinRequestStatus.ACCEPTED
            # Add player to roster
            roster_entry = TeamRoster(
                team_id=request.team_id,
                player_id=request.player_id,
                role=RosterRole.MEMBER,
                is_active=True,
            )
            await self.roster_repo.save(roster_entry)
        else:
            request.status = JoinRequestStatus.REJECTED
        
        await self.join_request_repo.update(request)
        await self.join_request_repo.commit()
        return True
