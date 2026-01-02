import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { LoadingSpinner } from '../../components/common';
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
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Team Not Found</h2>
                    <Link to="/my-teams" className="text-emerald-600 hover:underline">
                        Back to My Teams
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Back link */}
            <Link
                to="/my-teams"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to My Teams
            </Link>

            {/* Team Header */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-24 h-24 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                        {team.logoUrl ? (
                            <img src={team.logoUrl} alt={team.teamName} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{team.teamName}</h1>
                        {team.location && (
                            <p className="text-gray-600 flex items-center gap-2 mb-4">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                </svg>
                                {team.location}
                            </p>
                        )}
                        <div className="flex flex-wrap gap-2">
                            <LeaveTeamButton
                                teamId={team.teamId}
                                playerId={playerId}
                                teamName={team.teamName}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
                <p className="text-gray-600">{team.description || 'No description provided.'}</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                    <p className="text-2xl font-bold text-emerald-600">12</p>
                    <p className="text-sm text-gray-500">Members</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                    <p className="text-2xl font-bold text-teal-600">24</p>
                    <p className="text-sm text-gray-500">Matches Played</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600">15</p>
                    <p className="text-sm text-gray-500">Wins</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                    <p className="text-2xl font-bold text-purple-600">{team.skillLevel}/10</p>
                    <p className="text-sm text-gray-500">Skill Level</p>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Team Activity</h2>
                <div className="text-center py-8 text-gray-500">
                    <p>No recent activity to show.</p>
                </div>
            </div>
        </div>
    );
};

export default TeamDetailsPage;
