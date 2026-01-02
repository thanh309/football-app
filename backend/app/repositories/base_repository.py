"""
Base repository providing generic CRUD operations.
All entity repositories extend this base class following the DAO pattern.
"""
from typing import TypeVar, Generic, Optional, List, Type
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from sqlalchemy.orm import selectinload

from app.database import Base

# Generic type for the model
T = TypeVar('T', bound=Base)


class BaseRepository(Generic[T]):
    """
    Generic base repository implementing common CRUD operations.
    
    Usage:
        class UserRepository(BaseRepository[UserAccount]):
            def __init__(self, db: AsyncSession):
                super().__init__(UserAccount, db)
    """
    
    def __init__(self, model: Type[T], db: AsyncSession):
        self.model = model
        self.db = db
    
    async def find_by_id(self, id: int) -> Optional[T]:
        """Find entity by primary key ID."""
        result = await self.db.execute(
            select(self.model).where(self.model.__table__.c[self._get_pk_name()] == id)
        )
        return result.scalar_one_or_none()
    
    async def find_all(self, limit: int = 100, offset: int = 0) -> List[T]:
        """Find all entities with pagination."""
        result = await self.db.execute(
            select(self.model).offset(offset).limit(limit)
        )
        return list(result.scalars().all())
    
    async def save(self, entity: T) -> T:
        """Save a new entity."""
        self.db.add(entity)
        await self.db.flush()
        await self.db.refresh(entity)
        return entity
    
    async def update(self, entity: T) -> T:
        """Update an existing entity."""
        await self.db.flush()
        await self.db.refresh(entity)
        return entity
    
    async def delete(self, entity: T) -> bool:
        """Delete an entity."""
        await self.db.delete(entity)
        await self.db.flush()
        return True
    
    async def delete_by_id(self, id: int) -> bool:
        """Delete entity by ID."""
        entity = await self.find_by_id(id)
        if entity:
            await self.delete(entity)
            return True
        return False
    
    async def commit(self) -> None:
        """Commit the current transaction."""
        await self.db.commit()
    
    def _get_pk_name(self) -> str:
        """Get the primary key column name."""
        pk_columns = self.model.__table__.primary_key.columns
        return list(pk_columns)[0].name
