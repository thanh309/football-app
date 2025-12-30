import { useState, useEffect } from 'react';
import { Bell, Save } from 'lucide-react';
import { LoadingSpinner, Button } from '../common';
import {
    useNotificationPreferences,
    useUpdateNotificationPreferences,
} from '../../api/hooks/useNotification';
import toast from 'react-hot-toast';
import type { NotificationPreference } from '../../types';

interface NotificationSettingsFormProps {
    onSuccess?: () => void;
}

const NotificationSettingsForm: React.FC<NotificationSettingsFormProps> = ({ onSuccess }) => {
    const { data: preferences, isLoading } = useNotificationPreferences();
    const updateMutation = useUpdateNotificationPreferences();
    const [settings, setSettings] = useState<NotificationPreference[]>([]);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        if (preferences && !initialized) {
            setSettings(preferences);
            setInitialized(true);
        }
    }, [preferences, initialized]);

    const toggleSetting = (notificationType: string, field: 'isEnabled' | 'emailEnabled' | 'pushEnabled') => {
        setSettings(prev => prev.map(p => {
            if (p.notificationType !== notificationType) return p;
            return { ...p, [field]: !p[field] };
        }));
    };

    const handleSave = async () => {
        try {
            await updateMutation.mutateAsync(
                settings.map(s => ({
                    notificationType: s.notificationType,
                    isEnabled: s.isEnabled,
                    pushEnabled: s.pushEnabled,
                    emailEnabled: s.emailEnabled,
                }))
            );
            toast.success('Notification preferences saved');
            onSuccess?.();
        } catch {
            toast.error('Failed to save preferences');
        }
    };

    if (isLoading) {
        return <LoadingSpinner text="Loading preferences..." />;
    }

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

            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 border-b text-sm font-medium text-gray-600">
                    <div>Notification Type</div>
                    <div className="text-center">Enabled</div>
                    <div className="text-center">Email</div>
                    <div className="text-center">Push</div>
                </div>

                {settings.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No notification types configured</div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {settings.map(pref => (
                            <div key={pref.preferenceId} className="grid grid-cols-4 gap-4 p-4 items-center">
                                <div className="text-sm text-gray-900">{pref.notificationType}</div>
                                <div className="flex justify-center">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={pref.isEnabled}
                                            onChange={() => toggleSetting(pref.notificationType, 'isEnabled')}
                                            className="sr-only peer"
                                        />
                                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                                    </label>
                                </div>
                                <div className="flex justify-center">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={pref.emailEnabled}
                                            onChange={() => toggleSetting(pref.notificationType, 'emailEnabled')}
                                            className="sr-only peer"
                                        />
                                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                                    </label>
                                </div>
                                <div className="flex justify-center">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={pref.pushEnabled}
                                            onChange={() => toggleSetting(pref.notificationType, 'pushEnabled')}
                                            className="sr-only peer"
                                        />
                                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
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
