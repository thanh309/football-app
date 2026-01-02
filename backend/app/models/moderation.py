"""
Moderation models: Report, ModerationLog.
"""
from datetime import datetime
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Text, Integer, DateTime, Enum as SQLEnum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.enums import ReportContentType, ReportStatus, ModerationAction

if TYPE_CHECKING:
    from app.models.user import UserAccount


class Report(Base):
    """Misconduct report submitted by users."""
    __tablename__ = "report"
    
    report_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    reporter_id: Mapped[int] = mapped_column(ForeignKey("user_account.user_id"), nullable=False, index=True)
    reported_user_id: Mapped[Optional[int]] = mapped_column(ForeignKey("user_account.user_id"), nullable=True, index=True)
    content_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    content_type: Mapped[ReportContentType] = mapped_column(SQLEnum(ReportContentType), nullable=False)
    reason: Mapped[str] = mapped_column(String(255), nullable=False)
    details: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[ReportStatus] = mapped_column(
        SQLEnum(ReportStatus), 
        nullable=False, 
        default=ReportStatus.PENDING
    )
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    resolved_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    
    def __repr__(self) -> str:
        return f"<Report(id={self.report_id}, type={self.content_type.value})>"


class ModerationLog(Base):
    """Audit trail for moderation actions."""
    __tablename__ = "moderation_log"
    
    log_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    moderator_id: Mapped[int] = mapped_column(ForeignKey("user_account.user_id"), nullable=False, index=True)
    target_user_id: Mapped[int] = mapped_column(ForeignKey("user_account.user_id"), nullable=False, index=True)
    action: Mapped[ModerationAction] = mapped_column(SQLEnum(ModerationAction), nullable=False)
    reason: Mapped[str] = mapped_column(Text, nullable=False)
    details: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    
    def __repr__(self) -> str:
        return f"<ModerationLog(id={self.log_id}, action={self.action.value})>"
