import React, { useState } from 'react';
import { PageContainer, PageHeader, LoadingSpinner } from '../../components/common';
import {
    PlayerSearchFilter,
    PlayerResultCard,
    EmptySearchState,
    type PlayerSearchFilters,
} from '../../components/search';
import { PreferredFoot, type PlayerProfile } from '../../types';

// Mock data
const mockPlayers: PlayerProfile[] = [
    {
        playerId: 1,
        userId: 1,
        displayName: 'Nguyen Van A',
        position: 'Midfielder',
        skillLevel: 7,
        bio: 'Experienced midfielder with good vision.',
        profileImage: 'https://via.placeholder.com/100',
        preferredFoot: PreferredFoot.RIGHT,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
    },
    {
        playerId: 2,
        userId: 2,
        displayName: 'Tran Van B',
        position: 'Forward',
        skillLevel: 8,
        bio: 'Goal-scoring striker.',
        profileImage: 'https://via.placeholder.com/100',
        preferredFoot: PreferredFoot.LEFT,
        createdAt: '2023-02-15T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
    },
    {
        playerId: 3,
        userId: 3,
        displayName: 'Le Van C',
        position: 'Goalkeeper',
        skillLevel: 6,
        bio: 'Reliable goalkeeper.',
        profileImage: 'https://via.placeholder.com/100',
        preferredFoot: PreferredFoot.RIGHT,
        createdAt: '2023-03-20T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
    },
];

const SearchPlayersPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [players, setPlayers] = useState<PlayerProfile[]>(mockPlayers);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const handleSearch = (filters: PlayerSearchFilters) => {
        setSearchQuery(filters.query || '');
        setLoading(true);
        setTimeout(() => {
            let filtered = [...mockPlayers];
            if (filters.query) {
                filtered = filtered.filter((p) =>
                    p.displayName.toLowerCase().includes(filters.query.toLowerCase())
                );
            }
            if (filters.position) {
                filtered = filtered.filter((p) => p.position === filters.position);
            }
            if (filters.minSkillLevel !== undefined) {
                filtered = filtered.filter((p) => (p.skillLevel || 0) >= filters.minSkillLevel!);
            }
            if (filters.maxSkillLevel !== undefined) {
                filtered = filtered.filter((p) => (p.skillLevel || 10) <= filters.maxSkillLevel!);
            }
            setPlayers(filtered);
            setLoading(false);
        }, 300);
    };

    return (
        <PageContainer maxWidth="xl">
            <PageHeader
                title="Search Players"
                subtitle="Find players to invite to your team."
            />

            <div className="mb-6">
                <PlayerSearchFilter onSearch={handleSearch} isLoading={loading} />
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner size="lg" />
                </div>
            ) : players.length === 0 ? (
                <EmptySearchState type="player" query={searchQuery} />
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {players.map((player) => (
                        <PlayerResultCard key={player.playerId} player={player} />
                    ))}
                </div>
            )}
        </PageContainer>
    );
};

export default SearchPlayersPage;
