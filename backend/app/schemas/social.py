"""
Social content schemas matching frontend types.
"""
from typing import Optional, List
from pydantic import BaseModel


# --- Post ---
class PostCreate(BaseModel):
    """Post creation matching frontend CreatePostRequest."""
    content: str
    teamId: Optional[int] = None
    visibility: str = "Public"
    imageUrl: Optional[str] = None


class PostResponse(BaseModel):
    """Post response matching frontend Post type."""
    postId: int
    authorId: int
    teamId: Optional[int] = None
    imageUrl: Optional[str] = None
    content: str
    visibility: str
    reactionCount: int
    commentCount: int
    isHidden: bool
    createdAt: str
    updatedAt: str
    
    class Config:
        from_attributes = True


# --- Comment ---
class CommentCreate(BaseModel):
    """Comment creation matching frontend AddCommentRequest."""
    content: str
    parentCommentId: Optional[int] = None


class CommentResponse(BaseModel):
    """Comment response matching frontend Comment type."""
    commentId: int
    postId: int
    authorId: int
    content: str
    parentCommentId: Optional[int] = None
    isHidden: bool
    createdAt: str
    updatedAt: str
    
    class Config:
        from_attributes = True


# --- Reaction ---
class ReactionToggleRequest(BaseModel):
    """Reaction toggle request."""
    type: str = "Like"
