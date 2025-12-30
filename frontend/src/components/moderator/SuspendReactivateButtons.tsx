import { useState } from 'react';
import { UserX, UserCheck, Ban } from 'lucide-react';
import { Button, ConfirmationModal } from '../common';
import { FormTextarea } from '../forms';
import { useSuspendUser, useReactivateUser, useBanUser } from '../../api/hooks/useModeration';
import toast from 'react-hot-toast';

interface SuspendReactivateButtonsProps {
    userId: number;
    currentStatus: string;
    onSuccess?: () => void;
}

const SuspendReactivateButtons: React.FC<SuspendReactivateButtonsProps> = ({
    userId,
    currentStatus,
    onSuccess,
}) => {
    const suspendMutation = useSuspendUser();
    const reactivateMutation = useReactivateUser();
    const banMutation = useBanUser();

    const [showSuspend, setShowSuspend] = useState(false);
    const [showReactivate, setShowReactivate] = useState(false);
    const [showBan, setShowBan] = useState(false);
    const [reason, setReason] = useState('');

    const handleSuspend = async () => {
        if (!reason.trim()) {
            toast.error('Please provide a reason');
            return;
        }
        try {
            await suspendMutation.mutateAsync({ userId, reason });
            toast.success('User suspended');
            setShowSuspend(false);
            setReason('');
            onSuccess?.();
        } catch {
            toast.error('Failed to suspend user');
        }
    };

    const handleReactivate = async () => {
        try {
            await reactivateMutation.mutateAsync({ userId, reason: reason || 'Account reactivated' });
            toast.success('User reactivated');
            setShowReactivate(false);
            setReason('');
            onSuccess?.();
        } catch {
            toast.error('Failed to reactivate user');
        }
    };

    const handleBan = async () => {
        if (!reason.trim()) {
            toast.error('Please provide a reason');
            return;
        }
        try {
            await banMutation.mutateAsync({ userId, reason });
            toast.success('User banned');
            setShowBan(false);
            setReason('');
            onSuccess?.();
        } catch {
            toast.error('Failed to ban user');
        }
    };

    const isProcessing = suspendMutation.isPending || reactivateMutation.isPending || banMutation.isPending;

    return (
        <>
            <div className="flex items-center gap-3">
                {currentStatus === 'Active' && (
                    <>
                        <Button
                            variant="outline"
                            onClick={() => setShowSuspend(true)}
                            disabled={isProcessing}
                            leftIcon={<UserX className="w-4 h-4" />}
                        >
                            Suspend
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() => setShowBan(true)}
                            disabled={isProcessing}
                            leftIcon={<Ban className="w-4 h-4" />}
                        >
                            Ban
                        </Button>
                    </>
                )}

                {(currentStatus === 'Suspended' || currentStatus === 'Banned') && (
                    <Button
                        onClick={() => setShowReactivate(true)}
                        disabled={isProcessing}
                        leftIcon={<UserCheck className="w-4 h-4" />}
                    >
                        Reactivate
                    </Button>
                )}
            </div>

            <ConfirmationModal
                isOpen={showSuspend}
                onClose={() => setShowSuspend(false)}
                onConfirm={handleSuspend}
                title="Suspend User?"
                message={
                    <div className="space-y-4">
                        <p className="text-gray-600">
                            This user will be temporarily suspended and cannot access their account.
                        </p>
                        <FormTextarea
                            label="Reason (required)"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Explain why this user is being suspended..."
                            rows={3}
                            required
                        />
                    </div>
                }
                confirmLabel="Suspend User"
                variant="danger"
                isLoading={suspendMutation.isPending}
            />

            <ConfirmationModal
                isOpen={showReactivate}
                onClose={() => setShowReactivate(false)}
                onConfirm={handleReactivate}
                title="Reactivate User?"
                message={
                    <div className="space-y-4">
                        <p className="text-gray-600">
                            This user's account will be reactivated and they can access the platform again.
                        </p>
                        <FormTextarea
                            label="Note (optional)"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Any notes about this reactivation..."
                            rows={2}
                        />
                    </div>
                }
                confirmLabel="Reactivate User"
                isLoading={reactivateMutation.isPending}
            />

            <ConfirmationModal
                isOpen={showBan}
                onClose={() => setShowBan(false)}
                onConfirm={handleBan}
                title="Ban User?"
                message={
                    <div className="space-y-4">
                        <p className="text-gray-600">
                            This user will be permanently banned and cannot create new accounts.
                        </p>
                        <FormTextarea
                            label="Reason (required)"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Explain why this user is being banned..."
                            rows={3}
                            required
                        />
                    </div>
                }
                confirmLabel="Ban User"
                variant="danger"
                isLoading={banMutation.isPending}
            />
        </>
    );
};

export default SuspendReactivateButtons;
