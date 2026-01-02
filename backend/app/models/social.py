"""
Social content models: Post, Comment, Reaction.
"""
from datetime import datetime
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, Text, Integer, Boolean, DateTime, Enum as SQLEnum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.enums import Visibility, ReactionType, ReactionEntityType

if TYPE_CHECKING:
    from app.models.user import UserAccount
    from app.models.team import TeamProfile


class Post(Base):
    """Community post created by users."""
    __tablename__ = "post"
    
    post_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    author_id: Mapped[int] = mapped_column(ForeignKey("user_account.user_id"), nullable=False, index=True)
    team_id: Mapped[Optional[int]] = mapped_column(ForeignKey("team_profile.team_id"), nullable=True, index=True)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    visibility: Mapped[Visibility] = mapped_column(
        SQLEnum(Visibility), 
        nullable=False, 
        default=Visibility.PUBLIC
    )
    reaction_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    comment_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    is_hidden: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, 
        nullable=False, 
        default=datetime.utcnow, 
        onupdate=datetime.utcnow
    )
    
    # Relationships
    author: Mapped["UserAccount"] = relationship("UserAccount", back_populates="posts")
    team: Mapped[Optional["TeamProfile"]] = relationship("TeamProfile", back_populates="posts")
    comments: Mapped[List["Comment"]] = relationship("Comment", back_populates="post", cascade="all, delete-orphan")
    reactions: Mapped[List["Reaction"]] = relationship(
        "Reaction", 
        primaryjoin="and_(Post.post_id == foreign(Reaction.entity_id), Reaction.entity_type == 'Post')",
        viewonly=True
    )
    
    def __repr__(self) -> str:
        return f"<Post(id={self.post_id}, author={self.author_id})>"


class Comment(Base):
    """Comment on a post with support for nested replies."""
    __tablename__ = "comment"
    
    comment_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    post_id: Mapped[int] = mapped_column(ForeignKey("post.post_id"), nullable=False, index=True)
    author_id: Mapped[int] = mapped_column(ForeignKey("user_account.user_id"), nullable=False, index=True)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    parent_comment_id: Mapped[Optional[int]] = mapped_column(ForeignKey("comment.comment_id"), nullable=True)
    is_hidden: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, 
        nullable=False, 
        default=datetime.utcnow, 
        onupdate=datetime.utcnow
    )
    
    # Relationships
    post: Mapped["Post"] = relationship("Post", back_populates="comments")
    author: Mapped["UserAccount"] = relationship("UserAccount", back_populates="comments")
    parent: Mapped[Optional["Comment"]] = relationship("Comment", remote_side=[comment_id], back_populates="replies")
    replies: Mapped[List["Comment"]] = relationship("Comment", back_populates="parent", cascade="all, delete-orphan")
    
    def __repr__(self) -> str:
        return f"<Comment(id={self.comment_id}, post={self.post_id})>"


class Reaction(Base):
    """User reaction on posts or comments (polymorphic)."""
    __tablename__ = "reaction"
    
    reaction_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    entity_type: Mapped[ReactionEntityType] = mapped_column(SQLEnum(ReactionEntityType), nullable=False)
    entity_id: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user_account.user_id"), nullable=False, index=True)
    type: Mapped[ReactionType] = mapped_column(SQLEnum(ReactionType), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    
    # Relationships
    user: Mapped["UserAccount"] = relationship("UserAccount", back_populates="reactions")
    
    def __repr__(self) -> str:
        return f"<Reaction(entity={self.entity_type.value}:{self.entity_id}, user={self.user_id})>"
