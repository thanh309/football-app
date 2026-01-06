import { useState } from 'react';
import { Send, Trash2, User } from 'lucide-react';
import { LoadingSpinner, Button } from '../common';
import { usePostComments, useAddComment, useDeleteComment } from '../../api/hooks/useCommunity';
import toast from 'react-hot-toast';
import type { Comment } from '../../types';
import { Link } from 'react-router-dom';

interface CommentSectionProps {
    postId: number;
    currentUserId?: number;
    isAuthenticated?: boolean;
}

interface CommentItemProps {
    comment: Comment;
    isOwner: boolean;
    onDelete: (commentId: number) => void;
    isDeleting: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, isOwner, onDelete, isDeleting }) => {
    return (
        <div className="flex gap-3">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <User className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2">
                <div className="flex items-center justify-between mb-1">
                    <Link
                        to={`/users/${comment.authorId}`}
                        className="font-medium text-gray-900 text-sm hover:text-emerald-600"
                    >
                        User #{comment.authorId}
                    </Link>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                        {isOwner && (
                            <button
                                onClick={() => onDelete(comment.commentId)}
                                disabled={isDeleting}
                                className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                </div>
                <p className="text-gray-700 text-sm text-left">{comment.content}</p>
            </div>
        </div>
    );
};

const CommentSection: React.FC<CommentSectionProps> = ({ postId, currentUserId, isAuthenticated = false }) => {
    const { data: comments, isLoading } = usePostComments(postId);
    const addComment = useAddComment();
    const deleteComment = useDeleteComment();
    const [newComment, setNewComment] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            await addComment.mutateAsync({ postId, content: newComment });
            setNewComment('');
            toast.success('Comment added');
        } catch {
            toast.error('Failed to add comment');
        }
    };

    const handleDelete = async (commentId: number) => {
        try {
            await deleteComment.mutateAsync({ commentId, postId });
            toast.success('Comment deleted');
        } catch {
            toast.error('Failed to delete comment');
        }
    };

    if (isLoading) {
        return <LoadingSpinner text="Loading comments..." size="sm" />;
    }

    return (
        <div className="space-y-4">
            {/* Comment Input - Only show for authenticated users */}
            {isAuthenticated && (
                <form onSubmit={handleSubmit} className="flex gap-3 items-start">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex-1 flex gap-2">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-emerald-500"
                        />
                        <Button
                            type="submit"
                            size="sm"
                            isLoading={addComment.isPending}
                            disabled={!newComment.trim()}
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </form>
            )}

            {/* Comments List */}
            {comments && comments.length > 0 ? (
                <div className="space-y-3 text-left">
                    {comments.map((comment: Comment) => (
                        <CommentItem
                            key={comment.commentId}
                            comment={comment}
                            isOwner={currentUserId === comment.authorId}
                            onDelete={handleDelete}
                            isDeleting={deleteComment.isPending}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 text-sm py-4">
                    {isAuthenticated ? 'No comments yet. Be the first to comment!' : 'No comments yet.'}
                </p>
            )}
        </div>
    );
};

export default CommentSection;

