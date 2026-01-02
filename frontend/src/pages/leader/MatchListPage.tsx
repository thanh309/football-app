import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, Calendar, Mail } from 'lucide-react';
import { LoadingSpinner, PageContainer, PageHeader } from '../../components/common';
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
            [MatchStatus.COMPLETED]: 'bg-slate-100 text-slate-800',
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
        <PageContainer maxWidth="md">
            <PageHeader
                title="Matches"
                subtitle="Manage your team's matches."
                backLink={{ label: 'Back to Team Dashboard', to: `/leader/teams/${teamId}` }}
                action={
                    <div className="flex gap-2">
                        <Link
                            to={`/leader/teams/${teamId}/matches/invitations`}
                            className="inline-flex items-center px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
                        >
                            <Mail className="w-4 h-4 mr-2" />
                            Invitations
                        </Link>
                        <Link
                            to={`/leader/teams/${teamId}/matches/create`}
                            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Schedule Match
                        </Link>
                    </div>
                }
            />

            {matches.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
                    <Calendar className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No matches yet</h3>
                    <p className="text-slate-500 mb-6">Schedule your first match to get started.</p>
                    <Link
                        to={`/leader/teams/${teamId}/matches/create`}
                        className="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
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
                            className="block bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="text-center">
                                        <p className="text-sm text-slate-500">
                                            {new Date(match.matchDate).toLocaleDateString('en-US', { weekday: 'short' })}
                                        </p>
                                        <p className="text-2xl font-bold text-slate-900">
                                            {new Date(match.matchDate).getDate()}
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            {new Date(match.matchDate).toLocaleDateString('en-US', { month: 'short' })}
                                        </p>
                                    </div>
                                    <div className="border-l border-slate-200 pl-4">
                                        <p className="font-medium text-slate-900">
                                            {match.opponentTeamId ? 'vs Team ' + match.opponentTeamId : 'Looking for opponent'}
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            {match.startTime.slice(0, 5)} - {match.endTime?.slice(0, 5) || 'TBD'}
                                        </p>
                                    </div>
                                </div>
                                {getStatusBadge(match.status)}
                            </div>
                            {match.description && (
                                <p className="text-sm text-slate-600">{match.description}</p>
                            )}
                        </Link>
                    ))}
                </div>
            )}
        </PageContainer>
    );
};

export default MatchListPage;
