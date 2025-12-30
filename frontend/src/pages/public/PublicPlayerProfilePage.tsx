import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { LoadingSpinner } from '../../components/common';
import { PreferredFoot, type PlayerProfile } from '../../types';

// Mock data for demonstration
const mockPlayer: PlayerProfile = {
    playerId: 1,
    userId: 1,
    displayName: 'Nguyen Van A',
    position: 'Midfielder',
    skillLevel: 7,
    bio: 'Passionate football player with 5 years of experience. I enjoy playing midfield and creating opportunities for my teammates. Always looking to improve and learn from every match.',
    profileImage: 'https://via.placeholder.com/200',
    dateOfBirth: '1995-05-15',
    height: 175,
    weight: 70,
    preferredFoot: PreferredFoot.RIGHT,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
};

const PublicPlayerProfilePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = React.useState(true);
    const [player, setPlayer] = React.useState<PlayerProfile | null>(null);

    React.useEffect(() => {
        // Simulate API call
        const timer = setTimeout(() => {
            setPlayer(mockPlayer);
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [id]);

    const calculateAge = (dateOfBirth: string) => {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!player) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Player Not Found</h2>
                    <Link to="/search/players" className="text-emerald-600 hover:underline">
                        Search Players
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Profile Header */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                        <div className="w-32 h-32 rounded-full bg-gray-100 overflow-hidden">
                            {player.profileImage ? (
                                <img
                                    src={player.profileImage}
                                    alt={player.displayName}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                            {player.displayName}
                        </h1>

                        {player.position && (
                            <p className="text-lg text-emerald-600 font-medium mb-4">
                                {player.position}
                            </p>
                        )}

                        {player.skillLevel && (
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-sm text-gray-500">Skill Level:</span>
                                <div className="flex gap-0.5">
                                    {[...Array(10)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={`w-2 h-4 rounded-sm ${i < player.skillLevel! ? 'bg-emerald-500' : 'bg-gray-200'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm font-medium text-gray-700">{player.skillLevel}/10</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bio */}
            {player.bio && (
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
                    <p className="text-gray-600 whitespace-pre-wrap">{player.bio}</p>
                </div>
            )}

            {/* Physical Stats */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Physical Stats</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {player.dateOfBirth && (
                        <div>
                            <p className="text-sm text-gray-500">Age</p>
                            <p className="text-xl font-bold text-gray-900">
                                {calculateAge(player.dateOfBirth)} years
                            </p>
                        </div>
                    )}
                    {player.height && (
                        <div>
                            <p className="text-sm text-gray-500">Height</p>
                            <p className="text-xl font-bold text-gray-900">{player.height} cm</p>
                        </div>
                    )}
                    {player.weight && (
                        <div>
                            <p className="text-sm text-gray-500">Weight</p>
                            <p className="text-xl font-bold text-gray-900">{player.weight} kg</p>
                        </div>
                    )}
                    {player.preferredFoot && (
                        <div>
                            <p className="text-sm text-gray-500">Preferred Foot</p>
                            <p className="text-xl font-bold text-gray-900">{player.preferredFoot}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Teams */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Teams</h2>
                <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p>Team information is private</p>
                </div>
            </div>
        </div>
    );
};

export default PublicPlayerProfilePage;
