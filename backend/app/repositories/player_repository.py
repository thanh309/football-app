"""
Player profile repository.
"""
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.repositories.base_repository import BaseRepository
from app.models.player import PlayerProfile


class PlayerRepository(BaseRepository[PlayerProfile]):
    """Repository for PlayerProfile operations."""
    
    def __init__(self, db: AsyncSession):
        super().__init__(PlayerProfile, db)
    
    async def find_by_id(self, player_id: int) -> Optional[PlayerProfile]:
        """Find player by ID."""
        result = await self.db.execute(
            select(PlayerProfile).where(PlayerProfile.player_id == player_id)
        )
        return result.scalar_one_or_none()
    
    async def find_by_user_id(self, user_id: int) -> Optional[PlayerProfile]:
        """Find player profile by user ID."""
        result = await self.db.execute(
            select(PlayerProfile).where(PlayerProfile.user_id == user_id)
        )
        return result.scalar_one_or_none()
    
    async def search_by_position(self, position: str, limit: int = 20, offset: int = 0) -> List[PlayerProfile]:
        """Search players by position."""
        result = await self.db.execute(
            select(PlayerProfile)
            .where(PlayerProfile.position.ilike(f"%{position}%"))
            .offset(offset).limit(limit)
        )
        return list(result.scalars().all())
    
    async def search_by_skill_level(self, min_skill: int, max_skill: int, limit: int = 20) -> List[PlayerProfile]:
        """Search players within skill range."""
        result = await self.db.execute(
            select(PlayerProfile)
            .where(
                PlayerProfile.skill_level >= min_skill,
                PlayerProfile.skill_level <= max_skill
            )
            .limit(limit)
        )
        return list(result.scalars().all())
