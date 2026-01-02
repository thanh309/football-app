import React from 'react';
import { useParams } from 'react-router-dom';
import { PageContainer, PageHeader } from '../../components/common';
import { TeamRosterView } from '../../components/leader';

const TeamRosterPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <PageContainer maxWidth="lg">
            <PageHeader
                title="Team Roster"
                subtitle="Manage your team members and their roles."
                backLink={{ label: 'Back to Team Dashboard', to: `/leader/teams/${id}` }}
            />
            <TeamRosterView teamId={Number(id)} isLeader={true} />
        </PageContainer>
    );
};

export default TeamRosterPage;
