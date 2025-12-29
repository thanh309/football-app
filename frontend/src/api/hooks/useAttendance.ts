import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    attendanceService,
    type AttendanceUpdateRequest,
    type BatchAttendanceRequest
} from '../services/attendanceService';

export const attendanceKeys = {
    all: ['attendance'] as const,
    match: (matchId: number) => [...attendanceKeys.all, 'match', matchId] as const,
    stats: (matchId: number) => [...attendanceKeys.all, 'stats', matchId] as const,
    player: (playerId: number) => [...attendanceKeys.all, 'player', playerId] as const,
};

export function useMatchAttendance(matchId: number) {
    return useQuery({
        queryKey: attendanceKeys.match(matchId),
        queryFn: () => attendanceService.getMatchAttendance(matchId),
        enabled: !!matchId,
    });
}

export function useAttendanceStats(matchId: number) {
    return useQuery({
        queryKey: attendanceKeys.stats(matchId),
        queryFn: () => attendanceService.getAttendanceStats(matchId),
        enabled: !!matchId,
    });
}

export function usePlayerAttendance(playerId: number) {
    return useQuery({
        queryKey: attendanceKeys.player(playerId),
        queryFn: () => attendanceService.getPlayerAttendance(playerId),
        enabled: !!playerId,
    });
}

export function useConfirmAttendance() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (matchId: number) => attendanceService.confirmAttendance(matchId),
        onSuccess: (record) => {
            queryClient.invalidateQueries({ queryKey: attendanceKeys.match(record.matchId) });
            queryClient.invalidateQueries({ queryKey: attendanceKeys.stats(record.matchId) });
        },
    });
}

export function useUpdateAttendance() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: AttendanceUpdateRequest) => attendanceService.updateAttendance(data),
        onSuccess: (record) => {
            queryClient.invalidateQueries({ queryKey: attendanceKeys.match(record.matchId) });
            queryClient.invalidateQueries({ queryKey: attendanceKeys.stats(record.matchId) });
        },
    });
}

export function useSaveBatchAttendance() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: BatchAttendanceRequest) => attendanceService.saveBatchAttendance(data),
        onSuccess: (_, data) => {
            queryClient.invalidateQueries({ queryKey: attendanceKeys.match(data.matchId) });
            queryClient.invalidateQueries({ queryKey: attendanceKeys.stats(data.matchId) });
        },
    });
}
