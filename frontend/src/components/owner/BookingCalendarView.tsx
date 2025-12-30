import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { LoadingSpinner, Button } from '../common';
import { useFieldCalendar } from '../../api/hooks/useBooking';
import type { FieldCalendar } from '../../types';

interface BookingCalendarViewProps {
    fieldId: number;
    onSlotClick?: (slot: FieldCalendar) => void;
}

const BookingCalendarView: React.FC<BookingCalendarViewProps> = ({ fieldId, onSlotClick }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const startDate = useMemo(() => {
        const date = new Date(currentDate);
        date.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
        return date.toISOString().split('T')[0];
    }, [currentDate]);

    const endDate = useMemo(() => {
        const date = new Date(currentDate);
        date.setDate(date.getDate() + (6 - date.getDay())); // End of week (Saturday)
        return date.toISOString().split('T')[0];
    }, [currentDate]);

    const { data: slots, isLoading } = useFieldCalendar(fieldId, { startDate, endDate });

    const weekDays = useMemo(() => {
        const days = [];
        const start = new Date(startDate);
        for (let i = 0; i < 7; i++) {
            const day = new Date(start);
            day.setDate(start.getDate() + i);
            days.push(day);
        }
        return days;
    }, [startDate]);

    const timeSlots = useMemo(() => {
        const times = [];
        for (let hour = 6; hour <= 22; hour++) {
            times.push(`${hour.toString().padStart(2, '0')}:00`);
        }
        return times;
    }, []);

    const getSlotForTime = (day: Date, time: string): FieldCalendar | undefined => {
        if (!slots) return undefined;
        const dayStr = day.toISOString().split('T')[0];
        return slots.find(s => s.date === dayStr && s.startTime.startsWith(time));
    };

    const getSlotStyle = (status: string) => {
        switch (status) {
            case 'Booked':
                return 'bg-emerald-100 text-emerald-700 border-emerald-300';
            case 'Blocked':
                return 'bg-red-100 text-red-700 border-red-300';
            case 'Available':
                return 'bg-green-50 text-green-600 border-green-200';
            default:
                return 'bg-gray-50 text-gray-500 border-gray-200';
        }
    };

    const goToPreviousWeek = () => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(prev.getDate() - 7);
            return newDate;
        });
    };

    const goToNextWeek = () => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(prev.getDate() + 7);
            return newDate;
        });
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    if (isLoading) {
        return <LoadingSpinner text="Loading calendar..." />;
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold text-gray-900">Booking Calendar</h2>
                    <Button variant="ghost" size="sm" onClick={goToToday}>
                        Today
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={goToPreviousWeek}>
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm font-medium text-gray-700 min-w-[200px] text-center">
                        {weekDays[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {weekDays[6].toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                    <Button variant="ghost" size="sm" onClick={goToNextWeek}>
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Legend */}
            <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-50 border border-green-200" />
                    <span className="text-gray-600">Available</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-emerald-100 border border-emerald-300" />
                    <span className="text-gray-600">Booked</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-red-100 border border-red-300" />
                    <span className="text-gray-600">Blocked</span>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="border rounded-lg overflow-auto">
                <table className="w-full min-w-[800px]">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="p-3 text-left text-sm font-medium text-gray-600 border-b w-20">
                                <Clock className="w-4 h-4" />
                            </th>
                            {weekDays.map(day => (
                                <th
                                    key={day.toISOString()}
                                    className={`p-3 text-center text-sm font-medium border-b ${day.toDateString() === new Date().toDateString()
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : 'text-gray-600'
                                        }`}
                                >
                                    <div>{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                                    <div className="text-lg">{day.getDate()}</div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {timeSlots.map(time => (
                            <tr key={time} className="border-b last:border-b-0">
                                <td className="p-2 text-sm text-gray-500 font-medium bg-gray-50">
                                    {time}
                                </td>
                                {weekDays.map(day => {
                                    const slot = getSlotForTime(day, time);
                                    return (
                                        <td
                                            key={day.toISOString() + time}
                                            className="p-1 border-l"
                                            onClick={() => slot && onSlotClick?.(slot)}
                                        >
                                            <div
                                                className={`h-8 rounded text-xs flex items-center justify-center cursor-pointer transition-colors border ${slot
                                                    ? getSlotStyle(slot.status)
                                                    : 'bg-green-50 border-green-200 text-green-600 hover:bg-green-100'
                                                    }`}
                                            >
                                                {slot?.status === 'Booked' && `#${slot.bookingId}`}
                                                {slot?.status === 'Blocked' && 'Blocked'}
                                                {!slot && 'Open'}
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BookingCalendarView;
