import { User, Shield, Star, MoreVertical, UserMinus } from 'lucide-react';
import { LoadingSpinner, EmptyState } from '../common';
import { useTeamRoster, useRemovePlayerFromRoster, useUpdatePlayerRole } from '../../api/hooks/useRoster';
import toast from 'react-hot-toast';
import { useState } from 'react';
import type { TeamRoster, RosterRole } from '../../types';

interface TeamRosterViewProps {
    teamId: number;
    isLeader?: boolean;
}

interface RosterMemberCardProps {
    member: TeamRoster;
    teamId: number;
    isLeader: boolean;
    onRemove: (playerId: number) => void;
    onRoleChange: (rosterId: number, role: RosterRole) => void;
    isRemoving: boolean;
}

const RosterMemberCard: React.FC<RosterMemberCardProps> = ({
    member,
    isLeader,
    onRemove,
    onRoleChange,
    isRemoving,
}) => {
    const [showMenu, setShowMenu] = useState(false);

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'Captain':
                return 'bg-yellow-100 text-yellow-700';
            case 'ViceCaptain':
                return 'bg-blue-100 text-blue-700';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'Captain':
                return <Star className="w-3 h-3" />;
            case 'ViceCaptain':
                return <Shield className="w-3 h-3" />;
            default:
                return null;
        }
    };

    return (
        <div className={`flex items-center justify-between p-4 bg-white rounded-lg border ${!member.isActive ? 'opacity-50' : ''}`}>
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                    <p className="font-medium text-gray-900">Player #{member.playerId}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${getRoleBadge(member.role)}`}>
                            {getRoleIcon(member.role)}
                            {member.role}
                        </span>
                        <span className="text-xs text-gray-500">
                            Joined {new Date(member.joinedAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>

            {isLeader && member.role !== 'Captain' && (
                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>

                    {showMenu && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                            <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border z-20 py-1 min-w-[160px]">
                                {member.role !== 'ViceCaptain' && (
                                    <button
                                        onClick={() => {
                                            onRoleChange(member.rosterId, 'ViceCaptain');
                                            setShowMenu(false);
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        <Shield className="w-4 h-4" />
                                        Promote to Vice Captain
                                    </button>
                                )}
                                {member.role === 'ViceCaptain' && (
                                    <button
                                        onClick={() => {
                                            onRoleChange(member.rosterId, 'Member');
                                            setShowMenu(false);
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        <User className="w-4 h-4" />
                                        Demote to Member
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        onRemove(member.playerId);
                                        setShowMenu(false);
                                    }}
                                    disabled={isRemoving}
                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                    <UserMinus className="w-4 h-4" />
                                    Remove from Team
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

const TeamRosterView: React.FC<TeamRosterViewProps> = ({ teamId, isLeader = false }) => {
    const { data: roster, isLoading, error } = useTeamRoster(teamId);
    const removeMutation = useRemovePlayerFromRoster();
    const updateRoleMutation = useUpdatePlayerRole();

    const handleRemove = async (playerId: number) => {
        try {
            await removeMutation.mutateAsync({ teamId, playerId });
            toast.success('Player removed from team');
        } catch {
            toast.error('Failed to remove player');
        }
    };

    const handleRoleChange = async (rosterId: number, role: RosterRole) => {
        try {
            await updateRoleMutation.mutateAsync({ rosterId, role });
            toast.success('Player role updated');
        } catch {
            toast.error('Failed to update role');
        }
    };

    if (isLoading) {
        return <LoadingSpinner text="Loading roster..." />;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">Failed to load roster</div>;
    }

    if (!roster || roster.length === 0) {
        return (
            <EmptyState
                title="No Team Members"
                description="This team doesn't have any members yet. Invite players to join!"
            />
        );
    }

    const activeMembers = roster.filter(m => m.isActive);
    const inactiveMembers = roster.filter(m => !m.isActive);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Team Roster</h2>
                <span className="text-sm text-gray-500">{activeMembers.length} active members</span>
            </div>

            <div className="space-y-3">
                {activeMembers.map(member => (
                    <RosterMemberCard
                        key={member.rosterId}
                        member={member}
                        teamId={teamId}
                        isLeader={isLeader}
                        onRemove={handleRemove}
                        onRoleChange={handleRoleChange}
                        isRemoving={removeMutation.isPending}
                    />
                ))}
            </div>

            {inactiveMembers.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-sm font-medium text-gray-500 uppercase mb-3">Inactive Members</h3>
                    <div className="space-y-3">
                        {inactiveMembers.map(member => (
                            <RosterMemberCard
                                key={member.rosterId}
                                member={member}
                                teamId={teamId}
                                isLeader={isLeader}
                                onRemove={handleRemove}
                                onRoleChange={handleRoleChange}
                                isRemoving={removeMutation.isPending}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamRosterView;
