import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService, type LoginRequest, type RegisterRequest, type ChangePasswordRequest } from '../services/authService';
import type { UserAccount } from '../../types';

// Query keys
export const authKeys = {
    all: ['auth'] as const,
    user: () => [...authKeys.all, 'user'] as const,
};

/**
 * Hook to get current authenticated user
 */
export function useCurrentUser() {
    return useQuery({
        queryKey: authKeys.user(),
        queryFn: authService.getCurrentUser,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: false,
    });
}

/**
 * Hook to login user
 */
export function useLogin() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: LoginRequest) => authService.login(data),
        onSuccess: (response) => {
            // Store tokens
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);
            // Update user in cache
            queryClient.setQueryData<UserAccount>(authKeys.user(), response.user);
        },
    });
}

/**
 * Hook to register new user
 */
export function useRegister() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: RegisterRequest) => authService.register(data),
        onSuccess: (response) => {
            // Store tokens
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);
            // Update user in cache
            queryClient.setQueryData<UserAccount>(authKeys.user(), response.user);
        },
    });
}

/**
 * Hook to logout user
 */
export function useLogout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => authService.logout(),
        onSuccess: () => {
            // Clear tokens
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            // Clear user from cache
            queryClient.setQueryData(authKeys.user(), null);
            queryClient.clear();
        },
        onError: () => {
            // Even if logout fails, clear local state
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            queryClient.clear();
        },
    });
}

/**
 * Hook to change password
 */
export function useChangePassword() {
    return useMutation({
        mutationFn: (data: ChangePasswordRequest) => authService.changePassword(data),
    });
}

/**
 * Hook to check if user is authenticated
 */
export function useIsAuthenticated(): boolean {
    const { data: user, isLoading } = useCurrentUser();
    return !isLoading && !!user;
}
