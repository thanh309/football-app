export const UserRole = {
    PLAYER: 'Player',
    TEAM_LEADER: 'TeamLeader',
    FIELD_OWNER: 'FieldOwner',
    MODERATOR: 'Moderator'
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export const AccountStatus = {
    ACTIVE: 'Active',
    SUSPENDED: 'Suspended',
    BANNED: 'Banned',
    PENDING: 'Pending',
    DELETED: 'Deleted'
} as const;

export type AccountStatus = typeof AccountStatus[keyof typeof AccountStatus];

export const TeamStatus = {
    PENDING: 'Pending',
    VERIFIED: 'Verified',
    REJECTED: 'Rejected',
    PENDING_REVISION: 'PendingRevision'
} as const;

export type TeamStatus = typeof TeamStatus[keyof typeof TeamStatus];

export const RosterRole = {
    MEMBER: 'Member',
    CAPTAIN: 'Captain',
    VICE_CAPTAIN: 'ViceCaptain'
} as const;

export type RosterRole = typeof RosterRole[keyof typeof RosterRole];

export const JoinRequestStatus = {
    PENDING: 'Pending',
    ACCEPTED: 'Accepted',
    REJECTED: 'Rejected'
} as const;

export type JoinRequestStatus = typeof JoinRequestStatus[keyof typeof JoinRequestStatus];

export const FieldStatus = {
    PENDING: 'Pending',
    VERIFIED: 'Verified',
    REJECTED: 'Rejected',
    PENDING_REVISION: 'PendingRevision'
} as const;

export type FieldStatus = typeof FieldStatus[keyof typeof FieldStatus];

export const CalendarStatus = {
    AVAILABLE: 'Available',
    BOOKED: 'Booked',
    MAINTENANCE: 'Maintenance',
    BLOCKED: 'Blocked'
} as const;

export type CalendarStatus = typeof CalendarStatus[keyof typeof CalendarStatus];

export const BookingStatus = {
    PENDING: 'Pending',
    CONFIRMED: 'Confirmed',
    REJECTED: 'Rejected',
    CANCELLED: 'Cancelled'
} as const;

export type BookingStatus = typeof BookingStatus[keyof typeof BookingStatus];

export const MatchStatus = {
    PENDING_APPROVAL: 'PendingApproval',
    SCHEDULED: 'Scheduled',
    IN_PROGRESS: 'InProgress',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
    LOOKING_FOR_FIELD: 'LookingForField'
} as const;

export type MatchStatus = typeof MatchStatus[keyof typeof MatchStatus];

export const Visibility = {
    PUBLIC: 'Public',
    PRIVATE: 'Private',
    TEAM_ONLY: 'TeamOnly'
} as const;

export type Visibility = typeof Visibility[keyof typeof Visibility];

export const InvitationStatus = {
    PENDING: 'Pending',
    ACCEPTED: 'Accepted',
    DECLINED: 'Declined',
    EXPIRED: 'Expired'
} as const;

export type InvitationStatus = typeof InvitationStatus[keyof typeof InvitationStatus];

export const AttendanceStatus = {
    PENDING: 'Pending',
    PRESENT: 'Present',
    ABSENT: 'Absent',
    EXCUSED: 'Excused'
} as const;

export type AttendanceStatus = typeof AttendanceStatus[keyof typeof AttendanceStatus];

export const TransactionType = {
    INCOME: 'Income',
    EXPENSE: 'Expense'
} as const;

export type TransactionType = typeof TransactionType[keyof typeof TransactionType];

export const ReactionType = {
    LIKE: 'Like',
    LOVE: 'Love',
    CELEBRATE: 'Celebrate'
} as const;

export type ReactionType = typeof ReactionType[keyof typeof ReactionType];

export const ReactionEntityType = {
    POST: 'Post',
    COMMENT: 'Comment'
} as const;

export type ReactionEntityType = typeof ReactionEntityType[keyof typeof ReactionEntityType];

export const ReportContentType = {
    POST: 'Post',
    COMMENT: 'Comment',
    USER: 'User'
} as const;

export type ReportContentType = typeof ReportContentType[keyof typeof ReportContentType];

export const ReportStatus = {
    PENDING: 'Pending',
    RESOLVED: 'Resolved',
    DISMISSED: 'Dismissed'
} as const;

export type ReportStatus = typeof ReportStatus[keyof typeof ReportStatus];

export const NotificationType = {
    TEAM_VERIFIED: 'TeamVerified',
    JOIN_REQUEST: 'JoinRequest',
    MATCH_INVITE: 'MatchInvite',
    BOOKING_UPDATE: 'BookingUpdate',
    ACCOUNT_STATUS_UPDATE: 'AccountStatusUpdate',
    TEAM_DELETED: 'TeamDeleted',
    MATCH_CANCELLED: 'MatchCancelled',
    FIELD_REJECTED: 'FieldRejected',
    MATCH_UPDATES: 'MatchUpdates',
    TEAM_NEWS: 'TeamNews',
    BOOKING_ALERTS: 'BookingAlerts',
    SYSTEM_MESSAGES: 'SystemMessages',
    PROMOTIONS: 'Promotions',
    COMMENTS: 'Comments',
    REACTIONS: 'Reactions'
} as const;

export type NotificationType = typeof NotificationType[keyof typeof NotificationType];

export const PreferredFoot = {
    LEFT: 'Left',
    RIGHT: 'Right',
    BOTH: 'Both'
} as const;

export type PreferredFoot = typeof PreferredFoot[keyof typeof PreferredFoot];

export const MediaType = {
    IMAGE: 'Image',
    VIDEO: 'Video'
} as const;

export type MediaType = typeof MediaType[keyof typeof MediaType];

export const MediaOwnerType = {
    TEAM: 'Team',
    FIELD: 'Field',
    POST: 'Post',
    PLAYER: 'Player'
} as const;

export type MediaOwnerType = typeof MediaOwnerType[keyof typeof MediaOwnerType];

export const ModerationAction = {
    SUSPEND: 'Suspend',
    BAN: 'Ban',
    REACTIVATE: 'Reactivate',
    CONTENT_REMOVAL: 'ContentRemoval',
    WARNING: 'Warning'
} as const;

export type ModerationAction = typeof ModerationAction[keyof typeof ModerationAction];

export const DayOfWeek = {
    MONDAY: 'Monday',
    TUESDAY: 'Tuesday',
    WEDNESDAY: 'Wednesday',
    THURSDAY: 'Thursday',
    FRIDAY: 'Friday',
    SATURDAY: 'Saturday',
    SUNDAY: 'Sunday'
} as const;

export type DayOfWeek = typeof DayOfWeek[keyof typeof DayOfWeek];

// --- Interfaces ---

export interface UserAccount {
    userId: number; // Primary Key
    username: string; // Unique
    email: string; // Unique
    passwordHash: string;
    roles: UserRole[];
    status: AccountStatus;
    isVerified: boolean;
    createdAt: string; // ISO DateTime
    updatedAt: string; // ISO DateTime
    contactInfo?: string;
    location?: string;
    latitude?: number;
    longitude?: number;
}

export interface Session {
    sessionId: string; // Primary Key
    userId: number; // Foreign Key -> UserAccount
    createdAt: string;
    expiresAt: string;
    ipAddress?: string;
    userAgent?: string;
}

export interface PlayerProfile {
    playerId: number; // Primary Key
    userId: number; // Foreign Key -> UserAccount, Unique
    displayName: string;
    position?: string;
    skillLevel?: number; // 1-10
    bio?: string;
    profileImage?: string; // URL
    dateOfBirth?: string; // Date (ISO string)
    height?: number; // cm
    weight?: number; // kg
    preferredFoot?: PreferredFoot;
    createdAt: string;
    updatedAt: string;
}

export interface TeamProfile {
    teamId: number; // Primary Key
    teamName: string; // Unique
    description?: string;
    logoUrl?: string; // URL
    leaderId: number; // Foreign Key -> UserAccount
    status: TeamStatus;
    rejectionReason?: string;
    location?: string;
    latitude?: number;
    longitude?: number;
    skillLevel?: number;
    createdAt: string;
    updatedAt: string;
}

export interface TeamRoster {
    rosterId: number; // Primary Key
    teamId: number; // Foreign Key -> TeamProfile
    playerId: number; // Foreign Key -> PlayerProfile
    role: RosterRole;
    joinedAt: string;
    isActive: boolean;
}

export interface JoinRequest {
    requestId: number; // Primary Key
    teamId: number; // Foreign Key -> TeamProfile
    playerId: number; // Foreign Key -> PlayerProfile
    status: JoinRequestStatus;
    message?: string;
    createdAt: string;
    processedAt?: string;
}

export interface FieldProfile {
    fieldId: number; // Primary Key
    ownerId: number; // Foreign Key -> UserAccount
    fieldName: string;
    description?: string;
    location: string;
    latitude?: number;
    longitude?: number;
    defaultPricePerHour: number; // Decimal
    capacity?: number;
    status: FieldStatus;
    rejectionReason?: string;
    createdAt: string;
    updatedAt: string;
}

export interface FieldPricingRule {
    pricingRuleId: number; // Primary Key
    fieldId: number; // Foreign Key -> FieldProfile
    name: string;
    dayOfWeek?: DayOfWeek[];
    startTime: string; // Time string HH:mm:ss
    endTime: string; // Time string HH:mm:ss
    pricePerHour: number; // Decimal
    priority: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CancellationPolicy {
    policyId: number; // Primary Key
    fieldId: number; // Foreign Key -> FieldProfile, Unique
    freeCancellationHours: number;
    lateCancellationPenaltyPercent: number; // Decimal
    noShowPenaltyPercent: number; // Decimal
    refundProcessingDays: number;
    policyDescription?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface FieldCalendar {
    calendarId: number; // Primary Key
    fieldId: number; // Foreign Key -> FieldProfile
    date: string; // Date string YYYY-MM-DD
    startTime: string; // Time string HH:mm:ss
    endTime: string; // Time string HH:mm:ss
    status: CalendarStatus;
    bookingId?: number; // Foreign Key -> BookingRequest
}

export interface BookingRequest {
    bookingId: number; // Primary Key
    fieldId: number; // Foreign Key -> FieldProfile
    teamId: number; // Foreign Key -> TeamProfile
    requesterId: number; // Foreign Key -> UserAccount
    date: string; // Date string YYYY-MM-DD
    startTime: string; // Time string HH:mm:ss
    endTime: string; // Time string HH:mm:ss
    status: BookingStatus;
    notes?: string;
    createdAt: string;
    processedAt?: string;
}

export interface MatchEvent {
    matchId: number; // Primary Key
    hostTeamId: number; // Foreign Key -> TeamProfile
    opponentTeamId?: number; // Foreign Key -> TeamProfile
    fieldId?: number; // Foreign Key -> FieldProfile
    bookingId?: number; // Foreign Key -> BookingRequest
    matchDate: string; // Date string YYYY-MM-DD
    startTime: string; // Time string HH:mm:ss
    endTime?: string; // Time string HH:mm:ss
    status: MatchStatus;
    visibility: Visibility;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

export interface MatchInvitation {
    invitationId: number; // Primary Key
    matchId: number; // Foreign Key -> MatchEvent
    invitingTeamId: number; // Foreign Key -> TeamProfile
    invitedTeamId: number; // Foreign Key -> TeamProfile
    status: InvitationStatus;
    message?: string;
    createdAt: string;
    respondedAt?: string;
}

export interface AttendanceRecord {
    attendanceId: number; // Primary Key
    matchId: number; // Foreign Key -> MatchEvent
    playerId: number; // Foreign Key -> PlayerProfile
    teamId: number; // Foreign Key -> TeamProfile
    status: AttendanceStatus;
    confirmedAt?: string;
    confirmedBy?: number; // Foreign Key -> UserAccount
}

export interface TeamWallet {
    walletId: number; // Primary Key
    teamId: number; // Foreign Key -> TeamProfile, Unique
    balance: number; // Decimal
    createdAt: string;
    updatedAt: string;
}

export interface TransactionLog {
    transactionId: number; // Primary Key
    walletId: number; // Foreign Key -> TeamWallet
    type: TransactionType;
    amount: number; // Decimal
    description?: string;
    category?: string;
    createdBy: number; // Foreign Key -> UserAccount
    createdAt: string;
}

export interface Post {
    postId: number; // Primary Key
    authorId: number; // Foreign Key -> UserAccount
    teamId?: number; // Foreign Key -> TeamProfile
    content: string;
    visibility: Visibility;
    reactionCount: number;
    commentCount: number;
    isHidden: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Comment {
    commentId: number; // Primary Key
    postId: number; // Foreign Key -> Post
    authorId: number; // Foreign Key -> UserAccount
    content: string;
    parentCommentId?: number; // Foreign Key -> Comment
    isHidden: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Reaction {
    reactionId: number; // Primary Key
    entityType: ReactionEntityType;
    entityId: number;
    userId: number; // Foreign Key -> UserAccount
    type: ReactionType;
    createdAt: string;
}

export interface Report {
    reportId: number; // Primary Key
    reporterId: number; // Foreign Key -> UserAccount
    reportedUserId?: number; // Foreign Key -> UserAccount
    contentId?: number;
    contentType: ReportContentType;
    reason: string;
    details?: string;
    status: ReportStatus;
    createdAt: string;
    resolvedAt?: string;
}

export interface Notification {
    notificationId: number; // Primary Key
    userId: number; // Foreign Key -> UserAccount
    type: NotificationType;
    title: string;
    message: string;
    relatedEntityId?: number;
    relatedEntityType?: string;
    isRead: boolean;
    createdAt: string;
}

export interface NotificationPreference {
    preferenceId: number; // Primary Key
    userId: number; // Foreign Key -> UserAccount
    notificationType: NotificationType;
    isEnabled: boolean;
    pushEnabled: boolean;
    emailEnabled: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface MatchResult {
    resultId: number; // Primary Key
    matchId: number; // Foreign Key -> MatchEvent, Unique
    homeScore: number;
    awayScore: number;
    winnerId?: number; // Foreign Key -> TeamProfile
    notes?: string;
    recordedBy: number; // Foreign Key -> UserAccount
    createdAt: string;
}

export interface Amenity {
    amenityId: number; // Primary Key
    name: string; // Unique
    description?: string;
    icon?: string;
    isActive: boolean;
}

export interface FieldAmenity {
    fieldAmenityId: number; // Primary Key
    fieldId: number; // Foreign Key -> FieldProfile
    amenityId: number; // Foreign Key -> Amenity
    quantity?: number;
    notes?: string;
}

export interface MediaAsset {
    assetId: number; // Primary Key
    ownerId: number; // Foreign Key -> UserAccount
    ownerType: MediaOwnerType;
    entityId: number;
    fileName: string;
    storagePath: string;
    fileType: MediaType;
    fileSize: number;
    mimeType: string;
    createdAt: string;
}

export interface ModerationLog {
    logId: number; // Primary Key
    moderatorId: number; // Foreign Key -> UserAccount
    targetUserId: number; // Foreign Key -> UserAccount
    action: ModerationAction;
    reason: string;
    details?: string;
    createdAt: string;
}
