import api from '../axios';
import type {
    TeamProfile,
    FieldProfile,
    Report,
    ModerationLog,
    UserAccount,
    ModerationAction
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

// Moderation service - Real API calls
export const moderationService = {
    // --- Team Verification ---

    /**
     * Get pending teams for verification
     */
    getPendingTeams: async (): Promise<TeamProfile[]> => {
        const response = await api.get<TeamProfile[]>('/mod/teams/pending');
        return response.data;
    },

    /**
     * Get team for review
     */
    getTeamForReview: async (teamId: number): Promise<TeamProfile> => {
        const response = await api.get<TeamProfile>(`/mod/teams/${teamId}`);
        return response.data;
    },

    /**
     * Verify team (approve/reject)
     */
    verifyTeam: async (data: VerifyTeamRequest): Promise<TeamProfile> => {
        const response = await api.put<TeamProfile>(`/mod/teams/${data.teamId}/verify`, {
            approved: data.approve,
            rejectionReason: data.rejectionReason,
        });
        return response.data;
    },

    // --- Field Verification ---

    /**
     * Get pending fields for verification
     */
    getPendingFields: async (): Promise<FieldProfile[]> => {
        const response = await api.get<FieldProfile[]>('/mod/fields/pending');
        return response.data;
    },

    /**
     * Get field for review
     */
    getFieldForReview: async (fieldId: number): Promise<FieldProfile> => {
        const response = await api.get<FieldProfile>(`/mod/fields/${fieldId}`);
        return response.data;
    },

    /**
     * Verify field (approve/reject)
     */
    verifyField: async (data: VerifyFieldRequest): Promise<FieldProfile> => {
        const response = await api.put<FieldProfile>(`/mod/fields/${data.fieldId}/verify`, {
            approved: data.approve,
            rejectionReason: data.rejectionReason,
        });
        return response.data;
    },

    // --- User Management ---

    /**
     * Search users
     */
    searchUsers: async (params: UserSearchParams): Promise<PaginatedResponse<UserAccount>> => {
        const response = await api.get<UserAccount[]>('/mod/users', { params });
        return {
            data: response.data,
            total: response.data.length,
            page: params.page || 1,
            limit: params.limit || 20,
            totalPages: 1,
        };
    },

    /**
     * Get user details
     */
    getUserDetails: async (userId: number): Promise<UserAccount> => {
        const response = await api.get<UserAccount>(`/mod/users/${userId}`);
        return response.data;
    },

    /**
     * Get user moderation history
     */
    getUserModerationHistory: async (userId: number): Promise<ModerationLog[]> => {
        const response = await api.get<ModerationLog[]>(`/mod/users/${userId}/history`);
        return response.data;
    },

    /**
     * Suspend user
     */
    suspendUser: async (userId: number, reason: string): Promise<UserAccount> => {
        const response = await api.put<UserAccount>(`/mod/users/${userId}/suspend`, { reason });
        return response.data;
    },

    /**
     * Ban user
     */
    banUser: async (userId: number, reason: string): Promise<UserAccount> => {
        const response = await api.put<UserAccount>(`/mod/users/${userId}/ban`, { reason });
        return response.data;
    },

    /**
     * Reactivate user
     */
    reactivateUser: async (userId: number, reason: string): Promise<UserAccount> => {
        const response = await api.put<UserAccount>(`/mod/users/${userId}/reactivate`, { reason });
        return response.data;
    },

    // --- Content Moderation ---

    /**
     * Get pending reports
     */
    getPendingReports: async (): Promise<Report[]> => {
        const response = await api.get<Report[]>('/mod/reports?status=Pending');
        return response.data;
    },

    /**
     * Get report details
     */
    getReportDetails: async (reportId: number): Promise<Report> => {
        const response = await api.get<Report>(`/mod/reports/${reportId}`);
        return response.data;
    },

    /**
     * Resolve a report
     */
    resolveReport: async (data: ResolveReportRequest): Promise<Report> => {
        const response = await api.put<Report>(`/mod/reports/${data.reportId}/resolve`, {
            action: data.action,
            notes: data.notes,
        });
        return response.data;
    },

    /**
     * Dismiss a report
     */
    dismissReport: async (reportId: number): Promise<Report> => {
        const response = await api.put<Report>(`/mod/reports/${reportId}/dismiss`);
        return response.data;
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
        const response = await api.get<ModerationLog[]>('/mod/history', { params });
        return {
            data: response.data,
            total: response.data.length,
            page: params?.page || 1,
            limit: params?.limit || 20,
            totalPages: 1,
        };
    },
};

export default moderationService;
