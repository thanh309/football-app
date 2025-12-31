import React, { useState } from 'react';
import { X, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, LoadingSpinner } from '../common';
import { useFieldCalendar } from '../../api/hooks/useBooking';
import { CalendarStatus } from '../../types';

interface ViewCalendarModalProps {
    fieldId: number;
    fieldName: string;
    isOpen: boolean;
    onClose: () => void;
}

const ViewCalendarModal: React.FC<ViewCalendarModalProps> = ({
    fieldId,
    fieldName,
    isOpen,
    onClose,
}) => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    const startDate = new Date(selectedDate);
    startDate.setDate(1);
    const endDate = new Date(selectedDate);
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(0);

    const { data: calendar, isLoading } = useFieldCalendar(fieldId, {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
    });

    if (!isOpen) return null;

    const prevMonth = () => {
        setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
    };

    const formatMonthYear = (date: Date) => {
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case CalendarStatus.AVAILABLE:
                return 'bg-emerald-100 text-emerald-800';
            case CalendarStatus.BOOKED:
                return 'bg-red-100 text-red-800';
            case CalendarStatus.MAINTENANCE:
                return 'bg-yellow-100 text-yellow-800';
            case CalendarStatus.BLOCKED:
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
                <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />

                <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 text-left overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <Calendar className="w-6 h-6 text-emerald-600" />
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Field Calendar</h2>
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

                    {/* Month Navigation */}
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={prevMonth}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <h3 className="text-lg font-semibold">{formatMonthYear(selectedDate)}</h3>
                        <button
                            onClick={nextMonth}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Calendar Content */}
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <LoadingSpinner text="Loading calendar..." />
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-80 overflow-y-auto">
                            {calendar && calendar.length > 0 ? (
                                calendar.map((slot) => (
                                    <div
                                        key={slot.calendarId}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                    >
                                        <div>
                                            <p className="font-medium text-gray-900">{slot.date}</p>
                                            <p className="text-sm text-gray-500">
                                                {slot.startTime} - {slot.endTime}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(slot.status)}`}>
                                            {slot.status}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 py-8">
                                    No availability data for this period.
                                </p>
                            )}
                        </div>
                    )}

                    {/* Legend */}
                    <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-emerald-500" />
                            <span className="text-xs text-gray-600">Available</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-red-500" />
                            <span className="text-xs text-gray-600">Booked</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-yellow-500" />
                            <span className="text-xs text-gray-600">Maintenance</span>
                        </div>
                    </div>

                    {/* Close Button */}
                    <div className="mt-6 flex justify-end">
                        <Button variant="outline" onClick={onClose}>
                            Close
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewCalendarModal;
