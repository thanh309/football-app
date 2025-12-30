import { Check, X } from 'lucide-react';
import { Button } from '../common';
import { useApproveBooking, useRejectBooking } from '../../api/hooks/useBooking';
import toast from 'react-hot-toast';

interface ApproveRejectBookingButtonsProps {
    bookingId: number;
    onSuccess?: () => void;
    size?: 'sm' | 'md' | 'lg';
}

const ApproveRejectBookingButtons: React.FC<ApproveRejectBookingButtonsProps> = ({
    bookingId,
    onSuccess,
    size = 'sm',
}) => {
    const approveMutation = useApproveBooking();
    const rejectMutation = useRejectBooking();

    const handleApprove = async () => {
        try {
            await approveMutation.mutateAsync(bookingId);
            toast.success('Booking approved!');
            onSuccess?.();
        } catch {
            toast.error('Failed to approve booking');
        }
    };

    const handleReject = async () => {
        try {
            await rejectMutation.mutateAsync({ bookingId });
            toast.success('Booking rejected');
            onSuccess?.();
        } catch {
            toast.error('Failed to reject booking');
        }
    };

    const isProcessing = approveMutation.isPending || rejectMutation.isPending;

    return (
        <div className="flex items-center gap-2">
            <Button
                variant="ghost"
                size={size}
                onClick={handleReject}
                disabled={isProcessing}
                leftIcon={<X className="w-4 h-4" />}
            >
                Reject
            </Button>
            <Button
                size={size}
                onClick={handleApprove}
                disabled={isProcessing}
                leftIcon={<Check className="w-4 h-4" />}
            >
                Approve
            </Button>
        </div>
    );
};

export default ApproveRejectBookingButtons;
