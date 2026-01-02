import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { OwnerSearchFilter, EmptySearchState, type OwnerSearchFilters } from '../../components/search';
import { LoadingSpinner, PageContainer, PageHeader } from '../../components/common';
import { useSearchOwners } from '../../api/hooks/useSearch';

const SearchOwnersPage: React.FC = () => {
    const [filters, setFilters] = useState<OwnerSearchFilters>({ query: '' });

    const { data: searchResult, isLoading } = useSearchOwners({
        query: filters.query || '',
        location: filters.location,
    });

    const handleSearch = (newFilters: OwnerSearchFilters) => {
        setFilters(newFilters);
    };

    const owners = searchResult?.data || [];

    return (
        <PageContainer maxWidth="xl">
            <PageHeader
                title="Search Field Owners"
                subtitle="Find football field owners and venues."
            />

            {/* Filters */}
            <div className="mb-6">
                <OwnerSearchFilter onSearch={handleSearch} isLoading={isLoading} />
            </div>

            {/* Results */}
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner size="lg" />
                </div>
            ) : owners.length === 0 ? (
                <EmptySearchState type="owner" query={filters.query || ''} />
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {owners.map((owner) => (
                        <div key={owner.userId} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                                    <span className="text-xl font-bold text-primary-600">
                                        {owner.username.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">{owner.username}</h3>
                                    <p className="text-sm text-slate-500">{owner.location}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {owner.isVerified && (
                                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                                            Verified
                                        </span>
                                    )}
                                </div>
                                <Link
                                    to={`/search/owners/${owner.userId}`}
                                    className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                                >
                                    View Profile
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </PageContainer>
    );
};

export default SearchOwnersPage;
