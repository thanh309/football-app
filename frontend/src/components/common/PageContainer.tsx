import React from 'react';
import { clsx } from 'clsx';

export interface PageContainerProps {
    children: React.ReactNode;
    /** Controls max-width: sm=max-w-2xl, md=max-w-4xl, lg=max-w-6xl (default), xl=max-w-7xl, full=none */
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    className?: string;
}

const maxWidthClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: '',
};

const PageContainer: React.FC<PageContainerProps> = ({
    children,
    maxWidth = 'lg',
    className,
}) => {
    return (
        <div
            className={clsx(
                maxWidthClasses[maxWidth],
                'mx-auto px-4 py-8',
                className
            )}
        >
            {children}
        </div>
    );
};

export default PageContainer;
