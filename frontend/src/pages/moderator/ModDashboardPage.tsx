import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, MapPin, Flag, Clock } from 'lucide-react';
import { PageContainer, PageHeader, ContentCard } from '../../components/common';
import { useModerationStats } from '../../api/hooks/useModeration';

const ModDashboardPage: React.FC = () => {
    const { data: statsData } = useModerationStats();

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
                <div className="text-center py-12 text-slate-500">
                    <Clock className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                    <p>No recent moderation activity</p>
                    <p className="text-sm text-slate-400 mt-1">
                        Your moderation actions will appear here.
                    </p>
                </div>
            </ContentCard>
        </PageContainer>
    );
};

export default ModDashboardPage;
