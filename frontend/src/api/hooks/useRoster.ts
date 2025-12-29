import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { rosterService, type AddPlayerRequest, type UpdateRoleRequest } from '../services/rosterService';
import { teamKeys } from './useTeam';

export const rosterKeys = {
    all: ['roster'] as const,
    team: (teamId: number) => [...rosterKeys.all, 'team', teamId] as const,
    player: (playerId: number) => [...rosterKeys.all, 'player', playerId] as const,
};

export function useTeamRoster(teamId: number) {
    return useQuery({
        queryKey: rosterKeys.team(teamId),
        queryFn: () => rosterService.getTeamRoster(teamId),
        enabled: !!teamId,
    });
}

export function usePlayerMembership(playerId: number) {
    return useQuery({
        queryKey: rosterKeys.player(playerId),
        queryFn: () => rosterService.getPlayerTeamMembership(playerId),
        enabled: !!playerId,
    });
}

export function useAddPlayerToRoster() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: AddPlayerRequest) => rosterService.addPlayer(data),
        onSuccess: (_, data) => {
            queryClient.invalidateQueries({ queryKey: rosterKeys.team(data.teamId) });
            queryClient.invalidateQueries({ queryKey: teamKeys.roster(data.teamId) });
        },
    });
}

export function useRemovePlayerFromRoster() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ teamId, playerId }: { teamId: number; playerId: number }) =>
            rosterService.removePlayer(teamId, playerId),
        onSuccess: (_, { teamId }) => {
            queryClient.invalidateQueries({ queryKey: rosterKeys.team(teamId) });
            queryClient.invalidateQueries({ queryKey: teamKeys.roster(teamId) });
        },
    });
}

export function useUpdatePlayerRole() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateRoleRequest) => rosterService.updatePlayerRole(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: rosterKeys.all });
        },
    });
}
