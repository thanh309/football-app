import { Link } from 'react-router-dom';
import { MapPin, DollarSign, ChevronRight, Building2 } from 'lucide-react';
import type { FieldProfile } from '../../types';
import { useAuth } from '../../contexts';

interface FieldResultCardProps {
    field: FieldProfile;
}

const FieldResultCard: React.FC<FieldResultCardProps> = ({ field }) => {
    const { isAuthenticated } = useAuth();

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Verified':
                return 'bg-green-100 text-green-700';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden">
            {/* Image placeholder */}
            <div className="h-40 bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
                <Building2 className="w-12 h-12 text-emerald-300" />
            </div>

            <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-lg text-left">{field.fieldName}</h3>
                        {field.location && (
                            <p className="text-sm text-gray-500 flex items-start gap-1 mt-0.5 text-left">
                                <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                                <span>{field.location}</span>
                            </p>
                        )}
                    </div>
                    <span className={`flex-shrink-0 text-xs px-2.5 py-1 rounded-full font-medium ${getStatusBadge(field.status)}`}>
                        {field.status}
                    </span>
                </div>

                {field.description && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{field.description}</p>
                )}

                <div className="flex items-center gap-4 mt-3">
                    {field.defaultPricePerHour && (
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-700">
                            <DollarSign className="w-4 h-4 text-emerald-500" />
                            {field.defaultPricePerHour.toLocaleString()}/hr
                        </span>
                    )}
                    {field.capacity && (
                        <span className="text-sm text-gray-500">
                            Capacity: {field.capacity}
                        </span>
                    )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <Link
                        to={`/search/fields/${field.fieldId}`}
                        className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
                    >
                        View Details
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                    {isAuthenticated && (
                        <Link
                            to={`/search/fields/${field.fieldId}`}
                            className="text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            Book Now
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FieldResultCard;
