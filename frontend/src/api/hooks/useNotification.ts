import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationService, type UpdatePreferencesRequest } from '../services/notificationService';

export const notificationKeys = {
    all: ['notifications'] as const,
    list: (params?: object) => [...notificationKeys.all, 'list', params] as const,
    unreadCount: () => [...notificationKeys.all, 'unread'] as const,
    preferences: () => [...notificationKeys.all, 'preferences'] as const,
};

export function useNotifications(params?: { unreadOnly?: boolean; limit?: number }) {
    return useQuery({
        queryKey: notificationKeys.list(params),
        queryFn: () => notificationService.getNotifications(params),
    });
}

export function useUnreadNotificationCount() {
    return useQuery({
        queryKey: notificationKeys.unreadCount(),
        queryFn: () => notificationService.getUnreadCount(),
        refetchInterval: 30000, // Refetch every 30 seconds
    });
}

export function useNotificationPreferences() {
    return useQuery({
        queryKey: notificationKeys.preferences(),
        queryFn: () => notificationService.getPreferences(),
    });
}

export function useMarkAsRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (notificationId: number) => notificationService.markAsRead(notificationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notificationKeys.all });
        },
    });
}

export function useMarkAllAsRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => notificationService.markAllAsRead(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notificationKeys.all });
        },
    });
}

export function useUpdateNotificationPreferences() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (preferences: UpdatePreferencesRequest[]) =>
            notificationService.updatePreferences(preferences),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notificationKeys.preferences() });
        },
    });
}
