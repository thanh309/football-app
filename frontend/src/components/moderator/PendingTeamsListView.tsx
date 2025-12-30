import { Shield, Users, Eye } from 'lucide-react';
import { LoadingSpinner, EmptyState, Button } from '../common';
import { usePendingTeams } from '../../api/hooks/useModeration';
import type { TeamProfile } from '../../types';
import { Link } from 'react-router-dom';

const PendingTeamsListView: React.FC = () => {
    const { data: teams, isLoading, error } = usePendingTeams();

    if (isLoading) {
        return <LoadingSpinner text="Loading pending teams..." />;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">Failed to load pending teams</div>;
    }

    if (!teams || teams.length === 0) {
        return (
            <EmptyState
                title="No Pending Teams"
                description="All teams have been reviewed. Nice work! 🎉"
            />
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Pending Teams</h2>
                        <p className="text-sm text-gray-500">Review and verify new team registrations</p>
                    </div>
                </div>
                <span className="bg-amber-100 text-amber-700 text-sm px-3 py-1 rounded-full">
                    {teams.length} pending
                </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {teams.map((team: TeamProfile) => (
                    <div
                        key={team.teamId}
                        className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                    >
                        <div className="p-5">
                            <div className="flex items-center gap-3 mb-3">
                                {team.logoUrl ? (
                                    <img
                                        src={team.logoUrl}
                                        alt={team.teamName}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                                        <Users className="w-6 h-6 text-emerald-600" />
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-semibold text-gray-900">{team.teamName}</h3>
                                    <p className="text-sm text-gray-500">Leader #{team.leaderId}</p>
                                </div>
                            </div>

                            {team.description && (
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{team.description}</p>
                            )}

                            <div className="flex items-center justify-between text-sm text-gray-500">
                                <span>
                                    Created {new Date(team.createdAt).toLocaleDateString()}
                                </span>
                                <Link to={`/moderator/teams/${team.teamId}/review`}>
                                    <Button size="sm" variant="outline" leftIcon={<Eye className="w-4 h-4" />}>
                                        Review
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PendingTeamsListView;
