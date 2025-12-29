import api from '../axios';
import type { UserAccount } from '../../types';

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

// Auth service functions
export const authService = {
    /**
     * Login with username and password
     */
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/login', data);
        return response.data;
    },

    /**
     * Register a new user account
     */
    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/register', data);
        return response.data;
    },

    /**
     * Logout current user
     */
    logout: async (): Promise<void> => {
        await api.post('/auth/logout');
    },

    /**
     * Change user password
     */
    changePassword: async (data: ChangePasswordRequest): Promise<void> => {
        await api.put('/auth/password', data);
    },

    /**
     * Get current authenticated user
     */
    getCurrentUser: async (): Promise<UserAccount> => {
        const response = await api.get<UserAccount>('/auth/me');
        return response.data;
    },

    /**
     * Refresh access token
     */
    refreshToken: async (refreshToken: string): Promise<{ accessToken: string }> => {
        const response = await api.post<{ accessToken: string }>('/auth/refresh', {
            refreshToken,
        });
        return response.data;
    },
};

export default authService;
