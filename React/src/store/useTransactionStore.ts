import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TransactionItem } from "../../component/transaction/TransactionForm";

interface TransactionState {
  transactions: TransactionItem[];
  deleteTransaction: (id: string) => void;
  addTransaction: (trx: TransactionItem) => void;
  updateTransaction: (id: string, updatedTrx: TransactionItem) => void;
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set) => ({
      transactions: [],
      addTransaction: (newTrx) =>
        set((state) => ({
          transactions: [newTrx, ...state.transactions],
        })),
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((trx) => trx.id !== id),
        })),
      updateTransaction: (id, updatedTrx) =>
        set((state) => ({
          transactions: state.transactions.map((trx) =>
            trx.id === id ? updatedTrx : trx,
          ),
        })),
    }),
    {
      name: "duitai-storage",
    },
  ),
);
