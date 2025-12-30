import React from 'react';
import { Link } from 'react-router-dom';
import { CommunityFeedView } from '../../components/community';

const CommunityFeedPage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Community</h1>
                    <p className="text-gray-600 mt-1">Connect with the football community.</p>
                </div>
                <Link
                    to="/community/create"
                    className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Post
                </Link>
            </div>

            <CommunityFeedView />
        </div>
    );
};

export default CommunityFeedPage;
