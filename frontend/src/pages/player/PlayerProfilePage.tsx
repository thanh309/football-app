import React, { useState } from 'react';
import { Edit } from 'lucide-react';
import { PlayerProfileView } from '../../components/player';
import { PlayerProfileForm } from '../../components/forms';
import { Button, PageContainer, PageHeader, ContentCard } from '../../components/common';
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
    };

    return (
        <PageContainer maxWidth="md">
            <PageHeader
                title="My Profile"
                subtitle="Manage your player profile information."
                action={
                    !isEditing ? (
                        <Button variant="secondary" onClick={handleEditClick}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Profile
                        </Button>
                    ) : undefined
                }
            />

            {isEditing ? (
                <ContentCard>
                    <PlayerProfileForm
                        player={player}
                        onSuccess={handleSaveSuccess}
                    />
                    <div className="mt-4 flex justify-start">
                        <Button variant="ghost" onClick={() => setIsEditing(false)}>
                            Cancel
                        </Button>
                    </div>
                </ContentCard>
            ) : (
                <PlayerProfileView player={player} />
            )}
        </PageContainer>
    );
};

export default PlayerProfilePage;
