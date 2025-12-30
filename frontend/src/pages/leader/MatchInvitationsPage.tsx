import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MatchInvitationsList } from '../../components/leader';

const MatchInvitationsPage: React.FC = () => {
    const { teamId } = useParams<{ teamId: string }>();

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Back link */}
            <Link
                to={`/leader/teams/${teamId}/matches`}
                className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Matches
            </Link>

            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Match Invitations</h1>
                <p className="text-gray-600 mt-1">View and respond to match invitations from other teams.</p>
            </div>

            <MatchInvitationsList teamId={Number(teamId)} />
        </div>
    );
};

export default MatchInvitationsPage;
