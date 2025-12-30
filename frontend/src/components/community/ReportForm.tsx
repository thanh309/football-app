import { useState } from 'react';
import { Flag, X } from 'lucide-react';
import { FormSelect, FormTextarea } from '../forms';
import { Button } from '../common';
import { useReportContent } from '../../api/hooks/useCommunity';
import toast from 'react-hot-toast';

interface ReportFormProps {
    contentId: number;
    contentType: 'Post' | 'Comment' | 'User';
    isOpen: boolean;
    onClose: () => void;
}

const reasonOptions = [
    { value: 'Spam', label: 'Spam or misleading' },
    { value: 'Harassment', label: 'Harassment or bullying' },
    { value: 'HateSpeech', label: 'Hate speech or discrimination' },
    { value: 'Violence', label: 'Violence or threats' },
    { value: 'Inappropriate', label: 'Inappropriate content' },
    { value: 'Other', label: 'Other' },
];

const ReportForm: React.FC<ReportFormProps> = ({ contentId, contentType, isOpen, onClose }) => {
    const reportMutation = useReportContent();
    const [reason, setReason] = useState('');
    const [details, setDetails] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reason) {
            toast.error('Please select a reason');
            return;
        }

        try {
            await reportMutation.mutateAsync({
                contentId,
                contentType,
                reason,
                details: details || undefined,
            });
            toast.success('Report submitted. Thank you for helping keep the community safe.');
            onClose();
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Failed to submit report');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-2">
                        <Flag className="w-5 h-5 text-red-500" />
                        <h2 className="text-lg font-semibold text-gray-900">Report {contentType}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <p className="text-sm text-gray-600">
                        Help us understand what's happening. We'll investigate and take action if there's a violation of our community guidelines.
                    </p>

                    <FormSelect
                        label="Why are you reporting this?"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        options={[{ value: '', label: 'Select a reason' }, ...reasonOptions]}
                        required
                    />

                    <FormTextarea
                        label="Additional details (optional)"
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        placeholder="Provide more context about the issue..."
                        rows={3}
                        maxLength={500}
                    />

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="danger"
                            isLoading={reportMutation.isPending}
                            leftIcon={<Flag className="w-4 h-4" />}
                        >
                            Submit Report
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportForm;
