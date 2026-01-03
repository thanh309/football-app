"""
Enum definitions matching frontend TypeScript types.
"""
import enum


class UserRole(str, enum.Enum):
    """User role enum."""
    PLAYER = "Player"
    TEAM_LEADER = "TeamLeader"
    FIELD_OWNER = "FieldOwner"
    MODERATOR = "Moderator"


class AccountStatus(str, enum.Enum):
    """Account status enum."""
    ACTIVE = "Active"
    SUSPENDED = "Suspended"
    BANNED = "Banned"
    PENDING = "Pending"
    DELETED = "Deleted"


class TeamStatus(str, enum.Enum):
    """Team verification status."""
    PENDING = "Pending"
    VERIFIED = "Verified"
    REJECTED = "Rejected"
    PENDING_REVISION = "PendingRevision"


class RosterRole(str, enum.Enum):
    """Player role within a team."""
    MEMBER = "Member"
    CAPTAIN = "Captain"
    VICE_CAPTAIN = "ViceCaptain"


class JoinRequestStatus(str, enum.Enum):
    """Join request status."""
    PENDING = "Pending"
    ACCEPTED = "Accepted"
    REJECTED = "Rejected"


class FieldStatus(str, enum.Enum):
    """Field verification status."""
    PENDING = "Pending"
    VERIFIED = "Verified"
    REJECTED = "Rejected"
    PENDING_REVISION = "PendingRevision"


class CalendarStatus(str, enum.Enum):
    """Field calendar slot status."""
    AVAILABLE = "Available"
    BOOKED = "Booked"
    MAINTENANCE = "Maintenance"
    BLOCKED = "Blocked"


class BookingStatus(str, enum.Enum):
    """Booking request status."""
    PENDING = "Pending"
    CONFIRMED = "Confirmed"
    REJECTED = "Rejected"
    CANCELLED = "Cancelled"


class MatchStatus(str, enum.Enum):
    """Match event status."""
    PENDING_APPROVAL = "PendingApproval"
    SCHEDULED = "Scheduled"
    IN_PROGRESS = "InProgress"
    COMPLETED = "Completed"
    CANCELLED = "Cancelled"
    LOOKING_FOR_FIELD = "LookingForField"


class Visibility(str, enum.Enum):
    """Content visibility."""
    PUBLIC = "Public"
    PRIVATE = "Private"
    TEAM_ONLY = "TeamOnly"


class InvitationStatus(str, enum.Enum):
    """Match invitation status."""
    PENDING = "Pending"
    ACCEPTED = "Accepted"
    DECLINED = "Declined"
    EXPIRED = "Expired"


class AttendanceStatus(str, enum.Enum):
    """Attendance record status."""
    PENDING = "Pending"
    PRESENT = "Present"
    ABSENT = "Absent"
    EXCUSED = "Excused"


class TransactionType(str, enum.Enum):
    """Transaction type."""
    INCOME = "Income"
    EXPENSE = "Expense"


class ReactionType(str, enum.Enum):
    """Reaction type."""
    LIKE = "Like"
    LOVE = "Love"
    CELEBRATE = "Celebrate"


class ReactionEntityType(str, enum.Enum):
    """Entity type for reactions."""
    POST = "Post"
    COMMENT = "Comment"


class ReportContentType(str, enum.Enum):
    """Report content type."""
    POST = "Post"
    COMMENT = "Comment"
    USER = "User"


class ReportStatus(str, enum.Enum):
    """Report status."""
    PENDING = "Pending"
    RESOLVED = "Resolved"
    DISMISSED = "Dismissed"


class NotificationType(str, enum.Enum):
    """Notification type."""
    TEAM_VERIFIED = "TeamVerified"
    JOIN_REQUEST = "JoinRequest"
    MATCH_INVITE = "MatchInvite"
    BOOKING_UPDATE = "BookingUpdate"
    ACCOUNT_STATUS_UPDATE = "AccountStatusUpdate"
    TEAM_DELETED = "TeamDeleted"
    MATCH_CANCELLED = "MatchCancelled"
    FIELD_REJECTED = "FieldRejected"
    MATCH_UPDATES = "MatchUpdates"
    TEAM_NEWS = "TeamNews"
    BOOKING_ALERTS = "BookingAlerts"
    SYSTEM_MESSAGES = "SystemMessages"
    PROMOTIONS = "Promotions"
    COMMENTS = "Comments"
    REACTIONS = "Reactions"


class PreferredFoot(str, enum.Enum):
    """Preferred foot."""
    LEFT = "Left"
    RIGHT = "Right"
    BOTH = "Both"


class MediaType(str, enum.Enum):
    """Media file type."""
    IMAGE = "Image"
    VIDEO = "Video"
    DOCUMENT = "Document"


class MediaOwnerType(str, enum.Enum):
    """Media owner entity type."""
    TEAM = "Team"
    FIELD = "Field"
    POST = "Post"
    PLAYER = "Player"


class ModerationAction(str, enum.Enum):
    """Moderation action type."""
    SUSPEND = "Suspend"
    BAN = "Ban"
    REACTIVATE = "Reactivate"
    CONTENT_REMOVAL = "ContentRemoval"
    WARNING = "Warning"
    ROLE_CHANGE = "RoleChange"
    ACTIVATE = "Activate"


class DayOfWeek(str, enum.Enum):
    """Day of week."""
    MONDAY = "Monday"
    TUESDAY = "Tuesday"
    WEDNESDAY = "Wednesday"
    THURSDAY = "Thursday"
    FRIDAY = "Friday"
    SATURDAY = "Saturday"
    SUNDAY = "Sunday"
