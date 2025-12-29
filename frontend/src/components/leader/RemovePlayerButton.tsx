import { UserMinus } from 'lucide-react';
import { useState } from 'react';
import { Button, ConfirmationModal } from '../common';
import { useRemovePlayerFromRoster } from '../../api/hooks/useRoster';
import toast from 'react-hot-toast';

interface RemovePlayerButtonProps {
    teamId: number;
    playerId: number;
    playerName?: string;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    onSuccess?: () => void;
}

const RemovePlayerButton: React.FC<RemovePlayerButtonProps> = ({
    teamId,
    playerId,
    playerName,
    variant = 'danger',
    size = 'sm',
    onSuccess,
}) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const removeMutation = useRemovePlayerFromRoster();

    const handleRemove = async () => {
        try {
            await removeMutation.mutateAsync({ teamId, playerId });
            toast.success(playerName ? `${playerName} has been removed` : 'Player removed from team');
            setShowConfirm(false);
            onSuccess?.();
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            const message = err.response?.data?.message || 'Failed to remove player';
            toast.error(message);
        }
    };

    return (
        <>
            <Button
                variant={variant}
                size={size}
                onClick={() => setShowConfirm(true)}
                leftIcon={<UserMinus className="w-4 h-4" />}
            >
                Remove
            </Button>

            <ConfirmationModal
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={handleRemove}
                title="Remove Player?"
                message={`Are you sure you want to remove ${playerName || 'this player'} from the team? They will need to request to join again.`}
                confirmLabel="Remove"
                variant="danger"
                isLoading={removeMutation.isPending}
            />
        </>
    );
};

export default RemovePlayerButton;
