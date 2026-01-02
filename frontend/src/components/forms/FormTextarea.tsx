import { forwardRef, useState } from 'react';
import { clsx } from 'clsx';

export interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
    maxLength?: number;
    showCharCount?: boolean;
}

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
    ({ label, error, helperText, maxLength, showCharCount = true, className, id, onChange, value, ...props }, ref) => {
        const textareaId = id || props.name;
        const [charCount, setCharCount] = useState((value as string)?.length || 0);

        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setCharCount(e.target.value.length);
            onChange?.(e);
        };

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={textareaId}
                        className="block text-sm font-medium text-slate-700 mb-1"
                    >
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={textareaId}
                    value={value}
                    onChange={handleChange}
                    maxLength={maxLength}
                    className={clsx(
                        'w-full px-4 py-2.5 rounded-lg border resize-none',
                        'transition-colors duration-200',
                        'focus:outline-none focus:ring-2 focus:ring-offset-0',
                        'disabled:bg-slate-100 disabled:cursor-not-allowed',
                        error
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                            : 'border-slate-200 focus:border-primary-500 focus:ring-primary-200',
                        className
                    )}
                    rows={props.rows || 4}
                    {...props}
                />
                <div className="flex justify-between mt-1">
                    <div>
                        {error && (
                            <p className="text-sm text-red-500">{error}</p>
                        )}
                        {helperText && !error && (
                            <p className="text-sm text-slate-500">{helperText}</p>
                        )}
                    </div>
                    {showCharCount && maxLength && (
                        <p className={clsx(
                            'text-sm',
                            charCount >= maxLength ? 'text-red-500' : 'text-slate-400'
                        )}>
                            {charCount}/{maxLength}
                        </p>
                    )}
                </div>
            </div>
        );
    }
);

FormTextarea.displayName = 'FormTextarea';

export default FormTextarea;
