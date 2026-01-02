import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
    ({ label, error, helperText, className, id, ...props }, ref) => {
        const inputId = id || props.name;

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-slate-700 mb-1"
                    >
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={clsx(
                        'w-full px-4 py-2.5 rounded-lg border transition-colors duration-200',
                        'focus:outline-none focus:ring-2 focus:ring-offset-0',
                        'disabled:bg-slate-100 disabled:cursor-not-allowed',
                        error
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                            : 'border-slate-200 focus:border-primary-500 focus:ring-primary-200',
                        className
                    )}
                    {...props}
                />
                {error && (
                    <p className="mt-1 text-sm text-red-500">{error}</p>
                )}
                {helperText && !error && (
                    <p className="mt-1 text-sm text-slate-500">{helperText}</p>
                )}
            </div>
        );
    }
);

FormInput.displayName = 'FormInput';

export default FormInput;
