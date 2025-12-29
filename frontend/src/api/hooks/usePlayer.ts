import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { playerService, type UpdatePlayerProfileRequest, type PlayerSearchParams } from '../services/playerService';
import type { PlayerProfile } from '../../types';

export const playerKeys = {
    all: ['players'] as const,
    lists: () => [...playerKeys.all, 'list'] as const,
    list: (filters: PlayerSearchParams) => [...playerKeys.lists(), filters] as const,
    details: () => [...playerKeys.all, 'detail'] as const,
    detail: (id: number) => [...playerKeys.details(), id] as const,
    byUser: (userId: number) => [...playerKeys.all, 'user', userId] as const,
    me: () => [...playerKeys.all, 'me'] as const,
};

export function usePlayerProfile(playerId: number) {
    return useQuery({
        queryKey: playerKeys.detail(playerId),
        queryFn: () => playerService.getPlayerById(playerId),
        enabled: !!playerId,
    });
}

export function usePlayerByUserId(userId: number) {
    return useQuery({
        queryKey: playerKeys.byUser(userId),
        queryFn: () => playerService.getPlayerByUserId(userId),
        enabled: !!userId,
    });
}

export function useMyPlayerProfile() {
    return useQuery({
        queryKey: playerKeys.me(),
        queryFn: () => playerService.getMyProfile(),
    });
}

export function useSearchPlayers(params: PlayerSearchParams) {
    return useQuery({
        queryKey: playerKeys.list(params),
        queryFn: () => playerService.searchPlayers(params),
    });
}

export function useUpdatePlayerProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ playerId, data }: { playerId: number; data: UpdatePlayerProfileRequest }) =>
            playerService.updateProfile(playerId, data),
        onSuccess: (player) => {
            queryClient.setQueryData<PlayerProfile>(playerKeys.detail(player.playerId), player);
            queryClient.invalidateQueries({ queryKey: playerKeys.me() });
        },
    });
}
