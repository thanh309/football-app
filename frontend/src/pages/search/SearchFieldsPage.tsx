import React, { useState } from 'react';
import { PageContainer, PageHeader, LoadingSpinner } from '../../components/common';
import {
    FieldSearchFilter,
    FieldResultCard,
    EmptySearchState,
    type FieldSearchFilters,
} from '../../components/search';
import { FieldStatus, type FieldProfile } from '../../types';

// Extended mock data with amenity IDs
interface FieldWithAmenities extends FieldProfile {
    amenityIds: number[];
}

const mockFields: FieldWithAmenities[] = [
    {
        fieldId: 1,
        ownerId: 1,
        fieldName: 'Green Valley Football Field',
        description: 'Professional-grade 7-a-side football pitch.',
        location: 'District 7, Ho Chi Minh City',
        defaultPricePerHour: 500000,
        capacity: 14,
        status: FieldStatus.VERIFIED,
        createdAt: '2023-06-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        amenityIds: [1, 2, 3, 5],
    },
    {
        fieldId: 2,
        ownerId: 2,
        fieldName: 'Sunrise Sports Complex',
        description: 'Modern facility with artificial turf.',
        location: 'Binh Thanh District',
        defaultPricePerHour: 600000,
        capacity: 14,
        status: FieldStatus.VERIFIED,
        createdAt: '2023-08-15T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        amenityIds: [1, 2, 3, 4, 5],
    },
    {
        fieldId: 3,
        ownerId: 3,
        fieldName: 'Central Park Arena',
        description: '5-a-side indoor football field.',
        location: 'District 1',
        defaultPricePerHour: 400000,
        capacity: 10,
        status: FieldStatus.VERIFIED,
        createdAt: '2023-09-20T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        amenityIds: [2, 4],
    },
];

const SearchFieldsPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [fields, setFields] = useState<FieldWithAmenities[]>(mockFields);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const handleSearch = (filters: FieldSearchFilters) => {
        setSearchQuery(filters.query || '');
        setLoading(true);
        setTimeout(() => {
            let filtered = [...mockFields];
            if (filters.query) {
                filtered = filtered.filter((f) =>
                    f.fieldName.toLowerCase().includes(filters.query.toLowerCase())
                );
            }
            if (filters.location) {
                filtered = filtered.filter((f) =>
                    f.location.toLowerCase().includes(filters.location!.toLowerCase())
                );
            }
            if (filters.minPrice !== undefined) {
                filtered = filtered.filter((f) => f.defaultPricePerHour >= filters.minPrice!);
            }
            if (filters.maxPrice !== undefined) {
                filtered = filtered.filter((f) => f.defaultPricePerHour <= filters.maxPrice!);
            }
            if (filters.amenityIds && filters.amenityIds.length > 0) {
                filtered = filtered.filter((f) =>
                    filters.amenityIds!.every((amenityId) => f.amenityIds.includes(amenityId))
                );
            }
            setFields(filtered);
            setLoading(false);
        }, 300);
    };

    return (
        <PageContainer maxWidth="xl">
            <PageHeader
                title="Search Fields"
                subtitle="Find and book football fields near you."
            />

            {/* Filters */}
            <div className="mb-6">
                <FieldSearchFilter onSearch={handleSearch} isLoading={loading} />
            </div>

            {/* Results */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner size="lg" />
                </div>
            ) : fields.length === 0 ? (
                <EmptySearchState
                    type="field"
                    query={searchQuery}
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
