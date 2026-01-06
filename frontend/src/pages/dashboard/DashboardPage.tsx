import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Bell, Search, MapPin, MessageCircle, Settings } from 'lucide-react';
import { PageContainer, PageHeader, ContentCard, LoadingSpinner } from '../../components/common';
import { useAuth } from '../../contexts';
import { usePlayerTeams } from '../../api/hooks/useTeam';
import { usePlayerSchedule } from '../../api/hooks/useMatch';
import { useUnreadNotificationCount } from '../../api/hooks/useNotification';

const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const { data: teams, isLoading: teamsLoading } = usePlayerTeams(user?.userId || 0);
    const { data: schedule, isLoading: scheduleLoading } = usePlayerSchedule(user?.userId || 0);
    const { data: unreadCount, isLoading: notificationsLoading } = useUnreadNotificationCount();

    const quickActions = [
        { to: '/search/teams', icon: Search, label: 'Find Teams' },
        { to: '/search/fields', icon: MapPin, label: 'Find Fields' },
        { to: '/community', icon: MessageCircle, label: 'Community' },
        { to: '/settings/account', icon: Settings, label: 'Settings' },
    ];

    const isLoading = teamsLoading || scheduleLoading || notificationsLoading;

    // Calculate upcoming matches from schedule
    const upcomingMatches = schedule?.filter(match => {
        const matchDate = new Date(match.matchDate);
        return matchDate >= new Date();
    }).length || 0;

    return (
        <PageContainer maxWidth="xl">
            <PageHeader
                title={`Welcome back${user?.username ? `, ${user.username}` : ''}!`}
                subtitle="Here's what's happening with your football activities."
            />

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <Link to="/schedule" className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500">Upcoming Matches</p>
                            {isLoading ? (
                                <LoadingSpinner size="sm" />
                            ) : (
                                <p className="text-3xl font-bold text-primary-600">{upcomingMatches}</p>
                            )}
                        </div>
                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-primary-600" />
                        </div>
                    </div>
                </Link>

                <Link to="/my-teams" className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500">My Teams</p>
                            {teamsLoading ? (
                                <LoadingSpinner size="sm" />
                            ) : (
                                <p className="text-3xl font-bold text-primary-600">{teams?.length || 0}</p>
                            )}
                        </div>
                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                            <Users className="w-6 h-6 text-primary-600" />
                        </div>
                    </div>
                </Link>

                <Link to="/notifications" className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500">Notifications</p>
                            {notificationsLoading ? (
                                <LoadingSpinner size="sm" />
                            ) : (
                                <p className="text-3xl font-bold text-primary-600">{unreadCount || 0}</p>
                            )}
                        </div>
                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                            <Bell className="w-6 h-6 text-primary-600" />
                        </div>
                    </div>
                </Link>
            </div>

            {/* Quick Actions */}
            <ContentCard title="Quick Actions" className="mb-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickActions.map((action) => (
                        <Link
                            key={action.to}
                            to={action.to}
                            className="flex flex-col items-center p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                        >
                            <action.icon className="w-8 h-8 text-primary-600 mb-2" />
                            <span className="text-sm font-medium text-slate-700">{action.label}</span>
                        </Link>
                    ))}
                </div>
        </ContentCard>
        </PageContainer>
    );
};

export default DashboardPage;
