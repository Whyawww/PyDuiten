import { useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Filter, Pencil, Trash2 } from 'lucide-react';
import type { TransactionItem } from './TransactionForm';
import { useTranslation } from 'react-i18next';

export const TransactionHistory = ({
    transactions,
    onEdit,
    onDelete
}: {
    transactions: TransactionItem[],
    onEdit: (trx: TransactionItem) => void,
    onDelete: (id: string) => void
}) => {
    const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
    const { t } = useTranslation();

    const formatRupiah = (angka: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
    };

    const filteredTransactions = transactions.filter((trx) => {
        if (filterType === 'all') return true;
        return trx.type === filterType;
    });

    if (transactions.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 animate-slide-up" style={{ animationDelay: '100ms' }}>
                <p className="text-gray-400 font-medium">{t('transaction.history_empty')}</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-800 dark:text-white">{t('transaction.history_title')}</h3>

                <div className="flex items-center gap-2 bg-surface/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-1.5">
                    <Filter className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as 'all' | 'income' | 'expense')}
                        className="bg-transparent text-xs font-bold text-gray-600 dark:text-gray-300 outline-none cursor-pointer"
                    >
                        <option value="all">{t('transaction.history_filter_all')}</option>
                        <option value="income">{t('transaction.history_filter_income')}</option>
                        <option value="expense">{t('transaction.history_filter_expense')}</option>
                    </select>
                </div>
            </div>

            <div className="space-y-3">
                {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((trx) => (
                        <div key={trx.id} className="group flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-2xl transition-all duration-300 border border-transparent hover:border-gray-100 dark:hover:border-gray-600 relative overflow-hidden">
                            <div className="flex items-center gap-4">
                                <div className={`p-2.5 rounded-xl ${trx.type === 'income' ? 'bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-500/10 text-red-500 dark:text-red-400'}`}>
                                    {trx.type === 'income' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-gray-200">{trx.note}</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[10px] font-bold px-2 py-0.5 bg-primary/10 text-primary rounded-md">
                                            {t(`categories.${trx.category || 'Lainnya'}`)}
                                        </span>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 border-l border-gray-200 dark:border-gray-600 pl-2">
                                            {new Date(trx.date).toLocaleDateString('id-ID')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <p className={`font-bold ${trx.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-gray-800 dark:text-gray-200'} transition-transform duration-300 group-hover:-translate-x-2`}>
                                    {trx.type === 'income' ? '+' : '-'}{formatRupiah(trx.amount)}
                                </p>

                                <div className="absolute right-3 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 flex items-center gap-1 bg-white dark:bg-gray-800 pl-2">
                                    <button onClick={() => onEdit(trx)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-colors">
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => onDelete(trx.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-4">
                        <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">{t('transaction.history_filter_empty')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};