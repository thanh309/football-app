import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { LoadingSpinner, Button } from '../../components/common';
import { TeamStatus, type TeamProfile } from '../../types';
import { useAuth } from '../../contexts';
import { useRequestJoinTeam } from '../../api/hooks/useTeam';
import toast from 'react-hot-toast';

// Mock data for demonstration
const mockTeam: TeamProfile = {
    teamId: 1,
    teamName: 'FC Thunder',
    description: 'A competitive amateur football team based in the city. We play weekly and participate in local tournaments. Looking for dedicated players who want to improve and have fun!',
    logoUrl: 'https://via.placeholder.com/200',
    leaderId: 1,
    status: TeamStatus.VERIFIED,
    location: 'Ho Chi Minh City, Vietnam',
    skillLevel: 7,
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
};

const PublicTeamProfilePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = React.useState(true);
    const [team, setTeam] = React.useState<TeamProfile | null>(null);
    const { isAuthenticated } = useAuth();
    const requestJoinTeam = useRequestJoinTeam();
    const [hasRequested, setHasRequested] = useState(false);

    React.useEffect(() => {
        // Simulate API call
        const timer = setTimeout(() => {
            setTeam(mockTeam);
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [id]);

    const handleRequestJoin = async () => {
        if (!team) return;
        try {
            await requestJoinTeam.mutateAsync({ teamId: team.teamId });
            setHasRequested(true);
            toast.success('Join request sent successfully!');
        } catch {
            toast.error('Failed to send join request');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!team) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Team Not Found</h2>
                    <Link to="/teams" className="text-emerald-600 hover:underline">
                        Browse Teams
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Back Button */}
            <Link
                to="/teams"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Teams
            </Link>

            {/* Header */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <div className="w-32 h-32 rounded-xl bg-gray-100 overflow-hidden">
                            {team.logoUrl ? (
                                <img
                                    src={team.logoUrl}
                                    alt={team.teamName}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                {team.teamName}
                            </h1>
                            {team.status === TeamStatus.VERIFIED && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                    <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Verified
                                </span>
                            )}
                        </div>

                        {team.location && (
                            <p className="text-gray-600 flex items-center gap-2 mb-4">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {team.location}
                            </p>
                        )}

                        {team.skillLevel && (
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-sm text-gray-500">Skill Level:</span>
                                <div className="flex gap-0.5">
                                    {[...Array(10)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={`w-2 h-4 rounded-sm ${i < team.skillLevel! ? 'bg-emerald-500' : 'bg-gray-200'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm font-medium text-gray-700">{team.skillLevel}/10</span>
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
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
                <p className="text-gray-600 whitespace-pre-wrap">
                    {team.description || 'No description provided.'}
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                    <p className="text-2xl font-bold text-emerald-600">--</p>
                    <p className="text-sm text-gray-500">Members</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                    <p className="text-2xl font-bold text-emerald-600">--</p>
                    <p className="text-sm text-gray-500">Matches Played</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                    <p className="text-2xl font-bold text-emerald-600">--</p>
                    <p className="text-sm text-gray-500">Wins</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                    <p className="text-2xl font-bold text-emerald-600">
                        {new Date(team.createdAt).getFullYear()}
                    </p>
                    <p className="text-sm text-gray-500">Founded</p>
                </div>
            </div>
        </div>
    );
};

export default PublicTeamProfilePage;

