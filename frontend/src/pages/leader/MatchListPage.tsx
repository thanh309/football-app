import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { LoadingSpinner } from '../../components/common';
import { MatchStatus, Visibility, type MatchEvent } from '../../types';

// Mock data
const mockMatches: MatchEvent[] = [
    {
        matchId: 1,
        hostTeamId: 1,
        opponentTeamId: 2,
        fieldId: 1,
        matchDate: '2024-01-20',
        startTime: '19:00:00',
        endTime: '21:00:00',
        status: MatchStatus.SCHEDULED,
        visibility: Visibility.PUBLIC,
        description: 'Friendly match',
        createdAt: '2024-01-10T00:00:00Z',
        updatedAt: '2024-01-10T00:00:00Z',
    },
    {
        matchId: 2,
        hostTeamId: 1,
        matchDate: '2024-01-25',
        startTime: '18:00:00',
        endTime: '20:00:00',
        status: MatchStatus.LOOKING_FOR_FIELD,
        visibility: Visibility.PUBLIC,
        description: 'Looking for opponent',
        createdAt: '2024-01-12T00:00:00Z',
        updatedAt: '2024-01-12T00:00:00Z',
    },
];

const MatchListPage: React.FC = () => {
    const { teamId } = useParams<{ teamId: string }>();
    const [loading, setLoading] = React.useState(true);
    const [matches, setMatches] = React.useState<MatchEvent[]>([]);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setMatches(mockMatches);
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [teamId]);

    const getStatusBadge = (status: MatchStatus) => {
        const styles: Record<MatchStatus, string> = {
            [MatchStatus.SCHEDULED]: 'bg-emerald-100 text-emerald-800',
            [MatchStatus.PENDING_APPROVAL]: 'bg-yellow-100 text-yellow-800',
            [MatchStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
            [MatchStatus.COMPLETED]: 'bg-gray-100 text-gray-800',
            [MatchStatus.CANCELLED]: 'bg-red-100 text-red-800',
            [MatchStatus.LOOKING_FOR_FIELD]: 'bg-purple-100 text-purple-800',
        };
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
                {status.replace(/([A-Z])/g, ' $1').trim()}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Back link */}
            <Link
                to={`/leader/teams/${teamId}`}
                className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Team Dashboard
            </Link>

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Matches</h1>
                    <p className="text-gray-600 mt-1">Manage your team's matches.</p>
                </div>
                <div className="flex gap-2">
                    <Link
                        to={`/leader/teams/${teamId}/matches/invitations`}
                        className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Invitations
                    </Link>
                    <Link
                        to={`/leader/teams/${teamId}/matches/create`}
                        className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Schedule Match
                    </Link>
                </div>
            </div>

            {matches.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No matches yet</h3>
                    <p className="text-gray-500 mb-6">Schedule your first match to get started.</p>
                    <Link
                        to={`/leader/teams/${teamId}/matches/create`}
                        className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                        Schedule Match
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {matches.map((match) => (
                        <Link
                            key={match.matchId}
                            to={`/leader/teams/${teamId}/matches/${match.matchId}`}
                            className="block bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="text-center">
                                        <p className="text-sm text-gray-500">
                                            {new Date(match.matchDate).toLocaleDateString('en-US', { weekday: 'short' })}
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {new Date(match.matchDate).getDate()}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(match.matchDate).toLocaleDateString('en-US', { month: 'short' })}
                                        </p>
                                    </div>
                                    <div className="border-l pl-4">
                                        <p className="font-medium text-gray-900">
                                            {match.opponentTeamId ? 'vs Team ' + match.opponentTeamId : 'Looking for opponent'}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {match.startTime.slice(0, 5)} - {match.endTime?.slice(0, 5) || 'TBD'}
                                        </p>
                                    </div>
                                </div>
                                {getStatusBadge(match.status)}
                            </div>
                            {match.description && (
                                <p className="text-sm text-gray-600">{match.description}</p>
                            )}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MatchListPage;
