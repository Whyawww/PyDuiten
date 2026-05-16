import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity } from 'lucide-react';
import type { TransactionItem } from '../transaction/TransactionForm';
import { useThemeStore } from '../../src/store/useThemeStore';
import { useTranslation } from 'react-i18next';

export const CashFlowChart = ({ transactions }: { transactions: TransactionItem[] }) => {
    const theme = useThemeStore((state) => state.theme);
    const { t, i18n } = useTranslation();

    const chartData = useMemo(() => {
        const sortedTransactions = [...transactions].reverse();
        const currentLocale = i18n.language === 'id' ? 'id-ID' : 'en-US';

        const grouped = sortedTransactions.reduce((acc, trx) => {
            const dateStr = new Date(trx.date).toLocaleDateString(currentLocale, { day: 'numeric', month: 'short' });

            if (!acc[dateStr]) acc[dateStr] = { date: dateStr, income: 0, expense: 0 };

            if (trx.type === 'income') acc[dateStr].income += trx.amount;
            else acc[dateStr].expense += trx.amount;

            return acc;
        }, {} as Record<string, { date: string; income: number; expense: number }>);

        return Object.values(grouped);
    }, [transactions, i18n.language]);

    const formatRupiah = (value: number) =>
        new Intl.NumberFormat('id-ID', { notation: 'compact', maximumFractionDigits: 1 }).format(value);

    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl p-6 shadow-sm lg:col-span-2 min-h-[350px] flex flex-col animate-slide-up" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                    <Activity className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-800 dark:text-white">{t('dashboard.chart_title')}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{t('dashboard.chart_subtitle')}</p>
                </div>
            </div>

            {chartData.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                    <Activity className="w-10 h-10 mb-2 opacity-50" />
                    <p className="font-medium text-sm">{t('dashboard.chart_empty')}</p>
                </div>
            ) : (
                <div className="flex-1 w-full h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#374151' : '#f3f4f6'} />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={formatRupiah} />

                            <Tooltip
                                cursor={{ fill: theme === 'dark' ? '#374151' : '#f9fafb' }}
                                contentStyle={{
                                    backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                                    color: theme === 'dark' ? '#f3f4f6' : '#1f2937',
                                    borderRadius: '16px',
                                    border: 'none',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                                }}
                                formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, '']}
                            />

                            <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />

                            <Bar dataKey="income" name={t('dashboard.type_income')} fill="#10B981" radius={[6, 6, 0, 0]} maxBarSize={50} />
                            <Bar dataKey="expense" name={t('dashboard.type_expense')} fill="#EF4444" radius={[6, 6, 0, 0]} maxBarSize={50} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};