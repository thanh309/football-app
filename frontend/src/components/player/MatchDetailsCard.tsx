import { Calendar, MapPin, Clock, Users, CheckCircle } from 'lucide-react';
import { LoadingSpinner, Button } from '../common';
import { useMatchDetails, useMatchResult } from '../../api/hooks/useMatch';
import { useConfirmAttendance, useMatchAttendance } from '../../api/hooks/useAttendance';
import { useAuth } from '../../contexts';
import toast from 'react-hot-toast';

interface MatchDetailsCardProps {
    matchId: number;
}

const MatchDetailsCard: React.FC<MatchDetailsCardProps> = ({ matchId }) => {
    const { user } = useAuth();
    const { data: match, isLoading: matchLoading } = useMatchDetails(matchId);
    const { data: result } = useMatchResult(matchId);
    const { data: attendance } = useMatchAttendance(matchId);
    const confirmMutation = useConfirmAttendance();

    const hasConfirmed = attendance?.some(
        a => a.playerId === user?.userId && a.status === 'Present'
    );

    const handleConfirmAttendance = async () => {
        try {
            await confirmMutation.mutateAsync(matchId);
            toast.success('Attendance confirmed!');
        } catch (error) {
            toast.error('Failed to confirm attendance');
        }
    };

    if (matchLoading) {
        return <LoadingSpinner text="Loading match details..." />;
    }

    if (!match) {
        return (
            <div className="text-center py-8 text-gray-500">
                Match not found
            </div>
        );
    }

    const matchDate = new Date(match.matchDate);
    const isPast = matchDate < new Date();
    const canConfirmAttendance = !isPast && match.status === 'Scheduled' && !hasConfirmed;



    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-6">
                <div className="flex items-center justify-between">
                    <span className={`text-sm px-3 py-1 rounded-full bg-white/20 text-white`}>
                        {match.status}
                    </span>
                    {result && (
                        <div className="text-white text-2xl font-bold">
                            {result.homeScore} - {result.awayScore}
                        </div>
                    )}
                </div>
                <h2 className="text-xl font-bold text-white mt-4">
                    Match #{match.matchId}
                </h2>
            </div>

            {/* Match Info */}
            <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 text-gray-600">
                        <Calendar className="w-5 h-5 text-emerald-500" />
                        <div>
                            <p className="font-medium text-gray-900">
                                {matchDate.toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                            <p className="text-sm text-gray-500">Date</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-gray-600">
                        <Clock className="w-5 h-5 text-emerald-500" />
                        <div>
                            <p className="font-medium text-gray-900">
                                {match.startTime}
                                {match.endTime && ` - ${match.endTime}`}
                            </p>
                            <p className="text-sm text-gray-500">Time</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-gray-600">
                        <Users className="w-5 h-5 text-emerald-500" />
                        <div>
                            <p className="font-medium text-gray-900">
                                Team #{match.hostTeamId}
                                {match.opponentTeamId && ` vs Team #${match.opponentTeamId}`}
                            </p>
                            <p className="text-sm text-gray-500">Teams</p>
                        </div>
                    </div>

                    {match.fieldId && (
                        <div className="flex items-center gap-3 text-gray-600">
                            <MapPin className="w-5 h-5 text-emerald-500" />
                            <div>
                                <p className="font-medium text-gray-900">Field #{match.fieldId}</p>
                                <p className="text-sm text-gray-500">Location</p>
                            </div>
                        </div>
                    )}
                </div>

                {match.description && (
                    <div className="pt-4 border-t border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                            Description
                        </h3>
                        <p className="text-gray-700">{match.description}</p>
                    </div>
                )}

                {/* Attendance Status */}
                <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        Your Attendance
                    </h3>
                    {hasConfirmed ? (
                        <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-medium">Attendance Confirmed</span>
                        </div>
                    ) : canConfirmAttendance ? (
                        <Button
                            onClick={handleConfirmAttendance}
                            isLoading={confirmMutation.isPending}
                            leftIcon={<CheckCircle className="w-4 h-4" />}
                        >
                            Confirm Attendance
                        </Button>
                    ) : isPast ? (
                        <p className="text-gray-500">Match has ended</p>
                    ) : (
                        <p className="text-gray-500">Attendance confirmation not available</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MatchDetailsCard;
