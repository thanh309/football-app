import { ThumbsUp, Heart, PartyPopper, MessageCircle, MoreVertical, Trash2, Flag } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useToggleReaction, useDeletePost } from '../../api/hooks/useCommunity';
import toast from 'react-hot-toast';
import type { Post, ReactionType } from '../../types';
import { Link } from 'react-router-dom';
import { getMediaUrl } from '../../utils/mediaUtils';

interface PostCardProps {
    post: Post;
    isOwner?: boolean;
    isAuthenticated?: boolean;
    userReaction?: ReactionType | null;
    onCommentClick?: () => void;
    onReportClick?: () => void;
}

const reactionIcons: Record<ReactionType, React.ReactNode> = {
    Like: <ThumbsUp className="w-4 h-4" />,
    Love: <Heart className="w-4 h-4" />,
    Celebrate: <PartyPopper className="w-4 h-4" />,
};

const reactionLabels: Record<ReactionType, string> = {
    Like: 'Like',
    Love: 'Love',
    Celebrate: 'Celebrate',
};

const reactionColors: Record<ReactionType, string> = {
    Like: 'text-blue-500',
    Love: 'text-red-500',
    Celebrate: 'text-yellow-500',
};

const PostCard: React.FC<PostCardProps> = ({ post, isOwner = false, isAuthenticated = false, userReaction: initialReaction = null, onCommentClick, onReportClick }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [showReactions, setShowReactions] = useState(false);
    const [currentReaction, setCurrentReaction] = useState<ReactionType | null>(initialReaction);
    const [reactionCount, setReactionCount] = useState(post.reactionCount);
    const toggleReaction = useToggleReaction();
    const deletePost = useDeletePost();
    const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Sync userReaction prop to state when it changes (e.g., after API fetch)
    useEffect(() => {
        setCurrentReaction(initialReaction);
    }, [initialReaction]);

    const handleReaction = async (type: ReactionType) => {
        // Optimistic update
        if (currentReaction === type) {
            // Remove reaction
            setCurrentReaction(null);
            setReactionCount(prev => Math.max(0, prev - 1));
        } else if (currentReaction) {
            // Change reaction (count stays same)
            setCurrentReaction(type);
        } else {
            // Add new reaction
            setCurrentReaction(type);
            setReactionCount(prev => prev + 1);
        }
        setShowReactions(false);

        try {
            await toggleReaction.mutateAsync({ postId: post.postId, type });
        } catch {
            // Revert on error
            setCurrentReaction(initialReaction);
            setReactionCount(post.reactionCount);
            toast.error('Failed to react');
        }
    };

    const handleQuickReact = () => {
        if (currentReaction) {
            // Remove current reaction
            handleReaction(currentReaction);
        } else {
            // Add Like as default
            handleReaction('Like' as ReactionType);
        }
    };

    const handleDelete = async () => {
        try {
            await deletePost.mutateAsync(post.postId);
            toast.success('Post deleted');
        } catch {
            toast.error('Failed to delete post');
        }
    };

    const handleMouseEnter = () => {
        if (!isAuthenticated) return;
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }
        hoverTimeoutRef.current = setTimeout(() => {
            setShowReactions(true);
        }, 500);
    };

    const handleMouseLeave = () => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }
        hoverTimeoutRef.current = setTimeout(() => {
            setShowReactions(false);
        }, 300);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center font-semibold text-emerald-600">
                        {post.authorId.toString().charAt(0)}
                    </div>
                    <div className="text-left">
                        <Link to={`/users/${post.authorId}`} className="font-medium text-gray-900 hover:text-emerald-600 block text-left">
                            User #{post.authorId}
                        </Link>
                        <p className="text-sm text-gray-500 text-left">
                            {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {/* Only show menu for authenticated users */}
                {isAuthenticated && (
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <MoreVertical className="w-4 h-4 text-gray-500" />
                        </button>

                        {showMenu && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                                <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border z-20 py-1 min-w-[140px]">
                                    {isOwner && (
                                        <button
                                            onClick={() => {
                                                handleDelete();
                                                setShowMenu(false);
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            onReportClick?.();
                                            setShowMenu(false);
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        <Flag className="w-4 h-4" />
                                        Report
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 text-left">
                <p className="text-gray-800 whitespace-pre-wrap text-left">{post.content}</p>
            </div>

            {/* Post Image */}
            {post.imageUrl && (
                <div className="px-4 pb-4">
                    <img
                        src={getMediaUrl(post.imageUrl)}
                        alt="Post image"
                        className="w-full rounded-lg object-cover max-h-96"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                </div>
            )}

            {/* Stats */}
            <div className="px-4 py-2 flex items-center justify-between text-sm text-gray-500 border-t border-gray-100">
                <span>{reactionCount} reactions</span>
                <button onClick={onCommentClick} className="hover:text-emerald-600 hover:underline">
                    {post.commentCount} comments
                </button>
            </div>

            {/* Actions - Only show for authenticated users */}
            {isAuthenticated && (
                <div className="px-4 py-2 flex items-center gap-2 border-t border-gray-100">
                    <div
                        className="relative flex-1"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <button
                            onClick={handleQuickReact}
                            className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-50 transition-colors ${currentReaction ? reactionColors[currentReaction] : 'text-gray-600'
                                }`}
                        >
                            {currentReaction ? (
                                <>
                                    {reactionIcons[currentReaction]}
                                    <span>{reactionLabels[currentReaction]}</span>
                                </>
                            ) : (
                                <>
                                    <ThumbsUp className="w-5 h-5" />
                                    <span>Like</span>
                                </>
                            )}
                        </button>

                        {showReactions && (
                            <div
                                className="absolute left-0 bottom-full mb-2 bg-white rounded-full shadow-lg border z-20 flex animate-in fade-in duration-200"
                                onMouseEnter={() => {
                                    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                                }}
                                onMouseLeave={handleMouseLeave}
                            >
                                {(Object.keys(reactionIcons) as ReactionType[]).map(type => (
                                    <button
                                        key={type}
                                        onClick={() => handleReaction(type)}
                                        className={`p-3 hover:bg-gray-100 hover:scale-125 first:rounded-l-full last:rounded-r-full transition-all ${currentReaction === type ? reactionColors[type] + ' bg-gray-100' : reactionColors[type]
                                            }`}
                                        title={type}
                                    >
                                        {reactionIcons[type]}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={onCommentClick}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
                    >
                        <MessageCircle className="w-5 h-5" />
                        <span>Comment</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default PostCard;


