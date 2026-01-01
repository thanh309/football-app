import { Check, X } from 'lucide-react';
import { useState } from 'react';
import { Button, ConfirmationModal } from '../common';
import { useVerifyField } from '../../api/hooks/useModeration';
import { FormTextarea } from '../forms';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface VerifyFieldButtonsProps {
    fieldId: number;
    onSuccess?: () => void;
}

const VerifyFieldButtons: React.FC<VerifyFieldButtonsProps> = ({ fieldId, onSuccess }) => {
    const navigate = useNavigate();
    const verifyMutation = useVerifyField();
    const [showApprove, setShowApprove] = useState(false);
    const [showReject, setShowReject] = useState(false);
    const [reason, setReason] = useState('');

    const handleApprove = async () => {
        try {
            await verifyMutation.mutateAsync({
                fieldId,
                approve: true,
            });
            toast.success('Field approved successfully!');
            setShowApprove(false);
            onSuccess?.();
            navigate('/mod/fields');
        } catch {
            toast.error('Failed to approve field');
        }
    };

    const handleReject = async () => {
        if (!reason.trim()) {
            toast.error('Please provide a reason for rejection');
            return;
        }

        try {
            await verifyMutation.mutateAsync({
                fieldId,
                approve: false,
                rejectionReason: reason,
            });
            toast.success('Field rejected');
            setShowReject(false);
            onSuccess?.();
            navigate('/mod/fields');
        } catch {
            toast.error('Failed to reject field');
        }
    };

    return (
        <>
            <div className="flex items-center gap-3">
                <Button
                    variant="danger"
                    onClick={() => setShowReject(true)}
                    leftIcon={<X className="w-4 h-4" />}
                >
                    Reject
                </Button>
                <Button onClick={() => setShowApprove(true)} leftIcon={<Check className="w-4 h-4" />}>
                    Approve
                </Button>
            </div>

            <ConfirmationModal
                isOpen={showApprove}
                onClose={() => setShowApprove(false)}
                onConfirm={handleApprove}
                title="Approve Field?"
                message="This field will be verified and available for bookings."
                confirmLabel="Approve Field"
                isLoading={verifyMutation.isPending}
            />

            <ConfirmationModal
                isOpen={showReject}
                onClose={() => setShowReject(false)}
                onConfirm={handleReject}
                title="Reject Field?"
                message={
                    <div className="space-y-4">
                        <p className="text-gray-600">
                            This field will be rejected and the owner will be notified.
                        </p>
                        <FormTextarea
                            label="Reason (required)"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Explain why this field is being rejected..."
                            rows={3}
                            required
                        />
                    </div>
                }
                confirmLabel="Reject Field"
                variant="danger"
                isLoading={verifyMutation.isPending}
            />
        </>
    );
};

export default VerifyFieldButtons;
