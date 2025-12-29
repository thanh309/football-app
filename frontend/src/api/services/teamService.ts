import api from '../axios';
import type { TeamProfile, JoinRequest, TeamRoster } from '../../types';

// Types for API requests/responses
export interface CreateTeamRequest {
    teamName: string;
    description?: string;
    logoUrl?: string;
    location?: string;
    skillLevel?: number;
}

export interface UpdateTeamRequest extends Partial<CreateTeamRequest> {
    teamId: number;
}

export interface TeamSearchParams {
    query?: string;
    location?: string;
    skillLevel?: number;
    status?: string;
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

export const teamService = {
    /**
     * Create a new team
     */
    createTeam: async (data: CreateTeamRequest): Promise<TeamProfile> => {
        const response = await api.post<TeamProfile>('/teams', data);
        return response.data;
    },

    /**
     * Get team by ID
     */
    getTeamById: async (teamId: number): Promise<TeamProfile> => {
        const response = await api.get<TeamProfile>(`/teams/${teamId}`);
        return response.data;
    },

    /**
     * Update team profile
     */
    updateTeam: async ({ teamId, ...data }: UpdateTeamRequest): Promise<TeamProfile> => {
        const response = await api.put<TeamProfile>(`/teams/${teamId}`, data);
        return response.data;
    },

    /**
     * Delete team
     */
    deleteTeam: async (teamId: number): Promise<void> => {
        await api.delete(`/teams/${teamId}`);
    },

    /**
     * Get teams led by user
     */
    getLeaderTeams: async (userId: number): Promise<TeamProfile[]> => {
        const response = await api.get<TeamProfile[]>(`/teams/leader/${userId}`);
        return response.data;
    },

    /**
     * Get teams where player is a member
     */
    getPlayerTeams: async (playerId: number): Promise<TeamProfile[]> => {
        const response = await api.get<TeamProfile[]>(`/teams/player/${playerId}`);
        return response.data;
    },

    /**
     * Search teams
     */
    searchTeams: async (params: TeamSearchParams): Promise<PaginatedResponse<TeamProfile>> => {
        const response = await api.get<PaginatedResponse<TeamProfile>>('/teams/search', { params });
        return response.data;
    },

    /**
     * Request to join a team
     */
    requestJoinTeam: async (teamId: number, message?: string): Promise<JoinRequest> => {
        const response = await api.post<JoinRequest>(`/teams/${teamId}/join-requests`, { message });
        return response.data;
    },

    /**
     * Leave a team
     */
    leaveTeam: async (teamId: number, playerId: number): Promise<void> => {
        await api.delete(`/teams/${teamId}/roster/${playerId}`);
    },

    /**
     * Get pending join requests for a team
     */
    getPendingJoinRequests: async (teamId: number): Promise<JoinRequest[]> => {
        const response = await api.get<JoinRequest[]>(`/teams/${teamId}/join-requests?status=Pending`);
        return response.data;
    },

    /**
     * Process join request (approve/reject)
     */
    processJoinRequest: async (requestId: number, approve: boolean): Promise<JoinRequest> => {
        const response = await api.patch<JoinRequest>(`/join-requests/${requestId}`, {
            status: approve ? 'Accepted' : 'Rejected',
        });
        return response.data;
    },

    /**
     * Get team roster
     */
    getTeamRoster: async (teamId: number): Promise<TeamRoster[]> => {
        const response = await api.get<TeamRoster[]>(`/teams/${teamId}/roster`);
        return response.data;
    },
};

export default teamService;
