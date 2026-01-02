import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { PageContainer, PageHeader } from '../../components/common';
import { FinanceDashboardView } from '../../components/leader';

const TeamFinancePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <PageContainer maxWidth="lg">
            <PageHeader
                title="Team Finance"
                subtitle="Manage your team's wallet and transactions."
                backLink={{ label: 'Back to Team Dashboard', to: `/leader/teams/${id}` }}
                action={
                    <Link
                        to={`/leader/teams/${id}/finance/add`}
                        className="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add Transaction
                    </Link>
                }
            />
            <FinanceDashboardView teamId={Number(id)} />
        </PageContainer>
    );
};

export default TeamFinancePage;
