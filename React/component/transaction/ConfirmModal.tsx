import { AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
    isLoading?: boolean;
    confirmText?: string;
    type?: 'warning' | 'success';
}

export const ConfirmModal = ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    isLoading,
    confirmText = 'Hapus',
    type = 'warning'
}: ConfirmModalProps) => {

    if (!isOpen) return null;

    const isSuccess = type === 'success';
    const Icon = isSuccess ? CheckCircle2 : AlertTriangle;
    const iconColorClass = isSuccess
        ? 'text-green-500 bg-green-50 dark:bg-green-500/10 dark:text-green-400'
        : 'text-primary bg-primary/10 dark:bg-primary/20';
    const buttonClass = isSuccess
        ? 'bg-green-500 hover:bg-green-600 shadow-green-500/30'
        : 'bg-primary hover:bg-primary/90 shadow-primary/30';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 w-full max-w-sm shadow-2xl animate-slide-up relative border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col items-center text-center">
                    <div className={`p-4 rounded-full mb-5 ${iconColorClass}`}>
                        <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2.5 tracking-tight">{title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-8 leading-relaxed px-2">{message}</p>
                </div>

                <div className="flex items-center gap-3 w-full">
                    {onCancel && (
                        <button
                            onClick={onCancel}
                            disabled={isLoading}
                            className="flex-1 py-3.5 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 active:scale-95"
                        >
                            Batal
                        </button>
                    )}
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`flex-1 py-3.5 px-4 text-white font-bold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 disabled:opacity-50 active:scale-95 ${buttonClass}`}
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};