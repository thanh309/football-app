import { Bell, Check, CheckCheck, X } from 'lucide-react';
import { useState } from 'react';
import { LoadingSpinner, EmptyState, Button } from '../common';
import {
    useNotifications,
    useMarkAsRead,
    useMarkAllAsRead,
    useUnreadNotificationCount,
} from '../../api/hooks/useNotification';
import toast from 'react-hot-toast';
import type { Notification } from '../../types';

interface NotificationCenterProps {
    onClose?: () => void;
}

const getNotificationIcon = (type: string) => {
    switch (type) {
        case 'TeamInvite':
        case 'TeamApproved':
            return '👥';
        case 'MatchScheduled':
        case 'MatchCancelled':
            return '⚽';
        case 'BookingApproved':
        case 'BookingRejected':
            return '📅';
        case 'Comment':
        case 'Reaction':
            return '💬';
        default:
            return '🔔';
    }
};

const NotificationCenter: React.FC<NotificationCenterProps> = ({ onClose }) => {
    const [filter, setFilter] = useState<'all' | 'unread'>('all');
    const { data: notifications, isLoading } = useNotifications({
        unreadOnly: filter === 'unread',
        limit: 50,
    });
    const { data: unreadCount } = useUnreadNotificationCount();
    const markAsRead = useMarkAsRead();
    const markAllAsRead = useMarkAllAsRead();

    const handleMarkAsRead = async (notificationId: number) => {
        try {
            await markAsRead.mutateAsync(notificationId);
        } catch {
            toast.error('Failed to mark as read');
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead.mutateAsync();
            toast.success('All notifications marked as read');
        } catch {
            toast.error('Failed to mark all as read');
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden max-h-[80vh] flex flex-col w-full max-w-md">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-emerald-600" />
                    <h2 className="font-semibold text-gray-900">Notifications</h2>
                    {typeof unreadCount === 'number' && unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                            {unreadCount}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {typeof unreadCount === 'number' && unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleMarkAllAsRead}
                            leftIcon={<CheckCheck className="w-4 h-4" />}
                        >
                            Mark all read
                        </Button>
                    )}
                    {onClose && (
                        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    )}
                </div>
            </div>

            {/* Filter */}
            <div className="flex border-b border-gray-100">
                <button
                    onClick={() => setFilter('all')}
                    className={`flex-1 py-2 text-sm font-medium transition-colors ${filter === 'all'
                        ? 'text-emerald-600 border-b-2 border-emerald-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    All
                </button>
                <button
                    onClick={() => setFilter('unread')}
                    className={`flex-1 py-2 text-sm font-medium transition-colors ${filter === 'unread'
                        ? 'text-emerald-600 border-b-2 border-emerald-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Unread
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                    <LoadingSpinner text="Loading notifications..." size="sm" />
                ) : !notifications || notifications.length === 0 ? (
                    <EmptyState
                        title="No Notifications"
                        description={filter === 'unread' ? 'No unread notifications' : 'You have no notifications yet'}
                    />
                ) : (
                    <div className="divide-y divide-gray-100">
                        {notifications.map((notification: Notification) => (
                            <div
                                key={notification.notificationId}
                                className={`p-4 hover:bg-gray-50 transition-colors ${!notification.isRead
                                    ? 'bg-emerald-50 border-l-4 border-emerald-500'
                                    : 'bg-white opacity-75'
                                    }`}
                            >
                                <div className="flex gap-3">
                                    <div className="text-2xl">{getNotificationIcon(notification.type)}</div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-medium ${!notification.isRead
                                            ? 'text-gray-900'
                                            : 'text-gray-500'
                                            }`}>
                                            {notification.title}
                                        </p>
                                        <p className={`text-sm ${!notification.isRead
                                            ? 'text-gray-700'
                                            : 'text-gray-400'
                                            }`}>
                                            {notification.message}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {new Date(notification.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                    {!notification.isRead ? (
                                        <button
                                            onClick={() => handleMarkAsRead(notification.notificationId)}
                                            className="p-1 text-emerald-600 hover:bg-emerald-100 rounded transition-colors"
                                            title="Mark as read"
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>
                                    ) : (
                                        <span className="p-1 text-gray-400" title="Read">
                                            <Check className="w-4 h-4" />
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationCenter;
