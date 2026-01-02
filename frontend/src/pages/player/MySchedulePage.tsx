import React from 'react';
import { PageContainer, PageHeader } from '../../components/common';
import { MatchScheduleList } from '../../components/player';
import { useAuth } from '../../contexts';

const MySchedulePage: React.FC = () => {
    const { user } = useAuth();
    const playerId = user?.userId || 0;

    return (
        <PageContainer maxWidth="md">
            <PageHeader
                title="My Schedule"
                subtitle="Your upcoming matches and events."
            />
            <MatchScheduleList playerId={playerId} />
        </PageContainer>
    );
};

export default MySchedulePage;
