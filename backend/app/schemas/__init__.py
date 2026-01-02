"""
Pydantic schemas package.
"""
from app.schemas.common import PaginatedResponse, MessageResponse, ErrorResponse
from app.schemas.auth import LoginRequest, RegisterRequest, AuthResponse, ChangePasswordRequest
from app.schemas.user import UserAccountResponse, UserAccountCreate, UserAccountUpdate
from app.schemas.player import PlayerProfileResponse, PlayerProfileCreate, PlayerProfileUpdate
from app.schemas.team import (
    TeamProfileResponse, TeamProfileCreate, TeamProfileUpdate,
    TeamRosterResponse, JoinRequestResponse, JoinRequestCreate,
    TeamWalletResponse, TransactionLogResponse, TransactionLogCreate
)
from app.schemas.field import (
    FieldProfileResponse, FieldProfileCreate, FieldProfileUpdate,
    FieldCalendarResponse, FieldPricingRuleResponse, FieldPricingRuleCreate,
    CancellationPolicyResponse, AmenityResponse
)
from app.schemas.booking import BookingRequestResponse, BookingRequestCreate
from app.schemas.match import (
    MatchEventResponse, MatchEventCreate, MatchEventUpdate,
    MatchInvitationResponse, AttendanceRecordResponse, MatchResultResponse
)
from app.schemas.social import PostResponse, PostCreate, CommentResponse, CommentCreate
from app.schemas.notification import NotificationResponse, NotificationPreferenceResponse

__all__ = [
    # Common
    "PaginatedResponse", "MessageResponse", "ErrorResponse",
    # Auth
    "LoginRequest", "RegisterRequest", "AuthResponse", "ChangePasswordRequest",
    # User
    "UserAccountResponse", "UserAccountCreate", "UserAccountUpdate",
    # Player
    "PlayerProfileResponse", "PlayerProfileCreate", "PlayerProfileUpdate",
    # Team
    "TeamProfileResponse", "TeamProfileCreate", "TeamProfileUpdate",
    "TeamRosterResponse", "JoinRequestResponse", "JoinRequestCreate",
    "TeamWalletResponse", "TransactionLogResponse", "TransactionLogCreate",
    # Field
    "FieldProfileResponse", "FieldProfileCreate", "FieldProfileUpdate",
    "FieldCalendarResponse", "FieldPricingRuleResponse", "FieldPricingRuleCreate",
    "CancellationPolicyResponse", "AmenityResponse",
    # Booking
    "BookingRequestResponse", "BookingRequestCreate",
    # Match
    "MatchEventResponse", "MatchEventCreate", "MatchEventUpdate",
    "MatchInvitationResponse", "AttendanceRecordResponse", "MatchResultResponse",
    # Social
    "PostResponse", "PostCreate", "CommentResponse", "CommentCreate",
    # Notification
    "NotificationResponse", "NotificationPreferenceResponse",
]
