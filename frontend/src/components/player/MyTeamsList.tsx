import { Link } from 'react-router-dom';
import { Users, MapPin, Trophy } from 'lucide-react';
import { LoadingSpinner, EmptyState } from '../common';
import { usePlayerTeams } from '../../api/hooks/useTeam';
import type { TeamProfile } from '../../types';

interface MyTeamsListProps {
    playerId: number;
}

interface TeamCardProps {
    team: TeamProfile;
}

const TeamCard: React.FC<TeamCardProps> = ({ team }) => {
    return (
        <Link
            to={`/my-teams/${team.teamId}`}
            className="block bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden"
        >
            <div className="flex items-center gap-4 p-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    {team.logoUrl ? (
                        <img
                            src={team.logoUrl}
                            alt={team.teamName}
                            className="w-full h-full object-cover rounded-lg"
                        />
                    ) : (
                        <Users className="w-8 h-8 text-emerald-600" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{team.teamName}</h3>
                    {team.location && (
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {team.location}
                        </p>
                    )}
                    <div className="flex items-center gap-4 mt-2">
                        {team.skillLevel && (
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                <Trophy className="w-3 h-3" />
                                Level {team.skillLevel}
                            </span>
                        )}
                        <span className={`text-xs px-2 py-1 rounded-full ${team.status === 'Verified'
                            ? 'bg-green-50 text-green-600'
                            : 'bg-yellow-50 text-yellow-600'
                            }`}>
                            {team.status}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

const MyTeamsList: React.FC<MyTeamsListProps> = ({ playerId }) => {
    const { data: teams, isLoading, error } = usePlayerTeams(playerId);

    if (isLoading) {
        return <LoadingSpinner text="Loading your teams..." />;
    }

    if (error) {
        return (
            <div className="text-center py-8 text-red-500">
                Failed to load teams. Please try again.
            </div>
        );
    }

    if (!teams || teams.length === 0) {
        return (
            <EmptyState
                title="No Teams Yet"
                description="You haven't joined any teams. Search for teams and send join requests to get started!"
                actionLabel="Find Teams"
                onAction={() => window.location.href = '/search/teams'}
            />
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">My Teams</h2>
                <span className="text-sm text-gray-500">{teams.length} team(s)</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {teams.map(team => (
                    <TeamCard key={team.teamId} team={team} />
                ))}
            </div>
        </div>
    );
};

export default MyTeamsList;
