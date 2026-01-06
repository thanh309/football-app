import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LoadingSpinner, PageContainer, PageHeader, ContentCard } from '../../components/common';
import { LeaveTeamButton } from '../../components/player';
import { useAuth } from '../../contexts';
import { useTeam, useTeamRoster } from '../../api/hooks/useTeam';
import { useTeamMatches } from '../../api/hooks/useMatch';
import { MatchStatus } from '../../types';

const TeamDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const teamId = parseInt(id || '0', 10);
    const { user } = useAuth();
    const playerId = user?.userId || 0;

    const { data: team, isLoading } = useTeam(teamId);
    const { data: roster } = useTeamRoster(teamId);
    const { data: matches, isLoading: matchesLoading } = useTeamMatches(teamId);

    // Calculate match stats
    const matchStats = useMemo(() => {
        const matchData = matches?.data;
        if (!matchData || matchData.length === 0) return { played: 0, wins: 0 };

        const completedMatches = matchData.filter(m => m.status === MatchStatus.COMPLETED);
        const played = completedMatches.length;

        // Count wins where this team is hostTeamId and won, or opponentTeamId and won
        // Note: Without detailed match results, we count matches where the team participated
        // In a real app, you'd fetch match results to determine wins
        const wins = 0; // Would need MatchResult data to calculate

        return { played, wins };
    }, [matches]);

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
                    <div className="flex-1 text-left">
                        <p className="text-slate-600 text-left">{team.description || 'No description provided.'}</p>
                    </div>
                </div>
            </ContentCard>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <ContentCard>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-primary-600">{roster?.length || 0}</p>
                        <p className="text-sm text-slate-500">Members</p>
                    </div>
                </ContentCard>
                <ContentCard>
                    <div className="text-center">
                        {matchesLoading ? (
                            <LoadingSpinner size="sm" />
                        ) : (
                            <p className="text-2xl font-bold text-primary-600">{matchStats.played}</p>
                        )}
                        <p className="text-sm text-slate-500">Matches Played</p>
                    </div>
                </ContentCard>
                <ContentCard>
                    <div className="text-center">
                        {matchesLoading ? (
                            <LoadingSpinner size="sm" />
                        ) : (
                            <p className="text-2xl font-bold text-primary-600">{matchStats.wins}</p>
                        )}
                        <p className="text-sm text-slate-500">Wins</p>
                    </div>
                </ContentCard>
                <ContentCard>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-primary-600">{team.skillLevel || 'N/A'}/10</p>
                        <p className="text-sm text-slate-500">Skill Level</p>
                    </div>
                </ContentCard>
            </div>

            {/* Recent Activity */}
            <ContentCard title="Recent Team Activity">
                {matches?.data && matches.data.length > 0 ? (
                    <div className="space-y-3">
                        {matches.data.slice(0, 3).map((match) => (
                            <div key={match.matchId} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                                <div className="flex-1 text-left">
                                    <p className="text-sm font-medium text-slate-900 text-left">
                                        Match on {new Date(match.matchDate).toLocaleDateString()}
                                    </p>
                                    <p className="text-xs text-slate-500 text-left">{match.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-8 text-slate-500 text-left">
                        <p>No recent activity to show.</p>
                    </div>
                )}
            </ContentCard>
        </PageContainer>
    );
};

export default TeamDetailsPage;
