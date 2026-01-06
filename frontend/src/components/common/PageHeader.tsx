import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { clsx } from 'clsx';

export interface PageHeaderProps {
    /** Page title */
    title: string;
    /** Optional subtitle displayed below title */
    subtitle?: React.ReactNode;
    /** Optional back navigation link */
    backLink?: {
        label: string;
        to: string;
    };
    /** Optional action element (button, link) displayed on the right */
    action?: React.ReactNode;
    /** Additional CSS classes */
    className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    subtitle,
    backLink,
    action,
    className,
}) => {
    return (
        <div className={clsx('mb-8', className)}>
            {backLink && (
                <Link
                    to={backLink.to}
                    className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-4 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {backLink.label}
                </Link>
            )}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-left">
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                        {title}
                    </h1>
                    {subtitle && (
                        <div className="text-slate-600 mt-1">{subtitle}</div>
                    )}
                </div>
                {action && <div className="flex-shrink-0">{action}</div>}
            </div>
        </div>
    );
};

export default PageHeader;
