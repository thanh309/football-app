import { useState, useEffect } from 'react';
import { Bell, Save } from 'lucide-react';
import { LoadingSpinner, Button } from '../common';
import {
    useNotificationPreferences,
    useUpdateNotificationPreferences,
} from '../../api/hooks/useNotification';
import toast from 'react-hot-toast';

interface NotificationSettingsFormProps {
    onSuccess?: () => void;
}

interface SettingsState {
    emailNotifications: boolean;
    pushNotifications: boolean;
    matchReminders: boolean;
    teamUpdates: boolean;
    bookingUpdates: boolean;
    communityUpdates: boolean;
}

const NotificationSettingsForm: React.FC<NotificationSettingsFormProps> = ({ onSuccess }) => {
    const { data: preferences, isLoading } = useNotificationPreferences();
    const updateMutation = useUpdateNotificationPreferences();
    const [settings, setSettings] = useState<SettingsState>({
        emailNotifications: true,
        pushNotifications: true,
        matchReminders: true,
        teamUpdates: true,
        bookingUpdates: true,
        communityUpdates: true,
    });
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        if (preferences && !initialized) {
            setSettings({
                emailNotifications: preferences.emailNotifications,
                pushNotifications: preferences.pushNotifications,
                matchReminders: preferences.matchReminders,
                teamUpdates: preferences.teamUpdates,
                bookingUpdates: preferences.bookingUpdates,
                communityUpdates: preferences.communityUpdates,
            });
            setInitialized(true);
        }
    }, [preferences, initialized]);

    const toggleSetting = (field: keyof SettingsState) => {
        setSettings(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSave = async () => {
        try {
            await updateMutation.mutateAsync(settings);
            toast.success('Notification preferences saved');
            onSuccess?.();
        } catch {
            toast.error('Failed to save preferences');
        }
    };

    if (isLoading) {
        return <LoadingSpinner text="Loading preferences..." />;
    }

    const settingItems = [
        { key: 'emailNotifications' as const, label: 'Email Notifications', description: 'Receive notifications via email' },
        { key: 'pushNotifications' as const, label: 'Push Notifications', description: 'Receive push notifications in browser' },
        { key: 'matchReminders' as const, label: 'Match Reminders', description: 'Get reminders before upcoming matches' },
        { key: 'teamUpdates' as const, label: 'Team Updates', description: 'Stay informed about team activities' },
        { key: 'bookingUpdates' as const, label: 'Booking Updates', description: 'Get notified about booking status changes' },
        { key: 'communityUpdates' as const, label: 'Community Updates', description: 'Comments and reactions on your posts' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Bell className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Notification Preferences</h2>
                    <p className="text-sm text-gray-500">Choose how you want to receive notifications</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
                {settingItems.map(item => (
                    <div key={item.key} className="p-4 flex items-center justify-between">
                        <div>
                            <div className="text-sm font-medium text-gray-900">{item.label}</div>
                            <div className="text-xs text-gray-500">{item.description}</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings[item.key]}
                                onChange={() => toggleSetting(item.key)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                    </div>
                ))}
            </div>

            <div className="flex justify-end">
                <Button
                    onClick={handleSave}
                    isLoading={updateMutation.isPending}
                    leftIcon={<Save className="w-4 h-4" />}
                >
                    Save Preferences
                </Button>
            </div>
        </div>
    );
};

export default NotificationSettingsForm;
