// @ts-ignore - Keeping api import for future use when switching back to real API
import api from '../axios';
import type { AttendanceRecord, AttendanceStatus } from '../../types';
import { AttendanceStatus as AttendanceStatusEnum } from '../../types';

export interface AttendanceUpdateRequest {
    matchId: number;
    playerId: number;
    status: AttendanceStatus;
}

export interface BatchAttendanceRequest {
    matchId: number;
    records: Array<{
        playerId: number;
        status: AttendanceStatus;
    }>;
}

export interface AttendanceStats {
    total: number;
    present: number;
    absent: number;
    excused: number;
    pending: number;
}

// --- Mock Data ---
const mockAttendanceRecords: AttendanceRecord[] = [
    {
        attendanceId: 1,
        matchId: 1,
        playerId: 1,
        teamId: 1,
        status: AttendanceStatusEnum.PRESENT,
        confirmedAt: '2025-01-15T17:30:00Z',
        confirmedBy: 1,
    },
    {
        attendanceId: 2,
        matchId: 1,
        playerId: 2,
        teamId: 1,
        status: AttendanceStatusEnum.PRESENT,
        confirmedAt: '2025-01-15T17:45:00Z',
        confirmedBy: 1,
    },
    {
        attendanceId: 3,
        matchId: 1,
        playerId: 3,
        teamId: 1,
        status: AttendanceStatusEnum.ABSENT,
    },
    {
        attendanceId: 4,
        matchId: 1,
        playerId: 4,
        teamId: 1,
        status: AttendanceStatusEnum.EXCUSED,
        confirmedAt: '2025-01-14T10:00:00Z',
        confirmedBy: 4,
    },
    {
        attendanceId: 5,
        matchId: 1,
        playerId: 5,
        teamId: 1,
        status: AttendanceStatusEnum.PENDING,
    },
];

const mockAttendanceStats: AttendanceStats = {
    total: 11,
    present: 8,
    absent: 1,
    excused: 1,
    pending: 1,
};

export const attendanceService = {
    /**
     * Get attendance for a match
     */
    getMatchAttendance: async (_matchId: number): Promise<AttendanceRecord[]> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<AttendanceRecord[]>(`/matches/${matchId}/attendance`);
        // return response.data;
        // --- End Real API call ---

        return mockAttendanceRecords;
    },

    /**
     * Confirm self attendance (player)
     */
    confirmAttendance: async (matchId: number): Promise<AttendanceRecord> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.post<AttendanceRecord>(`/matches/${matchId}/attendance/confirm`);
        // return response.data;
        // --- End Real API call ---

        return {
            attendanceId: Math.floor(Math.random() * 1000) + 100,
            matchId,
            playerId: 1, // Assume current player
            teamId: 1,
            status: AttendanceStatusEnum.PRESENT,
            confirmedAt: new Date().toISOString(),
            confirmedBy: 1,
        };
    },

    /**
     * Update attendance status (team leader)
     */
    updateAttendance: async (data: AttendanceUpdateRequest): Promise<AttendanceRecord> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.patch<AttendanceRecord>(
        //     `/matches/${data.matchId}/attendance/${data.playerId}`,
        //     { status: data.status }
        // );
        // return response.data;
        // --- End Real API call ---

        return {
            attendanceId: Math.floor(Math.random() * 1000) + 100,
            matchId: data.matchId,
            playerId: data.playerId,
            teamId: 1,
            status: data.status,
            confirmedAt: new Date().toISOString(),
            confirmedBy: 1,
        };
    },

    /**
     * Save batch attendance records
     */
    saveBatchAttendance: async (data: BatchAttendanceRequest): Promise<AttendanceRecord[]> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.post<AttendanceRecord[]>(
        //     `/matches/${data.matchId}/attendance/batch`,
        //     { records: data.records }
        // );
        // return response.data;
        // --- End Real API call ---

        return data.records.map((record, index) => ({
            attendanceId: index + 100,
            matchId: data.matchId,
            playerId: record.playerId,
            teamId: 1,
            status: record.status,
            confirmedAt: new Date().toISOString(),
            confirmedBy: 1,
        }));
    },

    /**
     * Get attendance statistics for a match
     */
    getAttendanceStats: async (_matchId: number): Promise<AttendanceStats> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<AttendanceStats>(`/matches/${matchId}/attendance/stats`);
        // return response.data;
        // --- End Real API call ---

        return mockAttendanceStats;
    },

    /**
     * Get player's attendance history
     */
    getPlayerAttendance: async (_playerId: number): Promise<AttendanceRecord[]> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<AttendanceRecord[]>(`/players/${playerId}/attendance`);
        // return response.data;
        // --- End Real API call ---

        return mockAttendanceRecords;
    },
};

export default attendanceService;
