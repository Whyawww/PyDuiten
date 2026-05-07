import { AlertTriangle, Loader2 } from 'lucide-react';
import React from 'react';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, isLoading }: ConfirmModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-sm shadow-2xl animate-slide-up relative">
                <div className="flex flex-col items-center text-center">
                    <div className="p-4 bg-red-50 text-red-500 rounded-full mb-4">
                        <AlertTriangle className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
                    <p className="text-sm text-gray-500 font-medium mb-8 leading-relaxed">{message}</p>
                </div>

                <div className="flex items-center gap-3 w-full">
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="flex-1 py-3.5 px-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex-1 py-3.5 px-4 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 hover:shadow-lg hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Hapus'}
                    </button>
                </div>
            </div>
        </div>
    );
};