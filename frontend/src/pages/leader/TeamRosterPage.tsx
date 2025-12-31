import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { TeamRosterView } from '../../components/leader';

const TeamRosterPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Back link */}
            <Link
                to={`/leader/teams/${id}`}
                className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Team Dashboard
            </Link>

            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Team Roster</h1>
                <p className="text-gray-600 mt-1">Manage your team members and their roles.</p>
            </div>

            <TeamRosterView teamId={Number(id)} isLeader={true} />
        </div>
    );
};

export default TeamRosterPage;
