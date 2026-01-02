import React from 'react';
import { useParams } from 'react-router-dom';
import { PageContainer, PageHeader } from '../../components/common';
import { AttendanceTrackingView } from '../../components/leader';

const MatchAttendancePage: React.FC = () => {
    const { teamId, matchId } = useParams<{ teamId: string; matchId: string }>();

    return (
        <PageContainer maxWidth="lg">
            <PageHeader
                title="Match Attendance"
                subtitle="Track player attendance for this match."
                backLink={{ label: 'Back to Match Details', to: `/leader/teams/${teamId}/matches/${matchId}` }}
            />
            <AttendanceTrackingView matchId={Number(matchId)} teamId={Number(teamId)} />
        </PageContainer>
    );
};

export default MatchAttendancePage;
