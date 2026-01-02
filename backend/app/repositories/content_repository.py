"""
Post, Comment, and Reaction repositories.
"""
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.repositories.base_repository import BaseRepository
from app.models.social import Post, Comment, Reaction
from app.models.enums import Visibility


class PostRepository(BaseRepository[Post]):
    """Repository for Post operations."""
    
    def __init__(self, db: AsyncSession):
        super().__init__(Post, db)
    
    async def find_by_id(self, post_id: int) -> Optional[Post]:
        """Find post by ID."""
        result = await self.db.execute(
            select(Post).where(Post.post_id == post_id)
        )
        return result.scalar_one_or_none()
    
    async def find_public_feed(self, limit: int = 20, offset: int = 0) -> List[Post]:
        """Find public posts for feed."""
        result = await self.db.execute(
            select(Post)
            .where(Post.visibility == Visibility.PUBLIC, Post.is_hidden == False)
            .order_by(Post.created_at.desc())
            .offset(offset).limit(limit)
        )
        return list(result.scalars().all())
    
    async def find_by_author(self, author_id: int) -> List[Post]:
        """Find posts by author."""
        result = await self.db.execute(
            select(Post).where(Post.author_id == author_id)
            .order_by(Post.created_at.desc())
        )
        return list(result.scalars().all())


class CommentRepository(BaseRepository[Comment]):
    """Repository for Comment operations."""
    
    def __init__(self, db: AsyncSession):
        super().__init__(Comment, db)
    
    async def find_by_post(self, post_id: int) -> List[Comment]:
        """Find comments for a post."""
        result = await self.db.execute(
            select(Comment)
            .where(Comment.post_id == post_id, Comment.is_hidden == False)
            .order_by(Comment.created_at)
        )
        return list(result.scalars().all())
    
    async def find_replies(self, comment_id: int) -> List[Comment]:
        """Find replies to a comment."""
        result = await self.db.execute(
            select(Comment).where(Comment.parent_comment_id == comment_id)
        )
        return list(result.scalars().all())


class ReactionRepository(BaseRepository[Reaction]):
    """Repository for Reaction operations."""
    
    def __init__(self, db: AsyncSession):
        super().__init__(Reaction, db)
    
    async def find_by_post(self, post_id: int) -> List[Reaction]:
        """Find reactions for a post."""
        result = await self.db.execute(
            select(Reaction).where(Reaction.target_type == "post", Reaction.target_id == post_id)
        )
        return list(result.scalars().all())
    
    async def exists(self, post_id: int, user_id: int) -> bool:
        """Check if user already reacted."""
        result = await self.db.execute(
            select(Reaction).where(
                Reaction.target_type == "post",
                Reaction.target_id == post_id,
                Reaction.user_id == user_id
            )
        )
        return result.scalar_one_or_none() is not None
