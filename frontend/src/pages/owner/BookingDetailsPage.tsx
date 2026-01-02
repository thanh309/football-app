import React from 'react';
import { useParams } from 'react-router-dom';
import { PageContainer, PageHeader } from '../../components/common';
import { BookingDetailsCard } from '../../components/owner';

const BookingDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <PageContainer maxWidth="md">
            <PageHeader
                title="Booking Details"
                subtitle="View and manage this booking."
                backLink={{ label: 'Back to Booking Requests', to: '/owner/bookings/requests' }}
            />
            <BookingDetailsCard bookingId={Number(id)} />
        </PageContainer>
    );
};

export default BookingDetailsPage;
