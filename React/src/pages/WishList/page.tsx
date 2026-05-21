import { useState, useMemo, useEffect, useCallback } from 'react';
import { useTransactionStore } from '../../store/useTransactionStore';
import { WishlistHeader } from '../../../component/wishlist/WishlistHeader';
import { WishlistProgress } from '../../../component/wishlist/WishlistProgress';
import { WishlistForm } from '../../../component/wishlist/WishlistForm';
import { WishlistItems } from '../../../component/wishlist/WishlistItems';

export interface WishlistItem {
    id: string;
    name: string;
    budget: number;
    priority: number;
    isAchieved: boolean;
    createdAt: string;
}

const isValidWishlistItem = (x: unknown): x is WishlistItem =>
    typeof x === 'object' && x !== null &&
    typeof (x as WishlistItem).id === 'string' &&
    typeof (x as WishlistItem).name === 'string' &&
    typeof (x as WishlistItem).budget === 'number' &&
    typeof (x as WishlistItem).priority === 'number' &&
    typeof (x as WishlistItem).isAchieved === 'boolean';

const STORAGE_KEY = 'pyduiten_wishlist';

const formatRupiah = (angka: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(angka);

export const WishlistPage = () => {
    const transactions = useTransactionStore((state) => state.transactions);
    const fetchTransactions = useTransactionStore((state) => state.fetchTransactions);
    const [wishlists, setWishlists] = useState<WishlistItem[]>([]);

    useEffect(() => {
        fetchTransactions();
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (!saved) return;
            const parsed: unknown = JSON.parse(saved);
            if (!Array.isArray(parsed)) return;
            const validated = parsed
                .filter(isValidWishlistItem)
                .sort((a, b) => a.priority - b.priority);
            setWishlists(validated);
        } catch (e) {
            console.error('Gagal load wishlist:', e);
        }
    }, [fetchTransactions]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlists));
    }, [wishlists]);

    const currentBalance = useMemo(() =>
        transactions.reduce((acc, curr) =>
            curr.type === 'income' ? acc + curr.amount : acc - curr.amount, 0
        ), [transactions]);

    const totalTarget = useMemo(() =>
        wishlists
            .filter((w) => !w.isAchieved)
            .reduce((acc, curr) => acc + curr.budget, 0),
        [wishlists]
    );

    const handleAdd = useCallback((name: string, budget: number) => {
        setWishlists((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                name,
                budget,
                priority: prev.length,
                isAchieved: false,
                createdAt: new Date().toISOString(),
            },
        ]);
    }, []);

    const handleEdit = useCallback((id: string, name: string, budget: number) => {
        setWishlists((prev) =>
            prev.map((w) => w.id === id ? { ...w, name, budget } : w)
        );
    }, []);

    const handleDelete = useCallback((id: string) => {
        setWishlists((prev) => {
            const filtered = prev.filter((w) => w.id !== id);
            return filtered.map((w, i) => ({ ...w, priority: i }));
        });
    }, []);

    const handleReorder = useCallback((id: string, direction: 'up' | 'down') => {
        setWishlists((prev) => {
            const sorted = [...prev].sort((a, b) => a.priority - b.priority);
            const idx = sorted.findIndex((w) => w.id === id);
            const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
            if (swapIdx < 0 || swapIdx >= sorted.length) return prev;

            // Swap priority
            const next = sorted.map((w, i) => {
                if (i === idx) return { ...w, priority: sorted[swapIdx].priority };
                if (i === swapIdx) return { ...w, priority: sorted[idx].priority };
                return w;
            });
            return next.sort((a, b) => a.priority - b.priority);
        });
    }, []);

    const handleToggleAchieved = useCallback((id: string) => {
        setWishlists((prev) =>
            prev.map((w) => w.id === id ? { ...w, isAchieved: !w.isAchieved } : w)
        );
    }, []);

    return (
        <main className="p-6 md:p-8 relative pb-32 md:pb-24 min-h-screen bg-surface dark:bg-gray-950 transition-colors">
            <WishlistHeader />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <WishlistProgress
                    currentBalance={currentBalance}
                    totalTarget={totalTarget}
                    formatRp={formatRupiah}
                />
                <div className="lg:col-span-2 space-y-6">
                    <WishlistForm onAdd={handleAdd} formatRp={formatRupiah} />
                    <WishlistItems
                        items={wishlists}
                        currentBalance={currentBalance}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                        onReorder={handleReorder}
                        onToggleAchieved={handleToggleAchieved}
                        formatRp={formatRupiah}
                    />
                </div>
            </div>
        </main>
    );
};