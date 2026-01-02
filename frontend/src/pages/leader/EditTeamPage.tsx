import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer, PageHeader, ContentCard } from '../../components/common';
import { EditTeamForm } from '../../components/forms';

const EditTeamPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const handleSuccess = () => {
        navigate(`/leader/teams/${id}`);
    };

    return (
        <PageContainer maxWidth="sm">
            <PageHeader
                title="Edit Team"
                subtitle="Update your team's information."
                backLink={{ label: 'Back to Team Dashboard', to: `/leader/teams/${id}` }}
            />
            <ContentCard>
                <EditTeamForm teamId={Number(id)} onSuccess={handleSuccess} />
            </ContentCard>
        </PageContainer>
    );
};

export default EditTeamPage;
