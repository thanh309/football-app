import React from 'react';
import { PageContainer, PageHeader } from '../../components/common';
import { ReportedContentListView } from '../../components/moderator';

const ReportedContentPage: React.FC = () => {
    return (
        <PageContainer maxWidth="md">
            <PageHeader
                title="Reported Content"
                subtitle="Review and take action on content reported by users."
                backLink={{ label: 'Back to Dashboard', to: '/mod' }}
            />
            <ReportedContentListView />
        </PageContainer>
    );
};

export default ReportedContentPage;
