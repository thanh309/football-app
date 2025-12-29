import api from '../axios';
import type { TeamProfile, FieldProfile, PlayerProfile, UserAccount } from '../../types';

export interface SearchParams {
    query: string;
    page?: number;
    limit?: number;
}

export interface TeamSearchParams extends SearchParams {
    location?: string;
    skillLevel?: number;
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

export const searchService = {
    /**
     * Search teams
     */
    searchTeams: async (params: TeamSearchParams): Promise<PaginatedResponse<TeamProfile>> => {
        const response = await api.get<PaginatedResponse<TeamProfile>>('/search/teams', { params });
        return response.data;
    },

    /**
     * Search fields
     */
    searchFields: async (params: FieldSearchParams): Promise<PaginatedResponse<FieldProfile>> => {
        const response = await api.get<PaginatedResponse<FieldProfile>>('/search/fields', { params });
        return response.data;
    },

    /**
     * Search players
     */
    searchPlayers: async (params: PlayerSearchParams): Promise<PaginatedResponse<PlayerProfile>> => {
        const response = await api.get<PaginatedResponse<PlayerProfile>>('/search/players', { params });
        return response.data;
    },

    /**
     * Search field owners
     */
    searchOwners: async (params: OwnerSearchParams): Promise<PaginatedResponse<UserAccount>> => {
        const response = await api.get<PaginatedResponse<UserAccount>>('/search/owners', { params });
        return response.data;
    },
};

export default searchService;
