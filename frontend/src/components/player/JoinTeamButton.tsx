import { UserPlus, Loader2 } from 'lucide-react';
import { Button } from '../common';
import { useRequestJoinTeam } from '../../api/hooks/useTeam';
import toast from 'react-hot-toast';

interface JoinTeamButtonProps {
    teamId: number;
    teamName?: string;
    disabled?: boolean;
    className?: string;
}

const JoinTeamButton: React.FC<JoinTeamButtonProps> = ({
    teamId,
    teamName,
    disabled = false,
    className,
}) => {
    const requestMutation = useRequestJoinTeam();

    const handleJoinRequest = async () => {
        try {
            await requestMutation.mutateAsync({ teamId });
            toast.success(
                teamName
                    ? `Join request sent to ${teamName}!`
                    : 'Join request sent successfully!'
            );
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            const message = err.response?.data?.message || 'Failed to send join request';
            toast.error(message);
        }
    };

    return (
        <Button
            onClick={handleJoinRequest}
            disabled={disabled || requestMutation.isPending}
            leftIcon={
                requestMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <UserPlus className="w-4 h-4" />
                )
            }
            className={className}
        >
            {requestMutation.isPending ? 'Sending...' : 'Request to Join'}
        </Button>
    );
};

export default JoinTeamButton;
