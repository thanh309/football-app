import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CreateMatchForm } from '../../components/forms';

const CreateMatchPage: React.FC = () => {
    const { teamId } = useParams<{ teamId: string }>();
    const navigate = useNavigate();

    const handleSuccess = () => {
        navigate(`/leader/teams/${teamId}/matches`);
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
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
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Schedule Match</h1>
                <p className="text-gray-600 mt-1">Create a new match for your team.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
                <CreateMatchForm
                    teamId={Number(teamId)}
                    onSuccess={handleSuccess}
                />
            </div>
        </div>
    );
};

export default CreateMatchPage;
