import { useState } from 'react';
import { Users, Save } from 'lucide-react';
import { FormInput, FormSelect, FormTextarea } from './';
import { Button } from '../common';
import { useCreateTeam } from '../../api/hooks/useTeam';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface CreateTeamFormProps {
    onSuccess?: () => void;
}

const skillLevelOptions = [
    { value: '1', label: '1 - Beginner' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5 - Intermediate' },
    { value: '6', label: '6' },
    { value: '7', label: '7' },
    { value: '8', label: '8' },
    { value: '9', label: '9' },
    { value: '10', label: '10 - Professional' },
];

const CreateTeamForm: React.FC<CreateTeamFormProps> = ({ onSuccess }) => {
    const navigate = useNavigate();
    const createMutation = useCreateTeam();

    const [formData, setFormData] = useState({
        teamName: '',
        description: '',
        logoUrl: '',
        location: '',
        skillLevel: '5',
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
        if (!formData.teamName.trim()) {
            newErrors.teamName = 'Team name is required';
        } else if (formData.teamName.length < 3) {
            newErrors.teamName = 'Team name must be at least 3 characters';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const team = await createMutation.mutateAsync({
                teamName: formData.teamName,
                description: formData.description || undefined,
                logoUrl: formData.logoUrl || undefined,
                location: formData.location || undefined,
                skillLevel: parseInt(formData.skillLevel),
            });
            toast.success('Team created successfully! Waiting for moderator approval.');
            onSuccess?.();
            navigate(`/leader/teams/${team.teamId}`);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            const message = err.response?.data?.message || 'Failed to create team';
            toast.error(message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Users className="w-8 h-8 text-emerald-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Create New Team</h2>
                    <p className="text-gray-500">Set up your team profile</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                    label="Team Name"
                    value={formData.teamName}
                    onChange={(e) => handleChange('teamName', e.target.value)}
                    placeholder="Enter your team name"
                    error={errors.teamName}
                    required
                />

                <FormInput
                    label="Location"
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    placeholder="City or area..."
                />

                <FormSelect
                    label="Skill Level"
                    value={formData.skillLevel}
                    onChange={(e) => handleChange('skillLevel', e.target.value)}
                    options={skillLevelOptions}
                />

                <FormInput
                    label="Logo URL"
                    value={formData.logoUrl}
                    onChange={(e) => handleChange('logoUrl', e.target.value)}
                    placeholder="https://example.com/logo.png"
                    helperText="Enter a URL for your team logo"
                />
            </div>

            <FormTextarea
                label="Description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Tell us about your team..."
                maxLength={1000}
                rows={4}
            />

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800">
                    <strong>Note:</strong> Your team will be reviewed by a moderator before it becomes visible to others. This usually takes 1-2 business days.
                </p>
            </div>

            <div className="flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
                    Cancel
                </Button>
                <Button
                    type="submit"
                    isLoading={createMutation.isPending}
                    leftIcon={<Save className="w-4 h-4" />}
                >
                    Create Team
                </Button>
            </div>
        </form>
    );
};

export default CreateTeamForm;
