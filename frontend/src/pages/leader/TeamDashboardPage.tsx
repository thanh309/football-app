import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { LoadingSpinner } from '../../components/common';
import { DeleteTeamButton } from '../../components/leader';
import { useTeam, useTeamRoster, usePendingJoinRequests } from '../../api/hooks/useTeam';
import { useTeamMatches } from '../../api/hooks/useMatch';
import { useTeamWallet } from '../../api/hooks/useFinance';

const TeamDashboardPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const teamId = parseInt(id || '0', 10);

    const { data: team, isLoading: teamLoading } = useTeam(teamId);
    const { data: roster } = useTeamRoster(teamId);
    const { data: joinRequests } = usePendingJoinRequests(teamId);
    const { data: matchesData } = useTeamMatches(teamId);
    const { data: wallet } = useTeamWallet(teamId);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    if (teamLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!team) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Team Not Found</h2>
                    <Link to="/leader/teams" className="text-emerald-600 hover:underline">
                        Back to My Teams
                    </Link>
                </div>
            </div>
        );
    }

    const stats = {
        members: roster?.length || 0,
        pendingRequests: joinRequests?.length || 0,
        upcomingMatches: matchesData?.data?.length || 0,
        walletBalance: wallet?.balance || 0,
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                            {team.logoUrl ? (
                                <img src={team.logoUrl} alt={team.teamName} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{team.teamName}</h1>
                            <p className="text-gray-500">{team.location}</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Link
                            to={`/leader/teams/${id}/edit`}
                            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                        </Link>
                        <DeleteTeamButton teamId={team.teamId} teamName={team.teamName} />
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Link
                    to={`/leader/teams/${id}/roster`}
                    className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                    <p className="text-sm text-gray-500 mb-1">Members</p>
                    <p className="text-3xl font-bold text-emerald-600">{stats.members}</p>
                </Link>
                <Link
                    to={`/leader/teams/${id}/requests`}
                    className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                    <p className="text-sm text-gray-500 mb-1">Pending Requests</p>
                    <p className="text-3xl font-bold text-yellow-600">{stats.pendingRequests}</p>
                </Link>
                <Link
                    to={`/leader/teams/${id}/matches`}
                    className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                    <p className="text-sm text-gray-500 mb-1">Upcoming Matches</p>
                    <p className="text-3xl font-bold text-blue-600">{stats.upcomingMatches}</p>
                </Link>
                <Link
                    to={`/leader/teams/${id}/finance`}
                    className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                    <p className="text-sm text-gray-500 mb-1">Wallet Balance</p>
                    <p className="text-2xl font-bold text-purple-600">{formatCurrency(stats.walletBalance)}</p>
                </Link>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link
                        to={`/leader/teams/${id}/roster`}
                        className="flex flex-col items-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                        <svg className="w-8 h-8 text-emerald-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">Manage Roster</span>
                    </Link>
                    <Link
                        to={`/leader/teams/${id}/matches/create`}
                        className="flex flex-col items-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                        <svg className="w-8 h-8 text-teal-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">Schedule Match</span>
                    </Link>
                    <Link
                        to={`/leader/teams/${id}/matches/invitations`}
                        className="flex flex-col items-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                        <svg className="w-8 h-8 text-blue-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">Match Invites</span>
                    </Link>
                    <Link
                        to={`/leader/teams/${id}/finance/add`}
                        className="flex flex-col items-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                        <svg className="w-8 h-8 text-purple-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">Add Transaction</span>
                    </Link>
                </div>
            </div>

            {/* Recent Activity placeholder */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
                <div className="text-center py-8 text-gray-500">
                    <p>Activity feed coming soon...</p>
                </div>
            </div>
        </div>
    );
};

export default TeamDashboardPage;
