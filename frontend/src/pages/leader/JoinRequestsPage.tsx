import React from 'react';
import { useParams } from 'react-router-dom';
import { PageContainer, PageHeader } from '../../components/common';
import { JoinRequestsList } from '../../components/leader';

const JoinRequestsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <PageContainer maxWidth="md">
            <PageHeader
                title="Join Requests"
                subtitle="Review and manage requests to join your team."
                backLink={{ label: 'Back to Team Dashboard', to: `/leader/teams/${id}` }}
            />
            <JoinRequestsList teamId={Number(id)} />
        </PageContainer>
    );
};

export default JoinRequestsPage;
