import { Mail, Calendar, Shield, Clock } from 'lucide-react';
import { LoadingSpinner } from '../common';
import { useUserDetails, useUserModerationHistory } from '../../api/hooks/useModeration';
import SuspendReactivateButtons from './SuspendReactivateButtons';
import type { ModerationLog } from '../../types';

interface UserDetailsViewProps {
    userId: number;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Active':
            return 'bg-green-100 text-green-700';
        case 'Suspended':
            return 'bg-amber-100 text-amber-700';
        case 'Banned':
            return 'bg-red-100 text-red-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

const UserDetailsView: React.FC<UserDetailsViewProps> = ({ userId }) => {
    const { data: user, isLoading, error } = useUserDetails(userId);
    const { data: history } = useUserModerationHistory(userId);

    if (isLoading) {
        return <LoadingSpinner text="Loading user details..." />;
    }

    if (error || !user) {
        return <div className="text-center py-8 text-red-500">Failed to load user details</div>;
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center text-2xl font-bold text-indigo-600">
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
                                <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(user.status)}`}>
                                    {user.status}
                                </span>
                            </div>
                            <p className="text-gray-500 flex items-center gap-1">
                                <Mail className="w-4 h-4" /> {user.email}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-500">User ID</p>
                            <p className="font-medium text-gray-900">{user.userId}</p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                <Shield className="w-4 h-4" /> Roles
                            </p>
                            <p className="font-medium text-gray-900">{user.roles.join(', ')}</p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                <Calendar className="w-4 h-4" /> Joined
                            </p>
                            <p className="font-medium text-gray-900">
                                {new Date(user.createdAt).toLocaleDateString()}
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                <Clock className="w-4 h-4" /> Verified
                            </p>
                            <p className="font-medium text-gray-900">
                                {user.isVerified ? 'Yes' : 'No'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <SuspendReactivateButtons userId={userId} currentStatus={user.status} />
                </div>
            </div>

            {history && history.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900">Moderation History</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {history.map((item: ModerationLog) => (
                            <div key={item.logId} className="p-4">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium text-gray-900">{item.action}</span>
                                    <span className="text-sm text-gray-500">
                                        {new Date(item.createdAt).toLocaleString()}
                                    </span>
                                </div>
                                {item.reason && (
                                    <p className="text-sm text-gray-600">{item.reason}</p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">By Moderator #{item.moderatorId}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDetailsView;
