import { useMemo, useState, useEffect } from 'react';
import { Filter, Loader2 } from 'lucide-react';
import { useTransactionStore } from '../../store/useTransactionStore';
import { CashFlowChart } from '../../../component/dashboard/CashFlowChart';
import { RecentTransactions } from '../../../component/dashboard/RecentTransactions';
import { SummaryCards } from '../../../component/dashboard/SummaryCards';
import { CategoryPieChart } from '../../../component/dashboard/CategoryPieChart';

export const Dashboard = () => {
    const [filter, setFilter] = useState('Bulan Ini');

    const allTransactions = useTransactionStore((state) => state.transactions);
    const fetchTransactions = useTransactionStore((state) => state.fetchTransactions);
    const isLoading = useTransactionStore((state) => state.isLoading);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const filteredTransactions = useMemo(() => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        return allTransactions.filter(trx => {
            const trxDate = new Date(trx.date);
            trxDate.setHours(0, 0, 0, 0);

            const diffTime = Math.abs(now.getTime() - trxDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            switch (filter) {
                case 'Minggu Ini':
                    return diffDays <= 7;
                case 'Bulan Ini':
                    return diffDays <= 30;
                case '3 Bulan':
                    return diffDays <= 90;
                case 'Tahun Ini':
                    return trxDate.getFullYear() === now.getFullYear();
                default:
                    return true;
            }
        });
    }, [allTransactions, filter]);

    const summaryData = useMemo(() => {
        return filteredTransactions.reduce((acc, curr) => {
            if (curr.type === 'income') acc.pemasukan += curr.amount;
            else acc.pengeluaran += curr.amount;

            acc.saldo = acc.pemasukan - acc.pengeluaran;
            return acc;
        }, { saldo: 0, pemasukan: 0, pengeluaran: 0 });
    }, [filteredTransactions]);

    return (
        <div className="p-6 md:p-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl sm:text-3xl font-black text-gray-800 tracking-tight">Ringkasan Keuangan</h1>
                        {isLoading && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
                    </div>
                    <p className="text-gray-500 font-medium mt-1">Pantau terus duit lu biar nggak boncos.</p>
                </div>

                <div className="relative">
                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-4 py-2.5 shadow-sm hover:border-primary focus-within:border-primary transition-colors">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="bg-transparent text-sm font-semibold text-gray-700 outline-none cursor-pointer appearance-none pr-4"
                            disabled={isLoading}
                        >
                            <option value="Minggu Ini">Minggu Ini</option>
                            <option value="Bulan Ini">Bulan Ini</option>
                            <option value="3 Bulan">3 Bulan Terakhir</option>
                            <option value="Tahun Ini">Tahun Ini</option>
                        </select>
                    </div>
                </div>
            </div>

            <SummaryCards data={summaryData} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <CashFlowChart transactions={filteredTransactions} />
                <RecentTransactions transactions={filteredTransactions} />
            </div>

            <div className="pt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <CategoryPieChart transactions={filteredTransactions} />
            </div>
        </div>
    );
};