import React from 'react';
import { useParams } from 'react-router-dom';
import { PageContainer, PageHeader } from '../../components/common';
import { FieldReviewView } from '../../components/moderator';

const FieldReviewPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <PageContainer maxWidth="md">
            <PageHeader
                title="Field Review"
                subtitle="Review field details and verify or reject the registration."
                backLink={{ label: 'Back to Pending Fields', to: '/mod/fields' }}
            />
            <FieldReviewView fieldId={Number(id)} />
        </PageContainer>
    );
};

export default FieldReviewPage;
