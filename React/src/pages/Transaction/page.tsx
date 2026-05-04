import { useMemo, useState } from 'react';
import { TransactionForm } from '../../../component/transaction/TransactionForm';
import type { TransactionItem } from '../../../component/transaction/TransactionForm';
import { TransactionHistory } from '../../../component/transaction/TransactionHistory';
import { AIAdvisorBar } from '../../../component/transaction/AIAdvisorBar';
import { useTransactionStore } from '../../../src/store/useTransactionStore';

export const TransactionPage = () => {
    const [editingTrx, setEditingTrx] = useState<TransactionItem | null>(null);

    const transactions = useTransactionStore((state) => state.transactions);
    const addTransaction = useTransactionStore((state) => state.addTransaction);
    const deleteTransaction = useTransactionStore((state) => state.deleteTransaction);
    const updateTransaction = useTransactionStore((state) => state.updateTransaction);

    const handleAdd = (newTrx: TransactionItem) => {
        addTransaction(newTrx);
    };

    const handleUpdate = (id: string, updatedTrx: TransactionItem) => {
        updateTransaction(id, updatedTrx);
        setEditingTrx(null);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Yakin mau hapus transaksi ini?')) {
            deleteTransaction(id);
            if (editingTrx?.id === id) setEditingTrx(null);
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
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-black text-gray-800 tracking-tight">Manajemen Transaksi</h1>
                <p className="text-gray-500 font-medium mt-1">Catat semua arus kas di PyDuiten.</p>
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