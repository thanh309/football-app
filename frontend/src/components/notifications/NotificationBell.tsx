import { Bell } from 'lucide-react';
import { useState } from 'react';
import { useUnreadNotificationCount } from '../../api/hooks/useNotification';
import NotificationCenter from './NotificationCenter';

interface NotificationBellProps {
    className?: string;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ className = '' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { data: unreadCount } = useUnreadNotificationCount();

    return (
        <div className={`relative ${className}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
                <Bell className="w-5 h-5 text-gray-600" />
                {unreadCount && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 z-50">
                        <NotificationCenter onClose={() => setIsOpen(false)} />
                    </div>
                </>
            )}
        </div>
    );
};

export default NotificationBell;
