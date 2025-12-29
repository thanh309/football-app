import { Check, X } from 'lucide-react';
import { Button } from '../common';
import { useRespondInvitation } from '../../api/hooks/useMatch';
import toast from 'react-hot-toast';

interface RespondInvitationButtonsProps {
    invitationId: number;
    onSuccess?: () => void;
    size?: 'sm' | 'md' | 'lg';
}

const RespondInvitationButtons: React.FC<RespondInvitationButtonsProps> = ({
    invitationId,
    onSuccess,
    size = 'sm',
}) => {
    const respondMutation = useRespondInvitation();

    const handleAccept = async () => {
        try {
            await respondMutation.mutateAsync({ invitationId, accept: true });
            toast.success('Invitation accepted!');
            onSuccess?.();
        } catch (error) {
            toast.error('Failed to accept invitation');
        }
    };

    const handleDecline = async () => {
        try {
            await respondMutation.mutateAsync({ invitationId, accept: false });
            toast.success('Invitation declined');
            onSuccess?.();
        } catch (error) {
            toast.error('Failed to decline invitation');
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Button
                variant="ghost"
                size={size}
                onClick={handleDecline}
                disabled={respondMutation.isPending}
                leftIcon={<X className="w-4 h-4" />}
            >
                Decline
            </Button>
            <Button
                size={size}
                onClick={handleAccept}
                disabled={respondMutation.isPending}
                leftIcon={<Check className="w-4 h-4" />}
            >
                Accept
            </Button>
        </div>
    );
};

export default RespondInvitationButtons;
