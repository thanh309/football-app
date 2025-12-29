import api from '../axios';
import type { PlayerProfile } from '../../types';

export interface UpdatePlayerProfileRequest {
    displayName?: string;
    position?: string;
    skillLevel?: number;
    bio?: string;
    profileImage?: string;
    dateOfBirth?: string;
    height?: number;
    weight?: number;
    preferredFoot?: string;
}

export interface PlayerSearchParams {
    query?: string;
    position?: string;
    minSkillLevel?: number;
    maxSkillLevel?: number;
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

export const playerService = {
    /**
     * Get player profile by user ID
     */
    getPlayerByUserId: async (userId: number): Promise<PlayerProfile> => {
        const response = await api.get<PlayerProfile>(`/players/user/${userId}`);
        return response.data;
    },

    /**
     * Get player profile by player ID
     */
    getPlayerById: async (playerId: number): Promise<PlayerProfile> => {
        const response = await api.get<PlayerProfile>(`/players/${playerId}`);
        return response.data;
    },

    /**
     * Update player profile
     */
    updateProfile: async (playerId: number, data: UpdatePlayerProfileRequest): Promise<PlayerProfile> => {
        const response = await api.put<PlayerProfile>(`/players/${playerId}`, data);
        return response.data;
    },

    /**
     * Search players
     */
    searchPlayers: async (params: PlayerSearchParams): Promise<PaginatedResponse<PlayerProfile>> => {
        const response = await api.get<PaginatedResponse<PlayerProfile>>('/players/search', { params });
        return response.data;
    },

    /**
     * Get current user's player profile
     */
    getMyProfile: async (): Promise<PlayerProfile> => {
        const response = await api.get<PlayerProfile>('/players/me');
        return response.data;
    },
};

export default playerService;
