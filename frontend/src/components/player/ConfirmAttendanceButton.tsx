import { CheckCircle } from 'lucide-react';
import { Button } from '../common';
import { useConfirmAttendance } from '../../api/hooks/useAttendance';
import toast from 'react-hot-toast';

interface ConfirmAttendanceButtonProps {
    matchId: number;
    hasConfirmed?: boolean;
    disabled?: boolean;
    className?: string;
}

const ConfirmAttendanceButton: React.FC<ConfirmAttendanceButtonProps> = ({
    matchId,
    hasConfirmed = false,
    disabled = false,
    className,
}) => {
    const confirmMutation = useConfirmAttendance();

    const handleConfirm = async () => {
        try {
            await confirmMutation.mutateAsync(matchId);
            toast.success('Attendance confirmed!');
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            const message = err.response?.data?.message || 'Failed to confirm attendance';
            toast.error(message);
        }
    };

    if (hasConfirmed) {
        return (
            <div className={`flex items-center gap-2 text-green-600 ${className}`}>
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Confirmed</span>
            </div>
        );
    }

    return (
        <Button
            onClick={handleConfirm}
            disabled={disabled || confirmMutation.isPending}
            isLoading={confirmMutation.isPending}
            leftIcon={<CheckCircle className="w-4 h-4" />}
            className={className}
        >
            Confirm Attendance
        </Button>
    );
};

export default ConfirmAttendanceButton;
