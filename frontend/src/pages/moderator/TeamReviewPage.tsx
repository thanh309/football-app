import React from 'react';
import { useParams } from 'react-router-dom';
import { PageContainer, PageHeader } from '../../components/common';
import { TeamReviewView } from '../../components/moderator';

const TeamReviewPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <PageContainer maxWidth="md">
            <PageHeader
                title="Team Review"
                subtitle="Review team details and verify or reject the registration."
                backLink={{ label: 'Back to Pending Teams', to: '/mod/teams' }}
            />
            <TeamReviewView teamId={Number(id)} />
        </PageContainer>
    );
};

export default TeamReviewPage;
