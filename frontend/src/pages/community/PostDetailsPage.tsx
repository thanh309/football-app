import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PostCard, CommentSection } from '../../components/community';
import { LoadingSpinner } from '../../components/common';
import { Visibility, type Post } from '../../types';

// Mock data for demonstration
const mockPost: Post = {
    postId: 1,
    authorId: 1,
    content: 'Great match yesterday! Our team played really well and we managed to secure a 3-2 victory against City United. Special thanks to our goalkeeper for some amazing saves! 🎉⚽',
    visibility: Visibility.PUBLIC,
    reactionCount: 24,
    commentCount: 8,
    isHidden: false,
    createdAt: '2024-01-15T14:30:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
};

const PostDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = React.useState(true);
    const [post, setPost] = React.useState<Post | null>(null);

    React.useEffect(() => {
        // Simulate API call
        const timer = setTimeout(() => {
            setPost(mockPost);
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h2>
                    <p className="text-gray-600 mb-6">This post may have been deleted or is not available.</p>
                    <Link to="/community" className="text-emerald-600 hover:underline">
                        Back to Community
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Back link */}
            <Link
                to="/community"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Community
            </Link>

            {/* Post */}
            <div className="mb-6">
                <PostCard post={post} />
            </div>

            {/* Comments */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                    Comments ({post.commentCount})
                </h2>
                <CommentSection postId={post.postId} />
            </div>
        </div>
    );
};

export default PostDetailsPage;
