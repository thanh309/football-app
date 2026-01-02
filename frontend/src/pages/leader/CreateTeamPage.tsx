import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer, PageHeader, ContentCard } from '../../components/common';
import { CreateTeamForm } from '../../components/forms';

const CreateTeamPage: React.FC = () => {
    const navigate = useNavigate();

    const handleSuccess = () => {
        navigate('/leader/teams');
    };

    return (
        <PageContainer maxWidth="sm">
            <PageHeader
                title="Create Team"
                subtitle="Set up your new football team."
                backLink={{ label: 'Back to My Teams', to: '/leader/teams' }}
            />
            <ContentCard>
                <CreateTeamForm onSuccess={handleSuccess} />
            </ContentCard>
        </PageContainer>
    );
};

export default CreateTeamPage;
