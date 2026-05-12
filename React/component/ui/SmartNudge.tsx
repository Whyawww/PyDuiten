import { useState, useEffect } from 'react';
import { Lightbulb, Loader2 } from 'lucide-react';
import { apiFetch } from '../../src/utils/api';

interface SmartNudgeProps {
    income: number;
    expense: number;
}

export const SmartNudge = ({ income, expense }: SmartNudgeProps) => {
    const [nudge, setNudge] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (income === 0 && expense === 0) return;

        const fetchNudge = async () => {
            setIsLoading(true);
            try {
                const res = await apiFetch<{ status: string, data: { nudge: string } }>(
                    `/ai/smart-nudge?income=${income}&expense=${expense}`
                );
                setNudge(res.data.nudge);
            } catch {
                setNudge('Jangan lupa siapin dana darurat ya cuy, jaga-jaga!');
            } finally {
                setIsLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchNudge, 1500);
        return () => clearTimeout(timeoutId);
    }, [income, expense]);

    if (income === 0 && expense === 0) return null;

    return (
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border border-indigo-100 dark:border-indigo-800/30 rounded-3xl p-5 mb-8 flex items-start md:items-center gap-4 animate-slide-up shadow-sm">
            <div className="p-3 bg-indigo-500 text-white rounded-2xl shadow-sm flex-shrink-0 animate-pulse">
                <Lightbulb className="w-6 h-6" />
            </div>
            <div className="flex-1">
                <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-100 flex items-center gap-2">
                    Smart Nudge
                    {isLoading && <Loader2 className="w-3 h-3 animate-spin text-indigo-500" />}
                </h3>
                <p className="text-sm font-medium text-indigo-800/80 dark:text-indigo-200/80 mt-1 leading-relaxed">
                    {isLoading ? 'Sedang menganalisis rasio keuangan lu...' : nudge}
                </p>
            </div>
        </div>
    );
};