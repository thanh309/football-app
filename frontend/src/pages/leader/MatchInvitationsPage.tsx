import React from 'react';
import { useParams } from 'react-router-dom';
import { PageContainer, PageHeader } from '../../components/common';
import { MatchInvitationsList } from '../../components/leader';

const MatchInvitationsPage: React.FC = () => {
    const { teamId } = useParams<{ teamId: string }>();

    return (
        <PageContainer maxWidth="md">
            <PageHeader
                title="Match Invitations"
                subtitle="View and respond to match invitations from other teams."
                backLink={{ label: 'Back to Matches', to: `/leader/teams/${teamId}/matches` }}
            />
            <MatchInvitationsList teamId={Number(teamId)} />
        </PageContainer>
    );
};

export default MatchInvitationsPage;
