import { InputHTMLAttributes, ReactNode } from 'react';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon?: ReactNode;
}

export const InputField = ({ label, icon, ...props }: InputFieldProps) => {
    return (
        <div className="flex flex-col gap-1.5 mb-4 w-full">
            <label className="text-sm font-semibold text-gray-700 ml-1">
                {label}
            </label>
            <div className="relative flex items-center">
                {icon && (
                    <div className="absolute left-4 text-gray-400">
                        {icon}
                    </div>
                )}
                <input
                    {...props}
                    className={`w-full bg-surface/50 border border-gray-200 text-gray-800 rounded-2xl px-4 py-3.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 shadow-sm ${icon ? 'pl-11' : ''}`}
                />
            </div>
        </div>
    );
};