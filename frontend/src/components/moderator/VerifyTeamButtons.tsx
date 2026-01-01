import { Check, X } from 'lucide-react';
import { useState } from 'react';
import { Button, ConfirmationModal } from '../common';
import { useVerifyTeam } from '../../api/hooks/useModeration';
import { FormTextarea } from '../forms';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface VerifyTeamButtonsProps {
    teamId: number;
    onSuccess?: () => void;
}

const VerifyTeamButtons: React.FC<VerifyTeamButtonsProps> = ({ teamId, onSuccess }) => {
    const navigate = useNavigate();
    const verifyMutation = useVerifyTeam();
    const [showApprove, setShowApprove] = useState(false);
    const [showReject, setShowReject] = useState(false);
    const [reason, setReason] = useState('');

    const handleApprove = async () => {
        try {
            await verifyMutation.mutateAsync({
                teamId,
                approve: true,
            });
            toast.success('Team approved successfully!');
            setShowApprove(false);
            onSuccess?.();
            navigate('/mod/teams');
        } catch {
            toast.error('Failed to approve team');
        }
    };

    const handleReject = async () => {
        if (!reason.trim()) {
            toast.error('Please provide a reason for rejection');
            return;
        }

        try {
            await verifyMutation.mutateAsync({
                teamId,
                approve: false,
                rejectionReason: reason,
            });
            toast.success('Team rejected');
            setShowReject(false);
            onSuccess?.();
            navigate('/mod/teams');
        } catch {
            toast.error('Failed to reject team');
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
                title="Approve Team?"
                message="This team will be verified and visible on the platform."
                confirmLabel="Approve Team"
                isLoading={verifyMutation.isPending}
            />

            <ConfirmationModal
                isOpen={showReject}
                onClose={() => setShowReject(false)}
                onConfirm={handleReject}
                title="Reject Team?"
                message={
                    <div className="space-y-4">
                        <p className="text-gray-600">
                            This team will be rejected and the leader will be notified.
                        </p>
                        <FormTextarea
                            label="Reason (required)"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Explain why this team is being rejected..."
                            rows={3}
                            required
                        />
                    </div>
                }
                confirmLabel="Reject Team"
                variant="danger"
                isLoading={verifyMutation.isPending}
            />
        </>
    );
};

export default VerifyTeamButtons;
