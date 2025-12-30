import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateTeamForm } from '../../components/forms';

const CreateTeamPage: React.FC = () => {
    const navigate = useNavigate();

    const handleSuccess = () => {
        navigate('/leader/teams');
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Create Team</h1>
                <p className="text-gray-600 mt-1">Set up your new football team.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
                <CreateTeamForm onSuccess={handleSuccess} />
            </div>
        </div>
    );
};

export default CreateTeamPage;
