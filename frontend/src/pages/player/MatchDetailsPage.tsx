import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MatchDetailsCard } from '../../components/match';
import { ConfirmAttendanceButton } from '../../components/player';
import { LoadingSpinner, PageContainer, PageHeader, ContentCard } from '../../components/common';
import { MatchStatus } from '../../types';
import { useMatchDetails } from '../../api/hooks/useMatch';

const MatchDetailsPage: React.FC = () => {
    const { matchId } = useParams<{ matchId: string }>();
    const matchIdNum = parseInt(matchId || '0', 10);

    const { data: match, isLoading } = useMatchDetails(matchIdNum);

    if (isLoading) {
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
                <MatchDetailsCard matchId={matchIdNum} />
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
