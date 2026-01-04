import api from '../axios';
import type { Post, Comment, Reaction, ReactionType, Visibility } from '../../types';

export interface CreatePostRequest {
    content: string;
    visibility?: Visibility;
    teamId?: number;
}

export interface AddCommentRequest {
    postId: number;
    content: string;
    parentCommentId?: number;
}

export interface FeedParams {
    visibility?: Visibility;
    teamId?: number;
    authorId?: number;
    page?: number;
    limit?: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// Community service functions - Real API calls
export const communityService = {
    /**
     * Get public feed
     */
    getPublicFeed: async (params?: FeedParams): Promise<PaginatedResponse<Post>> => {
        const response = await api.get<Post[]>('/posts', { params });
        return {
            data: response.data,
            total: response.data.length,
            page: params?.page || 1,
            limit: params?.limit || 20,
            totalPages: 1,
        };
    },

    /**
     * Get post by ID
     */
    getPostById: async (postId: number): Promise<Post> => {
        const response = await api.get<Post>(`/posts/${postId}`);
        return response.data;
    },

    /**
     * Create a new post
     */
    createPost: async (data: CreatePostRequest): Promise<Post> => {
        const response = await api.post<Post>('/posts', data);
        return response.data;
    },

    /**
     * Update a post
     */
    updatePost: async (postId: number, content: string): Promise<Post> => {
        const response = await api.put<Post>(`/posts/${postId}`, { content });
        return response.data;
    },

    /**
     * Delete a post
     */
    deletePost: async (postId: number): Promise<void> => {
        await api.delete(`/posts/${postId}`);
    },

    /**
     * Get comments for a post
     */
    getPostComments: async (postId: number): Promise<Comment[]> => {
        const response = await api.get<Comment[]>(`/posts/${postId}/comments`);
        return response.data;
    },

    /**
     * Add a comment
     */
    addComment: async (data: AddCommentRequest): Promise<Comment> => {
        const response = await api.post<Comment>(`/posts/${data.postId}/comments`, {
            content: data.content,
            parentCommentId: data.parentCommentId,
        });
        return response.data;
    },

    /**
     * Delete a comment
     */
    deleteComment: async (commentId: number): Promise<void> => {
        await api.delete(`/comments/${commentId}`);
    },

    /**
     * Toggle reaction on a post
     */
    toggleReaction: async (postId: number, type: ReactionType): Promise<Reaction | null> => {
        const response = await api.post<Reaction | null>(`/posts/${postId}/reactions`, { type });
        return response.data;
    },

    /**
     * Get reactions for a post
     */
    getPostReactions: async (postId: number): Promise<Reaction[]> => {
        const response = await api.get<Reaction[]>(`/posts/${postId}/reactions`);
        return response.data;
    },

    /**
     * Report content
     */
    reportContent: async (
        contentId: number,
        contentType: 'Post' | 'Comment' | 'User',
        reason: string,
        details?: string
    ): Promise<void> => {
        await api.post('/posts/report', {
            contentId,
            contentType,
            reason,
            details,
        });
    },

    /**
     * Get current user's reactions for multiple posts
     */
    getMyReactions: async (postIds: number[]): Promise<{ postId: number; reactionType: string | null }[]> => {
        const response = await api.get<{ postId: number; reactionType: string | null }[]>('/posts/my-reactions', {
            params: { 'postIds[]': postIds },
        });
        return response.data;
    },
};

export default communityService;
