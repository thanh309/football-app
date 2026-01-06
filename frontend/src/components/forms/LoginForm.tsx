import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import FormInput from './FormInput';
import Button from '../common/Button';
import { useLogin } from '../../api/hooks/useAuth';
import toast from 'react-hot-toast';

interface LoginFormData {
    username: string;
    password: string;
}

interface FormErrors {
    username?: string;
    password?: string;
}

const LoginForm: React.FC = () => {
    const navigate = useNavigate();
    const loginMutation = useLogin();

    const [formData, setFormData] = useState<LoginFormData>({
        username: '',
        password: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [showPassword, setShowPassword] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            await loginMutation.mutateAsync(formData);
            toast.success('Welcome back!');
            navigate('/dashboard');
        } catch (error: unknown) {
            const err = error as { response?: { data?: { detail?: string; message?: string } } };
            const message = err.response?.data?.detail || err.response?.data?.message || 'Invalid username or password';
            toast.error(message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
                <p className="mt-2 text-gray-600">
                    Sign in to your account to continue
                </p>
            </div>

            <FormInput
                label="Username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                error={errors.username}
                placeholder="Enter your username"
                autoComplete="username"
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
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                >
                    {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                    ) : (
                        <Eye className="w-5 h-5" />
                    )}
                </button>
            </div>

            <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={loginMutation.isPending}
                leftIcon={<LogIn className="w-5 h-5" />}
            >
                Sign In
            </Button>

            <p className="text-center text-gray-600">
                Don't have an account?{' '}
                <Link
                    to="/register"
                    className="text-primary-600 hover:text-primary-700 font-medium"
                >
                    Sign up
                </Link>
            </p>
        </form>
    );
};

export default LoginForm;
