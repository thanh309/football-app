import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CreatePostForm } from '../../components/community';

const CreatePostPage: React.FC = () => {
    const navigate = useNavigate();

    const handleSuccess = () => {
        navigate('/community');
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Create Post</h1>
                <p className="text-gray-600 mt-1">Share something with the community.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
                <CreatePostForm onSuccess={handleSuccess} />
            </div>
        </div>
    );
};

export default CreatePostPage;
