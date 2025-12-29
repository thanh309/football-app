import { useState } from 'react';
import { User, Save } from 'lucide-react';
import { FormInput, FormSelect, FormTextarea, DateTimePicker } from '../forms';
import { Button } from '../common';
import { useUpdatePlayerProfile } from '../../api/hooks/usePlayer';
import type { PlayerProfile } from '../../types';
import toast from 'react-hot-toast';

interface PlayerProfileFormProps {
    player: PlayerProfile;
    onSuccess?: () => void;
}

const positionOptions = [
    { value: 'Goalkeeper', label: 'Goalkeeper' },
    { value: 'Defender', label: 'Defender' },
    { value: 'Midfielder', label: 'Midfielder' },
    { value: 'Forward', label: 'Forward' },
];

const footOptions = [
    { value: 'Right', label: 'Right' },
    { value: 'Left', label: 'Left' },
    { value: 'Both', label: 'Both' },
];

const skillLevelOptions = [
    { value: '1', label: '1 - Beginner' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5 - Intermediate' },
    { value: '6', label: '6' },
    { value: '7', label: '7' },
    { value: '8', label: '8' },
    { value: '9', label: '9' },
    { value: '10', label: '10 - Professional' },
];

const PlayerProfileForm: React.FC<PlayerProfileFormProps> = ({ player, onSuccess }) => {
    const updateMutation = useUpdatePlayerProfile();

    const [formData, setFormData] = useState({
        displayName: player.displayName || '',
        position: player.position || '',
        skillLevel: player.skillLevel?.toString() || '5',
        bio: player.bio || '',
        dateOfBirth: player.dateOfBirth || '',
        height: player.height?.toString() || '',
        weight: player.weight?.toString() || '',
        preferredFoot: player.preferredFoot || 'Right',
    });

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await updateMutation.mutateAsync({
                playerId: player.playerId,
                data: {
                    displayName: formData.displayName,
                    position: formData.position,
                    skillLevel: parseInt(formData.skillLevel),
                    bio: formData.bio,
                    dateOfBirth: formData.dateOfBirth,
                    height: formData.height ? parseInt(formData.height) : undefined,
                    weight: formData.weight ? parseInt(formData.weight) : undefined,
                    preferredFoot: formData.preferredFoot,
                },
            });
            toast.success('Profile updated successfully!');
            onSuccess?.();
        } catch (error) {
            toast.error('Failed to update profile');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-emerald-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
                    <p className="text-gray-500">Update your player information</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                    label="Display Name"
                    value={formData.displayName}
                    onChange={(e) => handleChange('displayName', e.target.value)}
                    placeholder="Enter your display name"
                    required
                />

                <FormSelect
                    label="Position"
                    value={formData.position}
                    onChange={(e) => handleChange('position', e.target.value)}
                    options={positionOptions}
                    placeholder="Select your position"
                />

                <FormSelect
                    label="Skill Level"
                    value={formData.skillLevel}
                    onChange={(e) => handleChange('skillLevel', e.target.value)}
                    options={skillLevelOptions}
                />

                <FormSelect
                    label="Preferred Foot"
                    value={formData.preferredFoot}
                    onChange={(e) => handleChange('preferredFoot', e.target.value)}
                    options={footOptions}
                />

                <DateTimePicker
                    label="Date of Birth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(value) => handleChange('dateOfBirth', value)}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormInput
                        label="Height (cm)"
                        type="number"
                        value={formData.height}
                        onChange={(e) => handleChange('height', e.target.value)}
                        placeholder="175"
                    />
                    <FormInput
                        label="Weight (kg)"
                        type="number"
                        value={formData.weight}
                        onChange={(e) => handleChange('weight', e.target.value)}
                        placeholder="70"
                    />
                </div>
            </div>

            <FormTextarea
                label="Bio"
                value={formData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                placeholder="Tell us about yourself..."
                maxLength={500}
                rows={4}
            />

            <div className="flex justify-end">
                <Button
                    type="submit"
                    isLoading={updateMutation.isPending}
                    leftIcon={<Save className="w-4 h-4" />}
                >
                    Save Changes
                </Button>
            </div>
        </form>
    );
};

export default PlayerProfileForm;
