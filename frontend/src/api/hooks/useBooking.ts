import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    bookingService,
    type CreateBookingRequest,
    type CalendarQueryParams,
    type BlockSlotRequest
} from '../services/bookingService';

export const bookingKeys = {
    all: ['bookings'] as const,
    lists: () => [...bookingKeys.all, 'list'] as const,
    details: () => [...bookingKeys.all, 'detail'] as const,
    detail: (id: number) => [...bookingKeys.details(), id] as const,
    pending: (fieldId: number) => [...bookingKeys.all, 'pending', fieldId] as const,
    ownerPending: () => [...bookingKeys.all, 'owner', 'pending'] as const,
    calendar: (fieldId: number, params: CalendarQueryParams) =>
        [...bookingKeys.all, 'calendar', fieldId, params] as const,
    team: (teamId: number) => [...bookingKeys.all, 'team', teamId] as const,
};

export function useBookingDetails(bookingId: number) {
    return useQuery({
        queryKey: bookingKeys.detail(bookingId),
        queryFn: () => bookingService.getBookingById(bookingId),
        enabled: !!bookingId,
    });
}

export function usePendingBookings(fieldId: number) {
    return useQuery({
        queryKey: bookingKeys.pending(fieldId),
        queryFn: () => bookingService.getPendingBookings(fieldId),
        enabled: !!fieldId,
    });
}

export function useOwnerPendingBookings() {
    return useQuery({
        queryKey: bookingKeys.ownerPending(),
        queryFn: () => bookingService.getOwnerPendingBookings(),
    });
}

export function useFieldCalendar(fieldId: number, params: CalendarQueryParams) {
    return useQuery({
        queryKey: bookingKeys.calendar(fieldId, params),
        queryFn: () => bookingService.getFieldCalendar(fieldId, params),
        enabled: !!fieldId && !!params.startDate && !!params.endDate,
    });
}

export function useTeamBookings(teamId: number) {
    return useQuery({
        queryKey: bookingKeys.team(teamId),
        queryFn: () => bookingService.getTeamBookings(teamId),
        enabled: !!teamId,
    });
}

export function useCreateBooking() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateBookingRequest) => bookingService.createBooking(data),
        onSuccess: (booking) => {
            queryClient.invalidateQueries({ queryKey: bookingKeys.pending(booking.fieldId) });
            queryClient.invalidateQueries({ queryKey: bookingKeys.team(booking.teamId) });
        },
    });
}

export function useApproveBooking() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (bookingId: number) => bookingService.approveBooking(bookingId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: bookingKeys.all });
        },
    });
}

export function useRejectBooking() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ bookingId, reason }: { bookingId: number; reason?: string }) =>
            bookingService.rejectBooking(bookingId, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: bookingKeys.all });
        },
    });
}

export function useCancelBooking() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (bookingId: number) => bookingService.cancelBooking(bookingId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: bookingKeys.all });
        },
    });
}

export function useBlockSlot() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: BlockSlotRequest) => bookingService.blockSlot(data),
        onSuccess: (_, data) => {
            queryClient.invalidateQueries({
                queryKey: [...bookingKeys.all, 'calendar', data.fieldId]
            });
        },
    });
}

export function useUnblockSlot() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (calendarId: number) => bookingService.unblockSlot(calendarId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: bookingKeys.all });
        },
    });
}
