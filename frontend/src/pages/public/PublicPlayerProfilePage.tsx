import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import { LoadingSpinner, PageContainer, ContentCard } from '../../components/common';
import { usePlayerProfile } from '../../api/hooks/usePlayer';

const PublicPlayerProfilePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const playerId = parseInt(id || '0', 10);

    const { data: player, isLoading } = usePlayerProfile(playerId);

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

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!player) {
        return (
            <PageContainer maxWidth="md">
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Player Not Found</h2>
                    <Link to="/search/players" className="text-primary-600 hover:underline">
                        Search Players
                    </Link>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer maxWidth="md">
            {/* Profile Header */}
            <ContentCard className="mb-6">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                        <div className="w-32 h-32 rounded-full bg-slate-100 overflow-hidden">
                            {player.profileImage ? (
                                <img src={player.profileImage} alt={player.displayName} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                    <Users className="w-16 h-16" />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 text-left">{player.displayName}</h1>
                        {player.position && <p className="text-lg text-primary-600 font-medium mb-4 text-left">{player.position}</p>}
                        {player.skillLevel && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-500">Skill Level:</span>
                                <div className="flex gap-0.5">
                                    {[...Array(10)].map((_, i) => (
                                        <div key={i} className={`w-2 h-4 rounded-sm ${i < player.skillLevel! ? 'bg-primary-500' : 'bg-slate-200'}`} />
                                    ))}
                                </div>
                                <span className="text-sm font-medium text-slate-700">{player.skillLevel}/10</span>
                            </div>
                        )}
                    </div>
                </div>
            </ContentCard>

            {/* Bio */}
            {player.bio && (
                <ContentCard title="About" className="mb-6">
                    <p className="text-slate-600 whitespace-pre-wrap text-left">{player.bio}</p>
                </ContentCard>
            )}

            {/* Physical Stats */}
            <ContentCard title="Physical Stats" className="mb-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {player.dateOfBirth && (
                        <div>
                            <p className="text-sm text-slate-500">Age</p>
                            <p className="text-xl font-bold text-slate-900">{calculateAge(player.dateOfBirth)} years</p>
                        </div>
                    )}
                    {player.height && (
                        <div>
                            <p className="text-sm text-slate-500">Height</p>
                            <p className="text-xl font-bold text-slate-900">{player.height} cm</p>
                        </div>
                    )}
                    {player.weight && (
                        <div>
                            <p className="text-sm text-slate-500">Weight</p>
                            <p className="text-xl font-bold text-slate-900">{player.weight} kg</p>
                        </div>
                    )}
                    {player.preferredFoot && (
                        <div>
                            <p className="text-sm text-slate-500">Preferred Foot</p>
                            <p className="text-xl font-bold text-slate-900">{player.preferredFoot}</p>
                        </div>
                    )}
                </div>
            </ContentCard>

            {/* Teams */}
            <ContentCard title="Teams">
                <div className="text-center py-8 text-slate-500">
                    <Users className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                    <p>Team information is private</p>
                </div>
            </ContentCard>
        </PageContainer>
    );
};

export default PublicPlayerProfilePage;
