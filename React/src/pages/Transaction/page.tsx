import { useMemo, useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { TransactionForm } from '../../../component/transaction/TransactionForm';
import type { TransactionItem } from '../../../component/transaction/TransactionForm';
import { TransactionHistory } from '../../../component/transaction/TransactionHistory';
import { AIAdvisorBar } from '../../../component/transaction/AIAdvisorBar';
import { ConfirmModal } from '../../../component/transaction/ConfirmModal';
import { useTransactionStore } from '../../../src/store/useTransactionStore';
import { LanguageSwitcher } from '../../../component/ui/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

export const TransactionPage = () => {
    const [editingTrx, setEditingTrx] = useState<TransactionItem | null>(null);
    const { t } = useTranslation();

    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

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

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
    };

    const executeDelete = async () => {
        if (!deleteId) return;

        setIsDeleting(true);
        try {
            await deleteTransaction(deleteId);
            if (editingTrx?.id === deleteId) setEditingTrx(null);
        } catch (error) {
            console.error("Gagal hapus transaksi:", error);
        } finally {
            setIsDeleting(false);
            setDeleteId(null);
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
            <div className="absolute top-6 right-6 z-50">
                <LanguageSwitcher />
            </div>
            <ConfirmModal
                isOpen={deleteId !== null}
                title={t('transaction.delete_title')}
                message={t('transaction.delete_msg')}
                onConfirm={executeDelete}
                onCancel={() => setDeleteId(null)}
                isLoading={isDeleting}
            />

            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl sm:text-3xl font-black text-gray-800 dark:text-white tracking-tight">
                            {t('transaction.title')}
                        </h1>
                        {isLoading && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
                        {t('transaction.subtitle')}
                    </p>
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
                    onDelete={handleDeleteClick}
                />
            </div>

            <AIAdvisorBar income={totalIncome} expense={totalExpense} />
        </div>
    );
};