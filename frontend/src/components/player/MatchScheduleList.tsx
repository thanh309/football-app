import { Calendar, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LoadingSpinner, EmptyState } from '../common';
import { usePlayerSchedule } from '../../api/hooks/useMatch';
import type { MatchEvent } from '../../types';

interface MatchScheduleListProps {
    playerId: number;
}

interface MatchCardProps {
    match: MatchEvent;
}

const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
    const matchDate = new Date(match.matchDate);
    const isPast = matchDate < new Date();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Scheduled':
                return 'bg-blue-100 text-blue-700';
            case 'Completed':
                return 'bg-green-100 text-green-700';
            case 'Cancelled':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <Link
            to={`/player/matches/${match.matchId}`}
            className={`block bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden ${isPast ? 'opacity-75' : ''
                }`}
        >
            <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(match.status)}`}>
                        {match.status}
                    </span>
                    {match.visibility && (
                        <span className="text-xs text-gray-500">
                            {match.visibility}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4 text-emerald-500" />
                        <span className="font-medium">
                            {matchDate.toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                            })}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4 text-emerald-500" />
                        <span>{match.startTime}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                            Team #{match.hostTeamId}
                            {match.opponentTeamId && ` vs Team #${match.opponentTeamId}`}
                        </span>
                    </div>
                </div>

                {match.description && (
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                        {match.description}
                    </p>
                )}
            </div>
        </Link>
    );
};

const MatchScheduleList: React.FC<MatchScheduleListProps> = ({ playerId }) => {
    const { data: matches, isLoading, error } = usePlayerSchedule(playerId);

    if (isLoading) {
        return <LoadingSpinner text="Loading your schedule..." />;
    }

    if (error) {
        return (
            <div className="text-center py-8 text-red-500">
                Failed to load schedule. Please try again.
            </div>
        );
    }

    if (!matches || matches.length === 0) {
        return (
            <EmptyState
                title="No Upcoming Matches"
                description="You don't have any scheduled matches. Your team leaders will schedule matches for you."
            />
        );
    }

    // Separate upcoming and past matches
    const now = new Date();
    const upcoming = matches.filter(m => new Date(m.matchDate) >= now);
    const past = matches.filter(m => new Date(m.matchDate) < now);

    return (
        <div className="space-y-8">
            {upcoming.length > 0 && (
                <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Matches</h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {upcoming.map(match => (
                            <MatchCard key={match.matchId} match={match} />
                        ))}
                    </div>
                </div>
            )}

            {past.length > 0 && (
                <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Past Matches</h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {past.slice(0, 6).map(match => (
                            <MatchCard key={match.matchId} match={match} />
                        ))}
                    </div>
                    {past.length > 6 && (
                        <button className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium">
                            View all past matches →
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default MatchScheduleList;
