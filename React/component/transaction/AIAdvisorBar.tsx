import { AlertTriangle, CheckCircle2, Flame } from 'lucide-react';

export const AIAdvisorBar = ({ income, expense }: { income: number, expense: number }) => {
    const ratio = income === 0 ? (expense > 0 ? 1 : 0) : expense / income;

    let status = {
        color: 'bg-green-500 dark:bg-green-600',
        icon: <CheckCircle2 className="w-6 h-6 text-white" />,
        message: 'Aman terkendali bro! Keuangan sehat, pertahankan!'
    };

    if (ratio >= 0.8 || (income === 0 && expense > 0)) {
        status = {
            color: 'bg-red-500 dark:bg-red-600',
            icon: <Flame className="w-6 h-6 text-white" />,
            message: 'WADUH BONCOS! Pengeluaran lu mepet/lebih dari pemasukan. Ngerem jajan woy!'
        };
    } else if (ratio >= 0.5) {
        status = {
            color: 'bg-yellow-500 dark:bg-yellow-600',
            icon: <AlertTriangle className="w-6 h-6 text-white" />,
            message: 'Hati-hati cuy! Pengeluaran lumayan gede nih. Kurangin jajan gak penting.'
        };
    }

    if (income === 0 && expense === 0) return null;

    return (
        <div className={`fixed bottom-[68px] md:bottom-0 left-0 md:left-64 right-0 ${status.color} shadow-[0_-4px_20px_rgba(0,0,0,0.15)] z-40 px-6 py-4 transition-colors duration-500 animate-slide-up`}>
            <div className="flex items-center gap-4 max-w-4xl mx-auto">
                <div className="p-2 bg-white/20 rounded-full animate-bounce">
                    {status.icon}
                </div>
                <div className="flex-1 text-white">
                    <h4 className="font-black text-sm md:text-base tracking-tight">Gemini AI Advisor</h4>
                    <p className="text-xs md:text-sm font-medium opacity-90">{status.message}</p>
                </div>
            </div>
        </div>
    );
};