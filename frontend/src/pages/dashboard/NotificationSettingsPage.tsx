import React from 'react';
import { PageContainer, PageHeader, ContentCard } from '../../components/common';
import { NotificationSettingsForm } from '../../components/notifications';

const NotificationSettingsPage: React.FC = () => {
    return (
        <PageContainer maxWidth="md">
            <PageHeader
                title="Notification Settings"
                subtitle="Manage how you receive notifications."
                backLink={{ label: 'Back to Settings', to: '/settings/account' }}
            />
            <ContentCard>
                <NotificationSettingsForm />
            </ContentCard>
        </PageContainer>
    );
};

export default NotificationSettingsPage;
