import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { LoadingSpinner, Button } from '../../components/common';
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

    React.useEffect(() => {
        // Simulate API call
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
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Field Not Found</h2>
                    <Link to="/fields" className="text-emerald-600 hover:underline">
                        Browse Fields
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Image Gallery Placeholder */}
            <div className="bg-gray-200 rounded-2xl h-64 md:h-80 mb-6 flex items-center justify-center">
                <div className="text-center text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>Field Photos</p>
                </div>
            </div>

            {/* Header */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                {field.fieldName}
                            </h1>
                            {field.status === FieldStatus.VERIFIED && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                    <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Verified
                                </span>
                            )}
                        </div>

                        <p className="text-gray-600 flex items-center gap-2 mb-4">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {field.location}
                        </p>
                    </div>

                    <div className="text-right">
                        <p className="text-sm text-gray-500">Starting from</p>
                        <p className="text-2xl font-bold text-emerald-600">
                            {formatPrice(field.defaultPricePerHour)}
                        </p>
                        <p className="text-sm text-gray-500">per hour</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-4">
                    {isAuthenticated ? (
                        <Button variant="primary">
                            Book Now
                        </Button>
                    ) : (
                        <Link to="/login">
                            <Button variant="outline">
                                Log in to Book
                            </Button>
                        </Link>
                    )}
                    <Button variant="secondary">
                        View Calendar
                    </Button>
                </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">About This Field</h2>
                <p className="text-gray-600 whitespace-pre-wrap">
                    {field.description || 'No description provided.'}
                </p>
            </div>

            {/* Details */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Field Details</h2>
                    <dl className="space-y-3">
                        {field.capacity && (
                            <div className="flex justify-between">
                                <dt className="text-gray-500">Capacity</dt>
                                <dd className="font-medium text-gray-900">{field.capacity} players</dd>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <dt className="text-gray-500">Field Type</dt>
                            <dd className="font-medium text-gray-900">7-a-side</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-gray-500">Surface</dt>
                            <dd className="font-medium text-gray-900">Artificial Turf</dd>
                        </div>
                    </dl>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h2>
                    <ul className="space-y-2">
                        <li className="flex items-center gap-2 text-gray-600">
                            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Floodlights
                        </li>
                        <li className="flex items-center gap-2 text-gray-600">
                            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Changing Rooms
                        </li>
                        <li className="flex items-center gap-2 text-gray-600">
                            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Parking
                        </li>
                        <li className="flex items-center gap-2 text-gray-600">
                            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Drinking Water
                        </li>
                    </ul>
                </div>
            </div>

            {/* Operating Hours */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Operating Hours</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <p className="text-sm text-gray-500">Mon - Fri</p>
                        <p className="font-medium text-gray-900">6:00 AM - 10:00 PM</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Saturday</p>
                        <p className="font-medium text-gray-900">6:00 AM - 11:00 PM</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Sunday</p>
                        <p className="font-medium text-gray-900">7:00 AM - 10:00 PM</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Holidays</p>
                        <p className="font-medium text-gray-900">7:00 AM - 9:00 PM</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicFieldProfilePage;
