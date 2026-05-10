import { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import type { TransactionItem } from '../transaction/TransactionForm';

const COLORS = ['#e07a5f', '#81b29a', '#f2cc8f', '#3d405b', '#e09f3e', '#9c6644', '#606c38', '#bc4749', '#0077b6', '#00b4d8'];

export const CategoryPieChart = ({ transactions }: { transactions: TransactionItem[] }) => {
    const [type, setType] = useState<'expense' | 'income'>('expense');

    const chartData = useMemo(() => {
        const filtered = transactions.filter(trx => trx.type === type);

        const grouped = filtered.reduce((acc, trx) => {
            const cat = trx.category || 'Lainnya';
            acc[cat] = (acc[cat] || 0) + trx.amount;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(grouped)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
    }, [transactions, type]);

    const formatRupiah = (value: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);

    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl p-6 shadow-sm flex flex-col animate-slide-up lg:col-span-1 min-h-[350px]" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                        <PieChartIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 dark:text-white">Kategori</h3>
                    </div>
                </div>

                <select
                    value={type}
                    onChange={(e) => setType(e.target.value as 'expense' | 'income')}
                    className="bg-surface/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-xs font-bold text-gray-600 dark:text-gray-300 rounded-xl px-3 py-1.5 outline-none cursor-pointer focus:border-primary transition-colors"
                >
                    <option value="expense">Pengeluaran</option>
                    <option value="income">Pemasukan</option>
                </select>
            </div>

            {chartData.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 min-h-[200px]">
                    <PieChartIcon className="w-10 h-10 mb-2 opacity-30" />
                    <p className="font-medium text-sm text-center">Belum ada {type === 'expense' ? 'pengeluaran' : 'pemasukan'}.</p>
                </div>
            ) : (
                <div className="flex-1 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                                isAnimationActive={false}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                formatter={(value: number | string) => [formatRupiah(Number(value)), 'Total']}
                            />
                            <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};