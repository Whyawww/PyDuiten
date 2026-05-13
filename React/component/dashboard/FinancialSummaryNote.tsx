import { useState, useEffect, useCallback } from 'react';
import { FileText, Loader2, Sparkles } from 'lucide-react';
import { apiFetch } from '../../src/utils/api';

interface Transaction {
    id: string;
    type: 'INCOME' | 'EXPENSE';
    categoryName?: string | null;
    amount: number;
    date: Date | string;
}

interface CategoryAnalysisResponse {
    status: string;
    data: {
        analysis: string;
    };
}

type AnalysisState =
    | { kind: 'idle' }
    | { kind: 'loading' }
    | { kind: 'success'; html: string }
    | { kind: 'error'; message: string };

const FALLBACK_EMPTY = '<p class="text-gray-500">Belum ada transaksi di periode ini cuy.</p>';
const FALLBACK_ERROR = '<p class="text-red-500 font-medium">Gagal memuat analisis dari AI. Koneksi putus cuy.</p>';

interface FinancialSummaryNoteProps {
    transactions: Transaction[];
}

export const FinancialSummaryNote = ({ transactions }: FinancialSummaryNoteProps) => {
    const [state, setState] = useState<AnalysisState>({ kind: 'idle' });

    const fetchAnalysis = useCallback(async () => {
        if (transactions.length === 0) {
            setState({ kind: 'success', html: FALLBACK_EMPTY });
            return;
        }

        const categoryTotals = transactions.reduce<Record<string, { type: string; amount: number }>>(
            (acc, curr) => {
                const key = curr.categoryName ?? 'Lainnya';
                if (!acc[key]) acc[key] = { type: curr.type, amount: 0 };
                acc[key].amount += Number(curr.amount);
                return acc;
            },
            {}
        );

        setState({ kind: 'loading' });

        try {
            const res = await apiFetch<CategoryAnalysisResponse>('/ai/category-analysis', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ categoryData: categoryTotals }),
            });

            setState({ kind: 'success', html: res.data.analysis });
        } catch (error) {
            console.error('Gagal ambil analisis:', error);

            if (error?.status === 429 || error?.message?.includes('429')) {
                setState({
                    kind: 'error',
                    message: '<p class="text-red-500 font-medium">Buset pelan-pelan cuy! Server AI lagi ngos-ngosan (Tunggu semenit lagi ya).</p>'
                });
            } else {
                setState({ kind: 'error', message: FALLBACK_ERROR });
            }
        }
    }, [transactions]);

    useEffect(() => {
        const timer = setTimeout(fetchAnalysis, 2000);
        return () => clearTimeout(timer);
    }, [fetchAnalysis]);

    const isLoading = state.kind === 'loading';
    const htmlContent = state.kind === 'success'
        ? state.html
        : state.kind === 'error'
            ? state.message
            : '';

    return (
        <section
            aria-label="Analisis Cerdas AI"
            className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl p-6 shadow-sm h-full animate-slide-up flex flex-col"
        >
            <header className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                        <FileText className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-gray-800 dark:text-white tracking-tight flex items-center gap-2">
                            Catatan AI PyDuiten
                            <Sparkles className="w-4 h-4 text-yellow-500" />
                        </h2>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            Analisis Pemasukan & Pengeluaran
                        </p>
                    </div>
                </div>
                {isLoading && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
            </header>

            <article className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                {isLoading ? (
                    <div className="flex flex-col gap-3">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-5/6" />
                    </div>
                ) : (
                    <div
                        className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300
                                   font-medium leading-relaxed prose-li:marker:text-primary prose-ul:pl-4 prose-p:mb-2"
                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                    />
                )}
            </article>
        </section>
    );
};