import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import FormInput from './FormInput';
import Button from '../common/Button';
import { useRegister } from '../../api/hooks/useAuth';
import { UserRole } from '../../types';
import toast from 'react-hot-toast';

interface RegisterFormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    roles: string[];
}

interface FormErrors {
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    roles?: string;
}

const roleOptions = [
    { value: UserRole.PLAYER, label: 'Player', description: 'Join teams and play matches' },
    { value: UserRole.TEAM_LEADER, label: 'Team Leader', description: 'Create and manage teams' },
    { value: UserRole.FIELD_OWNER, label: 'Field Owner', description: 'List and manage football fields' },
];

const RegistrationForm: React.FC = () => {
    const navigate = useNavigate();
    const registerMutation = useRegister();

    const [formData, setFormData] = useState<RegisterFormData>({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        roles: [UserRole.PLAYER],
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
            newErrors.username = 'Username can only contain letters, numbers, and underscores';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (formData.roles.length === 0) {
            newErrors.roles = 'Please select at least one role';
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

    const handleRoleChange = (role: string) => {
        setFormData(prev => {
            let newRoles = prev.roles.includes(role)
                ? prev.roles.filter(r => r !== role)
                : [...prev.roles, role];

            // Team Leader requires Player role
            if (newRoles.includes(UserRole.TEAM_LEADER) && !newRoles.includes(UserRole.PLAYER)) {
                newRoles.push(UserRole.PLAYER);
            }
            // Prevent removing Player if Team Leader is selected
            if (role === UserRole.PLAYER && !newRoles.includes(UserRole.PLAYER) && prev.roles.includes(UserRole.TEAM_LEADER)) {
                return prev; // Don't allow removing Player when Team Leader is selected
            }

            return { ...prev, roles: newRoles };
        });
        if (errors.roles) {
            setErrors(prev => ({ ...prev, roles: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            await registerMutation.mutateAsync({
                username: formData.username,
                email: formData.email,
                password: formData.password,
                roles: formData.roles,
            });
            toast.success('Account created successfully!');
            navigate('/dashboard');
        } catch (error: unknown) {
            const err = error as { response?: { data?: { detail?: string; message?: string } } };
            const message = err.response?.data?.detail || err.response?.data?.message || 'Registration failed. Please try again.';
            toast.error(message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
                <p className="mt-2 text-gray-600">
                    Join the Kick-off community today
                </p>
            </div>

            <FormInput
                label="Username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                error={errors.username}
                placeholder="Choose a username"
                autoComplete="username"
                required
            />

            <FormInput
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="Enter your email"
                autoComplete="email"
                required
            />

            <div className="relative">
                <FormInput
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    required
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
            </div>

            <div className="relative">
                <FormInput
                    label="Confirm Password"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                    placeholder="Confirm your password"
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

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select your role(s) <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                    {roleOptions.map(role => (
                        <label
                            key={role.value}
                            className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.roles.includes(role.value)
                                ? 'border-emerald-500 bg-emerald-50'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <input
                                type="checkbox"
                                checked={formData.roles.includes(role.value)}
                                onChange={() => handleRoleChange(role.value)}
                                className="mt-1 h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                            />
                            <div className="ml-3">
                                <span className="font-medium text-gray-900">{role.label}</span>
                                <p className="text-sm text-gray-500">{role.description}</p>
                            </div>
                        </label>
                    ))}
                </div>
                {errors.roles && (
                    <p className="mt-2 text-sm text-red-500">{errors.roles}</p>
                )}
            </div>

            <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={registerMutation.isPending}
                leftIcon={<UserPlus className="w-5 h-5" />}
            >
                Create Account
            </Button>

            <p className="text-center text-gray-600">
                Already have an account?{' '}
                <Link
                    to="/login"
                    className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                    Sign in
                </Link>
            </p>
        </form>
    );
};

export default RegistrationForm;
