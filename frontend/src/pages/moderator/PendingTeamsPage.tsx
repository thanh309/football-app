import React from 'react';
import { PageContainer, PageHeader } from '../../components/common';
import { PendingTeamsListView } from '../../components/moderator';

const PendingTeamsPage: React.FC = () => {
    return (
        <PageContainer maxWidth="md">
            <PageHeader
                title="Pending Teams"
                subtitle="Review and verify new team registration requests."
                backLink={{ label: 'Back to Dashboard', to: '/mod' }}
            />
            <PendingTeamsListView />
        </PageContainer>
    );
};

export default PendingTeamsPage;
