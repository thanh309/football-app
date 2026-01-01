import { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { Button, ConfirmationModal } from '../common';
import { FormTextarea, FormSelect } from '../forms';
import { useResolveReport, useDismissReport } from '../../api/hooks/useModeration';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface ModerationActionButtonsProps {
    reportId: number;
    contentType: string;
    contentId: number;
    onSuccess?: () => void;
}

const actionOptions = [
    { value: 'Warn', label: 'Issue Warning' },
    { value: 'Remove', label: 'Remove Content' },
    { value: 'Suspend', label: 'Suspend User' },
    { value: 'Keep', label: 'Keep Content (No Action)' },
];

type ActionType = 'Keep' | 'Warn' | 'Remove' | 'Suspend' | 'Dismiss' | '';

const ModerationActionButtons: React.FC<ModerationActionButtonsProps> = ({
    reportId,
    contentType,
    contentId,
    onSuccess,
}) => {
    const navigate = useNavigate();
    const resolveMutation = useResolveReport();
    const dismissMutation = useDismissReport();

    const [showResolve, setShowResolve] = useState(false);
    const [showDismiss, setShowDismiss] = useState(false);
    const [action, setAction] = useState<ActionType>('');
    const [notes, setNotes] = useState('');

    const handleResolve = async () => {
        if (!action) {
            toast.error('Please select an action');
            return;
        }
        try {
            await resolveMutation.mutateAsync({
                reportId,
                action: action as Exclude<ActionType, ''>,
                notes: notes || undefined,
            });
            toast.success('Report resolved');
            setShowResolve(false);
            onSuccess?.();
            navigate('/mod/reports');
        } catch {
            toast.error('Failed to resolve report');
        }
    };

    const handleDismiss = async () => {
        try {
            await dismissMutation.mutateAsync(reportId);
            toast.success('Report dismissed');
            setShowDismiss(false);
            onSuccess?.();
            navigate('/mod/reports');
        } catch {
            toast.error('Failed to dismiss report');
        }
    };

    return (
        <>
            <div className="flex items-center gap-3">
                <Button variant="ghost" onClick={() => setShowDismiss(true)} leftIcon={<X className="w-4 h-4" />}>
                    Dismiss
                </Button>
                <Button variant="danger" onClick={() => setShowResolve(true)} leftIcon={<Trash2 className="w-4 h-4" />}>
                    Take Action
                </Button>
            </div>

            <ConfirmationModal
                isOpen={showResolve}
                onClose={() => setShowResolve(false)}
                onConfirm={handleResolve}
                title="Take Moderation Action"
                message={
                    <div className="space-y-4">
                        <p className="text-gray-600">
                            Select the action to take on this {contentType.toLowerCase()} (ID: {contentId}).
                        </p>
                        <FormSelect
                            label="Action"
                            value={action}
                            onChange={(e) => setAction(e.target.value as ActionType)}
                            options={[{ value: '', label: 'Select action...' }, ...actionOptions]}
                            required
                        />
                        <FormTextarea
                            label="Notes (optional)"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add any notes about this action..."
                            rows={3}
                        />
                    </div>
                }
                confirmLabel="Take Action"
                variant="danger"
                isLoading={resolveMutation.isPending}
            />

            <ConfirmationModal
                isOpen={showDismiss}
                onClose={() => setShowDismiss(false)}
                onConfirm={handleDismiss}
                title="Dismiss Report?"
                message="This report will be marked as dismissed."
                confirmLabel="Dismiss Report"
                isLoading={dismissMutation.isPending}
            />
        </>
    );
};

export default ModerationActionButtons;
