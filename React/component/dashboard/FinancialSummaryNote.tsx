import { useMemo } from 'react';
import { FileText, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Transaction {
    id: string;
    type: 'INCOME' | 'EXPENSE' | string;
    categoryName?: string | null;
    amount: number;
    date: Date | string;
}

export const FinancialSummaryNote = ({ transactions }: { transactions: Transaction[] }) => {
    const { t } = useTranslation();

    const formatRp = (angka: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
    };

    const analysisHtml = useMemo(() => {
        if (!transactions || transactions.length === 0) {
            return `<p class="text-gray-500">${t('dashboard_note.empty')}</p>`;
        }

        let totalIncome = 0;
        let totalExpense = 0;
        const incomeMap: Record<string, number> = {};
        const expenseMap: Record<string, number> = {};

        transactions.forEach(trx => {
            const amount = Number(trx.amount);
            const rawCat = trx.categoryName || 'Lainnya';
            const cat = t(`categories.${rawCat}`, rawCat);

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
            const apresiasi = totalIncome >= totalExpense ? t('dashboard_note.inc_good') : t('dashboard_note.inc_bad');
            html += `<li>${t('dashboard_note.inc_top', { category: topIncCat, amount: formatRp(topIncAmt), apresiasi })}</li>`;
        } else {
            html += `<li>${t('dashboard_note.inc_zero')}</li>`;
        }

        // PENGELUARAN WAJAR
        if (sortedExpenses.length > 1) {
            const normalExps = sortedExpenses.slice(1, 3).map(e => `<strong>${e[0]}</strong>`).join(' & ');
            html += `<li>${t('dashboard_note.exp_normal', { categories: normalExps })}</li>`;
        } else if (sortedExpenses.length === 1 && totalExpense <= totalIncome * 0.4) {
            html += `<li>${t('dashboard_note.exp_safe')}</li>`;
        }

        // PENGELUARAN BONCOS
        if (sortedExpenses.length > 0) {
            const [topExpCat, topExpAmt] = sortedExpenses[0];
            const expRatio = totalIncome > 0 ? topExpAmt / totalIncome : 1;

            if (expRatio >= 0.5) {
                html += `<li>${t('dashboard_note.exp_danger', { category: topExpCat, amount: formatRp(topExpAmt) })}</li>`;
            } else if (totalExpense > totalIncome) {
                html += `<li>${t('dashboard_note.exp_deficit', { category: topExpCat, amount: formatRp(topExpAmt) })}</li>`;
            } else {
                html += `<li>${t('dashboard_note.exp_highest', { category: topExpCat, amount: formatRp(topExpAmt) })}</li>`;
            }
        } else {
            html += `<li>${t('dashboard_note.exp_zero')}</li>`;
        }

        html += '</ul>';
        return html;
    }, [transactions, t]);

    return (
        <section aria-label="Analisis Kategori Keuangan" className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl p-6 shadow-sm h-full animate-slide-up flex flex-col">
            <header className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                        <FileText className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-gray-800 dark:text-white tracking-tight flex items-center gap-2">
                            {t('dashboard_note.title')} <Sparkles className="w-4 h-4 text-blue-500" />
                        </h2>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            {t('dashboard_note.subtitle')}
                        </p>
                    </div>
                </div>
            </header>
            <article className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 font-medium leading-relaxed prose-li:marker:text-primary prose-ul:pl-4 prose-p:mb-2" dangerouslySetInnerHTML={{ __html: analysisHtml }} />
            </article>
        </section>
    );
};