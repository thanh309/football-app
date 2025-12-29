import { useState } from 'react';
import { Calendar, Save } from 'lucide-react';
import { FormInput, FormSelect, FormTextarea, DateTimePicker } from './';
import { Button } from '../common';
import { useCreateMatch } from '../../api/hooks/useMatch';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface CreateMatchFormProps {
    teamId: number;
    onSuccess?: () => void;
}

const visibilityOptions = [
    { value: 'Public', label: 'Public - Visible to everyone' },
    { value: 'Private', label: 'Private - Only team members' },
    { value: 'TeamOnly', label: 'Team Only - Only participating teams' },
];

const CreateMatchForm: React.FC<CreateMatchFormProps> = ({ teamId, onSuccess }) => {
    const navigate = useNavigate();
    const createMutation = useCreateMatch();

    const [formData, setFormData] = useState({
        matchDate: '',
        startTime: '',
        endTime: '',
        description: '',
        visibility: 'Public',
        fieldId: '',
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
        if (!formData.matchDate) {
            newErrors.matchDate = 'Date is required';
        }
        if (!formData.startTime) {
            newErrors.startTime = 'Start time is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const match = await createMutation.mutateAsync({
                hostTeamId: teamId,
                matchDate: formData.matchDate,
                startTime: formData.startTime,
                endTime: formData.endTime || undefined,
                description: formData.description || undefined,
                visibility: formData.visibility as 'Public' | 'Private' | 'TeamOnly',
                fieldId: formData.fieldId ? parseInt(formData.fieldId) : undefined,
            });
            toast.success('Match created successfully!');
            onSuccess?.();
            navigate(`/leader/matches/${match.matchId}`);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            const message = err.response?.data?.message || 'Failed to create match';
            toast.error(message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-emerald-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Schedule New Match</h2>
                    <p className="text-gray-500">Set up a match event for your team</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DateTimePicker
                    label="Match Date"
                    type="date"
                    value={formData.matchDate}
                    onChange={(value) => handleChange('matchDate', value)}
                    required
                    error={errors.matchDate}
                />

                <div className="grid grid-cols-2 gap-4">
                    <DateTimePicker
                        label="Start Time"
                        type="time"
                        value={formData.startTime}
                        onChange={(value) => handleChange('startTime', value)}
                        required
                        error={errors.startTime}
                    />
                    <DateTimePicker
                        label="End Time"
                        type="time"
                        value={formData.endTime}
                        onChange={(value) => handleChange('endTime', value)}
                    />
                </div>

                <FormSelect
                    label="Visibility"
                    value={formData.visibility}
                    onChange={(e) => handleChange('visibility', e.target.value)}
                    options={visibilityOptions}
                />

                <FormInput
                    label="Field ID (if known)"
                    type="number"
                    value={formData.fieldId}
                    onChange={(e) => handleChange('fieldId', e.target.value)}
                    placeholder="Enter field ID or leave empty"
                    helperText="You can book a field after creating the match"
                />
            </div>

            <FormTextarea
                label="Description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Match details, notes for players..."
                maxLength={500}
                rows={3}
            />

            <div className="flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
                    Cancel
                </Button>
                <Button
                    type="submit"
                    isLoading={createMutation.isPending}
                    leftIcon={<Save className="w-4 h-4" />}
                >
                    Create Match
                </Button>
            </div>
        </form>
    );
};

export default CreateMatchForm;
