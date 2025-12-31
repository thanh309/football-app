import { useState } from 'react';
import { History, Filter } from 'lucide-react';
import { LoadingSpinner, EmptyState } from '../common';
import { FormSelect } from '../forms';
import { useModerationHistory } from '../../api/hooks/useModeration';
import type { ModerationLog, ModerationAction } from '../../types';

const actionOptions = [
    { value: '', label: 'All Actions' },
    { value: 'Warning', label: 'Warning' },
    { value: 'Suspend', label: 'Suspend' },
    { value: 'Ban', label: 'Ban' },
    { value: 'Reactivate', label: 'Reactivate' },
    { value: 'ContentRemoval', label: 'Content Removal' },
];

const getActionColor = (action: string) => {
    if (action === 'Reactivate') return 'bg-green-100 text-green-700';
    if (action === 'Ban') return 'bg-red-100 text-red-700';
    if (action === 'Suspend') return 'bg-amber-100 text-amber-700';
    return 'bg-gray-100 text-gray-700';
};

const ModerationHistoryView: React.FC = () => {
    const [actionFilter, setActionFilter] = useState<ModerationAction | ''>('');
    const { data: historyResponse, isLoading, error } = useModerationHistory(
        actionFilter ? { action: actionFilter } : undefined
    );

    const history = historyResponse?.data || [];

    if (isLoading) {
        return <LoadingSpinner text="Loading moderation history..." />;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">Failed to load history</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <History className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Moderation History</h2>
                        <p className="text-sm text-gray-500">Review all moderation actions</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <div className="w-40">
                        <FormSelect
                            label=""
                            value={actionFilter}
                            onChange={(e) => setActionFilter(e.target.value as ModerationAction | '')}
                            options={actionOptions}
                        />
                    </div>
                </div>
            </div>

            {history.length === 0 ? (
                <EmptyState
                    title="No History"
                    description={actionFilter ? 'No actions match this filter' : 'No moderation actions yet'}
                />
            ) : (
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Action</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Target</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Reason</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Mod</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {history.map((item: ModerationLog) => (
                                <tr key={item.logId} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <span className={`text-xs px-2 py-1 rounded-full ${getActionColor(item.action)}`}>
                                            {item.action}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-900">User #{item.targetUserId}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{item.reason || '-'}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">#{item.moderatorId}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ModerationHistoryView;
