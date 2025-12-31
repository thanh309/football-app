// @ts-ignore - Keeping api import for future use when switching back to real API
import api from '../axios';
import type { UserAccount } from '../../types';
import { UserRole, AccountStatus } from '../../types';

// Types for API requests/responses
export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    roles: string[];
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: UserAccount;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

// --- Mock Data ---
const mockUser: UserAccount = {
    userId: 1,
    username: 'mockuser',
    email: 'mockuser@example.com',
    passwordHash: 'hashed_password',
    roles: [UserRole.PLAYER, UserRole.TEAM_LEADER],
    status: AccountStatus.ACTIVE,
    isVerified: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-15T12:00:00Z',
    contactInfo: '+84 123 456 789',
    location: 'Ho Chi Minh City, Vietnam',
    latitude: 10.8231,
    longitude: 106.6297,
};

const mockAuthResponse: AuthResponse = {
    accessToken: 'mock-jwt-token',
    refreshToken: 'mock-refresh-token',
    user: mockUser,
};

// Auth service functions
export const authService = {
    /**
     * Login with username and password
     */
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.post<AuthResponse>('/auth/login', data);
        // return response.data;
        // --- End Real API call ---

        // Store token in localStorage for mock mode
        localStorage.setItem('token', mockAuthResponse.accessToken);
        localStorage.setItem('refreshToken', mockAuthResponse.refreshToken);

        // Return mock response with user data based on input
        return {
            ...mockAuthResponse,
            user: {
                ...mockUser,
                username: data.username,
            },
        };
    },

    /**
     * Register a new user account
     */
    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.post<AuthResponse>('/auth/register', data);
        // return response.data;
        // --- End Real API call ---

        const newUser: UserAccount = {
            ...mockUser,
            userId: Math.floor(Math.random() * 1000) + 100,
            username: data.username,
            email: data.email,
            roles: data.roles as UserRole[],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        // Store token in localStorage for mock mode
        localStorage.setItem('token', 'mock-jwt-token-new-user');
        localStorage.setItem('refreshToken', 'mock-refresh-token-new-user');

        return {
            accessToken: 'mock-jwt-token-new-user',
            refreshToken: 'mock-refresh-token-new-user',
            user: newUser,
        };
    },

    /**
     * Logout current user
     */
    logout: async (): Promise<void> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // await api.post('/auth/logout');
        // --- End Real API call ---

        // Clear localStorage for mock mode
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
    },

    /**
     * Change user password
     */
    changePassword: async (_data: ChangePasswordRequest): Promise<void> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // await api.put('/auth/password', data);
        // --- End Real API call ---

        // Mock: Password changed successfully (no action needed)
        console.log('Mock: Password changed successfully');
    },

    /**
     * Get current authenticated user
     */
    getCurrentUser: async (): Promise<UserAccount | null> => {
        await new Promise(r => setTimeout(r, 300)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<UserAccount>('/auth/me');
        // return response.data;
        // --- End Real API call ---

        // Check if token exists in localStorage
        const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
        if (!token) {
            return null;
        }

        return mockUser;
    },

    /**
     * Refresh access token
     */
    refreshToken: async (_refreshToken: string): Promise<{ accessToken: string }> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.post<{ accessToken: string }>('/auth/refresh', {
        //     refreshToken,
        // });
        // return response.data;
        // --- End Real API call ---

        const newAccessToken = 'new-mock-token-' + Date.now();
        localStorage.setItem('token', newAccessToken);

        return { accessToken: newAccessToken };
    },
};

export default authService;
