import { useState } from 'react';
import { MapPin, Save } from 'lucide-react';
import { FormInput, FormTextarea } from './';
import { Button } from '../common';
import { useCreateField, useAllAmenities } from '../../api/hooks/useField';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface CreateFieldFormProps {
    onSuccess?: () => void;
}

const CreateFieldForm: React.FC<CreateFieldFormProps> = ({ onSuccess }) => {
    const navigate = useNavigate();
    const createMutation = useCreateField();
    const { data: amenities } = useAllAmenities();

    const [formData, setFormData] = useState({
        fieldName: '',
        description: '',
        location: '',
        latitude: '',
        longitude: '',
        defaultPricePerHour: '',
        capacity: '',
    });

    const [selectedAmenities, setSelectedAmenities] = useState<number[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const toggleAmenity = (amenityId: number) => {
        setSelectedAmenities(prev =>
            prev.includes(amenityId)
                ? prev.filter(id => id !== amenityId)
                : [...prev, amenityId]
        );
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.fieldName.trim()) {
            newErrors.fieldName = 'Field name is required';
        }
        if (!formData.location.trim()) {
            newErrors.location = 'Location is required';
        }
        if (!formData.defaultPricePerHour || parseFloat(formData.defaultPricePerHour) <= 0) {
            newErrors.defaultPricePerHour = 'Valid price is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            await createMutation.mutateAsync({
                fieldName: formData.fieldName,
                description: formData.description || undefined,
                location: formData.location,
                latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
                longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
                defaultPricePerHour: parseFloat(formData.defaultPricePerHour),
                capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
                amenityIds: selectedAmenities.length > 0 ? selectedAmenities : undefined,
            });
            toast.success('Field created successfully! Waiting for moderator approval.');
            if (onSuccess) {
                onSuccess();
            } else {
                navigate('/owner/fields');
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Failed to create field');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-emerald-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Register New Field</h2>
                    <p className="text-gray-500">Add your football field to the platform</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                    label="Field Name"
                    value={formData.fieldName}
                    onChange={(e) => handleChange('fieldName', e.target.value)}
                    placeholder="e.g., Central Park Field A"
                    error={errors.fieldName}
                    required
                />

                <FormInput
                    label="Location"
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    placeholder="Full address..."
                    error={errors.location}
                    required
                />

                <FormInput
                    label="Price per Hour"
                    type="number"
                    step="0.01"
                    value={formData.defaultPricePerHour}
                    onChange={(e) => handleChange('defaultPricePerHour', e.target.value)}
                    placeholder="0.00"
                    error={errors.defaultPricePerHour}
                    required
                />

                <FormInput
                    label="Capacity (players)"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => handleChange('capacity', e.target.value)}
                    placeholder="e.g., 22"
                />

                <FormInput
                    label="Latitude"
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => handleChange('latitude', e.target.value)}
                    placeholder="e.g., 10.762622"
                />

                <FormInput
                    label="Longitude"
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => handleChange('longitude', e.target.value)}
                    placeholder="e.g., 106.660172"
                />
            </div>

            <FormTextarea
                label="Description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Describe your field, facilities, parking, etc..."
                maxLength={1000}
                rows={4}
            />

            {amenities && amenities.length > 0 && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Amenities</label>
                    <div className="flex flex-wrap gap-2">
                        {amenities.map(amenity => (
                            <button
                                key={amenity.amenityId}
                                type="button"
                                onClick={() => toggleAmenity(amenity.amenityId)}
                                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${selectedAmenities.includes(amenity.amenityId)
                                    ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                                    : 'bg-gray-100 text-gray-600 border-gray-200'
                                    } border`}
                            >
                                {amenity.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800">
                    <strong>Note:</strong> Your field will be reviewed by a moderator before it becomes visible. This usually takes 1-2 business days.
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
                    Create Field
                </Button>
            </div>
        </form>
    );
};

export default CreateFieldForm;
