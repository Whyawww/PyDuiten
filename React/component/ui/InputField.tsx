import { InputHTMLAttributes, ReactNode } from 'react';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon?: ReactNode;
    error?: string;
}

export const InputField = ({ label, icon, error, ...props }: InputFieldProps) => {
    return (
        <div className="flex flex-col gap-1.5 mb-4 w-full">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-400 ml-1">
                {label}
            </label>
            <div className="relative flex items-center">
                {icon && (
                    <div className="absolute left-4 text-gray-400 dark:text-gray-500">
                        {icon}
                    </div>
                )}
                <input
                    {...props}
                    className={`w-full bg-surface/50 dark:bg-gray-900/50 border ${error ? 'border-red-500' : 'border-gray-200'} dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-2xl px-4 py-3.5 focus:outline-none focus:border-primary dark:focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 shadow-sm ${icon ? 'pl-11' : ''}`}
                />
            </div>
            {error && (
                <span className="text-[10px] font-bold text-red-500 ml-1 animate-slide-up">
                    {error}
                </span>
            )}
        </div>
    );
};