import { useState, useRef } from 'react';
import { Send, Image, Globe, Lock, Users, X, Upload, Link } from 'lucide-react';
import { FormTextarea, FormInput } from '../forms';
import { Button } from '../common';
import { useCreatePost } from '../../api/hooks/useCommunity';
import toast from 'react-hot-toast';
import type { Visibility } from '../../types';

interface CreatePostFormProps {
    teamId?: number;
    onSuccess?: () => void;
}

const visibilityOptions = [
    { value: 'Public', label: 'Public - Everyone can see' },
    { value: 'TeamOnly', label: 'Team Only - Team members only' },
    { value: 'Private', label: 'Private - Only me' },
];

const visibilityIcons: Record<Visibility, React.ReactNode> = {
    Public: <Globe className="w-4 h-4" />,
    TeamOnly: <Users className="w-4 h-4" />,
    Private: <Lock className="w-4 h-4" />,
};

const CreatePostForm: React.FC<CreatePostFormProps> = ({ teamId, onSuccess }) => {
    const createPost = useCreatePost();
    const [content, setContent] = useState('');
    const [visibility, setVisibility] = useState<Visibility>('Public');
    const [isExpanded, setIsExpanded] = useState(false);
    const [showImageOptions, setShowImageOptions] = useState(false);
    const [imageMode, setImageMode] = useState<'none' | 'url' | 'file'>('none');
    const [imageUrl, setImageUrl] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

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
            setImageUrl('');
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
        setImageUrl('');
        setImageFile(null);
        setImagePreview('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) {
            toast.error('Please write something');
            return;
        }

        try {
            // Determine image source
            let finalImageUrl: string | undefined;

            if (imageMode === 'url' && imageUrl.trim()) {
                finalImageUrl = imageUrl.trim();
            } else if (imageMode === 'file' && imageFile) {
                // Upload the file first to get the URL
                const { mediaService } = await import('../../api/services/mediaService');
                const { MediaOwnerType } = await import('../../types');

                // Create a temporary post to get entity ID, then upload image
                // For now, we'll upload as a user-owned image with entity_id 0
                // The backend will handle associating it with the post
                const formData = new FormData();
                formData.append('file', imageFile);
                formData.append('owner_type', MediaOwnerType.POST);
                formData.append('entity_id', '0');  // Will be updated by backend

                const media = await mediaService.uploadMedia({
                    file: imageFile,
                    ownerType: MediaOwnerType.POST,
                    entityId: 0,  // Temporary, backend will link to post
                });

                // Use the uploaded file's storage path
                finalImageUrl = media.storagePath;
            }

            await createPost.mutateAsync({
                content,
                visibility,
                teamId,
                imageUrl: finalImageUrl,
            });

            setContent('');
            clearImage();
            setIsExpanded(false);
            toast.success('Post created!');
            onSuccess?.();
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Failed to create post');
        }
    };

    const hasImage = imageMode === 'url' ? !!imageUrl : !!imageFile;
    const previewSrc = imageMode === 'url' ? imageUrl : imagePreview;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />

            <form onSubmit={handleSubmit}>
                {!isExpanded ? (
                    <button
                        type="button"
                        onClick={() => setIsExpanded(true)}
                        className="w-full px-4 py-3 text-left bg-gray-50 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
                    >
                        What's on your mind?
                    </button>
                ) : (
                    <div className="space-y-4">
                        <FormTextarea
                            label=""
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="What's on your mind?"
                            rows={4}
                            maxLength={2000}
                            autoFocus
                        />

                        {/* Image URL Input */}
                        {imageMode === 'url' && (
                            <div className="flex items-center gap-2">
                                <div className="flex-1">
                                    <FormInput
                                        label=""
                                        type="url"
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                        placeholder="Paste image URL (https://...)"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={clearImage}
                                    className="p-2 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        {/* Image Preview */}
                        {hasImage && previewSrc && (
                            <div className="relative">
                                <img
                                    src={previewSrc}
                                    alt="Preview"
                                    className="w-full max-h-48 object-cover rounded-lg"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={clearImage}
                                    className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                {imageMode === 'file' && imageFile && (
                                    <span className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded">
                                        {imageFile.name}
                                    </span>
                                )}
                            </div>
                        )}

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {/* Image Button with Dropdown */}
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setShowImageOptions(!showImageOptions)}
                                        className={`p-2 rounded-lg transition-colors ${hasImage
                                            ? 'text-primary-600 bg-primary-50'
                                            : 'text-gray-500 hover:bg-gray-100'
                                            }`}
                                        title="Add image"
                                    >
                                        <Image className="w-5 h-5" />
                                    </button>

                                    {/* Dropdown Menu */}
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
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    {visibilityIcons[visibility]}
                                    <select
                                        value={visibility}
                                        onChange={(e) => setVisibility(e.target.value as Visibility)}
                                        className="bg-transparent border-none text-sm focus:outline-none cursor-pointer"
                                    >
                                        {visibilityOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setIsExpanded(false);
                                        setContent('');
                                        clearImage();
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    size="sm"
                                    isLoading={createPost.isPending}
                                    disabled={!content.trim()}
                                    leftIcon={<Send className="w-4 h-4" />}
                                >
                                    Post
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default CreatePostForm;
