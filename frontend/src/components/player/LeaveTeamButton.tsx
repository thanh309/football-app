import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Button, ConfirmationModal } from '../common';
import { useLeaveTeam } from '../../api/hooks/useTeam';
import toast from 'react-hot-toast';

interface LeaveTeamButtonProps {
    teamId: number;
    playerId: number;
    teamName?: string;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const LeaveTeamButton: React.FC<LeaveTeamButtonProps> = ({
    teamId,
    playerId,
    teamName,
    variant = 'danger',
    size = 'md',
    className,
}) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const leaveMutation = useLeaveTeam();
    const navigate = useNavigate();

    const handleLeave = async () => {
        try {
            await leaveMutation.mutateAsync({ teamId, playerId });
            toast.success(
                teamName
                    ? `You have left ${teamName}`
                    : 'You have left the team'
            );
            setShowConfirm(false);
            navigate('/my-teams');
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            const message = err.response?.data?.message || 'Failed to leave team';
            toast.error(message);
        }
    };

    return (
        <>
            <Button
                variant={variant}
                size={size}
                onClick={() => setShowConfirm(true)}
                leftIcon={<LogOut className="w-4 h-4" />}
                className={className}
            >
                Leave Team
            </Button>

            <ConfirmationModal
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={handleLeave}
                title="Leave Team?"
                message={
                    teamName
                        ? `Are you sure you want to leave ${teamName}? You will need to request to join again if you change your mind.`
                        : 'Are you sure you want to leave this team? You will need to request to join again if you change your mind.'
                }
                confirmLabel="Leave Team"
                variant="danger"
                isLoading={leaveMutation.isPending}
            />
        </>
    );
};

export default LeaveTeamButton;
