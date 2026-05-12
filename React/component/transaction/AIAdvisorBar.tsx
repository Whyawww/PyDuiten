import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle2, Flame, Loader2, Bot } from 'lucide-react';
import { apiFetch, ApiError } from '../../src/utils/api';

export const AIAdvisorBar = ({ income, expense }: { income: number, expense: number }) => {
    const [advice, setAdvice] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const ratio = income === 0 ? (expense > 0 ? 1 : 0) : expense / income;

    let status = {
        color: 'bg-green-500 dark:bg-green-600',
        icon: <CheckCircle2 className="w-6 h-6 text-white" />,
    };

    if (ratio >= 0.8 || (income === 0 && expense > 0)) {
        status = {
            color: 'bg-red-500 dark:bg-red-600',
            icon: <Flame className="w-6 h-6 text-white" />,
        };
    } else if (ratio >= 0.5) {
        status = {
            color: 'bg-yellow-500 dark:bg-yellow-600',
            icon: <AlertTriangle className="w-6 h-6 text-white" />,
        };
    }

    useEffect(() => {
        if (income === 0 && expense === 0) return;

        const fetchAdvice = async () => {
            setIsLoading(true);
            try {
                const res = await apiFetch<{ status: string, data: { advice: string } }>(
                    `/ai/advice?income=${income}&expense=${expense}`
                );
                setAdvice(res.data.advice);
            } catch (error: unknown) {
                if (error instanceof ApiError && error.status === 429) {
                    setAdvice('Buset cuy nanyanya kecepatan, napas dulu semenit!');
                } else {
                    setAdvice('Waduh, AI lagi pusing mikirin duit lu. Coba refresh lagi ya...');
                }
            } finally {
                setIsLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchAdvice, 1000);
        return () => clearTimeout(timeoutId);

    }, [income, expense]);

    if (income === 0 && expense === 0) return null;

    return (
        <div className={`fixed bottom-[68px] md:bottom-0 left-0 md:left-64 right-0 ${status.color} shadow-[0_-4px_20px_rgba(0,0,0,0.15)] z-40 px-6 py-4 transition-colors duration-500 animate-slide-up`}>
            <div className="flex items-center gap-4 max-w-4xl mx-auto">
                <div className="p-2 bg-white/20 rounded-full animate-bounce">
                    {isLoading ? <Bot className="w-6 h-6 text-white animate-pulse" /> : status.icon}
                </div>
                <div className="flex-1 text-white">
                    <h4 className="font-black text-sm md:text-base tracking-tight flex items-center gap-2">
                        Gemini AI Advisor
                        {isLoading && <Loader2 className="w-3 h-3 animate-spin" />}
                    </h4>
                    <p className="text-xs md:text-sm font-medium opacity-90 transition-all">
                        {isLoading ? 'Lagi mikir kata-kata yang pas buat lu...' : advice}
                    </p>
                </div>
            </div>
        </div>
    );
};