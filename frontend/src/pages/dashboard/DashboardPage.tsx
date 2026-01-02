import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Bell, Search, MapPin, MessageCircle, User } from 'lucide-react';
import { PageContainer, PageHeader, ContentCard } from '../../components/common';

const DashboardPage: React.FC = () => {
    const stats = {
        upcomingMatches: 3,
        myTeams: 2,
        notifications: 5,
    };

    const quickActions = [
        { to: '/search/teams', icon: Search, label: 'Find Teams' },
        { to: '/search/fields', icon: MapPin, label: 'Find Fields' },
        { to: '/community', icon: MessageCircle, label: 'Community' },
        { to: '/profile', icon: User, label: 'My Profile' },
    ];

    return (
        <PageContainer maxWidth="xl">
            <PageHeader
                title="Welcome back!"
                subtitle="Here's what's happening with your football activities."
            />

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <Link to="/schedule" className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500">Upcoming Matches</p>
                            <p className="text-3xl font-bold text-primary-600">{stats.upcomingMatches}</p>
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
                            <p className="text-3xl font-bold text-primary-600">{stats.myTeams}</p>
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
                            <p className="text-3xl font-bold text-primary-600">{stats.notifications}</p>
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

            {/* Recent Activity */}
            <ContentCard title="Recent Activity">
                <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Calendar className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                            <p className="font-medium text-slate-900">New match scheduled</p>
                            <p className="text-sm text-slate-500">FC Thunder vs. City United - Tomorrow at 7:00 PM</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Users className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                            <p className="font-medium text-slate-900">New team member</p>
                            <p className="text-sm text-slate-500">John Doe joined FC Thunder</p>
                        </div>
                    </div>
                </div>
            </ContentCard>
        </PageContainer>
    );
};

export default DashboardPage;
