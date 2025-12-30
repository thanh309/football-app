import { ThumbsUp, Heart, PartyPopper, MessageCircle, MoreVertical, Trash2, Flag } from 'lucide-react';
import { useState } from 'react';
import { useToggleReaction, useDeletePost } from '../../api/hooks/useCommunity';
import toast from 'react-hot-toast';
import type { Post, ReactionType } from '../../types';
import { Link } from 'react-router-dom';

interface PostCardProps {
    post: Post;
    isOwner?: boolean;
    onCommentClick?: () => void;
    onReportClick?: () => void;
}

const reactionIcons: Record<ReactionType, React.ReactNode> = {
    Like: <ThumbsUp className="w-4 h-4" />,
    Love: <Heart className="w-4 h-4" />,
    Celebrate: <PartyPopper className="w-4 h-4" />,
};

const reactionColors: Record<ReactionType, string> = {
    Like: 'text-blue-500',
    Love: 'text-red-500',
    Celebrate: 'text-yellow-500',
};

const PostCard: React.FC<PostCardProps> = ({ post, isOwner = false, onCommentClick, onReportClick }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [showReactions, setShowReactions] = useState(false);
    const toggleReaction = useToggleReaction();
    const deletePost = useDeletePost();

    const handleReaction = async (type: ReactionType) => {
        try {
            await toggleReaction.mutateAsync({ postId: post.postId, type });
            setShowReactions(false);
        } catch {
            toast.error('Failed to react');
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

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center font-semibold text-emerald-600">
                        {post.authorId.toString().charAt(0)}
                    </div>
                    <div>
                        <Link to={`/users/${post.authorId}`} className="font-medium text-gray-900 hover:text-emerald-600">
                            User #{post.authorId}
                        </Link>
                        <p className="text-sm text-gray-500">
                            {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>

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
            </div>

            {/* Content */}
            <div className="p-4">
                <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
            </div>

            {/* Stats */}
            <div className="px-4 py-2 flex items-center justify-between text-sm text-gray-500 border-t border-gray-100">
                <span>{post.reactionCount} reactions</span>
                <span>{post.commentCount} comments</span>
            </div>

            {/* Actions */}
            <div className="px-4 py-2 flex items-center gap-2 border-t border-gray-100">
                <div className="relative flex-1">
                    <button
                        onClick={() => setShowReactions(!showReactions)}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
                    >
                        <ThumbsUp className="w-5 h-5" />
                        <span>React</span>
                    </button>

                    {showReactions && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowReactions(false)} />
                            <div className="absolute left-0 bottom-full mb-2 bg-white rounded-full shadow-lg border z-20 flex">
                                {(Object.keys(reactionIcons) as ReactionType[]).map(type => (
                                    <button
                                        key={type}
                                        onClick={() => handleReaction(type)}
                                        className={`p-3 hover:bg-gray-100 first:rounded-l-full last:rounded-r-full transition-colors ${reactionColors[type]}`}
                                        title={type}
                                    >
                                        {reactionIcons[type]}
                                    </button>
                                ))}
                            </div>
                        </>
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
        </div>
    );
};

export default PostCard;
