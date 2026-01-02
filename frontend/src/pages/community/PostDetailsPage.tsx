import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PostCard, CommentSection } from '../../components/community';
import { LoadingSpinner, PageContainer, PageHeader, ContentCard } from '../../components/common';
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
            <PageContainer maxWidth="md">
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Post Not Found</h2>
                    <p className="text-slate-600 mb-6">This post may have been deleted or is not available.</p>
                    <Link to="/community" className="text-primary-600 hover:underline">
                        Back to Community
                    </Link>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer maxWidth="md">
            <PageHeader
                title="Post Details"
                backLink={{ label: 'Back to Community', to: '/community' }}
            />

            {/* Post */}
            <div className="mb-6">
                <PostCard post={post} />
            </div>

            {/* Comments */}
            <ContentCard title={`Comments (${post.commentCount})`}>
                <CommentSection postId={post.postId} />
            </ContentCard>
        </PageContainer>
    );
};

export default PostDetailsPage;
