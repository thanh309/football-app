import { Calendar, Clock, Check, X } from 'lucide-react';
import { LoadingSpinner, EmptyState, Button } from '../common';
import { usePendingInvitations, useRespondInvitation } from '../../api/hooks/useMatch';
import toast from 'react-hot-toast';
import type { MatchInvitation } from '../../types';

interface MatchInvitationsListProps {
    teamId: number;
}

interface InvitationCardProps {
    invitation: MatchInvitation;
    onAccept: (invitationId: number) => void;
    onDecline: (invitationId: number) => void;
    isProcessing: boolean;
}

const InvitationCard: React.FC<InvitationCardProps> = ({
    invitation,
    onAccept,
    onDecline,
    isProcessing,
}) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-start justify-between mb-4">
                <div className="text-left">
                    <h3 className="font-semibold text-gray-900 text-left">Match Invitation</h3>
                    <p className="text-sm text-gray-500 text-left">
                        From Team #{invitation.invitingTeamId}
                    </p>
                </div>
                <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">
                    {invitation.status}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-emerald-500" />
                    Match #{invitation.matchId}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-emerald-500" />
                    Invitation #{invitation.invitationId}
                </div>
            </div>

            {invitation.message && (
                <p className="text-sm text-gray-600 mb-4 italic text-left">"{invitation.message}"</p>
            )}

            <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDecline(invitation.invitationId)}
                    disabled={isProcessing}
                    leftIcon={<X className="w-4 h-4" />}
                >
                    Decline
                </Button>
                <Button
                    size="sm"
                    onClick={() => onAccept(invitation.invitationId)}
                    disabled={isProcessing}
                    leftIcon={<Check className="w-4 h-4" />}
                >
                    Accept
                </Button>
            </div>
        </div>
    );
};

const MatchInvitationsList: React.FC<MatchInvitationsListProps> = ({ teamId }) => {
    const { data: invitations, isLoading, error } = usePendingInvitations(teamId);
    const respondMutation = useRespondInvitation();

    const handleAccept = async (invitationId: number) => {
        try {
            await respondMutation.mutateAsync({ invitationId, accept: true });
            toast.success('Invitation accepted! Match confirmed.');
        } catch {
            toast.error('Failed to accept invitation');
        }
    };

    const handleDecline = async (invitationId: number) => {
        try {
            await respondMutation.mutateAsync({ invitationId, accept: false });
            toast.success('Invitation declined');
        } catch {
            toast.error('Failed to decline invitation');
        }
    };

    if (isLoading) {
        return <LoadingSpinner text="Loading invitations..." />;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">Failed to load invitations</div>;
    }

    if (!invitations || invitations.length === 0) {
        return (
            <EmptyState
                title="No Match Invitations"
                description="You don't have any pending match invitations."
            />
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 text-left">Match Invitations</h2>
                <span className="bg-emerald-100 text-emerald-700 text-sm px-2.5 py-1 rounded-full">
                    {invitations.length} pending
                </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {invitations.map(invitation => (
                    <InvitationCard
                        key={invitation.invitationId}
                        invitation={invitation}
                        onAccept={handleAccept}
                        onDecline={handleDecline}
                        isProcessing={respondMutation.isPending}
                    />
                ))}
            </div>
        </div>
    );
};

export default MatchInvitationsList;
