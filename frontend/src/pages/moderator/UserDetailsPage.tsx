import React from 'react';
import { useParams } from 'react-router-dom';
import { PageContainer, PageHeader } from '../../components/common';
import { UserDetailsView } from '../../components/moderator';

const UserDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <PageContainer maxWidth="md">
            <PageHeader
                title="User Details"
                subtitle="View user information and manage their account."
                backLink={{ label: 'Back to User List', to: '/mod/users' }}
            />
            <UserDetailsView userId={Number(id)} />
        </PageContainer>
    );
};

export default UserDetailsPage;
