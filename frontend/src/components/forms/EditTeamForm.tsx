import { useState, useEffect } from 'react';
import { Users, Save } from 'lucide-react';
import { FormInput, FormSelect, FormTextarea } from './';
import { Button, LoadingSpinner } from '../common';
import { useUpdateTeam, useTeam } from '../../api/hooks/useTeam';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface EditTeamFormProps {
    teamId: number;
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

const EditTeamForm: React.FC<EditTeamFormProps> = ({ teamId, onSuccess }) => {
    const navigate = useNavigate();
    const { data: team, isLoading } = useTeam(teamId);
    const updateMutation = useUpdateTeam();

    const [formData, setFormData] = useState({
        teamName: '',
        description: '',
        logoUrl: '',
        location: '',
        skillLevel: '5',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (team) {
            setFormData({
                teamName: team.teamName || '',
                description: team.description || '',
                logoUrl: team.logoUrl || '',
                location: team.location || '',
                skillLevel: team.skillLevel?.toString() || '5',
            });
        }
    }, [team]);

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
            await updateMutation.mutateAsync({
                teamId,
                teamName: formData.teamName,
                description: formData.description || undefined,
                logoUrl: formData.logoUrl || undefined,
                location: formData.location || undefined,
                skillLevel: parseInt(formData.skillLevel),
            });
            toast.success('Team updated successfully!');
            onSuccess?.();
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            const message = err.response?.data?.message || 'Failed to update team';
            toast.error(message);
        }
    };

    if (isLoading) {
        return <LoadingSpinner text="Loading team details..." />;
    }

    if (!team) {
        return <div className="text-center py-8 text-gray-500">Team not found</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center overflow-hidden">
                    {formData.logoUrl ? (
                        <img src={formData.logoUrl} alt={formData.teamName} className="w-full h-full object-cover" />
                    ) : (
                        <Users className="w-8 h-8 text-emerald-600" />
                    )}
                </div>
                <div className="text-left">
                    <h2 className="text-2xl font-bold text-gray-900 text-left">Edit Team</h2>
                    <p className="text-gray-500 text-left">Update your team information</p>
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

            <div className="flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
                    Cancel
                </Button>
                <Button
                    type="submit"
                    isLoading={updateMutation.isPending}
                    leftIcon={<Save className="w-4 h-4" />}
                >
                    Save Changes
                </Button>
            </div>
        </form>
    );
};

export default EditTeamForm;
