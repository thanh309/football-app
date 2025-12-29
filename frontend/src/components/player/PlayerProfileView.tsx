import { User, Calendar, Target, Ruler, Weight } from 'lucide-react';
import type { PlayerProfile } from '../../types';

interface PlayerProfileViewProps {
    player: PlayerProfile;
    showEditButton?: boolean;
    onEdit?: () => void;
}

const PlayerProfileView: React.FC<PlayerProfileViewProps> = ({
    player,
    showEditButton = false,
    onEdit,
}) => {
    const getSkillLevelLabel = (level: number) => {
        if (level <= 3) return 'Beginner';
        if (level <= 6) return 'Intermediate';
        if (level <= 8) return 'Advanced';
        return 'Professional';
    };

    const getSkillLevelColor = (level: number) => {
        if (level <= 3) return 'bg-blue-100 text-blue-700';
        if (level <= 6) return 'bg-yellow-100 text-yellow-700';
        if (level <= 8) return 'bg-orange-100 text-orange-700';
        return 'bg-emerald-100 text-emerald-700';
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-8">
                <div className="flex items-center gap-4">
                    <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        {player.profileImage ? (
                            <img
                                src={player.profileImage}
                                alt={player.displayName}
                                className="w-full h-full object-cover rounded-full"
                            />
                        ) : (
                            <User className="w-12 h-12 text-white" />
                        )}
                    </div>
                    <div className="text-white">
                        <h2 className="text-2xl font-bold">{player.displayName}</h2>
                        {player.position && (
                            <p className="text-emerald-100 flex items-center gap-2 mt-1">
                                <Target className="w-4 h-4" />
                                {player.position}
                            </p>
                        )}
                    </div>
                    {showEditButton && (
                        <button
                            onClick={onEdit}
                            className="ml-auto px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border-b border-gray-100">
                {player.skillLevel && (
                    <div className="text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getSkillLevelColor(player.skillLevel)}`}>
                            Level {player.skillLevel}
                        </span>
                        <p className="text-sm text-gray-500 mt-1">{getSkillLevelLabel(player.skillLevel)}</p>
                    </div>
                )}
                {player.preferredFoot && (
                    <div className="text-center">
                        <p className="font-semibold text-gray-900">{player.preferredFoot}</p>
                        <p className="text-sm text-gray-500">Preferred Foot</p>
                    </div>
                )}
                {player.height && (
                    <div className="text-center flex flex-col items-center">
                        <Ruler className="w-5 h-5 text-gray-400 mb-1" />
                        <p className="font-semibold text-gray-900">{player.height} cm</p>
                        <p className="text-sm text-gray-500">Height</p>
                    </div>
                )}
                {player.weight && (
                    <div className="text-center flex flex-col items-center">
                        <Weight className="w-5 h-5 text-gray-400 mb-1" />
                        <p className="font-semibold text-gray-900">{player.weight} kg</p>
                        <p className="text-sm text-gray-500">Weight</p>
                    </div>
                )}
            </div>

            {/* Bio */}
            {player.bio && (
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">About</h3>
                    <p className="text-gray-700">{player.bio}</p>
                </div>
            )}

            {/* Additional Info */}
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {player.dateOfBirth && (
                        <div className="flex items-center gap-3 text-gray-600">
                            <Calendar className="w-5 h-5 text-gray-400" />
                            <span>{new Date(player.dateOfBirth).toLocaleDateString()}</span>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default PlayerProfileView;
