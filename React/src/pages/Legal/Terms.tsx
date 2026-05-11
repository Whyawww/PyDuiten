import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TermsContent } from '../../../component/ui/LegalContent';

export const TermsPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-surface dark:bg-gray-950 p-6 md:p-12 animate-fade-in">
            <div className="max-w-3xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-primary font-bold mb-8 hover:opacity-80 transition-opacity"
                >
                    <ArrowLeft className="w-5 h-5" /> Balik Cuy
                </button>

                <h1 className="text-4xl font-black text-gray-800 dark:text-white mb-4 tracking-tight">
                    Syarat & Ketentuan
                </h1>

                <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <TermsContent />
                </div>

                <p className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500 font-medium">
                    Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>
        </div>
    );
};