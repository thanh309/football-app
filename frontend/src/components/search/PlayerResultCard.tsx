import { Link } from 'react-router-dom';
import { User, Target, Trophy, ChevronRight } from 'lucide-react';
import type { PlayerProfile } from '../../types';

interface PlayerResultCardProps {
    player: PlayerProfile;
}

const PlayerResultCard: React.FC<PlayerResultCardProps> = ({ player }) => {
    const getSkillLevelColor = (level: number) => {
        if (level <= 3) return 'bg-blue-100 text-blue-700';
        if (level <= 6) return 'bg-yellow-100 text-yellow-700';
        if (level <= 8) return 'bg-orange-100 text-orange-700';
        return 'bg-emerald-100 text-emerald-700';
    };

    const getSkillLevelLabel = (level: number) => {
        if (level <= 3) return 'Beginner';
        if (level <= 6) return 'Intermediate';
        if (level <= 8) return 'Advanced';
        return 'Professional';
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden">
            <div className="p-5">
                <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                        {player.profileImage ? (
                            <img
                                src={player.profileImage}
                                alt={player.displayName}
                                className="w-full h-full object-cover rounded-full"
                            />
                        ) : (
                            <User className="w-7 h-7 text-emerald-600" />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-lg truncate">{player.displayName}</h3>
                        {player.position && (
                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                                <Target className="w-3.5 h-3.5" />
                                {player.position}
                            </p>
                        )}
                    </div>
                </div>

                {player.bio && (
                    <p className="text-sm text-gray-600 mt-3 line-clamp-2">{player.bio}</p>
                )}

                <div className="flex items-center gap-3 mt-3">
                    {player.skillLevel && (
                        <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${getSkillLevelColor(player.skillLevel)}`}>
                            <Trophy className="w-3 h-3" />
                            {getSkillLevelLabel(player.skillLevel)}
                        </span>
                    )}
                    {player.preferredFoot && (
                        <span className="text-xs text-gray-500">
                            {player.preferredFoot} foot
                        </span>
                    )}
                </div>

                <div className="flex items-center justify-end mt-4 pt-4 border-t border-gray-100">
                    <Link
                        to={`/search/players/${player.playerId}`}
                        className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
                    >
                        View Profile
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PlayerResultCard;
