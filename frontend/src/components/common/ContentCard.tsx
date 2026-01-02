import React from 'react';
import { clsx } from 'clsx';

export interface ContentCardProps {
    children: React.ReactNode;
    /** Optional card title displayed in header */
    title?: string;
    /** Optional action element in header (button, link) */
    action?: React.ReactNode;
    /** Additional CSS classes for the card container */
    className?: string;
    /** Remove default padding from content area */
    noPadding?: boolean;
}

const ContentCard: React.FC<ContentCardProps> = ({
    children,
    title,
    action,
    className,
    noPadding = false,
}) => {
    const hasHeader = title || action;

    return (
        <div
            className={clsx(
                'bg-white rounded-xl shadow-sm border border-slate-100',
                className
            )}
        >
            {hasHeader && (
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                    {title && (
                        <h2 className="text-lg font-semibold text-slate-900">
                            {title}
                        </h2>
                    )}
                    {action && <div>{action}</div>}
                </div>
            )}
            <div className={clsx(!noPadding && 'p-6')}>{children}</div>
        </div>
    );
};

export default ContentCard;
