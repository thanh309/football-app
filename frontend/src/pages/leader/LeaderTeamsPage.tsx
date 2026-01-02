import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users } from 'lucide-react';
import { LoadingSpinner, PageContainer, PageHeader } from '../../components/common';
import { TeamStatus } from '../../types';
import { useLeaderTeams } from '../../api/hooks/useTeam';
import { useAuth } from '../../contexts/AuthContext';

const LeaderTeamsPage: React.FC = () => {
    const { user } = useAuth();
    const { data: teams, isLoading, error } = useLeaderTeams(user?.userId || 0);

    const getStatusBadge = (status: TeamStatus) => {
        const styles = {
            [TeamStatus.VERIFIED]: 'bg-emerald-100 text-emerald-800',
            [TeamStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
            [TeamStatus.REJECTED]: 'bg-red-100 text-red-800',
            [TeamStatus.PENDING_REVISION]: 'bg-orange-100 text-orange-800',
        };
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
                {status}
            </span>
        );
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <PageContainer maxWidth="xl">
                <div className="text-center py-12">
                    <p className="text-red-600">Failed to load teams. Please try again.</p>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer maxWidth="xl">
            <PageHeader
                title="My Teams"
                subtitle="Teams you manage as a leader."
                action={
                    <Link
                        to="/leader/teams/create"
                        className="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Create Team
                    </Link>
                }
            />

            {!teams || teams.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
                    <Users className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No teams yet</h3>
                    <p className="text-slate-500 mb-6">Create your first team to get started.</p>
                    <Link
                        to="/leader/teams/create"
                        className="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
                    >
                        Create Team
                    </Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teams.map((team) => (
                        <Link
                            key={team.teamId}
                            to={`/leader/teams/${team.teamId}`}
                            className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                                    {team.logoUrl ? (
                                        <img src={team.logoUrl} alt={team.teamName} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                                            <Users className="w-8 h-8" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-slate-900 truncate">{team.teamName}</h3>
                                    <p className="text-sm text-slate-500 truncate">{team.location}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                {getStatusBadge(team.status)}
                                <span className="text-sm text-slate-500">
                                    {new Date(team.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </PageContainer>
    );
};

export default LeaderTeamsPage;
