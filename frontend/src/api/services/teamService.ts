// @ts-ignore - Keeping api import for future use when switching back to real API
import api from '../axios';
import type { TeamProfile, JoinRequest, TeamRoster } from '../../types';
import { TeamStatus, JoinRequestStatus, RosterRole } from '../../types';

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

// --- Mock Data ---
const mockTeamProfile: TeamProfile = {
    teamId: 1,
    teamName: 'FC Lightning',
    description: 'A competitive amateur football team based in Ho Chi Minh City',
    logoUrl: 'https://example.com/logos/lightning.png',
    leaderId: 1,
    status: TeamStatus.VERIFIED,
    location: 'Ho Chi Minh City, Vietnam',
    latitude: 10.8231,
    longitude: 106.6297,
    skillLevel: 7,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-06-20T14:30:00Z',
};

const mockTeamProfiles: TeamProfile[] = [
    mockTeamProfile,
    {
        teamId: 2,
        teamName: 'Thunder FC',
        description: 'Weekend warriors looking for friendly matches',
        logoUrl: 'https://example.com/logos/thunder.png',
        leaderId: 2,
        status: TeamStatus.VERIFIED,
        location: 'District 7, Ho Chi Minh City',
        skillLevel: 5,
        createdAt: '2024-02-20T08:00:00Z',
        updatedAt: '2024-07-10T16:00:00Z',
    },
    {
        teamId: 3,
        teamName: 'Phoenix United',
        description: 'New team seeking members',
        leaderId: 3,
        status: TeamStatus.PENDING,
        location: 'Binh Thanh District',
        skillLevel: 4,
        createdAt: '2024-11-01T09:00:00Z',
        updatedAt: '2024-11-01T09:00:00Z',
    },
];

const mockJoinRequest: JoinRequest = {
    requestId: 1,
    teamId: 1,
    playerId: 5,
    status: JoinRequestStatus.PENDING,
    message: 'I would love to join your team! I play as midfielder.',
    createdAt: '2024-12-01T10:00:00Z',
};

const mockJoinRequests: JoinRequest[] = [
    mockJoinRequest,
    {
        requestId: 2,
        teamId: 1,
        playerId: 6,
        status: JoinRequestStatus.PENDING,
        message: 'Looking for a new team to play with',
        createdAt: '2024-12-05T14:00:00Z',
    },
];

const mockTeamRoster: TeamRoster[] = [
    {
        rosterId: 1,
        teamId: 1,
        playerId: 1,
        role: RosterRole.CAPTAIN,
        joinedAt: '2024-01-15T10:00:00Z',
        isActive: true,
    },
    {
        rosterId: 2,
        teamId: 1,
        playerId: 2,
        role: RosterRole.VICE_CAPTAIN,
        joinedAt: '2024-01-20T11:00:00Z',
        isActive: true,
    },
    {
        rosterId: 3,
        teamId: 1,
        playerId: 3,
        role: RosterRole.MEMBER,
        joinedAt: '2024-02-01T09:00:00Z',
        isActive: true,
    },
    {
        rosterId: 4,
        teamId: 1,
        playerId: 4,
        role: RosterRole.MEMBER,
        joinedAt: '2024-03-15T15:00:00Z',
        isActive: false,
    },
];

export const teamService = {
    /**
     * Create a new team
     */
    createTeam: async (data: CreateTeamRequest): Promise<TeamProfile> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.post<TeamProfile>('/teams', data);
        // return response.data;
        // --- End Real API call ---

        return {
            teamId: Math.floor(Math.random() * 1000) + 100,
            teamName: data.teamName,
            description: data.description,
            logoUrl: data.logoUrl,
            leaderId: 1, // Assume current user
            status: TeamStatus.PENDING,
            location: data.location,
            skillLevel: data.skillLevel,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
    },

    /**
     * Get team by ID
     */
    getTeamById: async (_teamId: number): Promise<TeamProfile> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<TeamProfile>(`/teams/${teamId}`);
        // return response.data;
        // --- End Real API call ---

        return mockTeamProfile;
    },

    /**
     * Update team profile
     */
    updateTeam: async ({ teamId, ...data }: UpdateTeamRequest): Promise<TeamProfile> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.put<TeamProfile>(`/teams/${teamId}`, data);
        // return response.data;
        // --- End Real API call ---

        return {
            ...mockTeamProfile,
            teamId,
            ...data,
            updatedAt: new Date().toISOString(),
        };
    },

    /**
     * Delete team
     */
    deleteTeam: async (_teamId: number): Promise<void> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // await api.delete(`/teams/${teamId}`);
        // --- End Real API call ---

        console.log('Mock: Team deleted successfully');
    },

    /**
     * Get teams led by user
     */
    getLeaderTeams: async (_userId: number): Promise<TeamProfile[]> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<TeamProfile[]>(`/teams/leader/${userId}`);
        // return response.data;
        // --- End Real API call ---

        return mockTeamProfiles.filter(t => t.leaderId === 1);
    },

    /**
     * Get teams where player is a member
     */
    getPlayerTeams: async (_playerId: number): Promise<TeamProfile[]> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<TeamProfile[]>(`/teams/player/${playerId}`);
        // return response.data;
        // --- End Real API call ---

        return mockTeamProfiles.slice(0, 2);
    },

    /**
     * Search teams
     */
    searchTeams: async (params: TeamSearchParams): Promise<PaginatedResponse<TeamProfile>> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<PaginatedResponse<TeamProfile>>('/teams/search', { params });
        // return response.data;
        // --- End Real API call ---

        const page = params.page || 1;
        const limit = params.limit || 10;

        return {
            data: mockTeamProfiles,
            total: mockTeamProfiles.length,
            page,
            limit,
            totalPages: Math.ceil(mockTeamProfiles.length / limit),
        };
    },

    /**
     * Request to join a team
     */
    requestJoinTeam: async (teamId: number, message?: string): Promise<JoinRequest> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.post<JoinRequest>(`/teams/${teamId}/join-requests`, { message });
        // return response.data;
        // --- End Real API call ---

        return {
            requestId: Math.floor(Math.random() * 1000) + 100,
            teamId,
            playerId: 1, // Assume current player
            status: JoinRequestStatus.PENDING,
            message,
            createdAt: new Date().toISOString(),
        };
    },

    /**
     * Leave a team
     */
    leaveTeam: async (_teamId: number, _playerId: number): Promise<void> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // await api.delete(`/teams/${teamId}/roster/${playerId}`);
        // --- End Real API call ---

        console.log('Mock: Left team successfully');
    },

    /**
     * Get pending join requests for a team
     */
    getPendingJoinRequests: async (_teamId: number): Promise<JoinRequest[]> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<JoinRequest[]>(`/teams/${teamId}/join-requests?status=Pending`);
        // return response.data;
        // --- End Real API call ---

        return mockJoinRequests.filter(r => r.status === JoinRequestStatus.PENDING);
    },

    /**
     * Process join request (approve/reject)
     */
    processJoinRequest: async (requestId: number, approve: boolean): Promise<JoinRequest> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.patch<JoinRequest>(`/join-requests/${requestId}`, {
        //     status: approve ? 'Accepted' : 'Rejected',
        // });
        // return response.data;
        // --- End Real API call ---

        return {
            ...mockJoinRequest,
            requestId,
            status: approve ? JoinRequestStatus.ACCEPTED : JoinRequestStatus.REJECTED,
            processedAt: new Date().toISOString(),
        };
    },

    /**
     * Get team roster
     */
    getTeamRoster: async (_teamId: number): Promise<TeamRoster[]> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<TeamRoster[]>(`/teams/${teamId}/roster`);
        // return response.data;
        // --- End Real API call ---

        return mockTeamRoster;
    },
};

export default teamService;
