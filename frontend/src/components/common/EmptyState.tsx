import type { ReactNode } from 'react';
import { clsx } from 'clsx';
import { Inbox } from 'lucide-react';
import Button from './Button';

interface EmptyStateProps {
    icon?: ReactNode;
    title: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
    className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    icon,
    title,
    description,
    actionLabel,
    onAction,
    className,
}) => {
    return (
        <div
            className={clsx(
                'flex flex-col items-center justify-center py-12 px-4 text-center',
                className
            )}
        >
            <div className="text-slate-300 mb-4">
                {icon || <Inbox className="w-16 h-16" />}
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {title}
            </h3>
            {description && (
                <p className="text-slate-500 max-w-sm mb-6">
                    {description}
                </p>
            )}
            {actionLabel && onAction && (
                <Button onClick={onAction} variant="primary">
                    {actionLabel}
                </Button>
            )}
        </div>
    );
};

export default EmptyState;
