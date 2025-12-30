// @ts-ignore - Keeping api import for future use when switching back to real API
import api from '../axios';
import type { PlayerProfile } from '../../types';
import { PreferredFoot } from '../../types';

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

// --- Mock Data ---
const mockPlayerProfile: PlayerProfile = {
    playerId: 1,
    userId: 1,
    displayName: 'John "Flash" Doe',
    position: 'Midfielder',
    skillLevel: 7,
    bio: 'Passionate footballer with 10 years of experience. Love playing attacking midfield.',
    profileImage: 'https://example.com/avatars/john_doe.jpg',
    dateOfBirth: '1995-03-15',
    height: 178,
    weight: 72,
    preferredFoot: PreferredFoot.RIGHT,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-15T14:00:00Z',
};

const mockPlayerProfiles: PlayerProfile[] = [
    mockPlayerProfile,
    {
        playerId: 2,
        userId: 2,
        displayName: 'Jane "Striker" Smith',
        position: 'Forward',
        skillLevel: 8,
        bio: 'Top scorer in local league for 3 consecutive seasons.',
        profileImage: 'https://example.com/avatars/jane_smith.jpg',
        dateOfBirth: '1998-07-22',
        height: 165,
        weight: 58,
        preferredFoot: PreferredFoot.LEFT,
        createdAt: '2024-02-15T00:00:00Z',
        updatedAt: '2024-11-20T10:00:00Z',
    },
    {
        playerId: 3,
        userId: 3,
        displayName: 'Mike "Wall" Johnson',
        position: 'Goalkeeper',
        skillLevel: 9,
        bio: 'Professional goalkeeper with academy training. Amazing reflex saves.',
        dateOfBirth: '1992-11-08',
        height: 188,
        weight: 85,
        preferredFoot: PreferredFoot.BOTH,
        createdAt: '2024-01-20T00:00:00Z',
        updatedAt: '2024-10-05T16:00:00Z',
    },
    {
        playerId: 4,
        userId: 4,
        displayName: 'Alex Defender',
        position: 'Defender',
        skillLevel: 6,
        bio: 'Solid central defender, good in the air.',
        dateOfBirth: '1997-05-30',
        height: 182,
        weight: 78,
        preferredFoot: PreferredFoot.RIGHT,
        createdAt: '2024-03-10T00:00:00Z',
        updatedAt: '2024-09-15T11:00:00Z',
    },
];

export const playerService = {
    /**
     * Get player profile by user ID
     */
    getPlayerByUserId: async (_userId: number): Promise<PlayerProfile> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<PlayerProfile>(`/players/user/${userId}`);
        // return response.data;
        // --- End Real API call ---

        return mockPlayerProfile;
    },

    /**
     * Get player profile by player ID
     */
    getPlayerById: async (_playerId: number): Promise<PlayerProfile> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<PlayerProfile>(`/players/${playerId}`);
        // return response.data;
        // --- End Real API call ---

        return mockPlayerProfile;
    },

    /**
     * Update player profile
     */
    updateProfile: async (playerId: number, data: UpdatePlayerProfileRequest): Promise<PlayerProfile> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.put<PlayerProfile>(`/players/${playerId}`, data);
        // return response.data;
        // --- End Real API call ---

        return {
            ...mockPlayerProfile,
            playerId,
            ...data,
            preferredFoot: data.preferredFoot as typeof mockPlayerProfile.preferredFoot ?? mockPlayerProfile.preferredFoot,
            updatedAt: new Date().toISOString(),
        };
    },

    /**
     * Search players
     */
    searchPlayers: async (params: PlayerSearchParams): Promise<PaginatedResponse<PlayerProfile>> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<PaginatedResponse<PlayerProfile>>('/players/search', { params });
        // return response.data;
        // --- End Real API call ---

        const page = params.page || 1;
        const limit = params.limit || 10;

        let filteredPlayers = [...mockPlayerProfiles];

        if (params.position) {
            filteredPlayers = filteredPlayers.filter(p => p.position === params.position);
        }
        if (params.minSkillLevel) {
            filteredPlayers = filteredPlayers.filter(p => (p.skillLevel || 0) >= params.minSkillLevel!);
        }
        if (params.maxSkillLevel) {
            filteredPlayers = filteredPlayers.filter(p => (p.skillLevel || 0) <= params.maxSkillLevel!);
        }

        return {
            data: filteredPlayers,
            total: filteredPlayers.length,
            page,
            limit,
            totalPages: Math.ceil(filteredPlayers.length / limit),
        };
    },

    /**
     * Get current user's player profile
     */
    getMyProfile: async (): Promise<PlayerProfile> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<PlayerProfile>('/players/me');
        // return response.data;
        // --- End Real API call ---

        return mockPlayerProfile;
    },
};

export default playerService;
