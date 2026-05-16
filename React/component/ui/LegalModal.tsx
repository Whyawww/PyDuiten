import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LegalModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: React.ReactNode;
}

export const LegalModal = ({ isOpen, onClose, title, content }: LegalModalProps) => {
    const { t } = useTranslation();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
            <div className="bg-white dark:bg-gray-900 w-full max-w-2xl max-h-[80vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 dark:border-gray-800 animate-slide-up">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm sticky top-0">
                    <h2 className="text-xl font-black text-gray-800 dark:text-white tracking-tight">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors text-gray-400"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 overflow-y-auto text-gray-600 dark:text-gray-400 text-sm leading-relaxed space-y-4 custom-scrollbar">
                    {content}
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 text-center">
                    <button
                        onClick={onClose}
                        className="bg-primary text-white font-bold px-8 py-2.5 rounded-xl hover:shadow-lg active:scale-95 transition-all"
                    >
                        {t('legal.btn_understand')}
                    </button>
                </div>
            </div>
        </div>
    );
};