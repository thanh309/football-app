import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { FormInput } from '../forms';
import { Button } from '../common';
import { useAllAmenities } from '../../api/hooks/useField';

interface FieldSearchFilterProps {
    onSearch: (filters: FieldSearchFilters) => void;
    isLoading?: boolean;
}

export interface FieldSearchFilters {
    query: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    amenityIds?: number[];
}

const FieldSearchFilter: React.FC<FieldSearchFilterProps> = ({ onSearch, isLoading }) => {
    const { data: amenities } = useAllAmenities();
    const [filters, setFilters] = useState<FieldSearchFilters>({
        query: '',
        location: '',
        minPrice: undefined,
        maxPrice: undefined,
        amenityIds: [],
    });

    const handleChange = (field: keyof FieldSearchFilters, value: string | number | undefined) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const toggleAmenity = (amenityId: number) => {
        setFilters(prev => ({
            ...prev,
            amenityIds: prev.amenityIds?.includes(amenityId)
                ? prev.amenityIds.filter(id => id !== amenityId)
                : [...(prev.amenityIds || []), amenityId],
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(filters);
    };

    const handleClear = () => {
        const clearedFilters: FieldSearchFilters = {
            query: '',
            location: '',
            minPrice: undefined,
            maxPrice: undefined,
            amenityIds: [],
        };
        setFilters(clearedFilters);
        onSearch(clearedFilters);
    };

    const hasFilters = filters.query || filters.location || filters.minPrice ||
        filters.maxPrice || (filters.amenityIds && filters.amenityIds.length > 0);

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                    <FormInput
                        label="Search Fields"
                        value={filters.query}
                        onChange={(e) => handleChange('query', e.target.value)}
                        placeholder="Field name..."
                    />
                </div>

                <FormInput
                    label="Location"
                    value={filters.location || ''}
                    onChange={(e) => handleChange('location', e.target.value)}
                    placeholder="City or area..."
                />

                <div className="grid grid-cols-2 gap-2">
                    <FormInput
                        label="Min Price"
                        type="number"
                        value={filters.minPrice?.toString() || ''}
                        onChange={(e) => handleChange('minPrice', e.target.value ? parseInt(e.target.value) : undefined)}
                        placeholder="0"
                    />
                    <FormInput
                        label="Max Price"
                        type="number"
                        value={filters.maxPrice?.toString() || ''}
                        onChange={(e) => handleChange('maxPrice', e.target.value ? parseInt(e.target.value) : undefined)}
                        placeholder="∞"
                    />
                </div>
            </div>

            {amenities && amenities.length > 0 && (
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                    <div className="flex flex-wrap gap-2">
                        {amenities.map((amenity) => (
                            <button
                                key={amenity.amenityId}
                                type="button"
                                onClick={() => toggleAmenity(amenity.amenityId)}
                                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${filters.amenityIds?.includes(amenity.amenityId)
                                        ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    } border`}
                            >
                                {amenity.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex items-center justify-end gap-3 mt-4">
                {hasFilters && (
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={handleClear}
                        leftIcon={<X className="w-4 h-4" />}
                    >
                        Clear
                    </Button>
                )}
                <Button
                    type="submit"
                    isLoading={isLoading}
                    leftIcon={<Search className="w-4 h-4" />}
                >
                    Search
                </Button>
            </div>
        </form>
    );
};

export default FieldSearchFilter;
