import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { teamService, type CreateTeamRequest, type UpdateTeamRequest, type TeamSearchParams } from '../services/teamService';
import type { TeamProfile, JoinRequest } from '../../types';

export const teamKeys = {
    all: ['teams'] as const,
    lists: () => [...teamKeys.all, 'list'] as const,
    list: (filters: TeamSearchParams) => [...teamKeys.lists(), filters] as const,
    details: () => [...teamKeys.all, 'detail'] as const,
    detail: (id: number) => [...teamKeys.details(), id] as const,
    leader: (userId: number) => [...teamKeys.all, 'leader', userId] as const,
    player: (playerId: number) => [...teamKeys.all, 'player', playerId] as const,
    roster: (teamId: number) => [...teamKeys.all, 'roster', teamId] as const,
    joinRequests: (teamId: number) => [...teamKeys.all, 'joinRequests', teamId] as const,
};

export function useTeam(teamId: number) {
    return useQuery({
        queryKey: teamKeys.detail(teamId),
        queryFn: () => teamService.getTeamById(teamId),
        enabled: !!teamId,
    });
}

export function useLeaderTeams(userId: number) {
    return useQuery({
        queryKey: teamKeys.leader(userId),
        queryFn: () => teamService.getLeaderTeams(userId),
        enabled: !!userId,
    });
}

export function usePlayerTeams(playerId: number) {
    return useQuery({
        queryKey: teamKeys.player(playerId),
        queryFn: () => teamService.getPlayerTeams(playerId),
        enabled: !!playerId,
    });
}

export function useSearchTeams(params: TeamSearchParams) {
    return useQuery({
        queryKey: teamKeys.list(params),
        queryFn: () => teamService.searchTeams(params),
    });
}

export function useTeamRoster(teamId: number) {
    return useQuery({
        queryKey: teamKeys.roster(teamId),
        queryFn: () => teamService.getTeamRoster(teamId),
        enabled: !!teamId,
    });
}

export function usePendingJoinRequests(teamId: number) {
    return useQuery({
        queryKey: teamKeys.joinRequests(teamId),
        queryFn: () => teamService.getPendingJoinRequests(teamId),
        enabled: !!teamId,
    });
}

export function useCreateTeam() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateTeamRequest) => teamService.createTeam(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: teamKeys.all });
        },
    });
}

export function useUpdateTeam() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateTeamRequest) => teamService.updateTeam(data),
        onSuccess: (team) => {
            queryClient.setQueryData<TeamProfile>(teamKeys.detail(team.teamId), team);
            queryClient.invalidateQueries({ queryKey: teamKeys.lists() });
        },
    });
}

export function useDeleteTeam() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (teamId: number) => teamService.deleteTeam(teamId),
        onSuccess: (_, teamId) => {
            queryClient.removeQueries({ queryKey: teamKeys.detail(teamId) });
            queryClient.invalidateQueries({ queryKey: teamKeys.all });
        },
    });
}

export function useRequestJoinTeam() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ teamId, message }: { teamId: number; message?: string }) =>
            teamService.requestJoinTeam(teamId, message),
        onSuccess: (_, { teamId }) => {
            queryClient.invalidateQueries({ queryKey: teamKeys.joinRequests(teamId) });
        },
    });
}

export function useLeaveTeam() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ teamId, playerId }: { teamId: number; playerId: number }) =>
            teamService.leaveTeam(teamId, playerId),
        onSuccess: (_, { teamId }) => {
            queryClient.invalidateQueries({ queryKey: teamKeys.roster(teamId) });
            queryClient.invalidateQueries({ queryKey: teamKeys.all });
        },
    });
}

export function useProcessJoinRequest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ requestId, approve }: { requestId: number; approve: boolean }) =>
            teamService.processJoinRequest(requestId, approve),
        onSuccess: (request: JoinRequest) => {
            queryClient.invalidateQueries({ queryKey: teamKeys.joinRequests(request.teamId) });
            queryClient.invalidateQueries({ queryKey: teamKeys.roster(request.teamId) });
        },
    });
}
