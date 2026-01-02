"""
Media asset model for uploaded files.
"""
from datetime import datetime
from typing import TYPE_CHECKING
from sqlalchemy import String, Integer, DateTime, Enum as SQLEnum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.enums import MediaType, MediaOwnerType

if TYPE_CHECKING:
    from app.models.user import UserAccount


class MediaAsset(Base):
    """Uploaded media file (images, videos)."""
    __tablename__ = "media_asset"
    
    asset_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("user_account.user_id"), nullable=False, index=True)
    owner_type: Mapped[MediaOwnerType] = mapped_column(SQLEnum(MediaOwnerType), nullable=False)
    entity_id: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    file_name: Mapped[str] = mapped_column(String(255), nullable=False)
    storage_path: Mapped[str] = mapped_column(String(500), nullable=False)
    file_type: Mapped[MediaType] = mapped_column(SQLEnum(MediaType), nullable=False)
    file_size: Mapped[int] = mapped_column(Integer, nullable=False)
    mime_type: Mapped[str] = mapped_column(String(100), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    
    def __repr__(self) -> str:
        return f"<MediaAsset(id={self.asset_id}, type={self.owner_type.value}:{self.entity_id})>"
