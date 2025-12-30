import { useState, useEffect } from 'react';
import { MapPin, Save } from 'lucide-react';
import { FormInput, FormTextarea } from './';
import { Button, LoadingSpinner } from '../common';
import { useUpdateField, useField, useAllAmenities, useFieldAmenities, useUpdateFieldAmenities } from '../../api/hooks/useField';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface EditFieldFormProps {
    fieldId: number;
    onSuccess?: () => void;
}

const EditFieldForm: React.FC<EditFieldFormProps> = ({ fieldId, onSuccess }) => {
    const navigate = useNavigate();
    const { data: field, isLoading } = useField(fieldId);
    const { data: allAmenities } = useAllAmenities();
    const { data: fieldAmenities } = useFieldAmenities(fieldId);
    const updateMutation = useUpdateField();
    const updateAmenitiesMutation = useUpdateFieldAmenities();

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

    useEffect(() => {
        if (field) {
            setFormData({
                fieldName: field.fieldName || '',
                description: field.description || '',
                location: field.location || '',
                latitude: field.latitude?.toString() || '',
                longitude: field.longitude?.toString() || '',
                defaultPricePerHour: field.defaultPricePerHour?.toString() || '',
                capacity: field.capacity?.toString() || '',
            });
        }
    }, [field]);

    useEffect(() => {
        if (fieldAmenities) {
            setSelectedAmenities(fieldAmenities.map(a => a.amenityId));
        }
    }, [fieldAmenities]);

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
            await updateMutation.mutateAsync({
                fieldId,
                fieldName: formData.fieldName,
                description: formData.description || undefined,
                location: formData.location,
                latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
                longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
                defaultPricePerHour: parseFloat(formData.defaultPricePerHour),
                capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
            });

            // Update amenities separately
            await updateAmenitiesMutation.mutateAsync({
                fieldId,
                amenityIds: selectedAmenities,
            });

            toast.success('Field updated successfully!');
            onSuccess?.();
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Failed to update field');
        }
    };

    if (isLoading) {
        return <LoadingSpinner text="Loading field details..." />;
    }

    if (!field) {
        return <div className="text-center py-8 text-gray-500">Field not found</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-emerald-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Edit Field</h2>
                    <p className="text-gray-500">Update your field information</p>
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

            {allAmenities && allAmenities.length > 0 && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Amenities</label>
                    <div className="flex flex-wrap gap-2">
                        {allAmenities.map(amenity => (
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

            <div className="flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
                    Cancel
                </Button>
                <Button
                    type="submit"
                    isLoading={updateMutation.isPending || updateAmenitiesMutation.isPending}
                    leftIcon={<Save className="w-4 h-4" />}
                >
                    Save Changes
                </Button>
            </div>
        </form>
    );
};

export default EditFieldForm;
