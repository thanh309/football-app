import { Calendar, Clock, MapPin, User, X } from 'lucide-react';
import { Button } from '../common';
import { useUnblockSlot } from '../../api/hooks/useBooking';
import toast from 'react-hot-toast';
import type { FieldCalendar } from '../../types';

interface SlotDetailsModalProps {
    slot: FieldCalendar | null;
    isOpen: boolean;
    onClose: () => void;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Booked':
            return 'bg-emerald-100 text-emerald-700';
        case 'Blocked':
            return 'bg-red-100 text-red-700';
        case 'Available':
            return 'bg-green-100 text-green-700';
        default:
            return 'bg-gray-100 text-gray-600';
    }
};

const SlotDetailsModal: React.FC<SlotDetailsModalProps> = ({ slot, isOpen, onClose }) => {
    const unblockMutation = useUnblockSlot();

    if (!isOpen || !slot) return null;

    const handleUnblock = async () => {
        try {
            await unblockMutation.mutateAsync(slot.calendarId);
            toast.success('Slot unblocked successfully');
            onClose();
        } catch {
            toast.error('Failed to unblock slot');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-900">Slot Details</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Status</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(slot.status)}`}>
                            {slot.status}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-emerald-500" />
                            <div>
                                <p className="text-sm text-gray-500">Date</p>
                                <p className="font-medium">{new Date(slot.date).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-500" />
                            <div>
                                <p className="text-sm text-gray-500">Time</p>
                                <p className="font-medium">{slot.startTime} - {slot.endTime}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-purple-500" />
                            <div>
                                <p className="text-sm text-gray-500">Field</p>
                                <p className="font-medium">#{slot.fieldId}</p>
                            </div>
                        </div>

                        {slot.bookingId && (
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-amber-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Booking</p>
                                    <p className="font-medium">#{slot.bookingId}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
                    <Button variant="ghost" onClick={onClose}>
                        Close
                    </Button>
                    {slot.status === 'Blocked' && (
                        <Button
                            variant="outline"
                            onClick={handleUnblock}
                            isLoading={unblockMutation.isPending}
                        >
                            Unblock Slot
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SlotDetailsModal;
