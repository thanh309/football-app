import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, MapPin, Flag, Clock } from 'lucide-react';
import { PageContainer, PageHeader, ContentCard } from '../../components/common';
import { useModerationStats, useModerationHistory } from '../../api/hooks/useModeration';

const ModDashboardPage: React.FC = () => {
    const { data: statsData } = useModerationStats();
    const { data: historyData } = useModerationHistory({ limit: 5 });

    const stats = {
        pendingTeams: statsData?.pendingTeams ?? 0,
        pendingFields: statsData?.pendingFields ?? 0,
        reportedContent: statsData?.pendingReports ?? 0,
    };

    const pendingItems = [
        { label: 'Pending Teams', value: stats.pendingTeams, icon: Users, color: 'bg-blue-500', href: '/mod/teams' },
        { label: 'Pending Fields', value: stats.pendingFields, icon: MapPin, color: 'bg-purple-500', href: '/mod/fields' },
        { label: 'Reported Content', value: stats.reportedContent, icon: Flag, color: 'bg-red-500', href: '/mod/reports' },
    ];

    const quickActions = [
        { label: 'Review Teams', icon: Users, href: '/mod/teams', description: 'Verify new team registrations' },
        { label: 'Review Fields', icon: MapPin, href: '/mod/fields', description: 'Verify new field registrations' },
        { label: 'Handle Reports', icon: Flag, href: '/mod/reports', description: 'Review reported content' },
        { label: 'Manage Users', icon: Shield, href: '/mod/users', description: 'View and manage user accounts' },
    ];

    const recentActivity = historyData?.data ?? [];

    const getActionBadgeColor = (action: string) => {
        switch (action) {
            case 'BAN': return 'bg-red-100 text-red-700';
            case 'SUSPEND': return 'bg-orange-100 text-orange-700';
            case 'WARNING': return 'bg-yellow-100 text-yellow-700';
            case 'ACTIVATE': return 'bg-green-100 text-green-700';
            case 'ROLE_CHANGE': return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <PageContainer maxWidth="lg">
            <PageHeader
                title="Moderator Dashboard"
                subtitle="Overview of pending reviews and moderation tasks."
            />

            {/* Pending Items Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {pendingItems.map((item) => (
                    <Link
                        key={item.label}
                        to={item.href}
                        className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`${item.color} p-3 rounded-lg`}>
                                <item.icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">{item.label}</p>
                                <p className="text-3xl font-bold text-slate-900">{item.value}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <ContentCard title="Quick Actions" className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quickActions.map((action) => (
                        <Link
                            key={action.label}
                            to={action.href}
                            className="flex items-center gap-4 p-4 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors"
                        >
                            <div className="bg-primary-100 p-3 rounded-lg">
                                <action.icon className="w-5 h-5 text-primary-600" />
                            </div>
                            <div>
                                <h3 className="font-medium text-slate-900">{action.label}</h3>
                                <p className="text-sm text-slate-500">{action.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </ContentCard>

            {/* Recent Activity */}
            <ContentCard
                title="Recent Activity"
                action={
                    <Link to="/mod/history" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                        View All →
                    </Link>
                }
            >
                {recentActivity.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                        {recentActivity.map((log: any) => (
                            <div key={log.logId} className="py-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getActionBadgeColor(log.action)}`}>
                                        {log.action}
                                    </span>
                                    <span className="text-sm text-slate-700">
                                        User #{log.targetUserId}
                                    </span>
                                    {log.reason && (
                                        <span className="text-sm text-slate-500 truncate max-w-xs">
                                            - {log.reason}
                                        </span>
                                    )}
                                </div>
                                <span className="text-xs text-slate-400">
                                    {new Date(log.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-slate-500">
                        <Clock className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                        <p>No recent moderation activity</p>
                        <p className="text-sm text-slate-400 mt-1">
                            Your moderation actions will appear here.
                        </p>
                    </div>
                )}
            </ContentCard>
        </PageContainer>
    );
};

export default ModDashboardPage;
