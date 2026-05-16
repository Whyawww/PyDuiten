import {
    Wallet, TrendingUp, TrendingDown, AlertCircle, CheckCircle2, ShieldAlert, LineChart
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SummaryProps {
    data: { saldo: number; pemasukan: number; pengeluaran: number; }
}

export const SummaryCards = ({ data }: SummaryProps) => {
    const { saldo, pemasukan, pengeluaran } = data;
    const { t } = useTranslation();

    const formatRupiah = (angka: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency', currency: 'IDR', minimumFractionDigits: 0
        }).format(angka);
    };

    const ratio = pemasukan === 0 ? (pengeluaran > 0 ? 1 : 0) : pengeluaran / pemasukan;
    const percentageExpense = (ratio * 100).toFixed(0);

    let status = {
        label: t('dashboard_card.status_safe'),
        colorClass: 'bg-white/20 text-white',
        icon: <CheckCircle2 className="w-4 h-4 inline mr-1" />
    };

    if (ratio >= 0.8 || (pemasukan === 0 && pengeluaran > 0)) {
        status = {
            label: t('dashboard_card.status_danger'),
            colorClass: 'bg-red-500/60 text-white shadow-inner',
            icon: <ShieldAlert className="w-4 h-4 inline mr-1" />
        };
    } else if (ratio >= 0.5) {
        status = {
            label: t('dashboard_card.status_warning'),
            colorClass: 'bg-yellow-400/40 text-yellow-50',
            icon: <AlertCircle className="w-4 h-4 inline mr-1" />
        };
    }

    const today = new Date();
    const currentDay = today.getDate();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const remainingDays = daysInMonth - currentDay;

    const avgDailyExpense = currentDay > 0 ? pengeluaran / currentDay : 0;
    const projectedRemainingExpense = avgDailyExpense * remainingDays;
    const projectedBalance = saldo - projectedRemainingExpense;

    return (
        <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-primary rounded-3xl p-6 text-white shadow-lg animate-slide-up" style={{ animationDelay: '0ms' }}>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-white/80 font-medium text-sm">{t('dashboard_card.total_balance')}</p>
                            <h2 className="text-3xl font-black mt-1">{formatRupiah(saldo)}</h2>
                        </div>
                        <div className="p-3 bg-white/20 rounded-2xl">
                            <Wallet className="w-6 h-6" />
                        </div>
                    </div>
                    <div className={`text-sm font-medium inline-flex items-center px-3 py-1.5 rounded-full transition-all duration-300 ${status.colorClass}`}>
                        {status.icon} {status.label}
                    </div>
                </div>

                {/* Pemasukan */}
                <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl p-6 shadow-sm animate-slide-up" style={{ animationDelay: '100ms' }}>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">{t('dashboard_card.income')}</p>
                            <h2 className="text-2xl font-black text-gray-800 dark:text-white mt-1">{formatRupiah(pemasukan)}</h2>
                        </div>
                        <div className="p-3 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-2xl">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                    </div>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">
                        {pemasukan > 0 ? t('dashboard_card.income_good') : t('dashboard_card.income_empty')}
                    </p>
                </div>

                {/* Pengeluaran */}
                <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl p-6 shadow-sm animate-slide-up" style={{ animationDelay: '200ms' }}>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">{t('dashboard_card.expense')}</p>
                            <h2 className="text-2xl font-black text-gray-800 dark:text-white mt-1">{formatRupiah(pengeluaran)}</h2>
                        </div>
                        <div className="p-3 bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 rounded-2xl">
                            <TrendingDown className="w-6 h-6" />
                        </div>
                    </div>
                    <p className="text-sm font-medium text-red-500 dark:text-red-400">
                        {pengeluaran > 0 ? t('dashboard_card.expense_bad', { percentage: percentageExpense }) : t('dashboard_card.expense_good')}
                    </p>
                </div>
            </div>

            <div className="mt-6 border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-slide-up transition-colors" style={{ animationDelay: '300ms' }}>
                <div className="p-3 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-2xl flex-shrink-0">
                    <LineChart className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">{t('dashboard_card.ai_projection')}</h3>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                        {t('dashboard_card.projection_desc_1', { day: currentDay })}
                        <strong className={`font-black ${projectedBalance > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                            {formatRupiah(projectedBalance)}
                        </strong>.
                        {projectedBalance <= 0 && t('dashboard_card.projection_desc_2')}
                    </p>
                </div>
            </div>
        </div>
    );
};