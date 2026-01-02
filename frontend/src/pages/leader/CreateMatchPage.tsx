import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer, PageHeader, ContentCard } from '../../components/common';
import { CreateMatchForm } from '../../components/forms';

const CreateMatchPage: React.FC = () => {
    const { teamId } = useParams<{ teamId: string }>();
    const navigate = useNavigate();

    const handleSuccess = () => {
        navigate(`/leader/teams/${teamId}/matches`);
    };

    return (
        <PageContainer maxWidth="sm">
            <PageHeader
                title="Schedule Match"
                subtitle="Create a new match for your team."
                backLink={{ label: 'Back to Matches', to: `/leader/teams/${teamId}/matches` }}
            />
            <ContentCard>
                <CreateMatchForm teamId={Number(teamId)} onSuccess={handleSuccess} />
            </ContentCard>
        </PageContainer>
    );
};

export default CreateMatchPage;
