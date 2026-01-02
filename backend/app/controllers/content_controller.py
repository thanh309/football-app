"""
ContentController - Posts and comments HTTP endpoints.
Thin controller that delegates to ContentService.
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.services.content_service import ContentService
from app.schemas.social import PostResponse, PostCreate, CommentResponse, CommentCreate
from app.schemas.common import MessageResponse
from app.dependencies.auth import get_current_user, get_current_user_optional
from app.models.user import UserAccount
from app.models.enums import Visibility

router = APIRouter()


def get_content_service(db: AsyncSession = Depends(get_db)) -> ContentService:
    return ContentService(db)


def post_to_response(p) -> PostResponse:
    return PostResponse(
        postId=p.post_id,
        authorId=p.author_id,
        teamId=p.team_id,
        content=p.content,
        visibility=p.visibility.value,
        reactionCount=p.reaction_count,
        commentCount=p.comment_count,
        isHidden=p.is_hidden,
        createdAt=p.created_at.isoformat(),
        updatedAt=p.updated_at.isoformat(),
    )


@router.post("", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
async def create_post(
    data: PostCreate,
    user: UserAccount = Depends(get_current_user),
    content_service: ContentService = Depends(get_content_service)
):
    """Create a new post."""
    post = await content_service.create_post(
        author_id=user.user_id,
        content=data.content,
        team_id=data.teamId,
        visibility=Visibility(data.visibility),
    )
    return post_to_response(post)


@router.get("", response_model=List[PostResponse])
async def get_posts(
    team_id: Optional[int] = Query(None, alias="teamId"),
    limit: int = Query(20, le=100),
    offset: int = Query(0),
    content_service: ContentService = Depends(get_content_service)
):
    """Get posts feed."""
    posts = await content_service.get_public_feed(limit, offset)
    return [post_to_response(p) for p in posts]


@router.get("/{post_id}", response_model=PostResponse)
async def get_post(
    post_id: int,
    content_service: ContentService = Depends(get_content_service)
):
    """Get post by ID."""
    post = await content_service.get_post_by_id(post_id)
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    return post_to_response(post)


@router.delete("/{post_id}", response_model=MessageResponse)
async def delete_post(
    post_id: int,
    user: UserAccount = Depends(get_current_user),
    content_service: ContentService = Depends(get_content_service)
):
    """Delete post (author only)."""
    post = await content_service.get_post_by_id(post_id)
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    if post.author_id != user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    await content_service.delete_post(post)
    return MessageResponse(message="Post deleted")


@router.get("/{post_id}/comments", response_model=List[CommentResponse])
async def get_comments(
    post_id: int,
    content_service: ContentService = Depends(get_content_service)
):
    """Get comments for a post."""
    comments = await content_service.get_comments_by_post(post_id)
    return [
        CommentResponse(
            commentId=c.comment_id,
            postId=c.post_id,
            authorId=c.author_id,
            content=c.content,
            parentCommentId=c.parent_comment_id,
            isHidden=c.is_hidden,
            createdAt=c.created_at.isoformat(),
            updatedAt=c.updated_at.isoformat(),
        ) for c in comments
    ]


@router.post("/{post_id}/comments", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
async def add_comment(
    post_id: int,
    data: CommentCreate,
    user: UserAccount = Depends(get_current_user),
    content_service: ContentService = Depends(get_content_service)
):
    """Add a comment to a post."""
    try:
        comment = await content_service.create_comment(
            post_id=post_id,
            author_id=user.user_id,
            content=data.content,
            parent_comment_id=data.parentCommentId,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    
    return CommentResponse(
        commentId=comment.comment_id,
        postId=comment.post_id,
        authorId=comment.author_id,
        content=comment.content,
        parentCommentId=comment.parent_comment_id,
        isHidden=comment.is_hidden,
        createdAt=comment.created_at.isoformat(),
        updatedAt=comment.updated_at.isoformat(),
    )
