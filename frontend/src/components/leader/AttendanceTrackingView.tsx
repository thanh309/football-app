import { User, Check, X, Minus } from 'lucide-react';
import { LoadingSpinner, EmptyState, Button } from '../common';
import { useMatchAttendance, useSaveBatchAttendance } from '../../api/hooks/useAttendance';
import { useTeamRoster } from '../../api/hooks/useRoster';
import toast from 'react-hot-toast';
import { useState } from 'react';
import type { AttendanceStatus } from '../../types';

interface AttendanceTrackingViewProps {
    matchId: number;
    teamId: number;
}

const AttendanceTrackingView: React.FC<AttendanceTrackingViewProps> = ({ matchId, teamId }) => {
    const { data: existingAttendance, isLoading: attendanceLoading } = useMatchAttendance(matchId);
    const { data: roster, isLoading: rosterLoading } = useTeamRoster(teamId);
    const saveMutation = useSaveBatchAttendance();

    const [attendance, setAttendance] = useState<Record<number, AttendanceStatus | null>>({});
    const [initialized, setInitialized] = useState(false);

    // Initialize attendance from existing data
    if (existingAttendance && !initialized) {
        const initial: Record<number, AttendanceStatus | null> = {};
        existingAttendance.forEach(a => {
            initial[a.playerId] = a.status;
        });
        setAttendance(initial);
        setInitialized(true);
    }

    const handleStatusChange = (playerId: number, status: AttendanceStatus) => {
        setAttendance(prev => {
            // If clicking the same status, toggle to unmarked (null)
            if (prev[playerId] === status) {
                const newState = { ...prev };
                delete newState[playerId];
                return newState;
            }
            return { ...prev, [playerId]: status };
        });
    };

    const handleSave = async () => {
        try {
            const records = Object.entries(attendance)
                .filter(([, status]) => status !== null)
                .map(([playerId, status]) => ({
                    playerId: parseInt(playerId),
                    status: status as AttendanceStatus,
                }));
            await saveMutation.mutateAsync({ matchId, records });
            toast.success('Attendance saved successfully');
        } catch {
            toast.error('Failed to save attendance');
        }
    };

    if (attendanceLoading || rosterLoading) {
        return <LoadingSpinner text="Loading attendance..." />;
    }

    if (!roster || roster.length === 0) {
        return (
            <EmptyState
                title="No Team Members"
                description="Add players to your team roster to track attendance."
            />
        );
    }

    const activeMembers = roster.filter(m => m.isActive);
    const presentCount = Object.values(attendance).filter(s => s === 'Present').length;
    const absentCount = Object.values(attendance).filter(s => s === 'Absent').length;
    const unmarkedCount = activeMembers.length - presentCount - absentCount;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Attendance Tracking</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        <span className="text-green-600 font-medium">{presentCount} present</span>
                        {' · '}
                        <span className="text-red-600 font-medium">{absentCount} absent</span>
                        {' · '}
                        <span className="text-gray-500">{unmarkedCount} unmarked</span>
                    </p>
                </div>
                <Button
                    onClick={handleSave}
                    isLoading={saveMutation.isPending}
                    leftIcon={<Check className="w-4 h-4" />}
                >
                    Save Attendance
                </Button>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
                <span className="flex items-center gap-1">
                    <span className="w-6 h-6 rounded bg-green-100 border border-green-300 flex items-center justify-center">
                        <Check className="w-4 h-4 text-green-600" />
                    </span>
                    Present
                </span>
                <span className="flex items-center gap-1">
                    <span className="w-6 h-6 rounded bg-red-100 border border-red-300 flex items-center justify-center">
                        <X className="w-4 h-4 text-red-600" />
                    </span>
                    Absent
                </span>
                <span className="flex items-center gap-1">
                    <span className="w-6 h-6 rounded bg-gray-100 border border-gray-300 flex items-center justify-center">
                        <Minus className="w-4 h-4 text-gray-400" />
                    </span>
                    Unmarked
                </span>
            </div>

            <div className="space-y-3">
                {activeMembers.map(member => {
                    const status = attendance[member.playerId];
                    return (
                        <div
                            key={member.rosterId}
                            className="flex items-center justify-between p-4 bg-white rounded-lg border"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Player #{member.playerId}</p>
                                    <p className="text-sm text-gray-500">{member.role}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleStatusChange(member.playerId, 'Present')}
                                    className={`p-2 rounded-lg border transition-colors ${status === 'Present'
                                            ? 'bg-green-100 text-green-700 border-green-300'
                                            : 'hover:bg-gray-50 border-gray-200 text-gray-400'
                                        }`}
                                    title="Present (click again to unmark)"
                                >
                                    <Check className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleStatusChange(member.playerId, 'Absent')}
                                    className={`p-2 rounded-lg border transition-colors ${status === 'Absent'
                                            ? 'bg-red-100 text-red-700 border-red-300'
                                            : 'hover:bg-gray-50 border-gray-200 text-gray-400'
                                        }`}
                                    title="Absent (click again to unmark)"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AttendanceTrackingView;

