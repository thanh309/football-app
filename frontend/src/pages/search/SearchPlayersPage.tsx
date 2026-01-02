import React, { useState } from 'react';
import { PageContainer, PageHeader, LoadingSpinner } from '../../components/common';
import {
    PlayerSearchFilter,
    PlayerResultCard,
    EmptySearchState,
    type PlayerSearchFilters,
} from '../../components/search';
import { useSearchPlayers } from '../../api/hooks/useSearch';

const SearchPlayersPage: React.FC = () => {
    const [filters, setFilters] = useState<PlayerSearchFilters>({ query: '' });

    const { data: searchResult, isLoading } = useSearchPlayers({
        query: filters.query || '',
        position: filters.position,
        minSkillLevel: filters.minSkillLevel,
        maxSkillLevel: filters.maxSkillLevel,
    });

    const handleSearch = (newFilters: PlayerSearchFilters) => {
        setFilters(newFilters);
    };

    const players = searchResult?.data || [];

    return (
        <PageContainer maxWidth="xl">
            <PageHeader
                title="Search Players"
                subtitle="Find players to invite to your team."
            />

            <div className="mb-6">
                <PlayerSearchFilter onSearch={handleSearch} isLoading={isLoading} />
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner size="lg" />
                </div>
            ) : players.length === 0 ? (
                <EmptySearchState type="player" query={filters.query || ''} />
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
