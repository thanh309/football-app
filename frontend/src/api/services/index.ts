// Re-export default services only, types are exported individually to avoid conflicts
export { default as authService } from './authService';
export { default as teamService } from './teamService';
export { default as playerService } from './playerService';
export { default as matchService } from './matchService';
export { default as fieldService } from './fieldService';
export { default as bookingService } from './bookingService';
export { default as attendanceService } from './attendanceService';
export { default as financeService } from './financeService';
export { default as communityService } from './communityService';
export { default as moderationService } from './moderationService';
export { default as notificationService } from './notificationService';
export { default as searchService } from './searchService';
export { default as mediaService } from './mediaService';
export { default as rosterService } from './rosterService';

// Common types - avoid re-exporting conflicting types
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// Re-export specific types from services (non-conflicting)
export type { LoginRequest, RegisterRequest, AuthResponse, ChangePasswordRequest } from './authService';
export type { CreateTeamRequest, UpdateTeamRequest, TeamSearchParams } from './teamService';
export type { UpdatePlayerProfileRequest, PlayerSearchParams } from './playerService';
export type { CreateMatchRequest, UpdateMatchRequest, MatchSearchParams, SendInvitationRequest } from './matchService';
export type { CreateFieldRequest, UpdateFieldRequest, FieldSearchParams, AvailableSlotsParams } from './fieldService';
export type { CreateBookingRequest, CalendarQueryParams, BlockSlotRequest } from './bookingService';
export type { AttendanceUpdateRequest, BatchAttendanceRequest, AttendanceStats } from './attendanceService';
export type { AddTransactionRequest, TransactionFilters, FinanceSummary } from './financeService';
export type { CreatePostRequest, AddCommentRequest, FeedParams } from './communityService';
export type {
    VerifyTeamRequest,
    VerifyFieldRequest,
    UserModerationRequest,
    ResolveReportRequest,
    UserSearchParams
} from './moderationService';
export type { UpdatePreferencesRequest } from './notificationService';
export type {
    SearchParams,
    TeamSearchParams as SearchTeamParams,
    FieldSearchParams as SearchFieldParams,
    PlayerSearchParams as SearchPlayerParams,
    OwnerSearchParams
} from './searchService';
export type { UploadMediaRequest } from './mediaService';
export type { AddPlayerRequest, UpdateRoleRequest } from './rosterService';
