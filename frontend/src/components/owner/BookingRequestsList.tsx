import { Calendar, Clock, User, MapPin, Check, X, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LoadingSpinner, EmptyState, Button } from '../common';
import { useOwnerPendingBookings, useApproveBooking, useRejectBooking } from '../../api/hooks/useBooking';
import toast from 'react-hot-toast';
import type { BookingRequest } from '../../types';

interface BookingRequestsListProps {
    fieldId?: number; // Optional - if not provided, shows all owner's bookings
}

interface BookingCardProps {
    booking: BookingRequest;
    onApprove: (bookingId: number) => void;
    onReject: (bookingId: number) => void;
    isProcessing: boolean;
}

const BookingCard: React.FC<BookingCardProps> = ({
    booking,
    onApprove,
    onReject,
    isProcessing,
}) => {
    const bookingDate = new Date(booking.date);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 h-full flex flex-col">
            <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                <div className="text-left">
                    <h3 className="font-semibold text-gray-900 text-left">Booking Request</h3>
                    <p className="text-sm text-gray-500 text-left">Team #{booking.teamId}</p>
                </div>
                    <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">
                        {booking.status}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-emerald-500" />
                        {bookingDate.toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4 text-emerald-500" />
                        {booking.startTime} - {booking.endTime}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-emerald-500" />
                        Field #{booking.fieldId}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="w-4 h-4 text-emerald-500" />
                        Requester #{booking.requesterId}
                    </div>
                </div>

                {booking.notes && (
                    <p className="text-sm text-gray-600 mb-4 italic break-words">"{booking.notes}"</p>
                )}
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 mt-auto">
                <Link to={`/owner/bookings/${booking.bookingId}`}>
                    <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<Eye className="w-4 h-4" />}
                    >
                        Details
                    </Button>
                </Link>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onReject(booking.bookingId)}
                    disabled={isProcessing}
                    leftIcon={<X className="w-4 h-4" />}
                >
                    Reject
                </Button>
                <Button
                    size="sm"
                    onClick={() => onApprove(booking.bookingId)}
                    disabled={isProcessing}
                    leftIcon={<Check className="w-4 h-4" />}
                >
                    Approve
                </Button>
            </div>
        </div>
    );
};

const BookingRequestsList: React.FC<BookingRequestsListProps> = ({ fieldId }) => {
    const { data: bookings, isLoading, error } = useOwnerPendingBookings();
    const approveMutation = useApproveBooking();
    const rejectMutation = useRejectBooking();

    const handleApprove = async (bookingId: number) => {
        try {
            await approveMutation.mutateAsync(bookingId);
            toast.success('Booking approved! Team will be notified.');
        } catch {
            toast.error('Failed to approve booking');
        }
    };

    const handleReject = async (bookingId: number) => {
        try {
            await rejectMutation.mutateAsync({ bookingId });
            toast.success('Booking rejected');
        } catch {
            toast.error('Failed to reject booking');
        }
    };

    if (isLoading) {
        return <LoadingSpinner text="Loading booking requests..." />;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">Failed to load bookings</div>;
    }

    // Filter by fieldId if provided
    const filteredBookings = fieldId
        ? bookings?.filter(b => b.fieldId === fieldId)
        : bookings;

    if (!filteredBookings || filteredBookings.length === 0) {
        return (
            <EmptyState
                title="No Pending Bookings"
                description="You don't have any pending booking requests at the moment."
            />
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Booking Requests</h2>
                <span className="bg-amber-100 text-amber-700 text-sm px-2.5 py-1 rounded-full">
                    {filteredBookings.length} pending
                </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {filteredBookings.map(booking => (
                    <BookingCard
                        key={booking.bookingId}
                        booking={booking}
                        onApprove={handleApprove}
                        onReject={handleReject}
                        isProcessing={approveMutation.isPending || rejectMutation.isPending}
                    />
                ))}
            </div>
        </div>
    );
};

export default BookingRequestsList;
