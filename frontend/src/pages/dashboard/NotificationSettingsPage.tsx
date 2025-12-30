import React from 'react';
import { NotificationSettingsForm } from '../../components/notifications';

const NotificationSettingsPage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Notification Settings</h1>
                <p className="text-gray-600 mt-1">Manage how you receive notifications.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
                <NotificationSettingsForm />
            </div>
        </div>
    );
};

export default NotificationSettingsPage;
