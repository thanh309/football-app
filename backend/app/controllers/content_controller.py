"""
ContentController - Posts and comments HTTP endpoints.
Thin controller that delegates to ContentService.
"""
from typing import List, Optional
from pydantic import BaseModel
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
    db: AsyncSession = Depends(get_db)
):
    """Get posts feed (all non-hidden posts)."""
    from app.models.social import Post
    
    # Get all non-hidden posts (including public, private, team-only)
    stmt = select(Post).where(Post.is_hidden == False).order_by(Post.created_at.desc())
    
    if team_id:
        stmt = stmt.where(Post.team_id == team_id)
    
    stmt = stmt.offset(offset).limit(limit)
    
    result = await db.execute(stmt)
    posts = result.scalars().all()
    
    return [post_to_response(p) for p in posts]


class UserReactionResponse(BaseModel):
    """User reaction for a post."""
    postId: int
    reactionType: Optional[str] = None


@router.get("/my-reactions", response_model=List[UserReactionResponse])
async def get_my_reactions(
    postIds: List[int] = Query(..., alias="postIds[]"),
    user: UserAccount = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get current user's reactions for multiple posts."""
    from app.models.social import Reaction
    from app.models.enums import ReactionEntityType
    
    result = await db.execute(
        select(Reaction).where(
            Reaction.entity_type == ReactionEntityType.POST,
            Reaction.entity_id.in_(postIds),
            Reaction.user_id == user.user_id
        )
    )
    reactions = result.scalars().all()
    
    # Create a map of post_id -> reaction_type
    reaction_map = {r.entity_id: r.type.value for r in reactions}
    
    return [
        UserReactionResponse(
            postId=pid,
            reactionType=reaction_map.get(pid),
        ) for pid in postIds
    ]


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


# --- Community Enhancements ---
from sqlalchemy import select

@router.post("/{post_id}/like", response_model=MessageResponse)
async def like_post(
    post_id: int,
    user: UserAccount = Depends(get_current_user),
    content_service: ContentService = Depends(get_content_service),
    db: AsyncSession = Depends(get_db)
):
    """Like a post."""
    from app.models.social import Post
    
    post = await content_service.get_post_by_id(post_id)
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    
    # Increment reaction count
    post.reaction_count = (post.reaction_count or 0) + 1
    await db.commit()
    
    return MessageResponse(message="Post liked")


@router.delete("/{post_id}/like", response_model=MessageResponse)
async def unlike_post(
    post_id: int,
    user: UserAccount = Depends(get_current_user),
    content_service: ContentService = Depends(get_content_service),
    db: AsyncSession = Depends(get_db)
):
    """Unlike a post."""
    post = await content_service.get_post_by_id(post_id)
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    
    # Decrement reaction count
    if post.reaction_count and post.reaction_count > 0:
        post.reaction_count = post.reaction_count - 1
    await db.commit()
    
    return MessageResponse(message="Post unliked")


@router.get("/user/{user_id}", response_model=List[PostResponse])
async def get_user_posts(
    user_id: int,
    limit: int = Query(20, le=100),
    offset: int = Query(0),
    db: AsyncSession = Depends(get_db)
):
    """Get posts by a specific user."""
    from app.models.social import Post
    
    result = await db.execute(
        select(Post)
        .where(Post.author_id == user_id, Post.is_hidden == False)
        .order_by(Post.created_at.desc())
        .offset(offset)
        .limit(limit)
    )
    posts = result.scalars().all()
    
    return [post_to_response(p) for p in posts]


@router.get("/team/{team_id}", response_model=List[PostResponse])
async def get_team_posts(
    team_id: int,
    limit: int = Query(20, le=100),
    offset: int = Query(0),
    db: AsyncSession = Depends(get_db)
):
    """Get posts for a specific team."""
    from app.models.social import Post
    
    result = await db.execute(
        select(Post)
        .where(Post.team_id == team_id, Post.is_hidden == False)
        .order_by(Post.created_at.desc())
        .offset(offset)
        .limit(limit)
    )
    posts = result.scalars().all()
    
    return [post_to_response(p) for p in posts]


@router.get("/{post_id}/comments/{comment_id}/replies", response_model=List[CommentResponse])
async def get_comment_replies(
    post_id: int,
    comment_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get replies to a specific comment."""
    from app.models.social import Comment
    
    result = await db.execute(
        select(Comment)
        .where(
            Comment.post_id == post_id,
            Comment.parent_comment_id == comment_id,
            Comment.is_hidden == False
        )
        .order_by(Comment.created_at)
    )
    replies = result.scalars().all()
    
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
        ) for c in replies
    ]


# --- Reactions Endpoints ---

class ReactionRequest(BaseModel):
    """Reaction request body."""
    type: str


class ReactionResponse(BaseModel):
    """Reaction response."""
    reactionId: int
    postId: int
    userId: int
    type: str
    createdAt: str
    isRemoved: bool = False


@router.post("/{post_id}/reactions", response_model=ReactionResponse, status_code=status.HTTP_201_CREATED)
async def toggle_reaction(
    post_id: int,
    data: ReactionRequest,
    user: UserAccount = Depends(get_current_user),
    content_service: ContentService = Depends(get_content_service),
    db: AsyncSession = Depends(get_db)
):
    """Toggle a reaction on a post - creates if not exists, removes if same type, updates if different type."""
    from app.models.social import Post, Reaction
    from app.models.enums import ReactionType, ReactionEntityType
    from datetime import datetime
    
    post = await content_service.get_post_by_id(post_id)
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    
    # Parse the requested reaction type
    try:
        reaction_type = ReactionType(data.type)
    except ValueError:
        reaction_type = ReactionType.LIKE  # Default to LIKE if invalid type
    
    # Check if user already reacted to this post
    existing = await db.execute(
        select(Reaction).where(
            Reaction.entity_type == ReactionEntityType.POST,
            Reaction.entity_id == post_id,
            Reaction.user_id == user.user_id
        )
    )
    existing_reaction = existing.scalar_one_or_none()
    
    if existing_reaction:
        if existing_reaction.type == reaction_type:
            # Same type - remove reaction (toggle off)
            await db.delete(existing_reaction)
            post.reaction_count = max(0, (post.reaction_count or 0) - 1)
            await db.commit()
            return ReactionResponse(
                reactionId=existing_reaction.reaction_id,
                postId=post_id,
                userId=user.user_id,
                type=existing_reaction.type.value,
                createdAt=existing_reaction.created_at.isoformat(),
                isRemoved=True,
            )
        else:
            # Different type - update reaction type (count stays same)
            existing_reaction.type = reaction_type
            await db.commit()
            return ReactionResponse(
                reactionId=existing_reaction.reaction_id,
                postId=post_id,
                userId=user.user_id,
                type=existing_reaction.type.value,
                createdAt=existing_reaction.created_at.isoformat(),
                isRemoved=False,
            )
    else:
        # No existing reaction - create new one
        new_reaction = Reaction(
            entity_type=ReactionEntityType.POST,
            entity_id=post_id,
            user_id=user.user_id,
            type=reaction_type,
        )
        db.add(new_reaction)
        post.reaction_count = (post.reaction_count or 0) + 1
        await db.commit()
        await db.refresh(new_reaction)
        
        return ReactionResponse(
            reactionId=new_reaction.reaction_id,
            postId=post_id,
            userId=user.user_id,
            type=new_reaction.type.value,
            createdAt=new_reaction.created_at.isoformat(),
            isRemoved=False,
        )


@router.get("/{post_id}/reactions", response_model=List[ReactionResponse])
async def get_reactions(
    post_id: int,
    content_service: ContentService = Depends(get_content_service),
    db: AsyncSession = Depends(get_db)
):
    """Get all reactions for a post."""
    from app.models.social import Reaction
    from app.models.enums import ReactionEntityType
    
    post = await content_service.get_post_by_id(post_id)
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    
    result = await db.execute(
        select(Reaction).where(
            Reaction.entity_type == ReactionEntityType.POST,
            Reaction.entity_id == post_id
        ).order_by(Reaction.created_at.desc())
    )
    reactions = result.scalars().all()
    
    return [
        ReactionResponse(
            reactionId=r.reaction_id,
            postId=post_id,
            userId=r.user_id,
            type=r.type.value,
            createdAt=r.created_at.isoformat(),
            isRemoved=False,
        ) for r in reactions
    ]



# --- Reports Endpoint for Regular Users ---
class CreateReportRequest(BaseModel):
    """Create report request."""
    contentId: int
    contentType: str
    reason: str
    details: Optional[str] = None


class ReportResponse(BaseModel):
    """Report response."""
    reportId: int
    reporterId: int
    contentType: str
    contentId: int
    reason: str
    status: str
    createdAt: str


@router.post("/report", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
async def create_report(
    data: CreateReportRequest,
    user: UserAccount = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Report content (post, comment, or user)."""
    from app.models.moderation import Report
    from app.models.enums import ReportStatus, ReportContentType
    
    # Map string content type to enum
    try:
        content_type_enum = ReportContentType(data.contentType)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid content type: {data.contentType}")
    
    report = Report(
        reporter_id=user.user_id,
        content_type=content_type_enum,
        content_id=data.contentId,
        reason=data.reason,
        details=data.details,
        status=ReportStatus.PENDING,
    )
    
    db.add(report)
    await db.commit()
    await db.refresh(report)
    
    return ReportResponse(
        reportId=report.report_id,
        reporterId=report.reporter_id,
        contentType=report.content_type.value,
        contentId=report.content_id,
        reason=report.reason,
        status=report.status.value,
        createdAt=report.created_at.isoformat(),
    )
