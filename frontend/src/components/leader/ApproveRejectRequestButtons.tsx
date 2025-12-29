import { Check, X } from 'lucide-react';
import { Button } from '../common';
import { useProcessJoinRequest } from '../../api/hooks/useTeam';
import toast from 'react-hot-toast';

interface ApproveRejectRequestButtonsProps {
    requestId: number;
    onSuccess?: () => void;
    size?: 'sm' | 'md' | 'lg';
}

const ApproveRejectRequestButtons: React.FC<ApproveRejectRequestButtonsProps> = ({
    requestId,
    onSuccess,
    size = 'sm',
}) => {
    const processMutation = useProcessJoinRequest();

    const handleApprove = async () => {
        try {
            await processMutation.mutateAsync({ requestId, approve: true });
            toast.success('Player approved and added to team');
            onSuccess?.();
        } catch (error) {
            toast.error('Failed to approve request');
        }
    };

    const handleReject = async () => {
        try {
            await processMutation.mutateAsync({ requestId, approve: false });
            toast.success('Request rejected');
            onSuccess?.();
        } catch (error) {
            toast.error('Failed to reject request');
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Button
                variant="ghost"
                size={size}
                onClick={handleReject}
                disabled={processMutation.isPending}
                leftIcon={<X className="w-4 h-4" />}
            >
                Reject
            </Button>
            <Button
                size={size}
                onClick={handleApprove}
                disabled={processMutation.isPending}
                leftIcon={<Check className="w-4 h-4" />}
            >
                Approve
            </Button>
        </div>
    );
};

export default ApproveRejectRequestButtons;
