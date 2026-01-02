import React from 'react';
import { PageContainer, PageHeader } from '../../components/common';
import { NotificationCenter } from '../../components/notifications';

const NotificationsPage: React.FC = () => {
    return (
        <PageContainer maxWidth="md">
            <PageHeader
                title="Notifications"
                subtitle="Stay updated with your latest activities."
            />
            <NotificationCenter />
        </PageContainer>
    );
};

export default NotificationsPage;
