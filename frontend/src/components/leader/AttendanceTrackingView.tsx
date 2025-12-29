import { User, Clock, Check, X } from 'lucide-react';
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

    const [attendance, setAttendance] = useState<Record<number, AttendanceStatus>>({});
    const [initialized, setInitialized] = useState(false);

    // Initialize attendance from existing data
    if (existingAttendance && !initialized) {
        const initial: Record<number, AttendanceStatus> = {};
        existingAttendance.forEach(a => {
            initial[a.playerId] = a.status;
        });
        setAttendance(initial);
        setInitialized(true);
    }

    const handleStatusChange = (playerId: number, status: AttendanceStatus) => {
        setAttendance(prev => ({ ...prev, [playerId]: status }));
    };

    const handleSave = async () => {
        try {
            const records = Object.entries(attendance).map(([playerId, status]) => ({
                playerId: parseInt(playerId),
                status,
            }));
            await saveMutation.mutateAsync({ matchId, records });
            toast.success('Attendance saved successfully');
        } catch {
            toast.error('Failed to save attendance');
        }
    };

    const getStatusColor = (status?: AttendanceStatus) => {
        switch (status) {
            case 'Present':
                return 'bg-green-100 text-green-700 border-green-300';
            case 'Absent':
                return 'bg-red-100 text-red-700 border-red-300';
            case 'Excused':
                return 'bg-yellow-100 text-yellow-700 border-yellow-300';
            default:
                return 'bg-gray-100 text-gray-500 border-gray-300';
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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Attendance Tracking</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {presentCount} present, {absentCount} absent, {activeMembers.length - presentCount - absentCount} unmarked
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

            <div className="space-y-3">
                {activeMembers.map(member => (
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
                                className={`p-2 rounded-lg border transition-colors ${attendance[member.playerId] === 'Present'
                                        ? getStatusColor('Present')
                                        : 'hover:bg-gray-50 border-gray-200'
                                    }`}
                                title="Present"
                            >
                                <Check className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => handleStatusChange(member.playerId, 'Excused')}
                                className={`p-2 rounded-lg border transition-colors ${attendance[member.playerId] === 'Excused'
                                        ? getStatusColor('Excused')
                                        : 'hover:bg-gray-50 border-gray-200'
                                    }`}
                                title="Excused"
                            >
                                <Clock className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => handleStatusChange(member.playerId, 'Absent')}
                                className={`p-2 rounded-lg border transition-colors ${attendance[member.playerId] === 'Absent'
                                        ? getStatusColor('Absent')
                                        : 'hover:bg-gray-50 border-gray-200'
                                    }`}
                                title="Absent"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AttendanceTrackingView;
