import { Calendar, Clock, User, MapPin } from 'lucide-react';
import { LoadingSpinner } from '../common';
import { useBookingDetails } from '../../api/hooks/useBooking';
import type { BookingRequest } from '../../types';

interface BookingDetailsCardProps {
    bookingId: number;
    booking?: BookingRequest; // Optional - can pass directly or fetch
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Approved':
            return 'bg-green-100 text-green-700';
        case 'Pending':
            return 'bg-amber-100 text-amber-700';
        case 'Rejected':
            return 'bg-red-100 text-red-700';
        case 'Cancelled':
            return 'bg-gray-100 text-gray-600';
        default:
            return 'bg-gray-100 text-gray-600';
    }
};

const BookingDetailsCard: React.FC<BookingDetailsCardProps> = ({ bookingId, booking: propBooking }) => {
    const { data: fetchedBooking, isLoading } = useBookingDetails(propBooking ? 0 : bookingId);
    const booking = propBooking || fetchedBooking;

    if (isLoading && !propBooking) {
        return <LoadingSpinner text="Loading booking details..." />;
    }

    if (!booking) {
        return <div className="text-center py-8 text-gray-500">Booking not found</div>;
    }

    const bookingDate = new Date(booking.date);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Booking #{booking.bookingId}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Created {new Date(booking.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                    </span>
                </div>
            </div>

            <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Date</p>
                            <p className="font-medium text-gray-900">{bookingDate.toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Clock className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Time</p>
                            <p className="font-medium text-gray-900">{booking.startTime} - {booking.endTime}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Field</p>
                            <p className="font-medium text-gray-900">Field #{booking.fieldId}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                            <User className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Team</p>
                            <p className="font-medium text-gray-900">Team #{booking.teamId}</p>
                        </div>
                    </div>
                </div>

                {booking.notes && (
                    <div className="pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-500 mb-1">Notes</p>
                        <p className="text-gray-700">{booking.notes}</p>
                    </div>
                )}

                {booking.processedAt && (
                    <div className="pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-500 mb-1">Processed</p>
                        <p className="text-gray-700">{new Date(booking.processedAt).toLocaleString()}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingDetailsCard;
