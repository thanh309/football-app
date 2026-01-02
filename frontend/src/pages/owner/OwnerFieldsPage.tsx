import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, MapPin } from 'lucide-react';
import { Button, LoadingSpinner, EmptyState, PageContainer, PageHeader } from '../../components/common';
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
        <PageContainer maxWidth="lg">
            <PageHeader
                title="My Fields"
                subtitle="Manage your registered football fields."
                action={
                    <Link to="/owner/fields/create">
                        <Button leftIcon={<Plus className="w-5 h-5" />}>
                            Register New Field
                        </Button>
                    </Link>
                }
            />

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
                            className="block bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow"
                        >
                            <div className="h-40 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                                <MapPin className="w-16 h-16 text-white/50" />
                            </div>
                            <div className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-semibold text-slate-900">{field.fieldName}</h3>
                                    <span className={`text-xs px-2 py-1 rounded-full ${field.status === FieldStatus.VERIFIED
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : field.status === FieldStatus.PENDING
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : 'bg-red-100 text-red-700'
                                        }`}>
                                        {field.status}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-500 line-clamp-2">{field.location}</p>
                                <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
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
        </PageContainer>
    );
};

export default OwnerFieldsPage;
