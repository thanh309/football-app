import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookingDetailsCard } from '../../components/owner';

const BookingDetailsPage: React.FC = () => {
    const { fieldId, bookingId } = useParams<{ fieldId: string; bookingId: string }>();

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <Link
                to={fieldId ? `/owner/fields/${fieldId}/bookings` : '/owner/bookings/requests'}
                className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Booking Requests
            </Link>

            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Booking Details</h1>
                <p className="text-gray-600 mt-1">View and manage this booking.</p>
            </div>

            <BookingDetailsCard bookingId={Number(bookingId)} />
        </div>
    );
};

export default BookingDetailsPage;
