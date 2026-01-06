import { Shield, MapPin, Eye } from 'lucide-react';
import { LoadingSpinner, EmptyState, Button } from '../common';
import { usePendingFields } from '../../api/hooks/useModeration';
import type { FieldProfile } from '../../types';
import { Link } from 'react-router-dom';

const PendingFieldsListView: React.FC = () => {
    const { data: fields, isLoading, error } = usePendingFields();

    if (isLoading) {
        return <LoadingSpinner text="Loading pending fields..." />;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">Failed to load pending fields</div>;
    }

    if (!fields || fields.length === 0) {
        return (
            <EmptyState
                title="No Pending Fields"
                description="All fields have been reviewed. Great job! 🌟"
            />
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Pending Fields</h2>
                        <p className="text-sm text-gray-500">Review and verify new field registrations</p>
                    </div>
                </div>
                <span className="bg-amber-100 text-amber-700 text-sm px-3 py-1 rounded-full">
                    {fields.length} pending
                </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {fields.map((field: FieldProfile) => (
                    <div
                        key={field.fieldId}
                        className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                    >
                        <div className="p-5">
                            <div className="mb-3">
                                <h3 className="font-semibold text-gray-900">{field.fieldName}</h3>
                                <p className="text-sm text-gray-500">Owner #{field.ownerId}</p>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                                <MapPin className="w-4 h-4 text-emerald-500" />
                                <span className="line-clamp-1">{field.location}</span>
                            </div>

                            <div className="text-lg font-semibold text-emerald-600 mb-3">
                                ${(field as any).pricePerHour ?? 0}/hour
                            </div>

                            <div className="flex items-center justify-between text-sm text-gray-500">
                                <span>
                                    Created {new Date(field.createdAt).toLocaleDateString()}
                                </span>
                                <Link to={`/mod/fields/${field.fieldId}`}>
                                    <Button size="sm" variant="outline" leftIcon={<Eye className="w-4 h-4" />}>
                                        Review
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PendingFieldsListView;
