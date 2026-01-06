import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { LoadingSpinner, EmptyState, Button } from '../common';
import { useInfiniteFeed } from '../../api/hooks/useCommunity';
import { useAuth } from '../../contexts';
import { communityService } from '../../api/services/communityService';
import PostCard from './PostCard';
import CommentSection from './CommentSection';
import CreatePostForm from './CreatePostForm';
import ReportForm from './ReportForm';
import type { Post, ReactionType } from '../../types';

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
    const [userReactions, setUserReactions] = useState<Record<number, ReactionType | null>>({});

    const posts = data?.pages.flatMap(page => page.data) || [];

    // Fetch user's reactions when posts change
    useEffect(() => {
        if (!isAuthenticated || posts.length === 0) return;

        const postIds = posts.map(p => p.postId);
        // Only fetch for posts we haven't fetched yet
        const newPostIds = postIds.filter(id => !(id in userReactions));

        if (newPostIds.length === 0) return;

        communityService.getMyReactions(newPostIds)
            .then(reactions => {
                const newReactionsMap: Record<number, ReactionType | null> = {};
                reactions.forEach(r => {
                    newReactionsMap[r.postId] = r.reactionType as ReactionType | null;
                });
                setUserReactions(prev => ({ ...prev, ...newReactionsMap }));
            })
            .catch(() => {
                // Silently fail - reactions just won't be pre-selected
            });
    }, [isAuthenticated, posts.length]);

    if (isLoading) {
        return <LoadingSpinner text="Loading feed..." />;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">Failed to load feed</div>;
    }

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
                                userReaction={userReactions[post.postId] || null}
                                onCommentClick={() =>
                                    setExpandedPostId(
                                        expandedPostId === post.postId ? null : post.postId
                                    )
                                }
                                onReportClick={() => setReportingPostId(post.postId)}
                            />

                            {/* Comments Section - Always visible but toggle-able */}
                            {expandedPostId === post.postId && (
                                <div className="ml-4 p-4 bg-gray-50 rounded-xl text-left">
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

