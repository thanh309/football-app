import api from '../axios';
import type { AttendanceRecord, AttendanceStatus } from '../../types';

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

export const attendanceService = {
    /**
     * Get attendance for a match
     */
    getMatchAttendance: async (matchId: number): Promise<AttendanceRecord[]> => {
        const response = await api.get<AttendanceRecord[]>(`/matches/${matchId}/attendance`);
        return response.data;
    },

    /**
     * Confirm self attendance (player)
     */
    confirmAttendance: async (matchId: number): Promise<AttendanceRecord> => {
        const response = await api.post<AttendanceRecord>(`/matches/${matchId}/attendance/confirm`);
        return response.data;
    },

    /**
     * Update attendance status (team leader)
     */
    updateAttendance: async (data: AttendanceUpdateRequest): Promise<AttendanceRecord> => {
        const response = await api.patch<AttendanceRecord>(
            `/matches/${data.matchId}/attendance/${data.playerId}`,
            { status: data.status }
        );
        return response.data;
    },

    /**
     * Save batch attendance records
     */
    saveBatchAttendance: async (data: BatchAttendanceRequest): Promise<AttendanceRecord[]> => {
        const response = await api.post<AttendanceRecord[]>(
            `/matches/${data.matchId}/attendance/batch`,
            { records: data.records }
        );
        return response.data;
    },

    /**
     * Get attendance statistics for a match
     */
    getAttendanceStats: async (matchId: number): Promise<AttendanceStats> => {
        const response = await api.get<AttendanceStats>(`/matches/${matchId}/attendance/stats`);
        return response.data;
    },

    /**
     * Get player's attendance history
     */
    getPlayerAttendance: async (playerId: number): Promise<AttendanceRecord[]> => {
        const response = await api.get<AttendanceRecord[]>(`/players/${playerId}/attendance`);
        return response.data;
    },
};

export default attendanceService;
