import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { FormInput, FormSelect } from '../forms';
import { Button } from '../common';

interface TeamSearchFilterProps {
    onSearch: (filters: TeamSearchFilters) => void;
    isLoading?: boolean;
}

export interface TeamSearchFilters {
    query: string;
    location?: string;
    skillLevel?: number;
}

const skillLevelOptions = [
    { value: '', label: 'Any Level' },
    { value: '1', label: '1 - Beginner' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5 - Intermediate' },
    { value: '6', label: '6' },
    { value: '7', label: '7' },
    { value: '8', label: '8' },
    { value: '9', label: '9' },
    { value: '10', label: '10 - Professional' },
];

const TeamSearchFilter: React.FC<TeamSearchFilterProps> = ({ onSearch, isLoading }) => {
    const [filters, setFilters] = useState<TeamSearchFilters>({
        query: '',
        location: '',
        skillLevel: undefined,
    });

    const handleChange = (field: keyof TeamSearchFilters, value: string | number | undefined) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(filters);
    };

    const handleClear = () => {
        const clearedFilters = { query: '', location: '', skillLevel: undefined };
        setFilters(clearedFilters);
        onSearch(clearedFilters);
    };

    const hasFilters = filters.query || filters.location || filters.skillLevel;

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                    <FormInput
                        label="Search Teams"
                        value={filters.query}
                        onChange={(e) => handleChange('query', e.target.value)}
                        placeholder="Team name..."
                    />
                </div>

                <FormInput
                    label="Location"
                    value={filters.location || ''}
                    onChange={(e) => handleChange('location', e.target.value)}
                    placeholder="City or area..."
                />

                <FormSelect
                    label="Skill Level"
                    value={filters.skillLevel?.toString() || ''}
                    onChange={(e) => handleChange('skillLevel', e.target.value ? parseInt(e.target.value) : undefined)}
                    options={skillLevelOptions}
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

export default TeamSearchFilter;
