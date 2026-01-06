import React from 'react';
import { useParams } from 'react-router-dom';
import { PageContainer, PageHeader, ContentCard } from '../../components/common';
import { EditFieldForm } from '../../components/forms';

const EditFieldPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <PageContainer maxWidth="md">
            <PageHeader
                title="Edit Field"
                subtitle="Update your field information below."
                backLink={{ label: 'Back to Field Dashboard', to: `/owner/fields/${id}` }}
                className="text-left"
            />
            <ContentCard>
                <EditFieldForm fieldId={Number(id)} />
            </ContentCard>
        </PageContainer>
    );
};

export default EditFieldPage;
