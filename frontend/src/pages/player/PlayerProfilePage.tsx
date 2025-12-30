import React, { useState } from 'react';
import { PlayerProfileView } from '../../components/player';
import { PlayerProfileForm } from '../../components/forms';
import { Button } from '../../components/common';
import { PreferredFoot, type PlayerProfile } from '../../types';

// Mock data
const mockPlayer: PlayerProfile = {
    playerId: 1,
    userId: 1,
    displayName: 'Nguyen Van A',
    position: 'Midfielder',
    skillLevel: 7,
    bio: 'Passionate football player with 5 years of experience.',
    profileImage: 'https://via.placeholder.com/200',
    dateOfBirth: '1995-05-15',
    height: 175,
    weight: 70,
    preferredFoot: PreferredFoot.RIGHT,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
};

const PlayerProfilePage: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [player] = useState<PlayerProfile>(mockPlayer);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveSuccess = () => {
        setIsEditing(false);
        // Refresh data would happen here
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Profile</h1>
                    <p className="text-gray-600 mt-1">Manage your player profile information.</p>
                </div>
                {!isEditing && (
                    <Button variant="secondary" onClick={handleEditClick}>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Profile
                    </Button>
                )}
            </div>

            {isEditing ? (
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <PlayerProfileForm
                        player={player}
                        onSuccess={handleSaveSuccess}
                    />
                    <div className="mt-4 flex justify-start">
                        <Button variant="ghost" onClick={() => setIsEditing(false)}>
                            Cancel
                        </Button>
                    </div>
                </div>
            ) : (
                <PlayerProfileView player={player} />
            )}
        </div>
    );
};

export default PlayerProfilePage;
