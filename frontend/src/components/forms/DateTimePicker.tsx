import { forwardRef } from 'react';
import { clsx } from 'clsx';
import { Calendar, Clock } from 'lucide-react';

export interface DateTimePickerProps {
    label?: string;
    error?: string;
    helperText?: string;
    type?: 'date' | 'time' | 'datetime-local';
    value?: string;
    onChange?: (value: string) => void;
    min?: string;
    max?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    id?: string;
    name?: string;
}

const DateTimePicker = forwardRef<HTMLInputElement, DateTimePickerProps>(
    ({
        label,
        error,
        helperText,
        type = 'datetime-local',
        value,
        onChange,
        min,
        max,
        required,
        disabled,
        className,
        id,
        name
    }, ref) => {
        const inputId = id || name;

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange?.(e.target.value);
        };

        const Icon = type === 'time' ? Clock : Calendar;

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                <div className="relative">
                    <input
                        ref={ref}
                        type={type}
                        id={inputId}
                        name={name}
                        value={value}
                        onChange={handleChange}
                        min={min}
                        max={max}
                        required={required}
                        disabled={disabled}
                        className={clsx(
                            'w-full pl-10 pr-4 py-2.5 rounded-lg border',
                            'transition-colors duration-200',
                            'focus:outline-none focus:ring-2 focus:ring-offset-0',
                            'disabled:bg-gray-100 disabled:cursor-not-allowed',
                            error
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                                : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-200',
                            className
                        )}
                    />
                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
                {error && (
                    <p className="mt-1 text-sm text-red-500">{error}</p>
                )}
                {helperText && !error && (
                    <p className="mt-1 text-sm text-gray-500">{helperText}</p>
                )}
            </div>
        );
    }
);

DateTimePicker.displayName = 'DateTimePicker';

export default DateTimePicker;
