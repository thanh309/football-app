import React from 'react';
import { Link } from 'react-router-dom';
import { NotificationSettingsForm } from '../../components/notifications';

const NotificationSettingsPage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <Link
                to="/settings/account"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Settings
            </Link>

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

