import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer, PageHeader, ContentCard } from '../../components/common';
import { CreatePostForm } from '../../components/community';

const CreatePostPage: React.FC = () => {
    const navigate = useNavigate();

    const handleSuccess = () => {
        navigate('/community');
    };

    return (
        <PageContainer maxWidth="sm">
            <PageHeader
                title="Create Post"
                subtitle="Share something with the community."
                backLink={{ label: 'Back to Community', to: '/community' }}
            />
            <ContentCard>
                <CreatePostForm onSuccess={handleSuccess} />
            </ContentCard>
        </PageContainer>
    );
};

export default CreatePostPage;
