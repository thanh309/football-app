import api from '../axios';
import type { TeamProfile, FieldProfile, PlayerProfile, UserAccount } from '../../types';

export interface SearchParams {
    query: string;
    page?: number;
    limit?: number;
}

export interface TeamSearchParams extends SearchParams {
    location?: string;
    minSkillLevel?: number;
    maxSkillLevel?: number;
}

export interface FieldSearchParams extends SearchParams {
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    amenityIds?: number[];
}

export interface PlayerSearchParams extends SearchParams {
    position?: string;
    minSkillLevel?: number;
    maxSkillLevel?: number;
}

export interface OwnerSearchParams extends SearchParams {
    location?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// Search service functions - Real API calls
export const searchService = {
    /**
     * Search teams
     */
    searchTeams: async (params: TeamSearchParams): Promise<PaginatedResponse<TeamProfile>> => {
        const response = await api.get<TeamProfile[]>('/search/teams', { params });
        return {
            data: response.data,
            total: response.data.length,
            page: params.page || 1,
            limit: params.limit || 20,
            totalPages: 1,
        };
    },

    /**
     * Search fields
     */
    searchFields: async (params: FieldSearchParams): Promise<PaginatedResponse<FieldProfile>> => {
        const response = await api.get<FieldProfile[]>('/search/fields', { params });
        return {
            data: response.data,
            total: response.data.length,
            page: params.page || 1,
            limit: params.limit || 20,
            totalPages: 1,
        };
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
     * Search field owners
     */
    searchOwners: async (params: OwnerSearchParams): Promise<PaginatedResponse<UserAccount>> => {
        const response = await api.get<UserAccount[]>('/search/owners', { params });
        return {
            data: response.data,
            total: response.data.length,
            page: params.page || 1,
            limit: params.limit || 20,
            totalPages: 1,
        };
    },
};

export default searchService;
