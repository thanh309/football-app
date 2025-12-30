// @ts-ignore - Keeping api import for future use when switching back to real API
import api from '../axios';
import type { TeamRoster, RosterRole } from '../../types';
import { RosterRole as RosterRoleEnum } from '../../types';

export interface AddPlayerRequest {
    teamId: number;
    playerId: number;
    role?: RosterRole;
}

export interface UpdateRoleRequest {
    rosterId: number;
    role: RosterRole;
}

// --- Mock Data ---
const mockTeamRoster: TeamRoster[] = [
    {
        rosterId: 1,
        teamId: 1,
        playerId: 1,
        role: RosterRoleEnum.CAPTAIN,
        joinedAt: '2024-01-15T10:00:00Z',
        isActive: true,
    },
    {
        rosterId: 2,
        teamId: 1,
        playerId: 2,
        role: RosterRoleEnum.VICE_CAPTAIN,
        joinedAt: '2024-01-20T11:00:00Z',
        isActive: true,
    },
    {
        rosterId: 3,
        teamId: 1,
        playerId: 3,
        role: RosterRoleEnum.MEMBER,
        joinedAt: '2024-02-01T09:00:00Z',
        isActive: true,
    },
    {
        rosterId: 4,
        teamId: 1,
        playerId: 4,
        role: RosterRoleEnum.MEMBER,
        joinedAt: '2024-03-15T15:00:00Z',
        isActive: true,
    },
    {
        rosterId: 5,
        teamId: 1,
        playerId: 5,
        role: RosterRoleEnum.MEMBER,
        joinedAt: '2024-05-10T14:00:00Z',
        isActive: false, // Inactive member
    },
];

const mockPlayerMemberships: TeamRoster[] = [
    {
        rosterId: 1,
        teamId: 1,
        playerId: 1,
        role: RosterRoleEnum.CAPTAIN,
        joinedAt: '2024-01-15T10:00:00Z',
        isActive: true,
    },
    {
        rosterId: 10,
        teamId: 2,
        playerId: 1,
        role: RosterRoleEnum.MEMBER,
        joinedAt: '2024-06-01T12:00:00Z',
        isActive: true,
    },
];

export const rosterService = {
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

    /**
     * Add player to roster
     */
    addPlayer: async (data: AddPlayerRequest): Promise<TeamRoster> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.post<TeamRoster>(`/teams/${data.teamId}/roster`, {
        //     playerId: data.playerId,
        //     role: data.role || 'Member',
        // });
        // return response.data;
        // --- End Real API call ---

        return {
            rosterId: Math.floor(Math.random() * 1000) + 100,
            teamId: data.teamId,
            playerId: data.playerId,
            role: data.role || RosterRoleEnum.MEMBER,
            joinedAt: new Date().toISOString(),
            isActive: true,
        };
    },

    /**
     * Remove player from roster
     */
    removePlayer: async (_teamId: number, _playerId: number): Promise<void> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // await api.delete(`/teams/${teamId}/roster/${playerId}`);
        // --- End Real API call ---

        console.log('Mock: Player removed from roster');
    },

    /**
     * Update player role in team
     */
    updatePlayerRole: async (data: UpdateRoleRequest): Promise<TeamRoster> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.patch<TeamRoster>(`/roster/${data.rosterId}`, {
        //     role: data.role,
        // });
        // return response.data;
        // --- End Real API call ---

        const existingRoster = mockTeamRoster.find(r => r.rosterId === data.rosterId);

        return {
            ...(existingRoster || mockTeamRoster[0]),
            rosterId: data.rosterId,
            role: data.role,
        };
    },

    /**
     * Get player's team membership
     */
    getPlayerTeamMembership: async (_playerId: number): Promise<TeamRoster[]> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<TeamRoster[]>(`/players/${playerId}/roster`);
        // return response.data;
        // --- End Real API call ---

        return mockPlayerMemberships;
    },
};

export default rosterService;
