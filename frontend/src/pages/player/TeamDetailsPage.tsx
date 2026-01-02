import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { LoadingSpinner, PageContainer, PageHeader, ContentCard } from '../../components/common';
import { LeaveTeamButton } from '../../components/player';
import { useAuth } from '../../contexts';
import { TeamStatus, type TeamProfile } from '../../types';

// Mock data
const mockTeam: TeamProfile = {
    teamId: 1,
    teamName: 'FC Thunder',
    description: 'A competitive amateur football team based in the city. We play weekly and participate in local tournaments.',
    logoUrl: 'https://via.placeholder.com/200',
    leaderId: 1,
    status: TeamStatus.VERIFIED,
    location: 'Ho Chi Minh City, Vietnam',
    skillLevel: 7,
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
};

const TeamDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const playerId = user?.userId || 0;
    const [loading, setLoading] = React.useState(true);
    const [team, setTeam] = React.useState<TeamProfile | null>(null);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setTeam(mockTeam);
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!team) {
        return (
            <PageContainer maxWidth="md">
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Team Not Found</h2>
                    <Link to="/my-teams" className="text-primary-600 hover:underline">
                        Back to My Teams
                    </Link>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer maxWidth="md">
            <PageHeader
                title={team.teamName}
                subtitle={team.location}
                backLink={{ label: 'Back to My Teams', to: '/my-teams' }}
                action={
                    <LeaveTeamButton
                        teamId={team.teamId}
                        playerId={playerId}
                        teamName={team.teamName}
                    />
                }
            />

            {/* Team Header Card */}
            <ContentCard className="mb-6">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-24 h-24 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                        {team.logoUrl ? (
                            <img src={team.logoUrl} alt={team.teamName} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <p className="text-slate-600">{team.description || 'No description provided.'}</p>
                    </div>
                </div>
            </ContentCard>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <ContentCard>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-primary-600">12</p>
                        <p className="text-sm text-slate-500">Members</p>
                    </div>
                </ContentCard>
                <ContentCard>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-primary-600">24</p>
                        <p className="text-sm text-slate-500">Matches Played</p>
                    </div>
                </ContentCard>
                <ContentCard>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-primary-600">15</p>
                        <p className="text-sm text-slate-500">Wins</p>
                    </div>
                </ContentCard>
                <ContentCard>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-primary-600">{team.skillLevel}/10</p>
                        <p className="text-sm text-slate-500">Skill Level</p>
                    </div>
                </ContentCard>
            </div>

            {/* Recent Activity */}
            <ContentCard title="Recent Team Activity">
                <div className="text-center py-8 text-slate-500">
                    <p>No recent activity to show.</p>
                </div>
            </ContentCard>
        </PageContainer>
    );
};

export default TeamDetailsPage;
