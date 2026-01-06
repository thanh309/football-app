import { useState } from 'react';
import { DollarSign, Save } from 'lucide-react';
import { FormInput, FormSelect, FormTextarea } from './';
import { Button } from '../common';
import { useAddTransaction } from '../../api/hooks/useFinance';
import toast from 'react-hot-toast';

interface AddTransactionFormProps {
    teamId: number;
    onSuccess?: () => void;
    onCancel?: () => void;
}

const categoryOptions = [
    { value: 'FieldBooking', label: 'Field Booking' },
    { value: 'Equipment', label: 'Equipment' },
    { value: 'MembershipFee', label: 'Membership Fee' },
    { value: 'Sponsorship', label: 'Sponsorship' },
    { value: 'Prize', label: 'Prize Money' },
    { value: 'Other', label: 'Other' },
];

const typeOptions = [
    { value: 'Expense', label: 'Expense' },
    { value: 'Income', label: 'Income' },
];

const AddTransactionForm: React.FC<AddTransactionFormProps> = ({
    teamId,
    onSuccess,
    onCancel,
}) => {
    const addMutation = useAddTransaction();

    const [formData, setFormData] = useState({
        type: 'Expense',
        amount: '',
        category: 'Other',
        description: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            newErrors.amount = 'Please enter a valid amount';
        }
        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            await addMutation.mutateAsync({
                teamId,
                type: formData.type as 'Income' | 'Expense',
                amount: parseFloat(formData.amount),
                category: formData.category,
                description: formData.description,
            });
            toast.success('Transaction added successfully');
            onSuccess?.();
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            const message = err.response?.data?.message || 'Failed to add transaction';
            toast.error(message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Add Transaction</h2>
                    <p className="text-gray-500 text-sm">Record a new income or expense</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormSelect
                    label="Type"
                    value={formData.type}
                    onChange={(e) => handleChange('type', e.target.value)}
                    options={typeOptions}
                />

                <FormInput
                    label="Amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => handleChange('amount', e.target.value)}
                    placeholder="0.00"
                    error={errors.amount}
                    required
                />

                <FormSelect
                    label="Category"
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    options={categoryOptions}
                />
            </div>

            <FormTextarea
                label="Description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="What is this transaction for?"
                error={errors.description}
                maxLength={200}
                rows={2}
                required
            />

            <div className="flex justify-end gap-3">
                {onCancel && (
                    <Button type="button" variant="ghost" onClick={onCancel}>
                        Cancel
                    </Button>
                )}
                <Button
                    type="submit"
                    isLoading={addMutation.isPending}
                    leftIcon={<Save className="w-4 h-4" />}
                >
                    Add Transaction
                </Button>
            </div>
        </form>
    );
};

export default AddTransactionForm;
