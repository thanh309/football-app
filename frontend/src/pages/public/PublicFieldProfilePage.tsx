import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, CheckCircle } from 'lucide-react';
import { LoadingSpinner, Button, PageContainer, PageHeader, ContentCard } from '../../components/common';
import { BookFieldModal, ViewCalendarModal } from '../../components/booking';
import { FieldStatus } from '../../types';
import { useAuth } from '../../contexts';
import { useField, useFieldAmenities } from '../../api/hooks/useField';

// Helper to get proper image URL (local uploads need API base URL prefix)
const getPhotoUrl = (storagePath: string): string => {
    if (storagePath.startsWith('http://') || storagePath.startsWith('https://')) {
        return storagePath; // External URL
    }
    // Local upload - prefix with API base URL
    const apiBaseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000';
    return `${apiBaseUrl}${storagePath}`;
};

const PublicFieldProfilePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const fieldId = parseInt(id || '0', 10);
    const { isAuthenticated } = useAuth();
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [showCalendarModal, setShowCalendarModal] = useState(false);

    const { data: field, isLoading } = useField(fieldId);
    const { data: amenities } = useFieldAmenities(fieldId);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!field) {
        return (
            <PageContainer maxWidth="md">
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Field Not Found</h2>
                    <Link to="/search/fields" className="text-primary-600 hover:underline">
                        Browse Fields
                    </Link>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer maxWidth="lg">
            <PageHeader
                title={field.fieldName}
                subtitle={
                    <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {field.location}
                    </span>
                }
                backLink={{ label: 'Back to Fields', to: '/search/fields' }}
                action={
                    field.status === FieldStatus.VERIFIED ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            <CheckCircle className="w-3.5 h-3.5 mr-1" />
                            Verified
                        </span>
                    ) : undefined
                }
            />

            {/* Cover Image */}
            {field.coverImage ? (
                <div className="rounded-xl h-64 md:h-80 mb-6 overflow-hidden">
                    <img
                        src={getPhotoUrl(field.coverImage)}
                        alt={`${field.fieldName} cover`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Field+Photo';
                        }}
                    />
                </div>
            ) : (
                <div className="bg-slate-200 rounded-xl h-64 md:h-80 mb-6 flex items-center justify-center border border-slate-300">
                    <div className="text-center text-slate-500">
                        <svg className="w-16 h-16 mx-auto mb-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p>No cover image</p>
                    </div>
                </div>
            )}

            {/* Pricing and Actions */}
            <ContentCard className="mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="text-left">
                        <p className="text-sm text-slate-500 text-left">Starting from</p>
                        <p className="text-2xl font-bold text-primary-600 text-left">
                            {formatPrice(field.defaultPricePerHour)}
                        </p>
                        <p className="text-sm text-slate-500 text-left">per hour</p>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        {isAuthenticated ? (
                            <Button variant="primary" onClick={() => setShowBookingModal(true)}>
                                Book Now
                            </Button>
                        ) : (
                            <Link to="/login">
                                <Button variant="outline">
                                    Log in to Book
                                </Button>
                            </Link>
                        )}
                        <Button variant="secondary" onClick={() => setShowCalendarModal(true)}>
                            View Calendar
                        </Button>
                    </div>
                </div>
            </ContentCard>

            {/* Description */}
            <ContentCard title="About This Field" className="mb-6">
                <p className="text-slate-600 whitespace-pre-wrap text-left">
                    {field.description || 'No description provided.'}
                </p>
            </ContentCard>

            {/* Details */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
                <ContentCard title="Field Details">
                    <dl className="space-y-3">
                        {field.capacity && (
                            <div className="flex justify-between">
                                <dt className="text-slate-500">Capacity</dt>
                                <dd className="font-medium text-slate-900">{field.capacity} players</dd>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <dt className="text-slate-500">Field Type</dt>
                            <dd className="font-medium text-slate-900">7-a-side</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-slate-500">Surface</dt>
                            <dd className="font-medium text-slate-900">Artificial Turf</dd>
                        </div>
                    </dl>
                </ContentCard>

                <ContentCard title="Amenities">
                    {amenities && amenities.length > 0 ? (
                        <ul className="space-y-2">
                            {amenities.map((amenity) => (
                                <li key={amenity.amenityId} className="flex items-center gap-2 text-slate-600">
                                    <CheckCircle className="w-5 h-5 text-primary-500" />
                                    {amenity.name}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-slate-500 text-center py-4">No amenities listed.</p>
                    )}
                </ContentCard>
            </div>

            {/* Operating Hours - Note: This would need to come from API in a real implementation */}
            <ContentCard title="Operating Hours">
                <p className="text-slate-500 py-4 text-left">Contact owner for operating hours.</p>
            </ContentCard>

            {/* Modals */}
            {showBookingModal && (
                <BookFieldModal
                    fieldId={field.fieldId}
                    fieldName={field.fieldName}
                    pricePerHour={field.defaultPricePerHour}
                    isOpen={showBookingModal}
                    onClose={() => setShowBookingModal(false)}
                />
            )}
            {showCalendarModal && (
                <ViewCalendarModal
                    fieldId={field.fieldId}
                    fieldName={field.fieldName}
                    isOpen={showCalendarModal}
                    onClose={() => setShowCalendarModal(false)}
                />
            )}
        </PageContainer>
    );
};

export default PublicFieldProfilePage;
