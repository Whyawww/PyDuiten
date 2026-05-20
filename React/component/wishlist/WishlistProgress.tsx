import { CheckCircle2, Rocket } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ProgressProps {
    currentBalance: number;
    totalTarget: number;
    formatRp: (val: number) => string;
}

export const WishlistProgress = ({ currentBalance, totalTarget, formatRp }: ProgressProps) => {
    const { t } = useTranslation();
    const progressPercent = totalTarget > 0 ? Math.min(100, (Math.max(0, currentBalance) / totalTarget) * 100) : 0;
    const isReady = progressPercent >= 100 && totalTarget > 0;

    const radius = 100;
    const stroke = 20;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

    return (
        <section aria-label="Progress Tracker" className="lg:col-span-1 flex flex-col items-center bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl p-8 shadow-sm relative overflow-hidden animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10"></div>

            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-8 w-full text-center tracking-tight">
                Status Impian
            </h2>

            <div className="relative flex items-center justify-center mb-8">
                <svg height={radius * 2} width={radius * 2} className="transform -rotate-90 drop-shadow-md">
                    <circle stroke="currentColor" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx={radius} cy={radius} className="text-gray-100 dark:text-gray-700" />
                    <circle
                        stroke="currentColor" fill="transparent" strokeWidth={stroke}
                        strokeDasharray={circumference + ' ' + circumference}
                        style={{ strokeDashoffset, transition: 'stroke-dashoffset 2s cubic-bezier(0.4, 0, 0.2, 1)' }}
                        strokeLinecap="round" r={normalizedRadius} cx={radius} cy={radius}
                        className={isReady ? "text-green-500" : "text-primary"}
                    />
                </svg>

                <div className="absolute flex flex-col items-center justify-center text-center animate-fade-in" style={{ animationDelay: '500ms' }}>
                    <span className={`text-4xl font-black tracking-tighter ${isReady ? 'text-green-500' : 'text-primary'}`}>
                        {Math.floor(progressPercent)}%
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">
                        {isReady ? t('wishlist.progress_ready') : t('wishlist.progress_wait')}
                    </span>
                </div>
            </div>

            <div className="w-full space-y-3">
                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl flex justify-between items-center transition-colors">
                    <span className="text-xs font-semibold text-gray-500">{t('wishlist.available_balance')}</span>
                    <span className="font-black text-gray-800 dark:text-gray-200">{formatRp(currentBalance)}</span>
                </div>
                <div className={`p-4 rounded-2xl flex justify-between items-center border ${isReady ? 'bg-green-50/50 border-green-200 text-green-700' : 'bg-primary/5 border-primary/20 text-primary'} transition-all`}>
                    <span className="text-xs font-semibold flex items-center gap-1.5">
                        {isReady ? <CheckCircle2 className="w-4 h-4" /> : <Rocket className="w-4 h-4" />}
                        {t('wishlist.total_target')}
                    </span>
                    <span className="font-black">{formatRp(totalTarget)}</span>
                </div>
            </div>
        </section>
    );
};