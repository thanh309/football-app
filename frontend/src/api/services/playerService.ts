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

// Player service functions - Real API calls
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
    updateProfile: async (_playerId: number, data: UpdatePlayerProfileRequest): Promise<PlayerProfile> => {
        const response = await api.put<PlayerProfile>('/players/profile', data);
        return response.data;
    },

    /**
     * Search players
     */
    searchPlayers: async (params: PlayerSearchParams): Promise<PaginatedResponse<PlayerProfile>> => {
        const response = await api.get<PlayerProfile[]>('/search/players', { params });
        return {
            data: response.data,
            total: response.data.length,
            page: params.page || 1,
            limit: params.limit || 20,
            totalPages: 1,
        };
    },

    /**
     * Get current user's player profile
     */
    getMyProfile: async (): Promise<PlayerProfile> => {
        const response = await api.get<PlayerProfile>('/players/profile');
        return response.data;
    },
};

export default playerService;
