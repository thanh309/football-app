import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Users, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { MatchDetailsCard } from '../../components/match';
import { Button, PageContainer, PageHeader, ContentCard } from '../../components/common';

const LeaderMatchDetailsPage: React.FC = () => {
    const { teamId, matchId } = useParams<{ teamId: string; matchId: string }>();
    const navigate = useNavigate();

    const handleCancelMatch = () => {
        if (window.confirm('Are you sure you want to cancel this match?')) {
            toast.success('Match cancellation requested');
            navigate(`/leader/teams/${teamId}/matches`);
        }
    };

    return (
        <PageContainer maxWidth="md">
            <PageHeader
                title="Match Details"
                subtitle="View and manage match information."
                backLink={{ label: 'Back to Matches', to: `/leader/teams/${teamId}/matches` }}
            />

            {/* Leader Actions */}
            <ContentCard className="mb-6">
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
                    Leader Actions
                </h2>
                <div className="flex flex-wrap gap-3">
                    <Link to={`/leader/teams/${teamId}/matches/${matchId}/attendance`}>
                        <Button variant="secondary" leftIcon={<Users className="w-4 h-4" />}>
                            Manage Attendance
                        </Button>
                    </Link>
                    <Button variant="danger" leftIcon={<XCircle className="w-4 h-4" />} onClick={handleCancelMatch}>
                        Cancel Match
                    </Button>
                </div>
            </ContentCard>

            {/* Match Details Card */}
            <MatchDetailsCard matchId={Number(matchId)} />
        </PageContainer>
    );
};

export default LeaderMatchDetailsPage;
