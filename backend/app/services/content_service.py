"""
ContentService - Posts and comments business logic.
Maps to ContentController in class diagram.
"""
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.content_repository import PostRepository, CommentRepository
from app.models.social import Post, Comment
from app.models.enums import Visibility


class ContentService:
    """Service handling content (posts, comments) business logic."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
        self.post_repo = PostRepository(db)
        self.comment_repo = CommentRepository(db)
    
    async def create_post(
        self,
        author_id: int,
        content: str,
        team_id: int = None,
        visibility: Visibility = Visibility.PUBLIC,
    ) -> Post:
        """Create a new post."""
        post = Post(
            author_id=author_id,
            content=content,
            team_id=team_id,
            visibility=visibility,
        )
        await self.post_repo.save(post)
        await self.post_repo.commit()
        return post
    
    async def get_post_by_id(self, post_id: int) -> Optional[Post]:
        """Get post by ID."""
        return await self.post_repo.find_by_id(post_id)
    
    async def get_public_feed(self, limit: int = 20, offset: int = 0) -> List[Post]:
        """Get public posts for feed."""
        return await self.post_repo.find_public_feed(limit, offset)
    
    async def get_posts_by_author(self, author_id: int) -> List[Post]:
        """Get posts by author."""
        return await self.post_repo.find_by_author(author_id)
    
    async def delete_post(self, post: Post) -> bool:
        """Delete a post."""
        await self.post_repo.delete(post)
        await self.post_repo.commit()
        return True
    
    # --- Comments ---
    
    async def create_comment(
        self,
        post_id: int,
        author_id: int,
        content: str,
        parent_comment_id: int = None,
    ) -> Comment:
        """Create a comment on a post."""
        # Get post to increment counter
        post = await self.post_repo.find_by_id(post_id)
        if not post:
            raise ValueError("Post not found")
        
        comment = Comment(
            post_id=post_id,
            author_id=author_id,
            content=content,
            parent_comment_id=parent_comment_id,
        )
        await self.comment_repo.save(comment)
        
        # Increment comment count
        post.comment_count += 1
        await self.post_repo.update(post)
        
        await self.comment_repo.commit()
        return comment
    
    async def get_comments_by_post(self, post_id: int) -> List[Comment]:
        """Get comments for a post."""
        return await self.comment_repo.find_by_post(post_id)
