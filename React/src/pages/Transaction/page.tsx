import { useState, useMemo } from 'react';
import { TransactionForm } from '../../../component/transaction/TransactionForm';
import type { TransactionItem } from '../../../component/transaction/TransactionForm'
import { TransactionHistory } from '../../../component/transaction/TransactionHistory';
import { AIAdvisorBar } from '../../../component/transaction/AIAdvisorBar';

export const TransactionPage = () => {
    const [transactions, setTransactions] = useState<TransactionItem[]>([]);

    const handleAddTransaction = (newTrx: TransactionItem) => {
        setTransactions([newTrx, ...transactions]);
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
                <TransactionForm onAdd={handleAddTransaction} />
                <TransactionHistory transactions={transactions} />
            </div>

            <AIAdvisorBar income={totalIncome} expense={totalExpense} />
        </div>
    );
};