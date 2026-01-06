import { useState, useRef } from 'react';
import { User, Save, Camera, X, Upload, Link } from 'lucide-react';
import { FormInput, FormSelect, FormTextarea, DateTimePicker } from './';
import { Button } from '../common';
import { useUpdatePlayerProfile } from '../../api/hooks/usePlayer';
import type { PlayerProfile } from '../../types';
import toast from 'react-hot-toast';

interface PlayerProfileFormProps {
    player: PlayerProfile;
    onSuccess?: () => void;
    onCancel?: () => void;
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

const PlayerProfileForm: React.FC<PlayerProfileFormProps> = ({ player, onSuccess, onCancel }) => {
    const updateMutation = useUpdatePlayerProfile();
    const [showImageOptions, setShowImageOptions] = useState(false);
    const [imageMode, setImageMode] = useState<'none' | 'url' | 'file'>('none');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        displayName: player.displayName || '',
        position: player.position || '',
        skillLevel: player.skillLevel?.toString() || '5',
        bio: player.bio || '',
        dateOfBirth: player.dateOfBirth || '',
        height: player.height?.toString() || '',
        weight: player.weight?.toString() || '',
        preferredFoot: player.preferredFoot || 'Right',
        profileImageUrl: '',
    });

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast.error('Please select an image file');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image must be less than 5MB');
                return;
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setImageMode('file');
            handleChange('profileImageUrl', '');
            setShowImageOptions(false);
        }
    };

    const handleUrlMode = () => {
        setImageMode('url');
        setImageFile(null);
        setImagePreview('');
        setShowImageOptions(false);
    };

    const handleFileMode = () => {
        fileInputRef.current?.click();
    };

    const clearImage = () => {
        setImageMode('none');
        handleChange('profileImageUrl', '');
        setImageFile(null);
        setImagePreview('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            let finalImageUrl: string | undefined;

            if (imageMode === 'url' && formData.profileImageUrl.trim()) {
                finalImageUrl = formData.profileImageUrl.trim();
            } else if (imageMode === 'file' && imageFile) {
                // Upload the file first
                const { mediaService } = await import('../../api/services/mediaService');
                const { MediaOwnerType } = await import('../../types');

                const media = await mediaService.uploadMedia({
                    file: imageFile,
                    ownerType: MediaOwnerType.PLAYER,
                    entityId: player.playerId,
                });

                finalImageUrl = media.storagePath;
            }

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
                    profileImageUrl: finalImageUrl,
                },
            });
            toast.success('Profile updated successfully!');
            onSuccess?.();
        } catch (error) {
            toast.error('Failed to update profile');
        }
    };

    // Determine preview image
    const getPreviewImage = () => {
        if (imageMode === 'file' && imagePreview) return imagePreview;
        if (imageMode === 'url' && formData.profileImageUrl) return formData.profileImageUrl;
        return player.profileImage;
    };
    const previewImage = getPreviewImage();

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />

            {/* Profile Image Section */}
            <div className="flex items-center gap-6 mb-8">
                <div className="relative">
                    <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center overflow-hidden">
                        {previewImage ? (
                            <img
                                src={previewImage}
                                alt={formData.displayName}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }}
                            />
                        ) : (
                            <User className="w-12 h-12 text-emerald-600" />
                        )}
                    </div>

                    {/* Camera button with dropdown */}
                    <div className="absolute bottom-0 right-0">
                        <button
                            type="button"
                            onClick={() => setShowImageOptions(!showImageOptions)}
                            className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors shadow-md"
                            title="Change profile image"
                        >
                            <Camera className="w-4 h-4" />
                        </button>

                        {/* Dropdown */}
                        {showImageOptions && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowImageOptions(false)}
                                />
                                <div className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-lg border z-20 py-1 min-w-[160px]">
                                    <button
                                        type="button"
                                        onClick={handleFileMode}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        <Upload className="w-4 h-4" />
                                        Upload from device
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleUrlMode}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        <Link className="w-4 h-4" />
                                        Paste URL
                                    </button>
                                    {(imageMode !== 'none' || player.profileImage) && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                clearImage();
                                                setShowImageOptions(false);
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                        >
                                            <X className="w-4 h-4" />
                                            Remove image
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div className="text-left flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 text-left">Edit Profile</h2>
                    <p className="text-gray-500 text-left">Update your player information</p>
                </div>
            </div>

            {/* Image URL Input */}
            {imageMode === 'url' && (
                <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                        <FormInput
                            label="Profile Image URL"
                            type="url"
                            value={formData.profileImageUrl}
                            onChange={(e) => handleChange('profileImageUrl', e.target.value)}
                            placeholder="Paste image URL (https://...)"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={clearImage}
                        className="p-2 text-gray-400 hover:text-gray-600 mt-6"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* File Upload Indicator */}
            {imageMode === 'file' && imageFile && (
                <div className="flex items-center gap-2 p-4 bg-emerald-50 rounded-lg">
                    <Upload className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm text-emerald-700 flex-1">{imageFile.name}</span>
                    <button
                        type="button"
                        onClick={clearImage}
                        className="p-1 text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

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

            <div className="flex justify-end gap-3">
                {onCancel && (
                    <Button type="button" variant="ghost" onClick={onCancel}>
                        Cancel
                    </Button>
                )}
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
