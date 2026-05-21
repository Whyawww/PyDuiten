import { useMemo, useEffect, useCallback } from 'react';
import { useTransactionStore } from '../../store/useTransactionStore';
import { useWishlistStore } from '../../store/useWishlistStore';
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

const formatRupiah = (angka: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(angka);

export const WishlistPage = () => {
    const transactions = useTransactionStore((state) => state.transactions);
    const fetchTransactions = useTransactionStore((state) => state.fetchTransactions);

    const wishlists = useWishlistStore((state) => state.wishlists);
    const fetchWishlists = useWishlistStore((state) => state.fetchWishlists);
    const addWishlist = useWishlistStore((state) => state.addWishlist);
    const updateWishlist = useWishlistStore((state) => state.updateWishlist);
    const deleteWishlist = useWishlistStore((state) => state.deleteWishlist);
    const reorderWishlists = useWishlistStore((state) => state.reorderWishlists);

    useEffect(() => {
        fetchTransactions();
        fetchWishlists();
    }, [fetchTransactions, fetchWishlists]);

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
        addWishlist(name, budget);
    }, [addWishlist]);

    const handleEdit = useCallback((id: string, name: string, budget: number) => {
        updateWishlist(id, { name, budget });
    }, [updateWishlist]);

    const handleDelete = useCallback((id: string) => {
        deleteWishlist(id);
    }, [deleteWishlist]);

    const handleReorder = useCallback((id: string, direction: 'up' | 'down') => {
        const sorted = [...wishlists].sort((a, b) => a.priority - b.priority);
        const idx = sorted.findIndex((w) => w.id === id);
        const swapIdx = direction === 'up' ? idx - 1 : idx + 1;

        if (swapIdx < 0 || swapIdx >= sorted.length) return;

        const newOrder = [...sorted];
        [newOrder[idx], newOrder[swapIdx]] = [newOrder[swapIdx], newOrder[idx]];

        const payload = newOrder.map((item, index) => ({ id: item.id, priority: index }));

        useWishlistStore.setState({ wishlists: newOrder.map((item, i) => ({ ...item, priority: i })) });
        reorderWishlists(payload);

    }, [wishlists, reorderWishlists]);

    const handleToggleAchieved = useCallback((id: string) => {
        const item = wishlists.find(w => w.id === id);
        if (item) {
            updateWishlist(id, { isAchieved: !item.isAchieved });
        }
    }, [wishlists, updateWishlist]);

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