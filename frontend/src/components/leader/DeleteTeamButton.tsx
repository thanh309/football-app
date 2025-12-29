import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button, ConfirmationModal } from '../common';
import { useDeleteTeam } from '../../api/hooks/useTeam';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface DeleteTeamButtonProps {
    teamId: number;
    teamName?: string;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    redirectTo?: string;
}

const DeleteTeamButton: React.FC<DeleteTeamButtonProps> = ({
    teamId,
    teamName,
    variant = 'danger',
    size = 'md',
    redirectTo = '/leader/teams',
}) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const navigate = useNavigate();
    const deleteMutation = useDeleteTeam();

    const handleDelete = async () => {
        try {
            await deleteMutation.mutateAsync(teamId);
            toast.success(teamName ? `${teamName} has been deleted` : 'Team deleted successfully');
            setShowConfirm(false);
            navigate(redirectTo);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            const message = err.response?.data?.message || 'Failed to delete team';
            toast.error(message);
        }
    };

    return (
        <>
            <Button
                variant={variant}
                size={size}
                onClick={() => setShowConfirm(true)}
                leftIcon={<Trash2 className="w-4 h-4" />}
            >
                Delete Team
            </Button>

            <ConfirmationModal
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={handleDelete}
                title="Delete Team?"
                message={
                    <>
                        <p className="mb-2">
                            Are you sure you want to delete{' '}
                            <strong>{teamName || 'this team'}</strong>?
                        </p>
                        <p className="text-red-600 font-medium">
                            This action cannot be undone. All team data, roster information, and match history will be permanently removed.
                        </p>
                    </>
                }
                confirmLabel="Delete Team"
                variant="danger"
                isLoading={deleteMutation.isPending}
            />
        </>
    );
};

export default DeleteTeamButton;
