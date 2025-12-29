import api from '../axios';
import type { BookingRequest, FieldCalendar, BookingStatus, CalendarStatus } from '../../types';

export interface CreateBookingRequest {
    fieldId: number;
    teamId: number;
    date: string;
    startTime: string;
    endTime: string;
    notes?: string;
}

export interface CalendarQueryParams {
    startDate: string;
    endDate: string;
}

export interface BlockSlotRequest {
    fieldId: number;
    date: string;
    startTime: string;
    endTime: string;
    reason?: string;
}

export const bookingService = {
    /**
     * Create a new booking request
     */
    createBooking: async (data: CreateBookingRequest): Promise<BookingRequest> => {
        const response = await api.post<BookingRequest>('/bookings', data);
        return response.data;
    },

    /**
     * Get booking by ID
     */
    getBookingById: async (bookingId: number): Promise<BookingRequest> => {
        const response = await api.get<BookingRequest>(`/bookings/${bookingId}`);
        return response.data;
    },

    /**
     * Get pending bookings for a field
     */
    getPendingBookings: async (fieldId: number): Promise<BookingRequest[]> => {
        const response = await api.get<BookingRequest[]>(`/fields/${fieldId}/bookings?status=Pending`);
        return response.data;
    },

    /**
     * Get pending bookings for all owner's fields
     */
    getOwnerPendingBookings: async (): Promise<BookingRequest[]> => {
        const response = await api.get<BookingRequest[]>('/bookings/owner/pending');
        return response.data;
    },

    /**
     * Approve booking request
     */
    approveBooking: async (bookingId: number): Promise<BookingRequest> => {
        const response = await api.patch<BookingRequest>(`/bookings/${bookingId}`, {
            status: 'Confirmed' as BookingStatus,
        });
        return response.data;
    },

    /**
     * Reject booking request
     */
    rejectBooking: async (bookingId: number, reason?: string): Promise<BookingRequest> => {
        const response = await api.patch<BookingRequest>(`/bookings/${bookingId}`, {
            status: 'Rejected' as BookingStatus,
            rejectionReason: reason,
        });
        return response.data;
    },

    /**
     * Cancel booking
     */
    cancelBooking: async (bookingId: number): Promise<BookingRequest> => {
        const response = await api.patch<BookingRequest>(`/bookings/${bookingId}`, {
            status: 'Cancelled' as BookingStatus,
        });
        return response.data;
    },

    /**
     * Get field calendar
     */
    getFieldCalendar: async (fieldId: number, params: CalendarQueryParams): Promise<FieldCalendar[]> => {
        const response = await api.get<FieldCalendar[]>(`/fields/${fieldId}/calendar`, { params });
        return response.data;
    },

    /**
     * Block a calendar slot
     */
    blockSlot: async (data: BlockSlotRequest): Promise<FieldCalendar> => {
        const response = await api.post<FieldCalendar>(`/fields/${data.fieldId}/calendar/block`, {
            date: data.date,
            startTime: data.startTime,
            endTime: data.endTime,
            status: 'Blocked' as CalendarStatus,
        });
        return response.data;
    },

    /**
     * Unblock a calendar slot
     */
    unblockSlot: async (calendarId: number): Promise<FieldCalendar> => {
        const response = await api.patch<FieldCalendar>(`/calendar/${calendarId}`, {
            status: 'Available' as CalendarStatus,
        });
        return response.data;
    },

    /**
     * Get bookings for a team
     */
    getTeamBookings: async (teamId: number): Promise<BookingRequest[]> => {
        const response = await api.get<BookingRequest[]>(`/teams/${teamId}/bookings`);
        return response.data;
    },
};

export default bookingService;
