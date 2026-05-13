import { useMemo } from 'react';
import { FileText, Sparkles } from 'lucide-react';

interface Transaction {
    id: string;
    type: 'INCOME' | 'EXPENSE' | string;
    categoryName?: string | null;
    amount: number;
    date: Date | string;
}

interface FinancialSummaryNoteProps {
    transactions: Transaction[];
}

export const FinancialSummaryNote = ({ transactions }: FinancialSummaryNoteProps) => {

    const formatRp = (angka: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(angka);
    };

    const analysisHtml = useMemo(() => {
        if (!transactions || transactions.length === 0) {
            return '<p class="text-gray-500">Belum ada transaksi di periode ini cuy.</p>';
        }

        let totalIncome = 0;
        let totalExpense = 0;
        const incomeMap: Record<string, number> = {};
        const expenseMap: Record<string, number> = {};

        transactions.forEach(trx => {
            const amount = Number(trx.amount);
            const cat = trx.categoryName || 'Lainnya';

            const safeType = String(trx.type).toUpperCase();

            if (safeType === 'INCOME') {
                totalIncome += amount;
                incomeMap[cat] = (incomeMap[cat] || 0) + amount;
            } else if (safeType === 'EXPENSE') {
                totalExpense += amount;
                expenseMap[cat] = (expenseMap[cat] || 0) + amount;
            }
        });

        const sortedIncomes = Object.entries(incomeMap).sort((a, b) => b[1] - a[1]);
        const sortedExpenses = Object.entries(expenseMap).sort((a, b) => b[1] - a[1]);

        let html = '<ul>';

        // PEMASUKAN
        if (sortedIncomes.length > 0) {
            const [topIncCat, topIncAmt] = sortedIncomes[0];
            const apresiasi = totalIncome >= totalExpense
                ? 'Mantap, cuan lu sukses nutupin pengeluaran!'
                : 'Sayangnya pemasukan ini belum cukup buat nutupin borosnya lu bulan ini.';

            html += `<li>Pemasukan paling ngebantu datang dari <strong>${topIncCat}</strong> sebesar <span class="text-green-600 dark:text-green-400 font-bold">${formatRp(topIncAmt)}</span>. ${apresiasi}</li>`;
        } else {
            html += `<li>Belum ada pemasukan yang tercatat nih cuy. Semangat cari cuannya!</li>`;
        }

        // PENGELUARAN WAJAR
        if (sortedExpenses.length > 1) {
            const normalExps = sortedExpenses.slice(1, 3).map(e => `<strong>${e[0]}</strong>`).join(' dan ');
            html += `<li>Pengeluaran buat ${normalExps} masih terpantau wajar dan dalam batas aman.</li>`;
        } else if (sortedExpenses.length === 1 && totalExpense <= totalIncome * 0.4) {
            html += `<li>Gokil! Pengeluaran lu masih super aman, ngga ada yang aneh-aneh.</li>`;
        }

        // PENGELUARAN BONCOS
        if (sortedExpenses.length > 0) {
            const [topExpCat, topExpAmt] = sortedExpenses[0];
            const expRatio = totalIncome > 0 ? topExpAmt / totalIncome : 1;

            if (expRatio >= 0.5) {
                html += `<li><strong class="text-red-500">WADUH BONCOS!</strong> Duit lu paling banyak kesedot di <strong>${topExpCat}</strong> sampai <span class="text-red-500 font-bold">${formatRp(topExpAmt)}</span>. Kurangin cuy, masa setengah duit lu lari ke sini doang!</li>`;
            } else if (totalExpense > totalIncome) {
                html += `<li>Pengeluaran terbesar ada di <strong>${topExpCat}</strong> (<span class="text-red-500 font-bold">${formatRp(topExpAmt)}</span>). Pantesan lu tekor bulan ini, rem dikit bos!</li>`;
            } else {
                html += `<li>Pengeluaran paling gede lu saat ini di <strong>${topExpCat}</strong> (<span class="text-orange-500 font-bold">${formatRp(topExpAmt)}</span>). Angkanya masih masuk akal sih, tapi tetep dipantau ya.</li>`;
            }
        } else {
            html += `<li>Keren abis! Belum ada duit keluar sama sekali. Pertahankan puasa belanjanya cuy!</li>`;
        }

        html += '</ul>';
        return html;
    }, [transactions]);

    return (
        <section
            aria-label="Analisis Kategori Keuangan"
            className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl p-6 shadow-sm h-full animate-slide-up flex flex-col"
        >
            <header className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                        <FileText className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-gray-800 dark:text-white tracking-tight flex items-center gap-2">
                            Catatan Sistem PyDuiten
                            <Sparkles className="w-4 h-4 text-blue-500" />
                        </h2>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            Analisis Pemasukan & Pengeluaran
                        </p>
                    </div>
                </div>
            </header>

            <article className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                <div
                    className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300
                               font-medium leading-relaxed prose-li:marker:text-primary prose-ul:pl-4 prose-p:mb-2"
                    dangerouslySetInnerHTML={{ __html: analysisHtml }}
                />
            </article>
        </section>
    );
};