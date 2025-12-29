import { User, Clock, Check, X } from 'lucide-react';
import { LoadingSpinner, EmptyState, Button } from '../common';
import { usePendingJoinRequests, useProcessJoinRequest } from '../../api/hooks/useTeam';
import toast from 'react-hot-toast';
import type { JoinRequest } from '../../types';

interface JoinRequestsListProps {
    teamId: number;
}

interface RequestCardProps {
    request: JoinRequest;
    onApprove: (requestId: number) => void;
    onReject: (requestId: number) => void;
    isProcessing: boolean;
}

const RequestCard: React.FC<RequestCardProps> = ({ request, onApprove, onReject, isProcessing }) => {
    return (
        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                    <p className="font-medium text-gray-900">Player #{request.playerId}</p>
                    <div className="flex items-center gap-2 mt-0.5 text-sm text-gray-500">
                        <Clock className="w-3.5 h-3.5" />
                        Request #{request.requestId}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onReject(request.requestId)}
                    disabled={isProcessing}
                    leftIcon={<X className="w-4 h-4" />}
                >
                    Reject
                </Button>
                <Button
                    size="sm"
                    onClick={() => onApprove(request.requestId)}
                    disabled={isProcessing}
                    leftIcon={<Check className="w-4 h-4" />}
                >
                    Approve
                </Button>
            </div>
        </div>
    );
};

const JoinRequestsList: React.FC<JoinRequestsListProps> = ({ teamId }) => {
    const { data: requests, isLoading, error } = usePendingJoinRequests(teamId);
    const processMutation = useProcessJoinRequest();

    const handleApprove = async (requestId: number) => {
        try {
            await processMutation.mutateAsync({ requestId, approve: true });
            toast.success('Player approved and added to team');
        } catch {
            toast.error('Failed to approve request');
        }
    };

    const handleReject = async (requestId: number) => {
        try {
            await processMutation.mutateAsync({ requestId, approve: false });
            toast.success('Request rejected');
        } catch {
            toast.error('Failed to reject request');
        }
    };

    if (isLoading) {
        return <LoadingSpinner text="Loading requests..." />;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">Failed to load requests</div>;
    }

    if (!requests || requests.length === 0) {
        return (
            <EmptyState
                title="No Pending Requests"
                description="There are no pending join requests at the moment."
            />
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Join Requests</h2>
                <span className="bg-amber-100 text-amber-700 text-sm px-2.5 py-1 rounded-full">
                    {requests.length} pending
                </span>
            </div>

            <div className="space-y-3">
                {requests.map(request => (
                    <RequestCard
                        key={request.requestId}
                        request={request}
                        onApprove={handleApprove}
                        onReject={handleReject}
                        isProcessing={processMutation.isPending}
                    />
                ))}
            </div>
        </div>
    );
};

export default JoinRequestsList;
