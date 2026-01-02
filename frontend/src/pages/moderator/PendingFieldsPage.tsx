import React from 'react';
import { PageContainer, PageHeader } from '../../components/common';
import { PendingFieldsListView } from '../../components/moderator';

const PendingFieldsPage: React.FC = () => {
    return (
        <PageContainer maxWidth="md">
            <PageHeader
                title="Pending Fields"
                subtitle="Review and verify new field registration requests."
                backLink={{ label: 'Back to Dashboard', to: '/mod' }}
            />
            <PendingFieldsListView />
        </PageContainer>
    );
};

export default PendingFieldsPage;
