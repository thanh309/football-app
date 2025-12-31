import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { LoadingSpinner, EmptyState, Button } from '../common';
import { useInfiniteFeed } from '../../api/hooks/useCommunity';
import { useAuth } from '../../contexts';
import PostCard from './PostCard';
import CommentSection from './CommentSection';
import CreatePostForm from './CreatePostForm';
import ReportForm from './ReportForm';
import type { Post } from '../../types';

interface CommunityFeedViewProps {
    teamId?: number;
    currentUserId?: number;
}

const CommunityFeedView: React.FC<CommunityFeedViewProps> = ({ teamId, currentUserId }) => {
    const { isAuthenticated } = useAuth();
    const {
        data,
        isLoading,
        error,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = useInfiniteFeed({ teamId });

    const [expandedPostId, setExpandedPostId] = useState<number | null>(null);
    const [reportingPostId, setReportingPostId] = useState<number | null>(null);

    if (isLoading) {
        return <LoadingSpinner text="Loading feed..." />;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">Failed to load feed</div>;
    }

    const posts = data?.pages.flatMap(page => page.data) || [];

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Create Post - Only show for authenticated users */}
            {isAuthenticated && <CreatePostForm teamId={teamId} />}

            {/* Posts */}
            {posts.length === 0 ? (
                <EmptyState
                    title="No Posts Yet"
                    description={isAuthenticated ? "Be the first to share something with the community!" : "No posts in the community yet."}
                />
            ) : (
                <div className="space-y-6">
                    {posts.map((post: Post) => (
                        <div key={post.postId} className="space-y-3">
                            <PostCard
                                post={post}
                                isOwner={currentUserId === post.authorId}
                                isAuthenticated={isAuthenticated}
                                onCommentClick={() =>
                                    setExpandedPostId(
                                        expandedPostId === post.postId ? null : post.postId
                                    )
                                }
                                onReportClick={() => setReportingPostId(post.postId)}
                            />

                            {/* Comments Section - Always visible but toggle-able */}
                            {expandedPostId === post.postId && (
                                <div className="ml-4 p-4 bg-gray-50 rounded-xl">
                                    <CommentSection
                                        postId={post.postId}
                                        currentUserId={currentUserId}
                                        isAuthenticated={isAuthenticated}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Load More */}
            {hasNextPage && (
                <div className="text-center py-4">
                    <Button
                        variant="outline"
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        leftIcon={isFetchingNextPage ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
                    >
                        {isFetchingNextPage ? 'Loading...' : 'Load More'}
                    </Button>
                </div>
            )}

            {/* Report Modal - Only show for authenticated users */}
            {isAuthenticated && reportingPostId && (
                <ReportForm
                    contentId={reportingPostId}
                    contentType="Post"
                    isOpen={true}
                    onClose={() => setReportingPostId(null)}
                />
            )}
        </div>
    );
};

export default CommunityFeedView;

