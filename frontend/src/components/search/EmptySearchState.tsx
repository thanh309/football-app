import { Search, Users, Building2, User, HelpCircle } from 'lucide-react';
import { Button } from '../common';

type SearchType = 'team' | 'field' | 'player' | 'owner' | 'general';

interface EmptySearchStateProps {
    type?: SearchType;
    query?: string;
    onClear?: () => void;
}

const getIcon = (type: SearchType) => {
    switch (type) {
        case 'team':
            return <Users className="w-16 h-16 text-gray-300" />;
        case 'field':
            return <Building2 className="w-16 h-16 text-gray-300" />;
        case 'player':
            return <User className="w-16 h-16 text-gray-300" />;
        case 'owner':
            return <Building2 className="w-16 h-16 text-gray-300" />;
        default:
            return <Search className="w-16 h-16 text-gray-300" />;
    }
};

const getMessage = (type: SearchType, query?: string) => {
    const typeLabel = {
        team: 'teams',
        field: 'fields',
        player: 'players',
        owner: 'field owners',
        general: 'results',
    };

    if (query) {
        return `No ${typeLabel[type]} found for "${query}"`;
    }

    return `No ${typeLabel[type]} found`;
};

const getSuggestions = (type: SearchType) => {
    switch (type) {
        case 'team':
            return [
                'Try searching with different keywords',
                'Check for typos in your search',
                'Try a broader location search',
                'Adjust the skill level filter',
            ];
        case 'field':
            return [
                'Try searching in a different location',
                'Adjust the price range',
                'Remove some amenity filters',
                'Search with a partial field name',
            ];
        case 'player':
            return [
                'Try searching with different keywords',
                'Select a different position',
                'Expand the skill level range',
                'Check for typos in the player name',
            ];
        case 'owner':
            return [
                'Try a different location',
                'Search with partial business name',
                'Expand your search area',
            ];
        default:
            return [
                'Try different search terms',
                'Check your spelling',
                'Use fewer filters',
            ];
    }
};

const EmptySearchState: React.FC<EmptySearchStateProps> = ({
    type = 'general',
    query,
    onClear,
}) => {
    const suggestions = getSuggestions(type);

    return (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="mb-6">{getIcon(type)}</div>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {getMessage(type, query)}
            </h3>

            <p className="text-gray-500 mb-6 max-w-md">
                We couldn't find any matches for your search. Try adjusting your filters or search terms.
            </p>

            <div className="bg-gray-50 rounded-xl p-5 mb-6 max-w-sm">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                    <HelpCircle className="w-4 h-4" />
                    Suggestions
                </div>
                <ul className="text-sm text-gray-600 text-left space-y-2">
                    {suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-2">
                            <span className="text-emerald-500 mt-0.5">•</span>
                            {suggestion}
                        </li>
                    ))}
                </ul>
            </div>

            {onClear && (
                <Button variant="outline" onClick={onClear}>
                    Clear Filters
                </Button>
            )}
        </div>
    );
};

export default EmptySearchState;
