import { ArrowDownLeft, ArrowUpRight, Clock } from 'lucide-react';
import type { TransactionItem } from '../transaction/TransactionForm';
import { useTranslation } from 'react-i18next';

export const RecentTransactions = ({ transactions }: { transactions: TransactionItem[] }) => {
    const recentTrx = transactions.slice(0, 5);
    const { t } = useTranslation();

    const formatRupiah = (angka: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);

    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl p-6 shadow-sm min-h-[350px] flex flex-col animate-slide-up" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-blue-50 dark:bg-blue-500/10 text-blue-500 dark:text-blue-400 rounded-xl">
                    <Clock className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-800 dark:text-white">{t('dashboard_recent.title')}</h3>
                </div>
            </div>

            {recentTrx.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-gray-400 dark:text-gray-500 font-medium text-center text-sm" dangerouslySetInnerHTML={{ __html: t('dashboard_recent.empty') }} />
                </div>
            ) : (
                <div className="space-y-4">
                    {recentTrx.map((trx) => (
                        <div key={trx.id} className="flex items-center justify-between pb-4 border-b border-gray-50 dark:border-gray-700/50 last:border-0 last:pb-0">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-xl ${trx.type === 'income' ? 'bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-500/10 text-red-500 dark:text-red-400'}`}>
                                    {trx.type === 'income' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-gray-800 dark:text-gray-200 truncate max-w-[100px] sm:max-w-[150px]">{trx.note}</p>
                                    <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500">{new Date(trx.date).toLocaleDateString('id-ID')}</p>
                                </div>
                            </div>
                            <p className={`font-bold text-sm ${trx.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-gray-800 dark:text-gray-200'}`}>
                                {trx.type === 'income' ? '+' : '-'}{formatRupiah(trx.amount)}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};