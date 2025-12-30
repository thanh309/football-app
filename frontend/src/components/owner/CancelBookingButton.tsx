import { useState } from 'react';
import { XCircle } from 'lucide-react';
import { Button, ConfirmationModal } from '../common';
import { useCancelBooking } from '../../api/hooks/useBooking';
import toast from 'react-hot-toast';

interface CancelBookingButtonProps {
    bookingId: number;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    onSuccess?: () => void;
}

const CancelBookingButton: React.FC<CancelBookingButtonProps> = ({
    bookingId,
    variant = 'danger',
    size = 'sm',
    onSuccess,
}) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const cancelMutation = useCancelBooking();

    const handleCancel = async () => {
        try {
            await cancelMutation.mutateAsync(bookingId);
            toast.success('Booking cancelled successfully');
            setShowConfirm(false);
            onSuccess?.();
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Failed to cancel booking');
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
                Cancel Booking
            </Button>

            <ConfirmationModal
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={handleCancel}
                title="Cancel Booking?"
                message="Are you sure you want to cancel this booking? The team will be notified and any payment will be refunded according to the cancellation policy."
                confirmLabel="Cancel Booking"
                variant="danger"
                isLoading={cancelMutation.isPending}
            />
        </>
    );
};

export default CancelBookingButton;
