// @ts-ignore - Keeping api import for future use when switching back to real API
import api from '../axios';
import type { BookingRequest, FieldCalendar } from '../../types';
import { BookingStatus as BookingStatusEnum, CalendarStatus as CalendarStatusEnum } from '../../types';

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

// --- Mock Data ---
const mockBookingRequest: BookingRequest = {
    bookingId: 1,
    fieldId: 1,
    teamId: 1,
    requesterId: 1,
    date: '2025-01-20',
    startTime: '18:00:00',
    endTime: '20:00:00',
    status: BookingStatusEnum.PENDING,
    notes: 'Weekly practice session',
    createdAt: '2025-01-10T10:00:00Z',
};

const mockBookingRequests: BookingRequest[] = [
    mockBookingRequest,
    {
        bookingId: 2,
        fieldId: 1,
        teamId: 2,
        requesterId: 2,
        date: '2025-01-21',
        startTime: '19:00:00',
        endTime: '21:00:00',
        status: BookingStatusEnum.PENDING,
        notes: 'Team training',
        createdAt: '2025-01-11T14:00:00Z',
    },
    {
        bookingId: 3,
        fieldId: 1,
        teamId: 1,
        requesterId: 1,
        date: '2025-01-15',
        startTime: '17:00:00',
        endTime: '19:00:00',
        status: BookingStatusEnum.CONFIRMED,
        createdAt: '2025-01-05T09:00:00Z',
        processedAt: '2025-01-06T10:00:00Z',
    },
];

const mockFieldCalendar: FieldCalendar[] = [
    {
        calendarId: 1,
        fieldId: 1,
        date: '2025-01-20',
        startTime: '06:00:00',
        endTime: '08:00:00',
        status: CalendarStatusEnum.AVAILABLE,
    },
    {
        calendarId: 2,
        fieldId: 1,
        date: '2025-01-20',
        startTime: '08:00:00',
        endTime: '10:00:00',
        status: CalendarStatusEnum.BOOKED,
        bookingId: 3,
    },
    {
        calendarId: 3,
        fieldId: 1,
        date: '2025-01-20',
        startTime: '10:00:00',
        endTime: '12:00:00',
        status: CalendarStatusEnum.AVAILABLE,
    },
    {
        calendarId: 4,
        fieldId: 1,
        date: '2025-01-20',
        startTime: '12:00:00',
        endTime: '14:00:00',
        status: CalendarStatusEnum.MAINTENANCE,
    },
    {
        calendarId: 5,
        fieldId: 1,
        date: '2025-01-20',
        startTime: '14:00:00',
        endTime: '16:00:00',
        status: CalendarStatusEnum.BLOCKED,
    },
];

export const bookingService = {
    /**
     * Create a new booking request
     */
    createBooking: async (data: CreateBookingRequest): Promise<BookingRequest> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.post<BookingRequest>('/bookings', data);
        // return response.data;
        // --- End Real API call ---

        return {
            bookingId: Math.floor(Math.random() * 1000) + 100,
            fieldId: data.fieldId,
            teamId: data.teamId,
            requesterId: 1, // Assume current user
            date: data.date,
            startTime: data.startTime,
            endTime: data.endTime,
            status: BookingStatusEnum.PENDING,
            notes: data.notes,
            createdAt: new Date().toISOString(),
        };
    },

    /**
     * Get booking by ID
     */
    getBookingById: async (_bookingId: number): Promise<BookingRequest> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<BookingRequest>(`/bookings/${bookingId}`);
        // return response.data;
        // --- End Real API call ---

        return mockBookingRequest;
    },

    /**
     * Get pending bookings for a field
     */
    getPendingBookings: async (_fieldId: number): Promise<BookingRequest[]> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<BookingRequest[]>(`/fields/${fieldId}/bookings?status=Pending`);
        // return response.data;
        // --- End Real API call ---

        return mockBookingRequests.filter(b => b.status === BookingStatusEnum.PENDING);
    },

    /**
     * Get pending bookings for all owner's fields
     */
    getOwnerPendingBookings: async (): Promise<BookingRequest[]> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<BookingRequest[]>('/bookings/owner/pending');
        // return response.data;
        // --- End Real API call ---

        return mockBookingRequests.filter(b => b.status === BookingStatusEnum.PENDING);
    },

    /**
     * Approve booking request
     */
    approveBooking: async (bookingId: number): Promise<BookingRequest> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.patch<BookingRequest>(`/bookings/${bookingId}`, {
        //     status: 'Confirmed' as BookingStatus,
        // });
        // return response.data;
        // --- End Real API call ---

        return {
            ...mockBookingRequest,
            bookingId,
            status: BookingStatusEnum.CONFIRMED,
            processedAt: new Date().toISOString(),
        };
    },

    /**
     * Reject booking request
     */
    rejectBooking: async (bookingId: number, _reason?: string): Promise<BookingRequest> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.patch<BookingRequest>(`/bookings/${bookingId}`, {
        //     status: 'Rejected' as BookingStatus,
        //     rejectionReason: reason,
        // });
        // return response.data;
        // --- End Real API call ---

        return {
            ...mockBookingRequest,
            bookingId,
            status: BookingStatusEnum.REJECTED,
            processedAt: new Date().toISOString(),
        };
    },

    /**
     * Cancel booking
     */
    cancelBooking: async (bookingId: number): Promise<BookingRequest> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.patch<BookingRequest>(`/bookings/${bookingId}`, {
        //     status: 'Cancelled' as BookingStatus,
        // });
        // return response.data;
        // --- End Real API call ---

        return {
            ...mockBookingRequest,
            bookingId,
            status: BookingStatusEnum.CANCELLED,
            processedAt: new Date().toISOString(),
        };
    },

    /**
     * Get field calendar
     */
    getFieldCalendar: async (_fieldId: number, _params: CalendarQueryParams): Promise<FieldCalendar[]> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<FieldCalendar[]>(`/fields/${fieldId}/calendar`, { params });
        // return response.data;
        // --- End Real API call ---

        return mockFieldCalendar;
    },

    /**
     * Block a calendar slot
     */
    blockSlot: async (data: BlockSlotRequest): Promise<FieldCalendar> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.post<FieldCalendar>(`/fields/${data.fieldId}/calendar/block`, {
        //     date: data.date,
        //     startTime: data.startTime,
        //     endTime: data.endTime,
        //     status: 'Blocked' as CalendarStatus,
        // });
        // return response.data;
        // --- End Real API call ---

        return {
            calendarId: Math.floor(Math.random() * 1000) + 100,
            fieldId: data.fieldId,
            date: data.date,
            startTime: data.startTime,
            endTime: data.endTime,
            status: CalendarStatusEnum.BLOCKED,
        };
    },

    /**
     * Unblock a calendar slot
     */
    unblockSlot: async (calendarId: number): Promise<FieldCalendar> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.patch<FieldCalendar>(`/calendar/${calendarId}`, {
        //     status: 'Available' as CalendarStatus,
        // });
        // return response.data;
        // --- End Real API call ---

        return {
            ...mockFieldCalendar[0],
            calendarId,
            status: CalendarStatusEnum.AVAILABLE,
        };
    },

    /**
     * Get bookings for a team
     */
    getTeamBookings: async (_teamId: number): Promise<BookingRequest[]> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<BookingRequest[]>(`/teams/${teamId}/bookings`);
        // return response.data;
        // --- End Real API call ---

        return mockBookingRequests;
    },
};

export default bookingService;
