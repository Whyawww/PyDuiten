import { useState, useMemo, useEffect } from 'react';
import { useTransactionStore } from '../../store/useTransactionStore';
import { WishlistHeader } from '../../../component/wishlist/WishlistHeader';
import { WishlistProgress } from '../../../component/wishlist/WishlistProgress';
import { WishlistForm } from '../../../component/wishlist/WishlistForm';
import { WishlistItems } from '../../../component/wishlist/WishlistItems';

export interface WishlistItem {
    id: string;
    name: string;
    budget: number;
}

export const WishlistPage = () => {
    const transactions = useTransactionStore((state) => state.transactions);
    const fetchTransactions = useTransactionStore((state) => state.fetchTransactions);

    const [wishlists, setWishlists] = useState<WishlistItem[]>([]);

    useEffect(() => {
        fetchTransactions();
        const saved = localStorage.getItem('pyduiten_wishlist');
        if (saved) {
            try { 
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    setWishlists(parsed as WishlistItem[]);
                }
            } catch (e) {
                console.error("Gagal load wishlist:", e);
            }
        }
    }, [fetchTransactions]);

    useEffect(() => {
        localStorage.setItem('pyduiten_wishlist', JSON.stringify(wishlists));
    }, [wishlists]);

    const currentBalance = useMemo(() => {
        return transactions.reduce((acc, curr) => {
            return curr.type === 'income' ? acc + curr.amount : acc - curr.amount;
        }, 0);
    }, [transactions]);

    const totalTarget = useMemo(() => {
        return wishlists.reduce((acc, curr) => acc + curr.budget, 0);
    }, [wishlists]);

    const formatRupiah = (angka: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);

    const handleAddWishlist = (name: string, budget: number) => {
        const newItem: WishlistItem = {
            id: Date.now().toString(),
            name,
            budget,
        };
        setWishlists([...wishlists, newItem]);
    };

    const handleDelete = (id: string) => {
        setWishlists(wishlists.filter(w => w.id !== id));
    };

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
                    <WishlistForm
                        onAdd={handleAddWishlist}
                        formatRp={formatRupiah}
                    />
                    <WishlistItems
                        items={wishlists}
                        onDelete={handleDelete}
                        formatRp={formatRupiah}
                    />
                </div>
            </div>
        </main>
    );
};