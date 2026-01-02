import React from 'react';
import { PageContainer, PageHeader, ContentCard } from '../../components/common';
import { CreateFieldForm } from '../../components/forms';

const RegisterFieldPage: React.FC = () => {
    return (
        <PageContainer maxWidth="md">
            <PageHeader
                title="Register New Field"
                subtitle="Fill in the details below to register your football field. After submission, your field will be reviewed by our moderators before it becomes visible to users."
                backLink={{ label: 'Back to My Fields', to: '/owner/fields' }}
            />
            <ContentCard>
                <CreateFieldForm />
            </ContentCard>
        </PageContainer>
    );
};

export default RegisterFieldPage;
