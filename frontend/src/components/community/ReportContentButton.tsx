import { Flag } from 'lucide-react';
import { Button } from '../common';
import { useState } from 'react';
import ReportForm from './ReportForm';

interface ReportContentButtonProps {
    contentId: number;
    contentType: 'Post' | 'Comment' | 'User';
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg';
}

const ReportContentButton: React.FC<ReportContentButtonProps> = ({
    contentId,
    contentType,
    variant = 'ghost',
    size = 'sm',
}) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <Button
                variant={variant}
                size={size}
                onClick={() => setShowModal(true)}
                leftIcon={<Flag className="w-4 h-4" />}
            >
                Report
            </Button>

            <ReportForm
                contentId={contentId}
                contentType={contentType}
                isOpen={showModal}
                onClose={() => setShowModal(false)}
            />
        </>
    );
};

export default ReportContentButton;
