import React from 'react';
import { useParams } from 'react-router-dom';
import { PageContainer, PageHeader } from '../../components/common';
import { FieldPricingEditor } from '../../components/owner';

const FieldPricingPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <PageContainer maxWidth="md">
            <PageHeader
                title="Field Pricing"
                subtitle="Set different prices for different time slots and days."
                backLink={{ label: 'Back to Field Dashboard', to: `/owner/fields/${id}` }}
            />
            <FieldPricingEditor fieldId={Number(id)} />
        </PageContainer>
    );
};

export default FieldPricingPage;
