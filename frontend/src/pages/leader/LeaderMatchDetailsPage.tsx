import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MatchDetailsCard } from '../../components/match';
import { Button } from '../../components/common';
import { Users, Edit, XCircle } from 'lucide-react';

const LeaderMatchDetailsPage: React.FC = () => {
    const { teamId, matchId } = useParams<{ teamId: string; matchId: string }>();

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
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Match Details</h1>
                <p className="text-gray-600 mt-1">View and manage match information.</p>
            </div>

            {/* Leader Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Leader Actions
                </h2>
                <div className="flex flex-wrap gap-3">
                    <Link to={`/leader/teams/${teamId}/matches/${matchId}/attendance`}>
                        <Button variant="secondary" leftIcon={<Users className="w-4 h-4" />}>
                            Manage Attendance
                        </Button>
                    </Link>
                    <Button variant="outline" leftIcon={<Edit className="w-4 h-4" />}>
                        Edit Match
                    </Button>
                    <Button variant="danger" leftIcon={<XCircle className="w-4 h-4" />}>
                        Cancel Match
                    </Button>
                </div>
            </div>

            {/* Match Details Card */}
            <MatchDetailsCard matchId={Number(matchId)} />
        </div>
    );
};

export default LeaderMatchDetailsPage;
