import React from 'react';
import { useParams } from 'react-router-dom';
import { PageContainer, PageHeader } from '../../components/common';
import { BookingRequestsList } from '../../components/owner';

const BookingRequestsPage: React.FC = () => {
    const { fieldId } = useParams<{ fieldId: string }>();

    const backLink = fieldId
        ? { label: 'Back to Field Dashboard', to: `/owner/fields/${fieldId}` }
        : { label: 'Back to Booking Dashboard', to: '/owner/bookings' };

    return (
        <PageContainer maxWidth="md">
            <PageHeader
                title="Booking Requests"
                subtitle="Review and manage pending booking requests."
                backLink={backLink}
            />
            <BookingRequestsList fieldId={fieldId ? Number(fieldId) : undefined} />
        </PageContainer>
    );
};

export default BookingRequestsPage;
