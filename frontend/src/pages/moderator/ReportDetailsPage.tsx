import React from 'react';
import { useParams } from 'react-router-dom';
import { PageContainer, PageHeader } from '../../components/common';
import { ReportDetailsView } from '../../components/moderator';

const ReportDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <PageContainer maxWidth="md">
            <PageHeader
                title="Report Details"
                subtitle="Review the report and take appropriate moderation action."
                backLink={{ label: 'Back to Reported Content', to: '/mod/reports' }}
            />
            <ReportDetailsView reportId={Number(id)} />
        </PageContainer>
    );
};

export default ReportDetailsPage;
