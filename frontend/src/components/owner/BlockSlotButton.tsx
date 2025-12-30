import { useState } from 'react';
import { Ban } from 'lucide-react';
import { Button, ConfirmationModal } from '../common';
import { FormInput, DateTimePicker } from '../forms';
import { useBlockSlot } from '../../api/hooks/useBooking';
import toast from 'react-hot-toast';

interface BlockSlotButtonProps {
    fieldId: number;
    date?: string;
    startTime?: string;
    endTime?: string;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    onSuccess?: () => void;
}

const BlockSlotButton: React.FC<BlockSlotButtonProps> = ({
    fieldId,
    date: initialDate,
    startTime: initialStartTime,
    endTime: initialEndTime,
    variant = 'outline',
    size = 'sm',
    onSuccess,
}) => {
    const [showModal, setShowModal] = useState(false);
    const [date, setDate] = useState(initialDate || '');
    const [startTime, setStartTime] = useState(initialStartTime || '');
    const [endTime, setEndTime] = useState(initialEndTime || '');
    const [reason, setReason] = useState('');
    const blockMutation = useBlockSlot();

    const handleBlock = async () => {
        if (!date || !startTime || !endTime) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            await blockMutation.mutateAsync({
                fieldId,
                date,
                startTime,
                endTime,
                reason: reason || undefined,
            });
            toast.success('Slot blocked successfully');
            setShowModal(false);
            setDate(initialDate || '');
            setStartTime(initialStartTime || '');
            setEndTime(initialEndTime || '');
            setReason('');
            onSuccess?.();
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Failed to block slot');
        }
    };

    return (
        <>
            <Button
                variant={variant}
                size={size}
                onClick={() => setShowModal(true)}
                leftIcon={<Ban className="w-4 h-4" />}
            >
                Block Slot
            </Button>

            <ConfirmationModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleBlock}
                title="Block Time Slot"
                message={
                    <div className="space-y-4">
                        <p className="text-gray-600">
                            Block this time slot to prevent bookings. Useful for maintenance, private events, etc.
                        </p>
                        <div className="grid grid-cols-1 gap-4">
                            <DateTimePicker
                                label="Date"
                                type="date"
                                value={date}
                                onChange={setDate}
                                required
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <DateTimePicker
                                    label="Start Time"
                                    type="time"
                                    value={startTime}
                                    onChange={setStartTime}
                                    required
                                />
                                <DateTimePicker
                                    label="End Time"
                                    type="time"
                                    value={endTime}
                                    onChange={setEndTime}
                                    required
                                />
                            </div>
                            <FormInput
                                label="Reason (optional)"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="e.g., Maintenance, Private event..."
                            />
                        </div>
                    </div>
                }
                confirmLabel="Block Slot"
                variant="danger"
                isLoading={blockMutation.isPending}
            />
        </>
    );
};

export default BlockSlotButton;
