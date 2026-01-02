// @ts-ignore - Keeping api import for future use when switching back to real API
import api from '../axios';
import type { Notification, NotificationPreference, NotificationType } from '../../types';
import { NotificationType as NotificationTypeEnum } from '../../types';

export interface UpdatePreferencesRequest {
    notificationType: NotificationType;
    isEnabled: boolean;
    pushEnabled?: boolean;
    emailEnabled?: boolean;
}

// --- Mock Data ---
// Use let so we can mutate this in mock mode
let mockNotifications: Notification[] = [
    {
        notificationId: 1,
        userId: 1,
        type: NotificationTypeEnum.MATCH_INVITE,
        title: 'New Match Invitation',
        message: 'Thunder FC has invited your team to a friendly match on Jan 20th',
        relatedEntityId: 5,
        relatedEntityType: 'MatchInvitation',
        isRead: false,
        createdAt: '2025-01-10T10:00:00Z',
    },
    {
        notificationId: 2,
        userId: 1,
        type: NotificationTypeEnum.TEAM_VERIFIED,
        title: 'Team Verified!',
        message: 'Congratulations! Your team "FC Lightning" has been verified.',
        relatedEntityId: 1,
        relatedEntityType: 'Team',
        isRead: false,
        createdAt: '2025-01-09T14:30:00Z',
    },
    {
        notificationId: 3,
        userId: 1,
        type: NotificationTypeEnum.JOIN_REQUEST,
        title: 'New Join Request',
        message: 'A new player wants to join your team. Review their request.',
        relatedEntityId: 10,
        relatedEntityType: 'JoinRequest',
        isRead: true,
        createdAt: '2025-01-08T09:00:00Z',
    },
    {
        notificationId: 4,
        userId: 1,
        type: NotificationTypeEnum.BOOKING_UPDATE,
        title: 'Booking Confirmed',
        message: 'Your field booking for Jan 15th at Green Valley Stadium is confirmed.',
        relatedEntityId: 3,
        relatedEntityType: 'Booking',
        isRead: true,
        createdAt: '2025-01-06T16:00:00Z',
    },
    {
        notificationId: 5,
        userId: 1,
        type: NotificationTypeEnum.COMMENTS,
        title: 'New Comment',
        message: 'Someone commented on your post about the championship match.',
        relatedEntityId: 1,
        relatedEntityType: 'Post',
        isRead: false,
        createdAt: '2025-01-10T19:15:00Z',
    },
];

const mockNotificationPreferences: NotificationPreference[] = [
    {
        preferenceId: 1,
        userId: 1,
        notificationType: NotificationTypeEnum.MATCH_INVITE,
        isEnabled: true,
        pushEnabled: true,
        emailEnabled: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-12-01T10:00:00Z',
    },
    {
        preferenceId: 2,
        userId: 1,
        notificationType: NotificationTypeEnum.TEAM_VERIFIED,
        isEnabled: true,
        pushEnabled: true,
        emailEnabled: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-12-01T10:00:00Z',
    },
    {
        preferenceId: 3,
        userId: 1,
        notificationType: NotificationTypeEnum.JOIN_REQUEST,
        isEnabled: true,
        pushEnabled: true,
        emailEnabled: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-12-01T10:00:00Z',
    },
    {
        preferenceId: 4,
        userId: 1,
        notificationType: NotificationTypeEnum.BOOKING_UPDATE,
        isEnabled: true,
        pushEnabled: false,
        emailEnabled: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-12-01T10:00:00Z',
    },
    {
        preferenceId: 5,
        userId: 1,
        notificationType: NotificationTypeEnum.PROMOTIONS,
        isEnabled: false,
        pushEnabled: false,
        emailEnabled: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-12-01T10:00:00Z',
    },
];

export const notificationService = {
    /**
     * Get user notifications
     */
    getNotifications: async (params?: {
        unreadOnly?: boolean;
        limit?: number;
    }): Promise<Notification[]> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<Notification[]>('/notifications', { params });
        // return response.data;
        // --- End Real API call ---

        let result = [...mockNotifications];

        if (params?.unreadOnly) {
            result = result.filter(n => !n.isRead);
        }
        if (params?.limit) {
            result = result.slice(0, params.limit);
        }

        return result;
    },

    /**
     * Get unread count
     */
    getUnreadCount: async (): Promise<number> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<{ count: number }>('/notifications/unread-count');
        // return response.data.count;
        // --- End Real API call ---

        return mockNotifications.filter(n => !n.isRead).length;
    },

    /**
     * Mark notification as read
     */
    markAsRead: async (notificationId: number): Promise<void> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // await api.patch(`/notifications/${notificationId}/read`);
        // --- End Real API call ---

        // Update mock data so UI reflects the change
        mockNotifications = mockNotifications.map(n =>
            n.notificationId === notificationId ? { ...n, isRead: true } : n
        );
    },

    /**
     * Mark all notifications as read
     */
    markAllAsRead: async (): Promise<void> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // await api.patch('/notifications/read-all');
        // --- End Real API call ---

        // Update mock data so UI reflects the change
        mockNotifications = mockNotifications.map(n => ({ ...n, isRead: true }));
    },

    /**
     * Get notification preferences
     */
    getPreferences: async (): Promise<NotificationPreference[]> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<NotificationPreference[]>('/notification-preferences');
        // return response.data;
        // --- End Real API call ---

        return mockNotificationPreferences;
    },

    /**
     * Update notification preferences
     */
    updatePreferences: async (preferences: UpdatePreferencesRequest[]): Promise<NotificationPreference[]> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.put<NotificationPreference[]>('/notification-preferences', {
        //     preferences,
        // });
        // return response.data;
        // --- End Real API call ---

        return preferences.map((pref, index) => ({
            preferenceId: index + 1,
            userId: 1,
            notificationType: pref.notificationType,
            isEnabled: pref.isEnabled,
            pushEnabled: pref.pushEnabled ?? true,
            emailEnabled: pref.emailEnabled ?? false,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: new Date().toISOString(),
        }));
    },
};

export default notificationService;
