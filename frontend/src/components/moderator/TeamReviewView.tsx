import { Users, MapPin, Calendar, Shield } from 'lucide-react';
import { LoadingSpinner } from '../common';
import { useTeamForReview } from '../../api/hooks/useModeration';
import VerifyTeamButtons from './VerifyTeamButtons';

interface TeamReviewViewProps {
    teamId: number;
}

const TeamReviewView: React.FC<TeamReviewViewProps> = ({ teamId }) => {
    const { data: team, isLoading, error } = useTeamForReview(teamId);

    if (isLoading) {
        return <LoadingSpinner text="Loading team details..." />;
    }

    if (error || !team) {
        return <div className="text-center py-8 text-red-500">Failed to load team details</div>;
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start gap-4">
                        {team.logoUrl ? (
                            <img
                                src={team.logoUrl}
                                alt={team.teamName}
                                className="w-20 h-20 rounded-xl object-cover"
                            />
                        ) : (
                            <div className="w-20 h-20 bg-emerald-100 rounded-xl flex items-center justify-center">
                                <Users className="w-10 h-10 text-emerald-600" />
                            </div>
                        )}
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <h1 className="text-2xl font-bold text-gray-900">{team.teamName}</h1>
                                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                                    {team.status}
                                </span>
                            </div>
                            {team.description && (
                                <p className="text-gray-600">{team.description}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-purple-500" />
                        Team Information
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-500">Team ID</p>
                            <p className="font-medium text-gray-900">{team.teamId}</p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-500">Leader ID</p>
                            <p className="font-medium text-gray-900">{team.leaderId}</p>
                        </div>

                        {team.location && (
                            <div className="bg-gray-50 rounded-lg p-4 col-span-2">
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                    <MapPin className="w-4 h-4" /> Location
                                </p>
                                <p className="font-medium text-gray-900">{team.location}</p>
                            </div>
                        )}

                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                <Calendar className="w-4 h-4" /> Created
                            </p>
                            <p className="font-medium text-gray-900">
                                {new Date(team.createdAt).toLocaleDateString()}
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-500">Status</p>
                            <p className="font-medium text-amber-600">{team.status}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <VerifyTeamButtons teamId={teamId} />
                </div>
            </div>
        </div>
    );
};

export default TeamReviewView;
