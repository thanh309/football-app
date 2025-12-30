// @ts-ignore - Keeping api import for future use when switching back to real API
import api from '../axios';
import type { TeamProfile, FieldProfile, PlayerProfile, UserAccount } from '../../types';
import { TeamStatus, FieldStatus, AccountStatus, UserRole, PreferredFoot } from '../../types';

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

// --- Mock Data ---
const mockTeamProfiles: TeamProfile[] = [
    {
        teamId: 1,
        teamName: 'FC Lightning',
        description: 'A competitive amateur football team',
        logoUrl: 'https://example.com/logos/lightning.png',
        leaderId: 1,
        status: TeamStatus.VERIFIED,
        location: 'Ho Chi Minh City',
        skillLevel: 7,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-06-20T14:30:00Z',
    },
    {
        teamId: 2,
        teamName: 'Thunder FC',
        description: 'Weekend warriors',
        leaderId: 2,
        status: TeamStatus.VERIFIED,
        location: 'District 7, HCMC',
        skillLevel: 5,
        createdAt: '2024-02-20T08:00:00Z',
        updatedAt: '2024-07-10T16:00:00Z',
    },
];

const mockFieldProfiles: FieldProfile[] = [
    {
        fieldId: 1,
        ownerId: 5,
        fieldName: 'Green Valley Stadium',
        description: 'Premium 11-a-side football field',
        location: 'District 2, HCMC',
        latitude: 10.7869,
        longitude: 106.7518,
        defaultPricePerHour: 500000,
        capacity: 22,
        status: FieldStatus.VERIFIED,
        createdAt: '2024-01-10T08:00:00Z',
        updatedAt: '2024-08-15T10:30:00Z',
    },
    {
        fieldId: 2,
        ownerId: 5,
        fieldName: 'City Arena 5v5',
        description: 'Artificial turf 5-a-side',
        location: 'District 7, HCMC',
        defaultPricePerHour: 300000,
        capacity: 10,
        status: FieldStatus.VERIFIED,
        createdAt: '2024-03-20T09:00:00Z',
        updatedAt: '2024-09-01T14:00:00Z',
    },
];

const mockPlayerProfiles: PlayerProfile[] = [
    {
        playerId: 1,
        userId: 1,
        displayName: 'John Doe',
        position: 'Midfielder',
        skillLevel: 7,
        bio: 'Passionate footballer',
        height: 178,
        weight: 72,
        preferredFoot: PreferredFoot.RIGHT,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-12-15T14:00:00Z',
    },
    {
        playerId: 2,
        userId: 2,
        displayName: 'Jane Smith',
        position: 'Forward',
        skillLevel: 8,
        bio: 'Top scorer',
        height: 165,
        weight: 58,
        preferredFoot: PreferredFoot.LEFT,
        createdAt: '2024-02-15T00:00:00Z',
        updatedAt: '2024-11-20T10:00:00Z',
    },
];

const mockOwners: UserAccount[] = [
    {
        userId: 5,
        username: 'field_owner',
        email: 'owner@example.com',
        passwordHash: 'hashed',
        roles: [UserRole.FIELD_OWNER],
        status: AccountStatus.ACTIVE,
        isVerified: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-12-01T10:00:00Z',
        location: 'District 2, HCMC',
    },
    {
        userId: 6,
        username: 'sports_complex',
        email: 'sports@example.com',
        passwordHash: 'hashed',
        roles: [UserRole.FIELD_OWNER],
        status: AccountStatus.ACTIVE,
        isVerified: true,
        createdAt: '2024-03-15T00:00:00Z',
        updatedAt: '2024-10-20T14:00:00Z',
        location: 'Thu Duc City',
    },
];

export const searchService = {
    /**
     * Search teams
     */
    searchTeams: async (params: TeamSearchParams): Promise<PaginatedResponse<TeamProfile>> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<PaginatedResponse<TeamProfile>>('/search/teams', { params });
        // return response.data;
        // --- End Real API call ---

        const page = params.page || 1;
        const limit = params.limit || 10;

        let results = [...mockTeamProfiles];

        if (params.query) {
            const query = params.query.toLowerCase();
            results = results.filter(t =>
                t.teamName.toLowerCase().includes(query) ||
                t.description?.toLowerCase().includes(query)
            );
        }

        return {
            data: results,
            total: results.length,
            page,
            limit,
            totalPages: Math.ceil(results.length / limit),
        };
    },

    /**
     * Search fields
     */
    searchFields: async (params: FieldSearchParams): Promise<PaginatedResponse<FieldProfile>> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<PaginatedResponse<FieldProfile>>('/search/fields', { params });
        // return response.data;
        // --- End Real API call ---

        const page = params.page || 1;
        const limit = params.limit || 10;

        let results = [...mockFieldProfiles];

        if (params.query) {
            const query = params.query.toLowerCase();
            results = results.filter(f =>
                f.fieldName.toLowerCase().includes(query) ||
                f.location.toLowerCase().includes(query)
            );
        }

        if (params.minPrice) {
            results = results.filter(f => f.defaultPricePerHour >= params.minPrice!);
        }
        if (params.maxPrice) {
            results = results.filter(f => f.defaultPricePerHour <= params.maxPrice!);
        }

        return {
            data: results,
            total: results.length,
            page,
            limit,
            totalPages: Math.ceil(results.length / limit),
        };
    },

    /**
     * Search players
     */
    searchPlayers: async (params: PlayerSearchParams): Promise<PaginatedResponse<PlayerProfile>> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<PaginatedResponse<PlayerProfile>>('/search/players', { params });
        // return response.data;
        // --- End Real API call ---

        const page = params.page || 1;
        const limit = params.limit || 10;

        let results = [...mockPlayerProfiles];

        if (params.query) {
            const query = params.query.toLowerCase();
            results = results.filter(p =>
                p.displayName.toLowerCase().includes(query) ||
                p.position?.toLowerCase().includes(query)
            );
        }

        if (params.position) {
            results = results.filter(p => p.position === params.position);
        }

        return {
            data: results,
            total: results.length,
            page,
            limit,
            totalPages: Math.ceil(results.length / limit),
        };
    },

    /**
     * Search field owners
     */
    searchOwners: async (params: OwnerSearchParams): Promise<PaginatedResponse<UserAccount>> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<PaginatedResponse<UserAccount>>('/search/owners', { params });
        // return response.data;
        // --- End Real API call ---

        const page = params.page || 1;
        const limit = params.limit || 10;

        let results = [...mockOwners];

        if (params.query) {
            const query = params.query.toLowerCase();
            results = results.filter(o =>
                o.username.toLowerCase().includes(query) ||
                o.location?.toLowerCase().includes(query)
            );
        }

        return {
            data: results,
            total: results.length,
            page,
            limit,
            totalPages: Math.ceil(results.length / limit),
        };
    },
};

export default searchService;
