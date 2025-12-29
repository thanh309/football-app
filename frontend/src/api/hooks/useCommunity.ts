import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import {
    communityService,
    type CreatePostRequest,
    type AddCommentRequest,
    type FeedParams
} from '../services/communityService';
import type { ReactionType } from '../../types';

export const communityKeys = {
    all: ['community'] as const,
    feed: (params?: FeedParams) => [...communityKeys.all, 'feed', params] as const,
    posts: () => [...communityKeys.all, 'posts'] as const,
    post: (id: number) => [...communityKeys.posts(), id] as const,
    comments: (postId: number) => [...communityKeys.all, 'comments', postId] as const,
    reactions: (postId: number) => [...communityKeys.all, 'reactions', postId] as const,
};

export function usePublicFeed(params?: FeedParams) {
    return useQuery({
        queryKey: communityKeys.feed(params),
        queryFn: () => communityService.getPublicFeed(params),
    });
}

export function useInfiniteFeed(params?: Omit<FeedParams, 'page'>) {
    return useInfiniteQuery({
        queryKey: communityKeys.feed(params),
        queryFn: ({ pageParam = 1 }) =>
            communityService.getPublicFeed({ ...params, page: pageParam }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            if (lastPage.page < lastPage.totalPages) {
                return lastPage.page + 1;
            }
            return undefined;
        },
    });
}

export function usePost(postId: number) {
    return useQuery({
        queryKey: communityKeys.post(postId),
        queryFn: () => communityService.getPostById(postId),
        enabled: !!postId,
    });
}

export function usePostComments(postId: number) {
    return useQuery({
        queryKey: communityKeys.comments(postId),
        queryFn: () => communityService.getPostComments(postId),
        enabled: !!postId,
    });
}

export function usePostReactions(postId: number) {
    return useQuery({
        queryKey: communityKeys.reactions(postId),
        queryFn: () => communityService.getPostReactions(postId),
        enabled: !!postId,
    });
}

export function useCreatePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreatePostRequest) => communityService.createPost(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: communityKeys.feed() });
        },
    });
}

export function useUpdatePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, content }: { postId: number; content: string }) =>
            communityService.updatePost(postId, content),
        onSuccess: (post) => {
            queryClient.setQueryData(communityKeys.post(post.postId), post);
            queryClient.invalidateQueries({ queryKey: communityKeys.feed() });
        },
    });
}

export function useDeletePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (postId: number) => communityService.deletePost(postId),
        onSuccess: (_, postId) => {
            queryClient.removeQueries({ queryKey: communityKeys.post(postId) });
            queryClient.invalidateQueries({ queryKey: communityKeys.feed() });
        },
    });
}

export function useAddComment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: AddCommentRequest) => communityService.addComment(data),
        onSuccess: (comment) => {
            queryClient.invalidateQueries({ queryKey: communityKeys.comments(comment.postId) });
            queryClient.invalidateQueries({ queryKey: communityKeys.post(comment.postId) });
        },
    });
}

export function useDeleteComment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ commentId }: { commentId: number; postId: number }) =>
            communityService.deleteComment(commentId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: communityKeys.comments(variables.postId) });
            queryClient.invalidateQueries({ queryKey: communityKeys.post(variables.postId) });
        },
    });
}

export function useToggleReaction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, type }: { postId: number; type: ReactionType }) =>
            communityService.toggleReaction(postId, type),
        onSuccess: (_, { postId }) => {
            queryClient.invalidateQueries({ queryKey: communityKeys.reactions(postId) });
            queryClient.invalidateQueries({ queryKey: communityKeys.post(postId) });
        },
    });
}

export function useReportContent() {
    return useMutation({
        mutationFn: ({
            contentId,
            contentType,
            reason,
            details,
        }: {
            contentId: number;
            contentType: 'Post' | 'Comment' | 'User';
            reason: string;
            details?: string;
        }) => communityService.reportContent(contentId, contentType, reason, details),
    });
}
