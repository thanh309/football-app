import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MatchDetailsCard } from '../../components/match';
import { ConfirmAttendanceButton } from '../../components/player';
import { LoadingSpinner } from '../../components/common';
import { MatchStatus, Visibility, type MatchEvent } from '../../types';

// Mock data
const mockMatch: MatchEvent = {
    matchId: 1,
    hostTeamId: 1,
    opponentTeamId: 2,
    fieldId: 1,
    matchDate: '2024-01-20',
    startTime: '19:00:00',
    endTime: '21:00:00',
    status: MatchStatus.SCHEDULED,
    visibility: Visibility.PUBLIC,
    description: 'Friendly match between FC Thunder and City United.',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
};

const MatchDetailsPage: React.FC = () => {
    const { matchId } = useParams<{ matchId: string }>();
    const [loading, setLoading] = React.useState(true);
    const [match, setMatch] = React.useState<MatchEvent | null>(null);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setMatch(mockMatch);
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [matchId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!match) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Match Not Found</h2>
                    <Link to="/player/schedule" className="text-emerald-600 hover:underline">
                        Back to Schedule
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Back link */}
            <Link
                to="/player/schedule"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Schedule
            </Link>

            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Match Details</h1>
            </div>

            {/* Match Card - use matchId prop instead of match */}
            <div className="mb-6">
                <MatchDetailsCard matchId={Number(matchId)} />
            </div>

            {/* Attendance Action */}
            {match.status === MatchStatus.SCHEDULED && (
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Attendance</h2>
                    <p className="text-gray-600 mb-4">
                        Please confirm whether you will attend this match.
                    </p>
                    <ConfirmAttendanceButton matchId={match.matchId} />
                </div>
            )}

            {/* Match Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h2>
                {match.description ? (
                    <p className="text-gray-600">{match.description}</p>
                ) : (
                    <p className="text-gray-500">No additional information provided.</p>
                )}
            </div>
        </div>
    );
};

export default MatchDetailsPage;
