import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { FormInput } from '../forms';
import { Button } from '../common';

interface OwnerSearchFilterProps {
    onSearch: (filters: OwnerSearchFilters) => void;
    isLoading?: boolean;
}

export interface OwnerSearchFilters {
    query: string;
    location?: string;
}

const OwnerSearchFilter: React.FC<OwnerSearchFilterProps> = ({ onSearch, isLoading }) => {
    const [filters, setFilters] = useState<OwnerSearchFilters>({
        query: '',
        location: '',
    });

    const handleChange = (field: keyof OwnerSearchFilters, value: string) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(filters);
    };

    const handleClear = () => {
        const clearedFilters: OwnerSearchFilters = { query: '', location: '' };
        setFilters(clearedFilters);
        onSearch(clearedFilters);
    };

    const hasFilters = filters.query || filters.location;

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                    <FormInput
                        label="Search Field Owners"
                        value={filters.query}
                        onChange={(e) => handleChange('query', e.target.value)}
                        placeholder="Owner name or business..."
                    />
                </div>

                <FormInput
                    label="Location"
                    value={filters.location || ''}
                    onChange={(e) => handleChange('location', e.target.value)}
                    placeholder="City or area..."
                />
            </div>

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

export default OwnerSearchFilter;
