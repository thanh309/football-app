import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { FormInput } from '../forms';
import { Button } from '../common';

interface TeamSearchFilterProps {
    onSearch: (filters: TeamSearchFilters) => void;
    isLoading?: boolean;
}

export interface TeamSearchFilters {
    query: string;
    location?: string;
    minSkillLevel?: number;
    maxSkillLevel?: number;
}

const TeamSearchFilter: React.FC<TeamSearchFilterProps> = ({ onSearch, isLoading }) => {
    const [filters, setFilters] = useState<TeamSearchFilters>({
        query: '',
        location: '',
        minSkillLevel: 1,
        maxSkillLevel: 10,
    });

    const handleChange = (field: keyof TeamSearchFilters, value: string | number | undefined) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleMinChange = (value: number) => {
        const clampedValue = Math.max(1, Math.min(value, filters.maxSkillLevel || 10));
        handleChange('minSkillLevel', clampedValue);
    };

    const handleMaxChange = (value: number) => {
        const clampedValue = Math.max(filters.minSkillLevel || 1, Math.min(value, 10));
        handleChange('maxSkillLevel', clampedValue);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(filters);
    };

    const handleClear = () => {
        const clearedFilters = { query: '', location: '', minSkillLevel: 1, maxSkillLevel: 10 };
        setFilters(clearedFilters);
        onSearch(clearedFilters);
    };

    const hasFilters = filters.query || filters.location ||
        filters.minSkillLevel !== 1 || filters.maxSkillLevel !== 10;

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
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

                {/* Skill Level Range - Two number inputs */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Skill Level Range
                    </label>
                    <div className="flex items-center gap-2">
                        <div className="flex-1">
                            <input
                                type="number"
                                min="1"
                                max="10"
                                value={filters.minSkillLevel || 1}
                                onChange={(e) => handleMinChange(parseInt(e.target.value) || 1)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                            <p className="text-xs text-gray-400 text-center mt-1">Min</p>
                        </div>
                        <span className="text-gray-400 font-medium">—</span>
                        <div className="flex-1">
                            <input
                                type="number"
                                min="1"
                                max="10"
                                value={filters.maxSkillLevel || 10}
                                onChange={(e) => handleMaxChange(parseInt(e.target.value) || 10)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                            <p className="text-xs text-gray-400 text-center mt-1">Max</p>
                        </div>
                    </div>
                </div>
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


