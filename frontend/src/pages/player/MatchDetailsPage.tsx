import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MatchDetailsCard } from '../../components/match';
import { ConfirmAttendanceButton } from '../../components/player';
import { LoadingSpinner, PageContainer, PageHeader, ContentCard } from '../../components/common';
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
            <PageContainer maxWidth="md">
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Match Not Found</h2>
                    <Link to="/schedule" className="text-primary-600 hover:underline">
                        Back to Schedule
                    </Link>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer maxWidth="md">
            <PageHeader
                title="Match Details"
                backLink={{ label: 'Back to Schedule', to: '/schedule' }}
            />

            {/* Match Card */}
            <div className="mb-6">
                <MatchDetailsCard matchId={Number(matchId)} />
            </div>

            {/* Attendance Action */}
            {match.status === MatchStatus.SCHEDULED && (
                <ContentCard title="Your Attendance" className="mb-6">
                    <p className="text-slate-600 mb-4">
                        Please confirm whether you will attend this match.
                    </p>
                    <ConfirmAttendanceButton matchId={match.matchId} />
                </ContentCard>
            )}

            {/* Match Info */}
            <ContentCard title="Additional Information">
                {match.description ? (
                    <p className="text-slate-600">{match.description}</p>
                ) : (
                    <p className="text-slate-500">No additional information provided.</p>
                )}
            </ContentCard>
        </PageContainer>
    );
};

export default MatchDetailsPage;
