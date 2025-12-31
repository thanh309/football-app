import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, MapPin } from 'lucide-react';
import { Button, LoadingSpinner, EmptyState } from '../../components/common';
import { useOwnerFields } from '../../api/hooks/useField';
import { useAuth } from '../../contexts';
import { FieldStatus } from '../../types';

const OwnerFieldsPage: React.FC = () => {
    const { user } = useAuth();
    const { data: fields, isLoading } = useOwnerFields(user?.userId || 0);

    if (isLoading) {
        return <LoadingSpinner text="Loading your fields..." />;
    }

    const handleRegisterField = () => {
        window.location.href = '/owner/fields/create';
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Fields</h1>
                    <p className="text-gray-600 mt-1">Manage your registered football fields.</p>
                </div>
                <Link to="/owner/fields/create">
                    <Button leftIcon={<Plus className="w-5 h-5" />}>
                        Register New Field
                    </Button>
                </Link>
            </div>

            {!fields || fields.length === 0 ? (
                <EmptyState
                    title="No fields registered"
                    description="You haven't registered any fields yet. Register your first field to start receiving bookings."
                    actionLabel="Register Your First Field"
                    onAction={handleRegisterField}
                />
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {fields.map((field) => (
                        <Link
                            key={field.fieldId}
                            to={`/owner/fields/${field.fieldId}`}
                            className="block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                        >
                            <div className="h-40 bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center">
                                <MapPin className="w-16 h-16 text-white/50" />
                            </div>
                            <div className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-semibold text-gray-900">{field.fieldName}</h3>
                                    <span className={`text-xs px-2 py-1 rounded-full ${field.status === FieldStatus.VERIFIED
                                        ? 'bg-green-100 text-green-700'
                                        : field.status === FieldStatus.PENDING
                                            ? 'bg-yellow-100 text-yellow-700'
                                            : 'bg-red-100 text-red-700'
                                        }`}>
                                        {field.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 line-clamp-2">{field.location}</p>
                                <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                                    <span>{field.defaultPricePerHour?.toLocaleString() || 0} VND/hr</span>
                                    {field.capacity && (
                                        <>
                                            <span>•</span>
                                            <span>Capacity: {field.capacity}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OwnerFieldsPage;
