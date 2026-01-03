import api from '../axios';
import type { Notification, NotificationPreference } from '../../types';

export interface UpdatePreferencesRequest {
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    matchReminders?: boolean;
    teamUpdates?: boolean;
    bookingUpdates?: boolean;
    communityUpdates?: boolean;
}

// Notification service functions - Real API calls
export const notificationService = {
    /**
     * Get user notifications
     */
    getNotifications: async (params?: {
        unreadOnly?: boolean;
        limit?: number;
    }): Promise<Notification[]> => {
        const response = await api.get<Notification[]>('/notifications', { params });
        return response.data;
    },

    /**
     * Get unread count
     */
    getUnreadCount: async (): Promise<number> => {
        const response = await api.get<{ count: number }>('/notifications/unread-count');
        return response.data.count;
    },

    /**
     * Mark notification as read
     */
    markAsRead: async (notificationId: number): Promise<void> => {
        await api.put(`/notifications/${notificationId}/read`);
    },

    /**
     * Mark all notifications as read
     */
    markAllAsRead: async (): Promise<void> => {
        await api.put('/notifications/mark-all-read');
    },

    /**
     * Get notification preferences (single preference object)
     */
    getPreferences: async (): Promise<NotificationPreference> => {
        const response = await api.get<NotificationPreference>('/notifications/preferences');
        return response.data;
    },

    /**
     * Update notification preferences
     */
    updatePreferences: async (preferences: UpdatePreferencesRequest): Promise<NotificationPreference> => {
        const response = await api.put<NotificationPreference>('/notifications/preferences', preferences);
        return response.data;
    },
};

export default notificationService;
