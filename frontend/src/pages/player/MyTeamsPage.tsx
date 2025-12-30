import React from 'react';
import { Link } from 'react-router-dom';
import { MyTeamsList } from '../../components/player';
import { useAuth } from '../../contexts';

const MyTeamsPage: React.FC = () => {
    const { user } = useAuth();
    const playerId = user?.userId || 0;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Teams</h1>
                    <p className="text-gray-600 mt-1">Teams you are a member of.</p>
                </div>
                <Link
                    to="/search/teams"
                    className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Find Teams
                </Link>
            </div>

            <MyTeamsList playerId={playerId} />
        </div>
    );
};

export default MyTeamsPage;
