import { Check } from 'lucide-react';
import { useMarkAsRead } from '../../api/hooks/useNotification';
import type { Notification } from '../../types';
import toast from 'react-hot-toast';

interface NotificationItemProps {
    notification: Notification;
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

const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
    const markAsRead = useMarkAsRead();

    const handleMarkAsRead = async () => {
        try {
            await markAsRead.mutateAsync(notification.notificationId);
        } catch {
            toast.error('Failed to mark as read');
        }
    };

    return (
        <div
            className={`p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 ${!notification.isRead ? 'bg-emerald-50/50' : ''
                }`}
        >
            <div className="flex gap-3">
                <div className="text-2xl flex-shrink-0">{getNotificationIcon(notification.type)}</div>
                <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${!notification.isRead ? '' : 'text-gray-700'} text-gray-900`}>
                        {notification.title}
                    </p>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                    </p>
                </div>
                {!notification.isRead && (
                    <button
                        onClick={handleMarkAsRead}
                        disabled={markAsRead.isPending}
                        className="p-1.5 text-emerald-600 hover:bg-emerald-100 rounded transition-colors flex-shrink-0"
                        title="Mark as read"
                    >
                        <Check className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default NotificationItem;
