import React, { useState } from 'react';
import {
    TeamSearchFilter,
    TeamResultCard,
    EmptySearchState,
    type TeamSearchFilters,
} from '../../components/search';
import { LoadingSpinner } from '../../components/common';
import { TeamStatus, type TeamProfile } from '../../types';

// Mock data
const mockTeams: TeamProfile[] = [
    {
        teamId: 1,
        teamName: 'FC Thunder',
        description: 'Competitive amateur team looking for skilled players.',
        logoUrl: 'https://via.placeholder.com/100',
        leaderId: 1,
        status: TeamStatus.VERIFIED,
        location: 'Ho Chi Minh City',
        skillLevel: 7,
        createdAt: '2023-01-15T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
    },
    {
        teamId: 2,
        teamName: 'City United',
        description: 'Friendly social team, all skill levels welcome.',
        logoUrl: 'https://via.placeholder.com/100',
        leaderId: 2,
        status: TeamStatus.VERIFIED,
        location: 'District 2',
        skillLevel: 5,
        createdAt: '2023-03-20T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
    },
    {
        teamId: 3,
        teamName: 'Rising Stars FC',
        description: 'Youth-focused team developing future talent.',
        logoUrl: 'https://via.placeholder.com/100',
        leaderId: 3,
        status: TeamStatus.VERIFIED,
        location: 'Binh Thanh',
        skillLevel: 4,
        createdAt: '2023-06-10T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
    },
];

const SearchTeamsPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [teams, setTeams] = useState<TeamProfile[]>(mockTeams);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const handleSearch = (filters: TeamSearchFilters) => {
        setSearchQuery(filters.query || '');
        setLoading(true);
        // Simulate search
        setTimeout(() => {
            let filtered = [...mockTeams];
            if (filters.query) {
                filtered = filtered.filter((t) =>
                    t.teamName.toLowerCase().includes(filters.query.toLowerCase())
                );
            }
            if (filters.location) {
                filtered = filtered.filter((t) =>
                    t.location?.toLowerCase().includes(filters.location!.toLowerCase())
                );
            }
            if (filters.minSkillLevel !== undefined && filters.maxSkillLevel !== undefined) {
                filtered = filtered.filter((t) =>
                    t.skillLevel !== undefined &&
                    t.skillLevel >= filters.minSkillLevel! &&
                    t.skillLevel <= filters.maxSkillLevel!
                );
            }
            setTeams(filtered);
            setLoading(false);
        }, 300);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Search Teams</h1>
                <p className="text-gray-600 mt-1">Find and join football teams near you.</p>
            </div>

            {/* Filters */}
            <div className="mb-6">
                <TeamSearchFilter onSearch={handleSearch} isLoading={loading} />
            </div>

            {/* Results */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner size="lg" />
                </div>
            ) : teams.length === 0 ? (
                <EmptySearchState
                    type="team"
                    query={searchQuery}
                />
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teams.map((team) => (
                        <TeamResultCard key={team.teamId} team={team} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchTeamsPage;
