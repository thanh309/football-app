// @ts-ignore - Keeping api import for future use when switching back to real API
import api from '../axios';
import type { MatchEvent, MatchInvitation, MatchResult, MatchStatus, Visibility } from '../../types';
import { MatchStatus as MatchStatusEnum, Visibility as VisibilityEnum, InvitationStatus } from '../../types';

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

// --- Mock Data ---
const mockMatchEvent: MatchEvent = {
    matchId: 1,
    hostTeamId: 1,
    opponentTeamId: 2,
    fieldId: 1,
    bookingId: 1,
    matchDate: '2025-01-15',
    startTime: '18:00:00',
    endTime: '20:00:00',
    status: MatchStatusEnum.SCHEDULED,
    visibility: VisibilityEnum.PUBLIC,
    description: 'Friendly match between Team Alpha and Team Beta',
    createdAt: '2024-12-01T10:00:00Z',
    updatedAt: '2024-12-15T14:30:00Z',
};

const mockMatchEvents: MatchEvent[] = [
    mockMatchEvent,
    {
        matchId: 2,
        hostTeamId: 1,
        opponentTeamId: 3,
        fieldId: 2,
        matchDate: '2025-01-20',
        startTime: '19:00:00',
        endTime: '21:00:00',
        status: MatchStatusEnum.PENDING_APPROVAL,
        visibility: VisibilityEnum.TEAM_ONLY,
        description: 'Practice match',
        createdAt: '2024-12-10T09:00:00Z',
        updatedAt: '2024-12-10T09:00:00Z',
    },
    {
        matchId: 3,
        hostTeamId: 2,
        opponentTeamId: 1,
        fieldId: 1,
        matchDate: '2025-01-25',
        startTime: '17:00:00',
        endTime: '19:00:00',
        status: MatchStatusEnum.COMPLETED,
        visibility: VisibilityEnum.PUBLIC,
        description: 'Championship finals',
        createdAt: '2024-11-15T08:00:00Z',
        updatedAt: '2024-12-25T21:00:00Z',
    },
];

const mockMatchInvitation: MatchInvitation = {
    invitationId: 1,
    matchId: 1,
    invitingTeamId: 1,
    invitedTeamId: 2,
    status: InvitationStatus.PENDING,
    message: 'Would you like to play a friendly match?',
    createdAt: '2024-12-01T10:00:00Z',
};

const mockMatchInvitations: MatchInvitation[] = [
    mockMatchInvitation,
    {
        invitationId: 2,
        matchId: 2,
        invitingTeamId: 3,
        invitedTeamId: 1,
        status: InvitationStatus.PENDING,
        message: 'Challenge match request',
        createdAt: '2024-12-05T15:00:00Z',
    },
];

const mockMatchResult: MatchResult = {
    resultId: 1,
    matchId: 3,
    homeScore: 3,
    awayScore: 2,
    winnerId: 2,
    notes: 'Great game! Close match until the final minutes.',
    recordedBy: 1,
    createdAt: '2024-12-25T21:00:00Z',
};

export const matchService = {
    /**
     * Create a new match event
     */
    createMatch: async (data: CreateMatchRequest): Promise<MatchEvent> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.post<MatchEvent>('/matches', data);
        // return response.data;
        // --- End Real API call ---

        const newMatch: MatchEvent = {
            matchId: Math.floor(Math.random() * 1000) + 100,
            hostTeamId: data.hostTeamId,
            matchDate: data.matchDate,
            startTime: data.startTime,
            endTime: data.endTime,
            fieldId: data.fieldId,
            description: data.description,
            visibility: data.visibility || VisibilityEnum.PUBLIC,
            status: MatchStatusEnum.PENDING_APPROVAL,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        return newMatch;
    },

    /**
     * Get match by ID
     */
    getMatchById: async (_matchId: number): Promise<MatchEvent> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<MatchEvent>(`/matches/${matchId}`);
        // return response.data;
        // --- End Real API call ---

        return mockMatchEvent;
    },

    /**
     * Update match
     */
    updateMatch: async ({ matchId, ...data }: UpdateMatchRequest): Promise<MatchEvent> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.put<MatchEvent>(`/matches/${matchId}`, data);
        // return response.data;
        // --- End Real API call ---

        return {
            ...mockMatchEvent,
            matchId,
            ...data,
            updatedAt: new Date().toISOString(),
        };
    },

    /**
     * Cancel match
     */
    cancelMatch: async (matchId: number, _reason?: string): Promise<MatchEvent> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.patch<MatchEvent>(`/matches/${matchId}/cancel`, { reason });
        // return response.data;
        // --- End Real API call ---

        return {
            ...mockMatchEvent,
            matchId,
            status: MatchStatusEnum.CANCELLED,
            updatedAt: new Date().toISOString(),
        };
    },

    /**
     * Get matches for a team
     */
    getTeamMatches: async (_teamId: number, params?: MatchSearchParams): Promise<PaginatedResponse<MatchEvent>> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<PaginatedResponse<MatchEvent>>(`/teams/${teamId}/matches`, { params });
        // return response.data;
        // --- End Real API call ---

        const page = params?.page || 1;
        const limit = params?.limit || 10;

        return {
            data: mockMatchEvents,
            total: mockMatchEvents.length,
            page,
            limit,
            totalPages: Math.ceil(mockMatchEvents.length / limit),
        };
    },

    /**
     * Get player's match schedule (all teams)
     */
    getPlayerSchedule: async (_playerId: number): Promise<MatchEvent[]> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<MatchEvent[]>(`/players/${playerId}/schedule`);
        // return response.data;
        // --- End Real API call ---

        return mockMatchEvents;
    },

    /**
     * Send match invitation
     */
    sendInvitation: async (data: SendInvitationRequest): Promise<MatchInvitation> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.post<MatchInvitation>('/match-invitations', data);
        // return response.data;
        // --- End Real API call ---

        return {
            invitationId: Math.floor(Math.random() * 1000) + 100,
            matchId: data.matchId,
            invitingTeamId: 1, // Assume current team
            invitedTeamId: data.invitedTeamId,
            status: InvitationStatus.PENDING,
            message: data.message,
            createdAt: new Date().toISOString(),
        };
    },

    /**
     * Get pending invitations for a team
     */
    getPendingInvitations: async (_teamId: number): Promise<MatchInvitation[]> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<MatchInvitation[]>(`/teams/${teamId}/match-invitations?status=Pending`);
        // return response.data;
        // --- End Real API call ---

        return mockMatchInvitations.filter(inv => inv.status === InvitationStatus.PENDING);
    },

    /**
     * Respond to invitation
     */
    respondInvitation: async (invitationId: number, accept: boolean): Promise<MatchInvitation> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.patch<MatchInvitation>(`/match-invitations/${invitationId}`, {
        //     status: accept ? 'Accepted' : 'Declined',
        // });
        // return response.data;
        // --- End Real API call ---

        return {
            ...mockMatchInvitation,
            invitationId,
            status: accept ? InvitationStatus.ACCEPTED : InvitationStatus.DECLINED,
            respondedAt: new Date().toISOString(),
        };
    },

    /**
     * Record match result
     */
    recordResult: async (matchId: number, homeScore: number, awayScore: number, notes?: string): Promise<MatchResult> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.post<MatchResult>(`/matches/${matchId}/result`, {
        //     homeScore,
        //     awayScore,
        //     notes,
        // });
        // return response.data;
        // --- End Real API call ---

        return {
            resultId: Math.floor(Math.random() * 1000) + 100,
            matchId,
            homeScore,
            awayScore,
            winnerId: homeScore > awayScore ? 1 : homeScore < awayScore ? 2 : undefined,
            notes,
            recordedBy: 1,
            createdAt: new Date().toISOString(),
        };
    },

    /**
     * Get match result
     */
    getMatchResult: async (_matchId: number): Promise<MatchResult | null> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<MatchResult>(`/matches/${matchId}/result`);
        // return response.data;
        // --- End Real API call ---

        return mockMatchResult;
    },
};

export default matchService;
