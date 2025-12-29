import { useState } from 'react';
import { XCircle } from 'lucide-react';
import { Button, ConfirmationModal } from '../common';
import { useCancelMatch } from '../../api/hooks/useMatch';
import toast from 'react-hot-toast';

interface CancelMatchButtonProps {
    matchId: number;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    onSuccess?: () => void;
}

const CancelMatchButton: React.FC<CancelMatchButtonProps> = ({
    matchId,
    variant = 'danger',
    size = 'md',
    onSuccess,
}) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const cancelMutation = useCancelMatch();

    const handleCancel = async () => {
        try {
            await cancelMutation.mutateAsync({ matchId });
            toast.success('Match cancelled successfully');
            setShowConfirm(false);
            onSuccess?.();
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            const message = err.response?.data?.message || 'Failed to cancel match';
            toast.error(message);
        }
    };

    return (
        <>
            <Button
                variant={variant}
                size={size}
                onClick={() => setShowConfirm(true)}
                leftIcon={<XCircle className="w-4 h-4" />}
            >
                Cancel Match
            </Button>

            <ConfirmationModal
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={handleCancel}
                title="Cancel Match?"
                message="Are you sure you want to cancel this match? All players will be notified and any field booking will be released."
                confirmLabel="Cancel Match"
                variant="danger"
                isLoading={cancelMutation.isPending}
            />
        </>
    );
};

export default CancelMatchButton;
