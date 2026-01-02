// @ts-ignore - Keeping api import for future use when switching back to real API
import api from '../axios';
import type {
    TeamProfile,
    FieldProfile,
    Report,
    ModerationLog,
    UserAccount,
    ModerationAction
} from '../../types';
import {
    TeamStatus,
    FieldStatus,
    AccountStatus,
    UserRole,
    ReportStatus,
    ReportContentType,
    ModerationAction as ModerationActionEnum
} from '../../types';

export interface VerifyTeamRequest {
    teamId: number;
    approve: boolean;
    rejectionReason?: string;
}

export interface VerifyFieldRequest {
    fieldId: number;
    approve: boolean;
    rejectionReason?: string;
}

export interface UserModerationRequest {
    userId: number;
    action: ModerationAction;
    reason: string;
}

export interface ResolveReportRequest {
    reportId: number;
    action: 'Keep' | 'Warn' | 'Remove' | 'Suspend' | 'Dismiss';
    notes?: string;
}

export interface UserSearchParams {
    query?: string;
    status?: string;
    role?: string;
    page?: number;
    limit?: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// --- Mock Data ---
const mockPendingTeams: TeamProfile[] = [
    {
        teamId: 10,
        teamName: 'Rising Stars FC',
        description: 'New youth team from District 9',
        leaderId: 10,
        status: TeamStatus.PENDING,
        location: 'District 9, Ho Chi Minh City',
        skillLevel: 4,
        createdAt: '2025-01-05T10:00:00Z',
        updatedAt: '2025-01-05T10:00:00Z',
    },
    {
        teamId: 11,
        teamName: 'Golden Eagles',
        description: 'Experienced players looking for competitive matches',
        leaderId: 11,
        status: TeamStatus.PENDING,
        location: 'Thu Duc City',
        skillLevel: 7,
        createdAt: '2025-01-08T14:00:00Z',
        updatedAt: '2025-01-08T14:00:00Z',
    },
];

const mockPendingFields: FieldProfile[] = [
    {
        fieldId: 10,
        ownerId: 5,
        fieldName: 'Sunset Sports Complex',
        description: 'New facility with 2 full-size pitches',
        location: 'Tan Phu District',
        defaultPricePerHour: 450000,
        capacity: 22,
        status: FieldStatus.PENDING,
        createdAt: '2025-01-03T08:00:00Z',
        updatedAt: '2025-01-03T08:00:00Z',
    },
];

const mockUsers: UserAccount[] = [
    {
        userId: 1,
        username: 'john_doe',
        email: 'john@example.com',
        passwordHash: 'hashed',
        roles: [UserRole.PLAYER, UserRole.TEAM_LEADER],
        status: AccountStatus.ACTIVE,
        isVerified: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-12-01T10:00:00Z',
        location: 'District 1, HCMC',
    },
    {
        userId: 2,
        username: 'jane_smith',
        email: 'jane@example.com',
        passwordHash: 'hashed',
        roles: [UserRole.PLAYER],
        status: AccountStatus.SUSPENDED,
        isVerified: true,
        createdAt: '2024-02-15T00:00:00Z',
        updatedAt: '2025-01-05T16:00:00Z',
        location: 'District 7, HCMC',
    },
    {
        userId: 3,
        username: 'field_owner_1',
        email: 'owner@example.com',
        passwordHash: 'hashed',
        roles: [UserRole.FIELD_OWNER],
        status: AccountStatus.ACTIVE,
        isVerified: true,
        createdAt: '2024-03-01T00:00:00Z',
        updatedAt: '2024-11-20T14:00:00Z',
    },
    {
        userId: 4,
        username: 'banned_user',
        email: 'banned@example.com',
        passwordHash: 'hashed',
        roles: [UserRole.PLAYER],
        status: AccountStatus.BANNED,
        isVerified: true,
        createdAt: '2024-04-10T00:00:00Z',
        updatedAt: '2025-01-02T08:00:00Z',
        location: 'District 3, HCMC',
    },
    {
        userId: 5,
        username: 'active_player',
        email: 'active_player@example.com',
        passwordHash: 'hashed',
        roles: [UserRole.PLAYER, UserRole.TEAM_LEADER],
        status: AccountStatus.ACTIVE,
        isVerified: true,
        createdAt: '2024-05-20T00:00:00Z',
        updatedAt: '2024-12-15T12:00:00Z',
        location: 'Thu Duc City',
    },
    {
        userId: 6,
        username: 'suspended_owner',
        email: 'suspended_owner@example.com',
        passwordHash: 'hashed',
        roles: [UserRole.FIELD_OWNER],
        status: AccountStatus.SUSPENDED,
        isVerified: true,
        createdAt: '2024-06-01T00:00:00Z',
        updatedAt: '2025-01-08T10:00:00Z',
    },
];

const mockReports: Report[] = [
    {
        reportId: 1,
        reporterId: 2,
        reportedUserId: 5,
        contentType: ReportContentType.POST,
        contentId: 15,
        reason: 'Spam',
        details: 'User is posting repetitive promotional content',
        status: ReportStatus.PENDING,
        createdAt: '2025-01-10T09:00:00Z',
    },
    {
        reportId: 2,
        reporterId: 3,
        reportedUserId: 6,
        contentType: ReportContentType.COMMENT,
        contentId: 42,
        reason: 'Harassment',
        details: 'Offensive language directed at other users',
        status: ReportStatus.PENDING,
        createdAt: '2025-01-11T11:00:00Z',
    },
];

const mockModerationLogs: ModerationLog[] = [
    {
        logId: 1,
        moderatorId: 1,
        targetUserId: 5,
        action: ModerationActionEnum.WARNING,
        reason: 'Minor policy violation - first offense',
        createdAt: '2025-01-05T10:00:00Z',
    },
    {
        logId: 2,
        moderatorId: 1,
        targetUserId: 6,
        action: ModerationActionEnum.SUSPEND,
        reason: 'Repeated harassment complaints',
        details: 'Suspended for 7 days',
        createdAt: '2025-01-08T14:30:00Z',
    },
    {
        logId: 3,
        moderatorId: 1,
        targetUserId: 2,
        action: ModerationActionEnum.CONTENT_REMOVAL,
        reason: 'Inappropriate content in post #123',
        createdAt: '2025-01-09T16:00:00Z',
    },
    {
        logId: 4,
        moderatorId: 1,
        targetUserId: 4,
        action: ModerationActionEnum.BAN,
        reason: 'Repeated policy violations and harassment',
        details: 'Permanent ban - multiple offenses',
        createdAt: '2025-01-10T09:00:00Z',
    },
    {
        logId: 5,
        moderatorId: 1,
        targetUserId: 3,
        action: ModerationActionEnum.WARNING,
        reason: 'Field listing contains misleading information',
        createdAt: '2025-01-11T11:00:00Z',
    },
    {
        logId: 6,
        moderatorId: 1,
        targetUserId: 5,
        action: ModerationActionEnum.REACTIVATE,
        reason: 'Completed suspension period, user acknowledged policy',
        createdAt: '2025-01-12T08:00:00Z',
    },
];

export const moderationService = {
    // --- Team Verification ---

    /**
     * Get pending teams for verification
     */
    getPendingTeams: async (): Promise<TeamProfile[]> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<TeamProfile[]>('/mod/teams/pending');
        // return response.data;
        // --- End Real API call ---

        return mockPendingTeams;
    },

    /**
     * Get team for review
     */
    getTeamForReview: async (_teamId: number): Promise<TeamProfile> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<TeamProfile>(`/mod/teams/${teamId}`);
        // return response.data;
        // --- End Real API call ---

        return mockPendingTeams[0];
    },

    /**
     * Verify team (approve/reject)
     */
    verifyTeam: async (data: VerifyTeamRequest): Promise<TeamProfile> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.patch<TeamProfile>(`/mod/teams/${data.teamId}/verify`, {
        //     approved: data.approve,
        //     rejectionReason: data.rejectionReason,
        // });
        // return response.data;
        // --- End Real API call ---

        return {
            ...mockPendingTeams[0],
            teamId: data.teamId,
            status: data.approve ? TeamStatus.VERIFIED : TeamStatus.REJECTED,
            rejectionReason: data.rejectionReason,
            updatedAt: new Date().toISOString(),
        };
    },

    // --- Field Verification ---

    /**
     * Get pending fields for verification
     */
    getPendingFields: async (): Promise<FieldProfile[]> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<FieldProfile[]>('/mod/fields/pending');
        // return response.data;
        // --- End Real API call ---

        return mockPendingFields;
    },

    /**
     * Get field for review
     */
    getFieldForReview: async (_fieldId: number): Promise<FieldProfile> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<FieldProfile>(`/mod/fields/${fieldId}`);
        // return response.data;
        // --- End Real API call ---

        return mockPendingFields[0];
    },

    /**
     * Verify field (approve/reject)
     */
    verifyField: async (data: VerifyFieldRequest): Promise<FieldProfile> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.patch<FieldProfile>(`/mod/fields/${data.fieldId}/verify`, {
        //     approved: data.approve,
        //     rejectionReason: data.rejectionReason,
        // });
        // return response.data;
        // --- End Real API call ---

        return {
            ...mockPendingFields[0],
            fieldId: data.fieldId,
            status: data.approve ? FieldStatus.VERIFIED : FieldStatus.REJECTED,
            rejectionReason: data.rejectionReason,
            updatedAt: new Date().toISOString(),
        };
    },

    // --- User Management ---

    /**
     * Search users
     */
    searchUsers: async (params: UserSearchParams): Promise<PaginatedResponse<UserAccount>> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<PaginatedResponse<UserAccount>>('/mod/users', { params });
        // return response.data;
        // --- End Real API call ---

        const page = params.page || 1;
        const limit = params.limit || 10;

        // Filter by status if provided
        let filteredUsers = [...mockUsers];
        if (params.status) {
            filteredUsers = filteredUsers.filter(u => u.status === params.status);
        }
        // Filter by query if provided (search in username or email)
        if (params.query) {
            const query = params.query.toLowerCase();
            filteredUsers = filteredUsers.filter(u =>
                u.username.toLowerCase().includes(query) ||
                u.email.toLowerCase().includes(query)
            );
        }

        return {
            data: filteredUsers,
            total: filteredUsers.length,
            page,
            limit,
            totalPages: Math.ceil(filteredUsers.length / limit),
        };
    },

    /**
     * Get user details
     */
    getUserDetails: async (_userId: number): Promise<UserAccount> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<UserAccount>(`/mod/users/${userId}`);
        // return response.data;
        // --- End Real API call ---

        return mockUsers[0];
    },

    /**
     * Get user moderation history
     */
    getUserModerationHistory: async (_userId: number): Promise<ModerationLog[]> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<ModerationLog[]>(`/mod/users/${userId}/history`);
        // return response.data;
        // --- End Real API call ---

        return mockModerationLogs;
    },

    /**
     * Suspend user
     */
    suspendUser: async (userId: number, _reason: string): Promise<UserAccount> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.patch<UserAccount>(`/mod/users/${userId}/suspend`, { reason });
        // return response.data;
        // --- End Real API call ---

        return {
            ...mockUsers[0],
            userId,
            status: AccountStatus.SUSPENDED,
            updatedAt: new Date().toISOString(),
        };
    },

    /**
     * Ban user
     */
    banUser: async (userId: number, _reason: string): Promise<UserAccount> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.patch<UserAccount>(`/mod/users/${userId}/ban`, { reason });
        // return response.data;
        // --- End Real API call ---

        return {
            ...mockUsers[0],
            userId,
            status: AccountStatus.BANNED,
            updatedAt: new Date().toISOString(),
        };
    },

    /**
     * Reactivate user
     */
    reactivateUser: async (userId: number, _reason: string): Promise<UserAccount> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.patch<UserAccount>(`/mod/users/${userId}/reactivate`, { reason });
        // return response.data;
        // --- End Real API call ---

        return {
            ...mockUsers[0],
            userId,
            status: AccountStatus.ACTIVE,
            updatedAt: new Date().toISOString(),
        };
    },

    // --- Content Moderation ---

    /**
     * Get pending reports
     */
    getPendingReports: async (): Promise<Report[]> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<Report[]>('/mod/reports?status=Pending');
        // return response.data;
        // --- End Real API call ---

        return mockReports.filter(r => r.status === ReportStatus.PENDING);
    },

    /**
     * Get report details
     */
    getReportDetails: async (_reportId: number): Promise<Report> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<Report>(`/mod/reports/${reportId}`);
        // return response.data;
        // --- End Real API call ---

        return mockReports[0];
    },

    /**
     * Resolve a report
     */
    resolveReport: async (data: ResolveReportRequest): Promise<Report> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.patch<Report>(`/mod/reports/${data.reportId}/resolve`, {
        //     action: data.action,
        //     notes: data.notes,
        // });
        // return response.data;
        // --- End Real API call ---

        return {
            ...mockReports[0],
            reportId: data.reportId,
            status: ReportStatus.RESOLVED,
            details: data.notes || mockReports[0].details,
            resolvedAt: new Date().toISOString(),
        };
    },

    /**
     * Dismiss a report
     */
    dismissReport: async (reportId: number): Promise<Report> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.patch<Report>(`/mod/reports/${reportId}/dismiss`);
        // return response.data;
        // --- End Real API call ---

        return {
            ...mockReports[0],
            reportId,
            status: ReportStatus.DISMISSED,
            resolvedAt: new Date().toISOString(),
        };
    },

    // --- History ---

    /**
     * Get moderation history
     */
    getModerationHistory: async (params?: {
        moderatorId?: number;
        action?: ModerationAction;
        fromDate?: string;
        toDate?: string;
        page?: number;
        limit?: number;
    }): Promise<PaginatedResponse<ModerationLog>> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<PaginatedResponse<ModerationLog>>('/mod/history', { params });
        // return response.data;
        // --- End Real API call ---

        const page = params?.page || 1;
        const limit = params?.limit || 10;

        // Filter by action if provided
        let filteredLogs = [...mockModerationLogs];
        if (params?.action) {
            filteredLogs = filteredLogs.filter(log => log.action === params.action);
        }
        // Filter by moderator if provided
        if (params?.moderatorId) {
            filteredLogs = filteredLogs.filter(log => log.moderatorId === params.moderatorId);
        }

        return {
            data: filteredLogs,
            total: filteredLogs.length,
            page,
            limit,
            totalPages: Math.ceil(filteredLogs.length / limit),
        };
    },
};

export default moderationService;
