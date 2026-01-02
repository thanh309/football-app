import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer, PageHeader, ContentCard } from '../../components/common';
import { AddTransactionForm } from '../../components/forms';

const AddTransactionPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const handleSuccess = () => {
        navigate(`/leader/teams/${id}/finance`);
    };

    const handleCancel = () => {
        navigate(`/leader/teams/${id}/finance`);
    };

    return (
        <PageContainer maxWidth="sm">
            <PageHeader
                title="Add Transaction"
                subtitle="Record a new income or expense for your team."
                backLink={{ label: 'Back to Finance', to: `/leader/teams/${id}/finance` }}
            />
            <ContentCard>
                <AddTransactionForm
                    walletId={Number(id)}
                    onSuccess={handleSuccess}
                    onCancel={handleCancel}
                />
            </ContentCard>
        </PageContainer>
    );
};

export default AddTransactionPage;
