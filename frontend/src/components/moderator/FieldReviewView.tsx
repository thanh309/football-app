import { MapPin, Calendar, Shield, DollarSign, Users } from 'lucide-react';
import { LoadingSpinner } from '../common';
import { useFieldForReview } from '../../api/hooks/useModeration';
import VerifyFieldButtons from './VerifyFieldButtons';

interface FieldReviewViewProps {
    fieldId: number;
}

const FieldReviewView: React.FC<FieldReviewViewProps> = ({ fieldId }) => {
    const { data: field, isLoading, error } = useFieldForReview(fieldId);

    if (isLoading) {
        return <LoadingSpinner text="Loading field details..." />;
    }

    if (error || !field) {
        return <div className="text-center py-8 text-red-500">Failed to load field details</div>;
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <h1 className="text-2xl font-bold text-gray-900">{field.fieldName}</h1>
                                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                                    {field.status}
                                </span>
                            </div>
                            {field.description && (
                                <p className="text-gray-600 text-left">{field.description}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-blue-500" />
                        Field Information
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-500">Field ID</p>
                            <p className="font-medium text-gray-900">{field.fieldId}</p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-500">Owner ID</p>
                            <p className="font-medium text-gray-900">{field.ownerId}</p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 col-span-2">
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                <MapPin className="w-4 h-4" /> Location
                            </p>
                            <p className="font-medium text-gray-900">{field.location}</p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                <DollarSign className="w-4 h-4" /> Price per Hour
                            </p>
                            <p className="font-medium text-emerald-600">${field.defaultPricePerHour}</p>
                        </div>

                        {field.capacity && (
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                    <Users className="w-4 h-4" /> Capacity
                                </p>
                                <p className="font-medium text-gray-900">{field.capacity} players</p>
                            </div>
                        )}

                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                <Calendar className="w-4 h-4" /> Created
                            </p>
                            <p className="font-medium text-gray-900">
                                {new Date(field.createdAt).toLocaleDateString()}
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-500">Status</p>
                            <p className="font-medium text-amber-600">{field.status}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <VerifyFieldButtons fieldId={fieldId} />
                </div>
            </div>
        </div>
    );
};

export default FieldReviewView;
