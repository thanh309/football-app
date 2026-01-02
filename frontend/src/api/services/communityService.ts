// @ts-ignore - Keeping api import for future use when switching back to real API
import api from '../axios';
import type { Post, Comment, Reaction, ReactionType, Visibility } from '../../types';
import { Visibility as VisibilityEnum, ReactionType as ReactionTypeEnum, ReactionEntityType } from '../../types';

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

// --- Mock Data ---
const mockPost: Post = {
    postId: 1,
    authorId: 1,
    teamId: 1,
    content: '🎉 Great match today! Our team won 3-2 in an amazing comeback. Thanks to everyone who came to support us! #Victory #TeamSpirit',
    visibility: VisibilityEnum.PUBLIC,
    reactionCount: 24,
    commentCount: 8,
    isHidden: false,
    createdAt: '2025-01-10T18:30:00Z',
    updatedAt: '2025-01-10T18:30:00Z',
};

const mockPosts: Post[] = [
    mockPost,
    {
        postId: 2,
        authorId: 2,
        content: 'Looking for a team to join in District 7 area. I play as goalkeeper with 5 years experience. DM me! ⚽',
        visibility: VisibilityEnum.PUBLIC,
        reactionCount: 12,
        commentCount: 5,
        isHidden: false,
        createdAt: '2025-01-09T10:00:00Z',
        updatedAt: '2025-01-09T10:00:00Z',
    },
    {
        postId: 3,
        authorId: 1,
        teamId: 1,
        content: 'Training schedule for next week is up! Check the team calendar. 💪',
        visibility: VisibilityEnum.TEAM_ONLY,
        reactionCount: 8,
        commentCount: 2,
        isHidden: false,
        createdAt: '2025-01-08T14:00:00Z',
        updatedAt: '2025-01-08T14:00:00Z',
    },
];

// Use let so we can mutate this in mock mode
let mockComments: Comment[] = [
    {
        commentId: 1,
        postId: 1,
        authorId: 2,
        content: 'Congratulations! What an amazing game! 👏',
        isHidden: false,
        createdAt: '2025-01-10T19:00:00Z',
        updatedAt: '2025-01-10T19:00:00Z',
    },
    {
        commentId: 2,
        postId: 1,
        authorId: 3,
        content: 'I was there! The atmosphere was electric! ⚡',
        isHidden: false,
        createdAt: '2025-01-10T19:15:00Z',
        updatedAt: '2025-01-10T19:15:00Z',
    },
    {
        commentId: 3,
        postId: 1,
        authorId: 4,
        content: 'When is the next match?',
        parentCommentId: 1,
        isHidden: false,
        createdAt: '2025-01-10T19:30:00Z',
        updatedAt: '2025-01-10T19:30:00Z',
    },
];

const mockReactions: Reaction[] = [
    {
        reactionId: 1,
        entityType: ReactionEntityType.POST,
        entityId: 1,
        userId: 2,
        type: ReactionTypeEnum.LIKE,
        createdAt: '2025-01-10T18:35:00Z',
    },
    {
        reactionId: 2,
        entityType: ReactionEntityType.POST,
        entityId: 1,
        userId: 3,
        type: ReactionTypeEnum.LOVE,
        createdAt: '2025-01-10T18:40:00Z',
    },
    {
        reactionId: 3,
        entityType: ReactionEntityType.POST,
        entityId: 1,
        userId: 4,
        type: ReactionTypeEnum.CELEBRATE,
        createdAt: '2025-01-10T18:45:00Z',
    },
];

export const communityService = {
    /**
     * Get public feed
     */
    getPublicFeed: async (params?: FeedParams): Promise<PaginatedResponse<Post>> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<PaginatedResponse<Post>>('/posts', { params });
        // return response.data;
        // --- End Real API call ---

        const page = params?.page || 1;
        const limit = params?.limit || 10;

        return {
            data: mockPosts,
            total: mockPosts.length,
            page,
            limit,
            totalPages: Math.ceil(mockPosts.length / limit),
        };
    },

    /**
     * Get post by ID
     */
    getPostById: async (_postId: number): Promise<Post> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<Post>(`/posts/${postId}`);
        // return response.data;
        // --- End Real API call ---

        return mockPost;
    },

    /**
     * Create a new post
     */
    createPost: async (data: CreatePostRequest): Promise<Post> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.post<Post>('/posts', data);
        // return response.data;
        // --- End Real API call ---

        return {
            postId: Math.floor(Math.random() * 1000) + 100,
            authorId: 1, // Assume current user
            teamId: data.teamId,
            content: data.content,
            visibility: data.visibility || VisibilityEnum.PUBLIC,
            reactionCount: 0,
            commentCount: 0,
            isHidden: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
    },

    /**
     * Update a post
     */
    updatePost: async (postId: number, content: string): Promise<Post> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.put<Post>(`/posts/${postId}`, { content });
        // return response.data;
        // --- End Real API call ---

        return {
            ...mockPost,
            postId,
            content,
            updatedAt: new Date().toISOString(),
        };
    },

    /**
     * Delete a post
     */
    deletePost: async (_postId: number): Promise<void> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // await api.delete(`/posts/${postId}`);
        // --- End Real API call ---

        console.log('Mock: Post deleted successfully');
    },

    /**
     * Get comments for a post
     */
    getPostComments: async (postId: number): Promise<Comment[]> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<Comment[]>(`/posts/${postId}/comments`);
        // return response.data;
        // --- End Real API call ---

        // Return comments for this specific post
        return mockComments.filter(c => c.postId === postId);
    },

    /**
     * Add a comment
     */
    addComment: async (data: AddCommentRequest): Promise<Comment> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.post<Comment>(`/posts/${data.postId}/comments`, {
        //     content: data.content,
        //     parentCommentId: data.parentCommentId,
        // });
        // return response.data;
        // --- End Real API call ---

        const newComment: Comment = {
            commentId: Math.floor(Math.random() * 1000) + 100,
            postId: data.postId,
            authorId: 1, // Assume current user
            content: data.content,
            parentCommentId: data.parentCommentId,
            isHidden: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        // Add to mock data so it persists
        mockComments = [...mockComments, newComment];

        return newComment;
    },

    /**
     * Delete a comment
     */
    deleteComment: async (_commentId: number): Promise<void> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // await api.delete(`/comments/${commentId}`);
        // --- End Real API call ---

        console.log('Mock: Comment deleted successfully');
    },

    /**
     * Toggle reaction on a post
     */
    toggleReaction: async (postId: number, type: ReactionType): Promise<Reaction | null> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.post<Reaction | null>(`/posts/${postId}/reactions`, { type });
        // return response.data;
        // --- End Real API call ---

        // Simulate toggle: return new reaction or null (removed)
        return {
            reactionId: Math.floor(Math.random() * 1000) + 100,
            entityType: ReactionEntityType.POST,
            entityId: postId,
            userId: 1, // Assume current user
            type,
            createdAt: new Date().toISOString(),
        };
    },

    /**
     * Get reactions for a post
     */
    getPostReactions: async (_postId: number): Promise<Reaction[]> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<Reaction[]>(`/posts/${postId}/reactions`);
        // return response.data;
        // --- End Real API call ---

        return mockReactions;
    },

    /**
     * Report content
     */
    reportContent: async (
        _contentId: number,
        _contentType: 'Post' | 'Comment' | 'User',
        _reason: string,
        _details?: string
    ): Promise<void> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // await api.post('/reports', {
        //     contentId,
        //     contentType,
        //     reason,
        //     details,
        // });
        // --- End Real API call ---

        console.log('Mock: Content reported successfully');
    },
};

export default communityService;
