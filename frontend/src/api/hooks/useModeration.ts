import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    moderationService,
    type VerifyTeamRequest,
    type VerifyFieldRequest,
    type ResolveReportRequest,
    type UserSearchParams
} from '../services/moderationService';

export const moderationKeys = {
    all: ['moderation'] as const,
    stats: () => [...moderationKeys.all, 'stats'] as const,
    pendingTeams: () => [...moderationKeys.all, 'teams', 'pending'] as const,
    teamReview: (teamId: number) => [...moderationKeys.all, 'teams', teamId] as const,
    pendingFields: () => [...moderationKeys.all, 'fields', 'pending'] as const,
    fieldReview: (fieldId: number) => [...moderationKeys.all, 'fields', fieldId] as const,
    users: (params?: UserSearchParams) => [...moderationKeys.all, 'users', params] as const,
    user: (userId: number) => [...moderationKeys.all, 'user', userId] as const,
    userHistory: (userId: number) => [...moderationKeys.all, 'history', userId] as const,
    pendingReports: () => [...moderationKeys.all, 'reports', 'pending'] as const,
    report: (reportId: number) => [...moderationKeys.all, 'reports', reportId] as const,
    history: (params?: object) => [...moderationKeys.all, 'history', params] as const,
};

// --- Stats ---

export function useModerationStats() {
    return useQuery({
        queryKey: moderationKeys.stats(),
        queryFn: () => moderationService.getModerationStats(),
    });
}

// --- Team Verification ---

export function usePendingTeams() {
    return useQuery({
        queryKey: moderationKeys.pendingTeams(),
        queryFn: () => moderationService.getPendingTeams(),
    });
}

export function useTeamForReview(teamId: number) {
    return useQuery({
        queryKey: moderationKeys.teamReview(teamId),
        queryFn: () => moderationService.getTeamForReview(teamId),
        enabled: !!teamId,
    });
}

export function useVerifyTeam() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: VerifyTeamRequest) => moderationService.verifyTeam(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: moderationKeys.pendingTeams() });
        },
    });
}

// --- Field Verification ---

export function usePendingFields() {
    return useQuery({
        queryKey: moderationKeys.pendingFields(),
        queryFn: () => moderationService.getPendingFields(),
    });
}

export function useFieldForReview(fieldId: number) {
    return useQuery({
        queryKey: moderationKeys.fieldReview(fieldId),
        queryFn: () => moderationService.getFieldForReview(fieldId),
        enabled: !!fieldId,
    });
}

export function useVerifyField() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: VerifyFieldRequest) => moderationService.verifyField(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: moderationKeys.pendingFields() });
        },
    });
}

// --- User Management ---

export function useSearchUsers(params?: UserSearchParams) {
    return useQuery({
        queryKey: moderationKeys.users(params),
        queryFn: () => moderationService.searchUsers(params || {}),
    });
}

export function useUserDetails(userId: number) {
    return useQuery({
        queryKey: moderationKeys.user(userId),
        queryFn: () => moderationService.getUserDetails(userId),
        enabled: !!userId,
    });
}

export function useUserModerationHistory(userId: number) {
    return useQuery({
        queryKey: moderationKeys.userHistory(userId),
        queryFn: () => moderationService.getUserModerationHistory(userId),
        enabled: !!userId,
    });
}

export function useSuspendUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, reason }: { userId: number; reason: string }) =>
            moderationService.suspendUser(userId, reason),
        onSuccess: (user) => {
            queryClient.setQueryData(moderationKeys.user(user.userId), user);
            queryClient.invalidateQueries({ queryKey: moderationKeys.users() });
        },
    });
}

export function useBanUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, reason }: { userId: number; reason: string }) =>
            moderationService.banUser(userId, reason),
        onSuccess: (user) => {
            queryClient.setQueryData(moderationKeys.user(user.userId), user);
            queryClient.invalidateQueries({ queryKey: moderationKeys.users() });
        },
    });
}

export function useReactivateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, reason }: { userId: number; reason: string }) =>
            moderationService.reactivateUser(userId, reason),
        onSuccess: (user) => {
            queryClient.setQueryData(moderationKeys.user(user.userId), user);
            queryClient.invalidateQueries({ queryKey: moderationKeys.users() });
        },
    });
}

// --- Content Moderation ---

export function usePendingReports() {
    return useQuery({
        queryKey: moderationKeys.pendingReports(),
        queryFn: () => moderationService.getPendingReports(),
    });
}

export function useReportDetails(reportId: number) {
    return useQuery({
        queryKey: moderationKeys.report(reportId),
        queryFn: () => moderationService.getReportDetails(reportId),
        enabled: !!reportId,
    });
}

export function useResolveReport() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ResolveReportRequest) => moderationService.resolveReport(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: moderationKeys.pendingReports() });
        },
    });
}

export function useDismissReport() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (reportId: number) => moderationService.dismissReport(reportId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: moderationKeys.pendingReports() });
        },
    });
}

// --- History ---

export function useModerationHistory(params?: Parameters<typeof moderationService.getModerationHistory>[0]) {
    return useQuery({
        queryKey: moderationKeys.history(params),
        queryFn: () => moderationService.getModerationHistory(params),
    });
}
