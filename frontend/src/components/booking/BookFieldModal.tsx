import React, { useState, useEffect } from 'react';
import { X, Clock, CreditCard } from 'lucide-react';
import { Button, LoadingSpinner } from '../common';
import { useAvailableSlots } from '../../api/hooks/useField';
import { useCreateBooking } from '../../api/hooks/useBooking';
import { usePlayerTeams } from '../../api/hooks/useTeam';
import { useAuth } from '../../contexts';
import { CalendarStatus, type FieldCalendar } from '../../types';
import toast from 'react-hot-toast';

interface BookFieldModalProps {
    fieldId: number;
    fieldName: string;
    pricePerHour: number;
    isOpen: boolean;
    onClose: () => void;
}

const BookFieldModal: React.FC<BookFieldModalProps> = ({
    fieldId,
    fieldName,
    pricePerHour,
    isOpen,
    onClose,
}) => {
    const { user } = useAuth();
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split('T')[0]
    );
    const [selectedSlot, setSelectedSlot] = useState<FieldCalendar | null>(null);
    const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
    const [notes, setNotes] = useState('');

    const { data: slots, isLoading } = useAvailableSlots(fieldId, selectedDate);
    const { data: teams, isLoading: teamsLoading } = usePlayerTeams(user?.userId || 0);
    const createBooking = useCreateBooking();

    // Auto-select first team if only one
    useEffect(() => {
        if (teams && teams.length === 1 && !selectedTeamId) {
            setSelectedTeamId(teams[0].teamId);
        }
    }, [teams, selectedTeamId]);

    if (!isOpen) return null;

    const availableSlots = slots?.filter((s) => s.status === CalendarStatus.AVAILABLE) || [];

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    const handleBooking = async () => {
        if (!selectedSlot) {
            toast.error('Please select a time slot');
            return;
        }
        if (!selectedTeamId) {
            toast.error('Please select a team');
            return;
        }

        try {
            await createBooking.mutateAsync({
                fieldId,
                teamId: selectedTeamId,
                date: selectedDate,
                startTime: selectedSlot.startTime,
                endTime: selectedSlot.endTime,
                notes,
            });
            toast.success('Booking request sent successfully!');
            onClose();
        } catch {
            toast.error('Failed to create booking');
        }
    };

    const getMinDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
                <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />

                <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 text-left overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <CreditCard className="w-6 h-6 text-emerald-600" />
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Book Field</h2>
                                <p className="text-sm text-gray-500">{fieldName}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Team Selection */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Team
                        </label>
                        {teamsLoading ? (
                            <div className="flex justify-center py-4">
                                <LoadingSpinner size="sm" />
                            </div>
                        ) : teams && teams.length > 0 ? (
                            <select
                                value={selectedTeamId || ''}
                                onChange={(e) => setSelectedTeamId(Number(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            >
                                <option value="">Select a team...</option>
                                {teams.map((team) => (
                                    <option key={team.teamId} value={team.teamId}>
                                        {team.teamName}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <p className="text-sm text-gray-500 py-2">
                                You are not a member of any team. Join a team first to book fields.
                            </p>
                        )}
                    </div>

                    {/* Date Selection */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Date
                        </label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => {
                                setSelectedDate(e.target.value);
                                setSelectedSlot(null);
                            }}
                            min={getMinDate()}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                    </div>

                    {/* Time Slots */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Available Time Slots
                        </label>
                        {isLoading ? (
                            <div className="flex justify-center py-8">
                                <LoadingSpinner text="Loading slots..." size="sm" />
                            </div>
                        ) : availableSlots.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">
                                No available slots for this date.
                            </p>
                        ) : (
                            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                                {availableSlots.map((slot) => (
                                    <button
                                        key={slot.calendarId}
                                        onClick={() => setSelectedSlot(slot)}
                                        className={`flex items-center gap-2 p-3 rounded-lg border transition-colors ${selectedSlot?.calendarId === slot.calendarId
                                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                            : 'border-gray-200 hover:border-emerald-300'
                                            }`}
                                    >
                                        <Clock className="w-4 h-4" />
                                        <span className="text-sm font-medium">
                                            {slot.startTime.slice(0, 5)} - {slot.endTime.slice(0, 5)}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Notes */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Notes (optional)
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Any special requests..."
                            rows={2}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                        />
                    </div>

                    {/* Price Summary */}
                    {selectedSlot && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Price per hour</span>
                                <span className="font-semibold">{formatPrice(pricePerHour)}</span>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={onClose} className="flex-1">
                            Cancel
                        </Button>
                        <div className="relative flex-1 group">
                            <Button
                                onClick={handleBooking}
                                isLoading={createBooking.isPending}
                                disabled={!selectedSlot || !selectedTeamId || (teams && teams.length === 0)}
                                className="w-full"
                            >
                                Request Booking
                            </Button>
                            {teams && teams.length === 0 && (
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                    You must be in a team to book a field
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookFieldModal;
