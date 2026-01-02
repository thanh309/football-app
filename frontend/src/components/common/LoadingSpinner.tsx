import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    fullScreen?: boolean;
    text?: string;
    className?: string;
}

const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    fullScreen = false,
    text,
    className,
}) => {
    const spinner = (
        <div className={clsx('flex flex-col items-center justify-center gap-3', className)}>
            <Loader2
                className={clsx(
                    'animate-spin text-primary-600',
                    sizeMap[size]
                )}
            />
            {text && (
                <p className="text-sm text-slate-600 animate-pulse">{text}</p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                {spinner}
            </div>
        );
    }

    return spinner;
};

export default LoadingSpinner;
