import { ThumbsUp, Heart, PartyPopper } from 'lucide-react';
import { useState } from 'react';
import { useToggleReaction } from '../../api/hooks/useCommunity';
import toast from 'react-hot-toast';
import type { ReactionType } from '../../types';

interface ReactionButtonProps {
    postId: number;
    currentReaction?: ReactionType;
    reactionCount?: number;
}

const reactionConfig: Record<ReactionType, { icon: React.ReactNode; color: string; label: string }> = {
    Like: { icon: <ThumbsUp className="w-4 h-4" />, color: 'text-blue-500 bg-blue-50 border-blue-200', label: 'Like' },
    Love: { icon: <Heart className="w-4 h-4" />, color: 'text-red-500 bg-red-50 border-red-200', label: 'Love' },
    Celebrate: { icon: <PartyPopper className="w-4 h-4" />, color: 'text-yellow-500 bg-yellow-50 border-yellow-200', label: 'Celebrate' },
};

const ReactionButton: React.FC<ReactionButtonProps> = ({
    postId,
    currentReaction,
    reactionCount = 0,
}) => {
    const [showPicker, setShowPicker] = useState(false);
    const toggleReaction = useToggleReaction();

    const handleReaction = async (type: ReactionType) => {
        try {
            await toggleReaction.mutateAsync({ postId, type });
            setShowPicker(false);
        } catch {
            toast.error('Failed to react');
        }
    };

    const current = currentReaction ? reactionConfig[currentReaction] : null;

    return (
        <div className="relative inline-flex">
            <button
                onClick={() => setShowPicker(!showPicker)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${current
                        ? current.color
                        : 'text-gray-600 bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
            >
                {current ? current.icon : <ThumbsUp className="w-4 h-4" />}
                <span className="text-sm font-medium">
                    {current ? current.label : 'React'}
                </span>
                {reactionCount > 0 && (
                    <span className="text-sm opacity-75">({reactionCount})</span>
                )}
            </button>

            {showPicker && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowPicker(false)} />
                    <div className="absolute left-0 bottom-full mb-2 bg-white rounded-full shadow-lg border z-20 flex p-1">
                        {(Object.entries(reactionConfig) as [ReactionType, typeof reactionConfig.Like][]).map(
                            ([type, config]) => (
                                <button
                                    key={type}
                                    onClick={() => handleReaction(type)}
                                    disabled={toggleReaction.isPending}
                                    className={`p-2.5 rounded-full transition-all hover:scale-125 ${currentReaction === type ? 'bg-gray-100' : ''
                                        }`}
                                    title={config.label}
                                >
                                    <span className={config.color.split(' ')[0]}>{config.icon}</span>
                                </button>
                            )
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default ReactionButton;
