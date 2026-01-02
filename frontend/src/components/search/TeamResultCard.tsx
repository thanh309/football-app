import { Link } from 'react-router-dom';
import { Users, MapPin, Trophy, ChevronRight } from 'lucide-react';
import { JoinTeamButton } from '../player';
import type { TeamProfile } from '../../types';
import { useAuth } from '../../contexts';

interface TeamResultCardProps {
    team: TeamProfile;
    showJoinButton?: boolean;
}

const TeamResultCard: React.FC<TeamResultCardProps> = ({ team, showJoinButton = true }) => {
    const { isAuthenticated } = useAuth();

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Verified':
                return 'bg-green-100 text-green-700';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden">
            <div className="p-5">
                <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        {team.logoUrl ? (
                            <img
                                src={team.logoUrl}
                                alt={team.teamName}
                                className="w-full h-full object-cover rounded-xl"
                            />
                        ) : (
                            <Users className="w-8 h-8 text-emerald-600" />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <h3 className="font-semibold text-gray-900 text-lg truncate">{team.teamName}</h3>
                                {team.location && (
                                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                                        <MapPin className="w-3.5 h-3.5" />
                                        {team.location}
                                    </p>
                                )}
                            </div>
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusBadge(team.status)}`}>
                                {team.status}
                            </span>
                        </div>

                        {team.description && (
                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{team.description}</p>
                        )}

                        <div className="flex items-center gap-3 mt-3">
                            {team.skillLevel && (
                                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                    <Trophy className="w-3 h-3" />
                                    Level {team.skillLevel}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <Link
                        to={`/search/teams/${team.teamId}`}
                        className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
                    >
                        View Profile
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                    {showJoinButton && isAuthenticated && team.status === 'Verified' && (
                        <JoinTeamButton
                            teamId={team.teamId}
                            teamName={team.teamName}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeamResultCard;
