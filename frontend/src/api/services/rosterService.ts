import api from '../axios';
import type { TeamRoster, RosterRole } from '../../types';

export interface AddPlayerRequest {
    teamId: number;
    playerId: number;
    role?: RosterRole;
}

export interface UpdateRoleRequest {
    rosterId: number;
    role: RosterRole;
}

// Roster service - Real API calls
export const rosterService = {
    /**
     * Get team roster
     */
    getTeamRoster: async (teamId: number): Promise<TeamRoster[]> => {
        const response = await api.get<TeamRoster[]>(`/teams/${teamId}/roster`);
        return response.data;
    },

    /**
     * Add player to roster
     */
    addPlayer: async (data: AddPlayerRequest): Promise<TeamRoster> => {
        const response = await api.post<TeamRoster>(`/teams/${data.teamId}/roster`, {
            playerId: data.playerId,
            role: data.role || 'Member',
        });
        return response.data;
    },

    /**
     * Remove player from roster
     */
    removePlayer: async (teamId: number, playerId: number): Promise<void> => {
        await api.delete(`/teams/${teamId}/roster/${playerId}`);
    },

    /**
     * Update player role in team
     */
    updatePlayerRole: async (data: UpdateRoleRequest): Promise<TeamRoster> => {
        const response = await api.put<TeamRoster>(`/roster/${data.rosterId}`, {
            role: data.role,
        });
        return response.data;
    },

    /**
     * Get player's team membership
     */
    getPlayerTeamMembership: async (playerId: number): Promise<TeamRoster[]> => {
        const response = await api.get<TeamRoster[]>(`/players/${playerId}/roster`);
        return response.data;
    },
};

export default rosterService;
