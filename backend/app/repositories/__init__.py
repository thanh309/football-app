"""
Repositories package - Data Access Layer (DAO pattern).
"""
from app.repositories.base_repository import BaseRepository
from app.repositories.user_repository import UserRepository, SessionRepository
from app.repositories.player_repository import PlayerRepository
from app.repositories.team_repository import TeamRepository, RosterRepository, JoinRequestRepository
from app.repositories.field_repository import FieldRepository, CalendarRepository
from app.repositories.booking_repository import BookingRepository
from app.repositories.match_repository import MatchRepository, InvitationRepository, AttendanceRepository
from app.repositories.content_repository import PostRepository, CommentRepository, ReactionRepository
from app.repositories.notification_repository import NotificationRepository

__all__ = [
    "BaseRepository",
    "UserRepository", "SessionRepository",
    "PlayerRepository",
    "TeamRepository", "RosterRepository", "JoinRequestRepository",
    "FieldRepository", "CalendarRepository",
    "BookingRepository",
    "MatchRepository", "InvitationRepository", "AttendanceRepository",
    "PostRepository", "CommentRepository", "ReactionRepository",
    "NotificationRepository",
]
