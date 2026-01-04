import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, CheckCircle, Users } from 'lucide-react';
import { LoadingSpinner, Button, PageContainer, PageHeader, ContentCard } from '../../components/common';
import { TeamStatus, MatchStatus } from '../../types';
import { useAuth } from '../../contexts';
import { useTeam, useTeamRoster, useRequestJoinTeam } from '../../api/hooks/useTeam';
import { useTeamMatches } from '../../api/hooks/useMatch';
import toast from 'react-hot-toast';

const PublicTeamProfilePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const teamId = parseInt(id || '0', 10);
    const { isAuthenticated } = useAuth();
    const requestJoinTeam = useRequestJoinTeam();
    const [hasRequested, setHasRequested] = useState(false);

    const { data: team, isLoading } = useTeam(teamId);
    const { data: roster } = useTeamRoster(teamId);
    const { data: matches, isLoading: matchesLoading } = useTeamMatches(teamId);

    // Calculate match stats
    const matchStats = useMemo(() => {
        const matchData = matches?.data;
        if (!matchData || matchData.length === 0) return { played: 0, wins: 0 };

        const completedMatches = matchData.filter(m => m.status === MatchStatus.COMPLETED);
        const played = completedMatches.length;

        // Note: Would need MatchResult data to determine wins accurately
        const wins = 0;

        return { played, wins };
    }, [matches]);

    const handleRequestJoin = async () => {
        if (!team) return;
        try {
            await requestJoinTeam.mutateAsync({ teamId: team.teamId });
            setHasRequested(true);
            toast.success('Join request sent successfully!');
        } catch (error: unknown) {
            const err = error as { response?: { data?: { detail?: string; message?: string } } };
            const message = err.response?.data?.detail || err.response?.data?.message || 'Failed to send join request';
            toast.error(message);
        }
    };

    if (isLoading) {
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
                    <Link to="/search/teams" className="text-primary-600 hover:underline">
                        Browse Teams
                    </Link>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer maxWidth="lg">
            <PageHeader
                title={team.teamName}
                subtitle={
                    <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {team.location}
                    </span>
                }
                backLink={{ label: 'Back to Teams', to: '/search/teams' }}
                action={
                    team.status === TeamStatus.VERIFIED ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            <CheckCircle className="w-3.5 h-3.5 mr-1" />
                            Verified
                        </span>
                    ) : undefined
                }
            />

            {/* Profile Info */}
            <ContentCard className="mb-6">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                        <div className="w-32 h-32 rounded-xl bg-slate-100 overflow-hidden">
                            {team.logoUrl ? (
                                <img src={team.logoUrl} alt={team.teamName} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                    <Users className="w-16 h-16" />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{team.teamName}</h1>
                        {team.skillLevel && (
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-sm text-slate-500">Skill Level:</span>
                                <div className="flex gap-0.5">
                                    {[...Array(10)].map((_, i) => (
                                        <div key={i} className={`w-2 h-4 rounded-sm ${i < team.skillLevel! ? 'bg-primary-500' : 'bg-slate-200'}`} />
                                    ))}
                                </div>
                                <span className="text-sm font-medium text-slate-700">{team.skillLevel}/10</span>
                            </div>
                        )}
                        {isAuthenticated ? (
                            <Button
                                variant="primary"
                                onClick={handleRequestJoin}
                                isLoading={requestJoinTeam.isPending}
                                disabled={hasRequested}
                            >
                                {hasRequested ? 'Request Sent' : 'Request to Join'}
                            </Button>
                        ) : (
                            <Link to="/login">
                                <Button variant="outline">
                                    Log in to Join
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </ContentCard>

            {/* Description */}
            <ContentCard title="About" className="mb-6">
                <p className="text-slate-600 whitespace-pre-wrap">
                    {team.description || 'No description provided.'}
                </p>
            </ContentCard>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ContentCard className="text-center">
                    <p className="text-2xl font-bold text-primary-600">{roster?.length || 0}</p>
                    <p className="text-sm text-slate-500">Members</p>
                </ContentCard>
                <ContentCard className="text-center">
                    {matchesLoading ? (
                        <LoadingSpinner size="sm" />
                    ) : (
                        <p className="text-2xl font-bold text-primary-600">{matchStats.played}</p>
                    )}
                    <p className="text-sm text-slate-500">Matches Played</p>
                </ContentCard>
                <ContentCard className="text-center">
                    {matchesLoading ? (
                        <LoadingSpinner size="sm" />
                    ) : (
                        <p className="text-2xl font-bold text-primary-600">{matchStats.wins}</p>
                    )}
                    <p className="text-sm text-slate-500">Wins</p>
                </ContentCard>
                <ContentCard className="text-center">
                    <p className="text-2xl font-bold text-primary-600">
                        {new Date(team.createdAt).getFullYear()}
                    </p>
                    <p className="text-sm text-slate-500">Founded</p>
                </ContentCard>
            </div>
        </PageContainer>
    );
};

export default PublicTeamProfilePage;
