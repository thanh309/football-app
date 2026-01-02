import React from 'react';
import { PageContainer, PageHeader } from '../../components/common';
import { ModerationHistoryView } from '../../components/moderator';

const ModerationHistoryPage: React.FC = () => {
    return (
        <PageContainer maxWidth="md">
            <PageHeader
                title="Moderation History"
                subtitle="View the history of all moderation actions taken."
                backLink={{ label: 'Back to Dashboard', to: '/mod' }}
            />
            <ModerationHistoryView />
        </PageContainer>
    );
};

export default ModerationHistoryPage;
