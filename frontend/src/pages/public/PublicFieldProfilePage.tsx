import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, CheckCircle } from 'lucide-react';
import { LoadingSpinner, Button, PageContainer, PageHeader, ContentCard } from '../../components/common';
import { BookFieldModal, ViewCalendarModal } from '../../components/booking';
import { FieldStatus, type FieldProfile } from '../../types';
import { useAuth } from '../../contexts';

// Mock data for demonstration
const mockField: FieldProfile = {
    fieldId: 1,
    ownerId: 1,
    fieldName: 'Green Valley Football Field',
    description: 'Professional-grade 7-a-side football pitch with artificial turf. Includes floodlights for evening games, changing rooms, and parking facilities. Perfect for friendly matches and training sessions.',
    location: '123 Sports Avenue, District 7, Ho Chi Minh City',
    latitude: 10.7285,
    longitude: 106.7052,
    defaultPricePerHour: 500000,
    capacity: 14,
    status: FieldStatus.VERIFIED,
    createdAt: '2023-06-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
};

const PublicFieldProfilePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = React.useState(true);
    const [field, setField] = React.useState<FieldProfile | null>(null);
    const { isAuthenticated } = useAuth();
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [showCalendarModal, setShowCalendarModal] = useState(false);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setField(mockField);
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [id]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    if (loading) {
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

            {/* Image Gallery Placeholder */}
            <div className="bg-slate-200 rounded-xl h-64 md:h-80 mb-6 flex items-center justify-center border border-slate-300">
                <div className="text-center text-slate-500">
                    <svg className="w-16 h-16 mx-auto mb-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>Field Photos</p>
                </div>
            </div>

            {/* Pricing and Actions */}
            <ContentCard className="mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <p className="text-sm text-slate-500">Starting from</p>
                        <p className="text-2xl font-bold text-primary-600">
                            {formatPrice(field.defaultPricePerHour)}
                        </p>
                        <p className="text-sm text-slate-500">per hour</p>
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
                <p className="text-slate-600 whitespace-pre-wrap">
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
                    <ul className="space-y-2">
                        <li className="flex items-center gap-2 text-slate-600">
                            <CheckCircle className="w-5 h-5 text-primary-500" />
                            Floodlights
                        </li>
                        <li className="flex items-center gap-2 text-slate-600">
                            <CheckCircle className="w-5 h-5 text-primary-500" />
                            Changing Rooms
                        </li>
                        <li className="flex items-center gap-2 text-slate-600">
                            <CheckCircle className="w-5 h-5 text-primary-500" />
                            Parking
                        </li>
                        <li className="flex items-center gap-2 text-slate-600">
                            <CheckCircle className="w-5 h-5 text-primary-500" />
                            Drinking Water
                        </li>
                    </ul>
                </ContentCard>
            </div>

            {/* Operating Hours */}
            <ContentCard title="Operating Hours">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <p className="text-sm text-slate-500">Mon - Fri</p>
                        <p className="font-medium text-slate-900">6:00 AM - 10:00 PM</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Saturday</p>
                        <p className="font-medium text-slate-900">6:00 AM - 11:00 PM</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Sunday</p>
                        <p className="font-medium text-slate-900">7:00 AM - 10:00 PM</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Holidays</p>
                        <p className="font-medium text-slate-900">7:00 AM - 9:00 PM</p>
                    </div>
                </div>
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
