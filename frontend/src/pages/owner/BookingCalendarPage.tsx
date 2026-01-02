import React from 'react';
import { useParams } from 'react-router-dom';
import { PageContainer, PageHeader } from '../../components/common';
import { BookingCalendarView } from '../../components/owner';

const BookingCalendarPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <PageContainer maxWidth="xl">
            <PageHeader
                title="Booking Calendar"
                subtitle="View and manage all bookings for this field."
                backLink={{ label: 'Back to Field Dashboard', to: `/owner/fields/${id}` }}
            />
            <BookingCalendarView fieldId={Number(id)} />
        </PageContainer>
    );
};

export default BookingCalendarPage;
