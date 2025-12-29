import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { FormInput, FormSelect } from '../forms';
import { Button } from '../common';

interface PlayerSearchFilterProps {
    onSearch: (filters: PlayerSearchFilters) => void;
    isLoading?: boolean;
}

export interface PlayerSearchFilters {
    query: string;
    position?: string;
    minSkillLevel?: number;
    maxSkillLevel?: number;
}

const positionOptions = [
    { value: '', label: 'Any Position' },
    { value: 'Goalkeeper', label: 'Goalkeeper' },
    { value: 'Defender', label: 'Defender' },
    { value: 'Midfielder', label: 'Midfielder' },
    { value: 'Forward', label: 'Forward' },
];

const skillLevelOptions = [
    { value: '', label: 'Any' },
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5' },
    { value: '6', label: '6' },
    { value: '7', label: '7' },
    { value: '8', label: '8' },
    { value: '9', label: '9' },
    { value: '10', label: '10' },
];

const PlayerSearchFilter: React.FC<PlayerSearchFilterProps> = ({ onSearch, isLoading }) => {
    const [filters, setFilters] = useState<PlayerSearchFilters>({
        query: '',
        position: '',
        minSkillLevel: undefined,
        maxSkillLevel: undefined,
    });

    const handleChange = (field: keyof PlayerSearchFilters, value: string | number | undefined) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(filters);
    };

    const handleClear = () => {
        const clearedFilters: PlayerSearchFilters = {
            query: '',
            position: '',
            minSkillLevel: undefined,
            maxSkillLevel: undefined,
        };
        setFilters(clearedFilters);
        onSearch(clearedFilters);
    };

    const hasFilters = filters.query || filters.position || filters.minSkillLevel || filters.maxSkillLevel;

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                    <FormInput
                        label="Search Players"
                        value={filters.query}
                        onChange={(e) => handleChange('query', e.target.value)}
                        placeholder="Player name..."
                    />
                </div>

                <FormSelect
                    label="Position"
                    value={filters.position || ''}
                    onChange={(e) => handleChange('position', e.target.value || undefined)}
                    options={positionOptions}
                />

                <div className="grid grid-cols-2 gap-2">
                    <FormSelect
                        label="Min Skill"
                        value={filters.minSkillLevel?.toString() || ''}
                        onChange={(e) => handleChange('minSkillLevel', e.target.value ? parseInt(e.target.value) : undefined)}
                        options={skillLevelOptions}
                    />
                    <FormSelect
                        label="Max Skill"
                        value={filters.maxSkillLevel?.toString() || ''}
                        onChange={(e) => handleChange('maxSkillLevel', e.target.value ? parseInt(e.target.value) : undefined)}
                        options={skillLevelOptions}
                    />
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

export default PlayerSearchFilter;
