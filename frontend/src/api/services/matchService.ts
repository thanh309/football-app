import api from '../axios';
import type { MatchEvent, MatchInvitation, MatchResult, MatchStatus, Visibility } from '../../types';

export interface CreateMatchRequest {
    hostTeamId: number;
    matchDate: string;
    startTime: string;
    endTime?: string;
    fieldId?: number;
    description?: string;
    visibility?: Visibility;
}

export interface UpdateMatchRequest extends Partial<CreateMatchRequest> {
    matchId: number;
    opponentTeamId?: number;
    status?: MatchStatus;
}

export interface MatchSearchParams {
    teamId?: number;
    status?: MatchStatus;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
}

export interface SendInvitationRequest {
    matchId: number;
    invitedTeamId: number;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// Match service functions - Real API calls
export const matchService = {
    /**
     * Create a new match event
     */
    createMatch: async (data: CreateMatchRequest): Promise<MatchEvent> => {
        const response = await api.post<MatchEvent>('/matches', data);
        return response.data;
    },

    /**
     * Get match by ID
     */
    getMatchById: async (matchId: number): Promise<MatchEvent> => {
        const response = await api.get<MatchEvent>(`/matches/${matchId}`);
        return response.data;
    },

    /**
     * Update match
     */
    updateMatch: async ({ matchId, ...data }: UpdateMatchRequest): Promise<MatchEvent> => {
        const response = await api.put<MatchEvent>(`/matches/${matchId}`, data);
        return response.data;
    },

    /**
     * Cancel match
     */
    cancelMatch: async (matchId: number, _reason?: string): Promise<MatchEvent> => {
        const response = await api.put<MatchEvent>(`/matches/${matchId}/cancel`);
        return response.data;
    },

    /**
     * Get matches for a team
     */
    getTeamMatches: async (teamId: number, params?: MatchSearchParams): Promise<PaginatedResponse<MatchEvent>> => {
        const response = await api.get<MatchEvent[]>(`/matches/team/${teamId}`, { params });
        return {
            data: response.data,
            total: response.data.length,
            page: params?.page || 1,
            limit: params?.limit || 20,
            totalPages: 1,
        };
    },

    /**
     * Get player's match schedule (by user_id, looks up player first)
     */
    getPlayerSchedule: async (userId: number): Promise<MatchEvent[]> => {
        const response = await api.get<MatchEvent[]>(`/players/user/${userId}/schedule`);
        return response.data;
    },

    /**
     * Send match invitation
     */
    sendInvitation: async (data: SendInvitationRequest): Promise<MatchInvitation> => {
        const response = await api.post<MatchInvitation>(`/matches/${data.matchId}/invitations`, {
            invitedTeamId: data.invitedTeamId,
            message: data.message,
        });
        return response.data;
    },

    /**
     * Get pending invitations for a team
     */
    getPendingInvitations: async (teamId: number): Promise<MatchInvitation[]> => {
        const response = await api.get<MatchInvitation[]>(`/teams/${teamId}/match-invitations`);
        return response.data;
    },

    /**
     * Respond to invitation
     */
    respondInvitation: async (invitationId: number, accept: boolean): Promise<MatchInvitation> => {
        const action = accept ? 'accept' : 'decline';
        const response = await api.put<MatchInvitation>(`/matches/invitations/${invitationId}/${action}`);
        return response.data;
    },

    /**
     * Record match result
     */
    recordResult: async (matchId: number, homeScore: number, awayScore: number, notes?: string): Promise<MatchResult> => {
        const response = await api.post<MatchResult>(`/matches/${matchId}/result`, {
            homeScore,
            awayScore,
            notes,
        });
        return response.data;
    },

    /**
     * Get match result
     */
    getMatchResult: async (matchId: number): Promise<MatchResult | null> => {
        try {
            const response = await api.get<MatchResult>(`/matches/${matchId}/result`);
            return response.data;
        } catch {
            return null;
        }
    },
};

export default matchService;
