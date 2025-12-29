import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import Button from './Button';
import { useLogout } from '../../api/hooks/useAuth';
import toast from 'react-hot-toast';

interface LogoutButtonProps {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    showIcon?: boolean;
    showText?: boolean;
    className?: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
    variant = 'ghost',
    size = 'md',
    showIcon = true,
    showText = true,
    className,
}) => {
    const navigate = useNavigate();
    const logoutMutation = useLogout();

    const handleLogout = async () => {
        try {
            await logoutMutation.mutateAsync();
            toast.success('Logged out successfully');
            navigate('/login');
        } catch (error) {
            // Even if the API call fails, we've cleared local state
            // so just navigate to login
            navigate('/login');
        }
    };

    return (
        <Button
            variant={variant}
            size={size}
            onClick={handleLogout}
            isLoading={logoutMutation.isPending}
            leftIcon={showIcon ? <LogOut className="w-4 h-4" /> : undefined}
            className={className}
        >
            {showText && 'Logout'}
        </Button>
    );
};

export default LogoutButton;
