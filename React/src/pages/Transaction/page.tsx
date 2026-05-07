import { useMemo, useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react'; 
import { TransactionForm } from '../../../component/transaction/TransactionForm';
import type { TransactionItem } from '../../../component/transaction/TransactionForm';
import { TransactionHistory } from '../../../component/transaction/TransactionHistory';
import { AIAdvisorBar } from '../../../component/transaction/AIAdvisorBar';
import { useTransactionStore } from '../../../src/store/useTransactionStore';

export const TransactionPage = () => {
    const [editingTrx, setEditingTrx] = useState<TransactionItem | null>(null);

    const transactions = useTransactionStore((state) => state.transactions);
    const isLoading = useTransactionStore((state) => state.isLoading);
    const fetchTransactions = useTransactionStore((state) => state.fetchTransactions);
    const addTransaction = useTransactionStore((state) => state.addTransaction);
    const deleteTransaction = useTransactionStore((state) => state.deleteTransaction);
    const updateTransaction = useTransactionStore((state) => state.updateTransaction);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const handleAdd = async (newTrx: TransactionItem) => {
        try {
            await addTransaction(newTrx);
        } catch (error) {
            console.error("Gagal nyimpen transaksi:", error);
        }
    };

    const handleUpdate = async (id: string, updatedTrx: TransactionItem) => {
        try {
            await updateTransaction(id, updatedTrx);
            setEditingTrx(null);
        } catch (error) {
            console.error("Gagal update transaksi:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Yakin mau hapus transaksi ini? Data bakal hilang dari server lho!')) {
            try {
                await deleteTransaction(id);
                if (editingTrx?.id === id) setEditingTrx(null);
            } catch (error) {
                console.error("Gagal hapus transaksi:", error);
            }
        }
    };

    const { totalIncome, totalExpense } = useMemo(() => {
        return transactions.reduce((acc, curr) => {
            if (curr.type === 'income') acc.totalIncome += curr.amount;
            else acc.totalExpense += curr.amount;
            return acc;
        }, { totalIncome: 0, totalExpense: 0 });
    }, [transactions]);

    return (
        <div className="p-6 md:p-8 animate-fade-in relative pb-32 md:pb-24 min-h-screen">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl sm:text-3xl font-black text-gray-800 tracking-tight">Manajemen Transaksi</h1>
                        {isLoading && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
                    </div>
                    <p className="text-gray-500 font-medium mt-1">Catat semua arus kas di PyDuiten.</p>
                </div>
            </div>

            <div className="max-w-4xl">
                <TransactionForm
                    onAdd={handleAdd}
                    editData={editingTrx}
                    onUpdate={handleUpdate}
                    onCancelEdit={() => setEditingTrx(null)}
                />

                <TransactionHistory
                    transactions={transactions}
                    onEdit={(trx) => setEditingTrx(trx)}
                    onDelete={handleDelete}
                />
            </div>

            <AIAdvisorBar income={totalIncome} expense={totalExpense} />
        </div>
    );
};