import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';
import type { TransactionItem } from '../transaction/TransactionForm';

export const CashFlowChart = ({ transactions }: { transactions: TransactionItem[] }) => {
    const chartData = useMemo(() => {
        const sortedTransactions = [...transactions].reverse();

        const grouped = sortedTransactions.reduce((acc, trx) => {
            const dateStr = new Date(trx.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

            if (!acc[dateStr]) acc[dateStr] = { date: dateStr, income: 0, expense: 0 };

            if (trx.type === 'income') acc[dateStr].income += trx.amount;
            else acc[dateStr].expense += trx.amount;

            return acc;
        }, {} as Record<string, { date: string; income: number; expense: number }>);

        return Object.values(grouped);
    }, [transactions]);

    const formatRupiah = (value: number) =>
        new Intl.NumberFormat('id-ID', { notation: 'compact', maximumFractionDigits: 1 }).format(value);

    return (
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm lg:col-span-2 min-h-[350px] flex flex-col animate-slide-up" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                    <Activity className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-800">Arus Kas</h3>
                    <p className="text-xs text-gray-500 font-medium">Pergerakan duit lu beberapa hari terakhir</p>
                </div>
            </div>

            {chartData.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                    <Activity className="w-10 h-10 mb-2 opacity-50" />
                    <p className="font-medium text-sm">Belum ada data buat dibikin grafik.</p>
                </div>
            ) : (
                <div className="flex-1 w-full h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={formatRupiah} />
                            <Tooltip
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, '']}
                            />
                            <Area type="monotone" dataKey="income" name="Pemasukan" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                            <Area type="monotone" dataKey="expense" name="Pengeluaran" stroke="#EF4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};