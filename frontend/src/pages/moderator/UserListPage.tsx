import React from 'react';
import { PageContainer, PageHeader } from '../../components/common';
import { UserSearchView } from '../../components/moderator';

const UserListPage: React.FC = () => {
    return (
        <PageContainer maxWidth="md">
            <PageHeader
                title="User Management"
                subtitle="Search and manage user accounts."
                backLink={{ label: 'Back to Dashboard', to: '/mod' }}
                className="text-left"
            />
            <UserSearchView />
        </PageContainer>
    );
};

export default UserListPage;
