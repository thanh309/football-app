import React, { useState } from 'react';
import { Edit } from 'lucide-react';
import { PlayerProfileView } from '../../components/player';
import { PlayerProfileForm } from '../../components/forms';
import { Button, PageContainer, PageHeader, ContentCard, LoadingSpinner } from '../../components/common';
import { useMyPlayerProfile } from '../../api/hooks/usePlayer';

const PlayerProfilePage: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const { data: player, isLoading, error } = useMyPlayerProfile();

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveSuccess = () => {
        setIsEditing(false);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error || !player) {
        return (
            <PageContainer maxWidth="md">
                <div className="text-center py-12">
                    <p className="text-red-600">Failed to load profile. Please try again.</p>
                </div>
            </PageContainer>
        );
    }

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
                        onCancel={() => setIsEditing(false)}
                    />
                </ContentCard>
            ) : (
                <PlayerProfileView player={player} />
            )}
        </PageContainer>
    );
};

export default PlayerProfilePage;
