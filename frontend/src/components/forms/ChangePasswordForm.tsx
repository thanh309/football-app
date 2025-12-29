import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import FormInput from './FormInput';
import Button from '../common/Button';
import { useChangePassword } from '../../api/hooks/useAuth';
import toast from 'react-hot-toast';

interface ChangePasswordFormData {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

interface FormErrors {
    currentPassword?: string;
    newPassword?: string;
    confirmNewPassword?: string;
}

const ChangePasswordForm: React.FC = () => {
    const changePasswordMutation = useChangePassword();

    const [formData, setFormData] = useState<ChangePasswordFormData>({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.currentPassword) {
            newErrors.currentPassword = 'Current password is required';
        }

        if (!formData.newPassword) {
            newErrors.newPassword = 'New password is required';
        } else if (formData.newPassword.length < 8) {
            newErrors.newPassword = 'Password must be at least 8 characters';
        } else if (formData.newPassword === formData.currentPassword) {
            newErrors.newPassword = 'New password must be different from current password';
        }

        if (!formData.confirmNewPassword) {
            newErrors.confirmNewPassword = 'Please confirm your new password';
        } else if (formData.newPassword !== formData.confirmNewPassword) {
            newErrors.confirmNewPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            await changePasswordMutation.mutateAsync({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            });
            toast.success('Password changed successfully!');
            // Reset form
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: '',
            });
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            const message = err.response?.data?.message || 'Failed to change password';
            toast.error(message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
            <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Change Password</h3>
                <p className="mt-1 text-sm text-gray-600">
                    Update your password to keep your account secure
                </p>
            </div>

            <div className="relative">
                <FormInput
                    label="Current Password"
                    name="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={formData.currentPassword}
                    onChange={handleChange}
                    error={errors.currentPassword}
                    placeholder="Enter current password"
                    autoComplete="current-password"
                    required
                />
                <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                >
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
            </div>

            <div className="relative">
                <FormInput
                    label="New Password"
                    name="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={handleChange}
                    error={errors.newPassword}
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    helperText="Password must be at least 8 characters"
                    required
                />
                <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
            </div>

            <div className="relative">
                <FormInput
                    label="Confirm New Password"
                    name="confirmNewPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmNewPassword}
                    onChange={handleChange}
                    error={errors.confirmNewPassword}
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                    required
                />
                <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
            </div>

            <Button
                type="submit"
                size="lg"
                isLoading={changePasswordMutation.isPending}
                leftIcon={<Lock className="w-5 h-5" />}
            >
                Update Password
            </Button>
        </form>
    );
};

export default ChangePasswordForm;
