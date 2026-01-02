"""
SQLAlchemy models package.
All models are imported here for easy access and to ensure they are registered with Base.
"""
from app.database import Base

# Import all models to register them with SQLAlchemy
from app.models.user import UserAccount, Session
from app.models.player import PlayerProfile
from app.models.team import TeamProfile, TeamRoster, JoinRequest, TeamWallet, TransactionLog
from app.models.field import FieldProfile, FieldCalendar, FieldPricingRule, CancellationPolicy, Amenity, FieldAmenity
from app.models.booking import BookingRequest
from app.models.match import MatchEvent, MatchInvitation, AttendanceRecord, MatchResult
from app.models.social import Post, Comment, Reaction
from app.models.moderation import Report, ModerationLog
from app.models.notification import Notification, NotificationPreference
from app.models.media import MediaAsset

__all__ = [
    "Base",
    # User
    "UserAccount", "Session",
    # Player
    "PlayerProfile",
    # Team
    "TeamProfile", "TeamRoster", "JoinRequest", "TeamWallet", "TransactionLog",
    # Field
    "FieldProfile", "FieldCalendar", "FieldPricingRule", "CancellationPolicy", "Amenity", "FieldAmenity",
    # Booking
    "BookingRequest",
    # Match
    "MatchEvent", "MatchInvitation", "AttendanceRecord", "MatchResult",
    # Social
    "Post", "Comment", "Reaction",
    # Moderation
    "Report", "ModerationLog",
    # Notification
    "Notification", "NotificationPreference",
    # Media
    "MediaAsset",
]
