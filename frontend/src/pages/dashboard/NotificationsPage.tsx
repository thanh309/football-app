import React from 'react';
import { NotificationCenter } from '../../components/notifications';

const NotificationsPage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Notifications</h1>
                <p className="text-gray-600 mt-1">Stay updated with your latest activities.</p>
            </div>

            <NotificationCenter />
        </div>
    );
};

export default NotificationsPage;
