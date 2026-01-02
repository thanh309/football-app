import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PostCard, CommentSection } from '../../components/community';
import { LoadingSpinner, PageContainer, PageHeader, ContentCard } from '../../components/common';
import { usePost } from '../../api/hooks/useCommunity';

const PostDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const postId = parseInt(id || '0', 10);

    const { data: post, isLoading } = usePost(postId);

    if (isLoading) {
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
