import { useMemo, useState, useEffect } from 'react';
import { Filter, Loader2, Sparkles } from 'lucide-react';
import { useTransactionStore } from '../../store/useTransactionStore';
import { CashFlowChart } from '../../../component/dashboard/CashFlowChart';
import { RecentTransactions } from '../../../component/dashboard/RecentTransactions';
import { useAuthStore } from '../../store/useAuthStore';
import { SummaryCards } from '../../../component/dashboard/SummaryCards';
import { CategoryPieChart } from '../../../component/dashboard/CategoryPieChart';
import { SmartNudge } from '../../../component/ui/SmartNudge';
import { FinancialSummaryNote } from '../../../component/dashboard/FinancialSummaryNote';
import { DownloadReportButton } from '../../../component/dashboard/DownloadReportButton';

export const Dashboard = () => {
    const [filter, setFilter] = useState('Bulan Ini');

    const allTransactions = useTransactionStore((state) => state.transactions);
    const fetchTransactions = useTransactionStore((state) => state.fetchTransactions);
    const isLoading = useTransactionStore((state) => state.isLoading);

    const user = useAuthStore((state) => state.user);
    const userName = user?.name || 'PyDuiten Cuyyyy';

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
                case 'Minggu Ini': return diffDays <= 7;
                case 'Bulan Ini': return diffDays <= 30;
                case '3 Bulan': return diffDays <= 90;
                case 'Tahun Ini': return trxDate.getFullYear() === now.getFullYear();
                default: return true;
            }
        });
    }, [allTransactions, filter]);

    const summaryData = useMemo(() => {
        return filteredTransactions.reduce((acc, curr) => {
            const typeLower = String(curr.type).toLowerCase();
            if (typeLower === 'income') acc.pemasukan += Number(curr.amount);
            else acc.pengeluaran += Number(curr.amount);

            acc.saldo = acc.pemasukan - acc.pengeluaran;
            return acc;
        }, { saldo: 0, pemasukan: 0, pengeluaran: 0 });
    }, [filteredTransactions]);

    const smartInsightText = useMemo(() => {
        // Base Nudge
        let insight = "Keuangan lu masih terpantau aman dan wajar. Jangan lupa alokasiin buat dana darurat/investasi ya!";
        if (summaryData.pemasukan === 0 && summaryData.pengeluaran === 0) {
            return "Belum ada transaksi di periode ini cuy. Catat keuangan lu!";
        }
        if (summaryData.pengeluaran > summaryData.pemasukan) {
            insight = "Set, pengeluaran lu lebih gede dari pemasukan di periode ini. Rem dikit cuy biar nggak boncos!";
        } else if (summaryData.pemasukan > 0 && summaryData.pengeluaran <= summaryData.pemasukan * 0.5) {
            insight = "Gokil! Keuangan lu OK BAT. Rutinin nabung/investasi cuy dalam bentuk ape aje.";
        }

        // Analisa Komparatif Kategori
        if (filter !== 'Bulan Ini') return insight;

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        let lastMonth = currentMonth - 1;
        let lastMonthYear = currentYear;
        if (lastMonth < 0) {
            lastMonth = 11;
            lastMonthYear--;
        }

        const categoryStats: Record<string, { current: number; last: number }> = {};

        allTransactions.forEach((trx) => {
            const item = trx as unknown as {
                type: string;
                categoryName?: string | null;
                category?: string | { name: string } | null;
                amount: string | number;
                date: string | Date;
            };

            if (String(item.type).toUpperCase() !== 'EXPENSE') return;

            const trxDate = new Date(item.date);
            const month = trxDate.getMonth();
            const year = trxDate.getFullYear();

            const catData = item.category;
            const validCategory = item.categoryName ||
                (typeof catData === 'object' && catData !== null ? catData.name : catData);
            const catName = typeof validCategory === 'string' ? validCategory : 'Lainnya';

            if (!categoryStats[catName]) {
                categoryStats[catName] = { current: 0, last: 0 };
            }

            const amount = Number(item.amount);
            if (month === currentMonth && year === currentYear) {
                categoryStats[catName].current += amount;
            } else if (month === lastMonth && year === lastMonthYear) {
                categoryStats[catName].last += amount;
            }
        });

        let worstCategory = '';
        let highestPercentage = 0;

        for (const [catName, stats] of Object.entries(categoryStats)) {
            if (stats.current > stats.last && stats.last > 0) {
                const increase = stats.current - stats.last;
                const percentage = Math.round((increase / stats.last) * 100);

                if (percentage > highestPercentage && increase > 10000) {
                    highestPercentage = percentage;
                    worstCategory = catName;
                }
            }
        }

        if (worstCategory) {
            insight += ` Btw, bulan ini kategori ${worstCategory} lu lebih boros ${highestPercentage}% cuy dibanding bulan lalu. Evaluasi lagi pengeluaran lu buat hal itu!`;
        }

        return insight;
    }, [summaryData, filter, allTransactions]);

    const pdfAnalysisNote = useMemo(() => {
        if (summaryData.pemasukan === 0 && summaryData.pengeluaran === 0) {
            return "Belum ada transaksi di periode ini cuy. Yuk mulai catat keuangan lu!";
        }
        if (summaryData.pengeluaran > summaryData.pemasukan) {
            return "Waduh, pengeluaran lu lebih gede dari pemasukan di periode ini. Rem dikit jajan lu cuy biar nggak boncos!";
        }
        if (summaryData.pemasukan > 0 && summaryData.pengeluaran <= summaryData.pemasukan * 0.5) {
            return "Gokil! Keuangan lu super sehat. Pertahankan puasa belanjanya dan rutinin nabung cuy.";
        }
        return "Keuangan lu masih terpantau aman dan wajar. Jangan lupa alokasiin buat dana darurat ya!";
    }, [summaryData]);

    const pdfTransactions = useMemo(() => {
        return filteredTransactions.map((trx, index) => {

            const item = trx as unknown as {
                id?: string | number;
                type: string;
                categoryName?: string | null;
                category?: string | { name: string } | null;
                amount: string | number;
                date: string | Date;
            };

            const catData = item.category;
            const validCategory = item.categoryName ||
                (typeof catData === 'object' && catData !== null ? catData.name : catData);

            return {
                id: String(item.id ?? `temp-id-${index}`),
                type: String(item.type).toUpperCase() === 'INCOME' ? 'INCOME' as const : 'EXPENSE' as const,
                categoryName: typeof validCategory === 'string' ? validCategory : null,
                amount: Number(item.amount),
                date: item.date,
            };
        });
    }, [filteredTransactions]);

    return (
        <main className="p-6 md:p-8 animate-fade-in">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl sm:text-3xl font-black text-gray-800 dark:text-white tracking-tight">Ringkasan Keuangan</h1>
                        {isLoading && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Pantau terus duit lu biar nggak boncos.</p>
                </div>

                <div className="flex items-center gap-3">
                    <DownloadReportButton
                        userName={userName}
                        filter={filter}
                        summary={summaryData}
                        transactions={pdfTransactions}
                        analysisNote={pdfAnalysisNote}
                    />

                    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200
            dark:border-gray-700 rounded-2xl px-4 py-2.5 shadow-sm hover:border-primary
            focus-within:border-primary transition-colors">
                        <Filter className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="bg-transparent text-sm font-semibold text-gray-700 dark:text-gray-300
                    outline-none cursor-pointer appearance-none pr-4"
                            disabled={isLoading}
                        >
                            <option value="Minggu Ini">Minggu Ini</option>
                            <option value="Bulan Ini">Bulan Ini</option>
                            <option value="3 Bulan">3 Bulan Terakhir</option>
                            <option value="Tahun Ini">Tahun Ini</option>
                        </select>
                    </div>
                </div>
            </header>

            <section aria-label="Summary">
                <SummaryCards data={summaryData} />
                <SmartNudge
                    income={summaryData.pemasukan}
                    expense={summaryData.pengeluaran}
                />
                <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl flex gap-4 items-start shadow-sm">
                    <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-xl mt-0.5">
                        <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm text-blue-900 dark:text-blue-300 mb-1">Insight PyDuiten</h3>
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-400/90 leading-relaxed">
                            {smartInsightText}
                        </p>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6" aria-label="Cashflow and Transactions">
                <CashFlowChart transactions={filteredTransactions} />
                <RecentTransactions transactions={filteredTransactions} />
            </section>

            <section className="pt-8 grid grid-cols-1 lg:grid-cols-3 gap-6" aria-label="Category Analysis">
                <div className="lg:col-span-1">
                    <CategoryPieChart transactions={filteredTransactions} />
                </div>
                <div className="lg:col-span-2 h-[400px]">
                    <FinancialSummaryNote transactions={filteredTransactions} />
                </div>
            </section>
        </main>
    );
};