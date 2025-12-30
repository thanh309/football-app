import { useState } from 'react';
import { Send, Image, Globe, Lock, Users } from 'lucide-react';
import { FormTextarea } from '../forms';
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) {
            toast.error('Please write something');
            return;
        }

        try {
            await createPost.mutateAsync({
                content,
                visibility,
                teamId,
            });
            setContent('');
            setIsExpanded(false);
            toast.success('Post created!');
            onSuccess?.();
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Failed to create post');
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
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

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                                    title="Add image (coming soon)"
                                >
                                    <Image className="w-5 h-5" />
                                </button>

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
