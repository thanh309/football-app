import React, { useState } from 'react';
import { PageContainer, PageHeader, LoadingSpinner } from '../../components/common';
import {
    FieldSearchFilter,
    FieldResultCard,
    EmptySearchState,
    type FieldSearchFilters,
} from '../../components/search';
import { useSearchFields } from '../../api/hooks/useSearch';

const SearchFieldsPage: React.FC = () => {
    const [filters, setFilters] = useState<FieldSearchFilters>({ query: '' });

    const { data: searchResult, isLoading } = useSearchFields({
        query: filters.query || '',
        location: filters.location,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        amenityIds: filters.amenityIds,
    });

    const handleSearch = (newFilters: FieldSearchFilters) => {
        setFilters(newFilters);
    };

    const fields = searchResult?.data || [];

    return (
        <PageContainer maxWidth="xl">
            <PageHeader
                title="Search Fields"
                subtitle="Find and book football fields near you."
            />

            {/* Filters */}
            <div className="mb-6">
                <FieldSearchFilter onSearch={handleSearch} isLoading={isLoading} />
            </div>

            {/* Results */}
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner size="lg" />
                </div>
            ) : fields.length === 0 ? (
                <EmptySearchState
                    type="field"
                    query={filters.query || ''}
                />
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {fields.map((field) => (
                        <FieldResultCard key={field.fieldId} field={field} />
                    ))}
                </div>
            )}
        </PageContainer>
    );
};

export default SearchFieldsPage;
