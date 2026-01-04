import React, { useState } from 'react';
import { PageContainer, PageHeader, LoadingSpinner } from '../../components/common';
import {
    TeamSearchFilter,
    TeamResultCard,
    EmptySearchState,
    type TeamSearchFilters,
} from '../../components/search';
import { useSearchTeams } from '../../api/hooks/useTeam';

const SearchTeamsPage: React.FC = () => {
    const [filters, setFilters] = useState<TeamSearchFilters>({ query: '' });

    const { data: searchResult, isLoading } = useSearchTeams({
        query: filters.query || '',
        location: filters.location,
        minSkillLevel: filters.minSkillLevel,
        maxSkillLevel: filters.maxSkillLevel,
    });

    const handleSearch = (newFilters: TeamSearchFilters) => {
        setFilters(newFilters);
    };

    const teams = searchResult?.data || [];

    return (
        <PageContainer maxWidth="xl">
            <PageHeader
                title="Search Teams"
                subtitle="Find and join football teams near you."
            />

            {/* Filters */}
            <div className="mb-6">
                <TeamSearchFilter onSearch={handleSearch} isLoading={isLoading} />
            </div>

            {/* Results */}
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner size="lg" />
                </div>
            ) : teams.length === 0 ? (
                <EmptySearchState
                    type="team"
                    query={filters.query || ''}
                />
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teams.map((team) => (
                        <TeamResultCard key={team.teamId} team={team} />
                    ))}
                </div>
            )}
        </PageContainer>
    );
};

export default SearchTeamsPage;
