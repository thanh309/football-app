import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    matchService,
    type CreateMatchRequest,
    type UpdateMatchRequest,
    type MatchSearchParams,
    type SendInvitationRequest
} from '../services/matchService';
import type { MatchEvent } from '../../types';

export const matchKeys = {
    all: ['matches'] as const,
    lists: () => [...matchKeys.all, 'list'] as const,
    list: (filters: MatchSearchParams) => [...matchKeys.lists(), filters] as const,
    details: () => [...matchKeys.all, 'detail'] as const,
    detail: (id: number) => [...matchKeys.details(), id] as const,
    team: (teamId: number) => [...matchKeys.all, 'team', teamId] as const,
    playerSchedule: (playerId: number) => [...matchKeys.all, 'schedule', playerId] as const,
    invitations: (teamId: number) => [...matchKeys.all, 'invitations', teamId] as const,
    result: (matchId: number) => [...matchKeys.all, 'result', matchId] as const,
};

export function useMatchDetails(matchId: number) {
    return useQuery({
        queryKey: matchKeys.detail(matchId),
        queryFn: () => matchService.getMatchById(matchId),
        enabled: !!matchId,
    });
}

export function useTeamMatches(teamId: number, params?: MatchSearchParams) {
    return useQuery({
        queryKey: matchKeys.team(teamId),
        queryFn: () => matchService.getTeamMatches(teamId, params),
        enabled: !!teamId,
    });
}

export function usePlayerSchedule(playerId: number) {
    return useQuery({
        queryKey: matchKeys.playerSchedule(playerId),
        queryFn: () => matchService.getPlayerSchedule(playerId),
        enabled: !!playerId,
    });
}

export function usePendingInvitations(teamId: number) {
    return useQuery({
        queryKey: matchKeys.invitations(teamId),
        queryFn: () => matchService.getPendingInvitations(teamId),
        enabled: !!teamId,
    });
}

export function useMatchResult(matchId: number) {
    return useQuery({
        queryKey: matchKeys.result(matchId),
        queryFn: () => matchService.getMatchResult(matchId),
        enabled: !!matchId,
    });
}

export function useCreateMatch() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateMatchRequest) => matchService.createMatch(data),
        onSuccess: (match) => {
            queryClient.invalidateQueries({ queryKey: matchKeys.team(match.hostTeamId) });
        },
    });
}

export function useUpdateMatch() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateMatchRequest) => matchService.updateMatch(data),
        onSuccess: (match) => {
            queryClient.setQueryData<MatchEvent>(matchKeys.detail(match.matchId), match);
            queryClient.invalidateQueries({ queryKey: matchKeys.team(match.hostTeamId) });
        },
    });
}

export function useCancelMatch() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ matchId, reason }: { matchId: number; reason?: string }) =>
            matchService.cancelMatch(matchId, reason),
        onSuccess: (match) => {
            queryClient.setQueryData<MatchEvent>(matchKeys.detail(match.matchId), match);
            queryClient.invalidateQueries({ queryKey: matchKeys.all });
        },
    });
}

export function useSendInvitation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: SendInvitationRequest) => matchService.sendInvitation(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: matchKeys.all });
        },
    });
}

export function useRespondInvitation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ invitationId, accept }: { invitationId: number; accept: boolean }) =>
            matchService.respondInvitation(invitationId, accept),
        onSuccess: (invitation) => {
            queryClient.invalidateQueries({ queryKey: matchKeys.invitations(invitation.invitedTeamId) });
            queryClient.invalidateQueries({ queryKey: matchKeys.detail(invitation.matchId) });
        },
    });
}

export function useRecordMatchResult() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            matchId,
            homeScore,
            awayScore,
            notes,
        }: {
            matchId: number;
            homeScore: number;
            awayScore: number;
            notes?: string;
        }) => matchService.recordResult(matchId, homeScore, awayScore, notes),
        onSuccess: (result) => {
            queryClient.setQueryData(matchKeys.result(result.matchId), result);
            queryClient.invalidateQueries({ queryKey: matchKeys.detail(result.matchId) });
        },
    });
}
