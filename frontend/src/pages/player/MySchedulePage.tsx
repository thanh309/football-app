import React from 'react';
import { MatchScheduleList } from '../../components/player';
import { useAuth } from '../../contexts';

const MySchedulePage: React.FC = () => {
    const { user } = useAuth();
    const playerId = user?.userId || 0;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Schedule</h1>
                <p className="text-gray-600 mt-1">Your upcoming matches and events.</p>
            </div>

            <MatchScheduleList playerId={playerId} />
        </div>
    );
};

export default MySchedulePage;
