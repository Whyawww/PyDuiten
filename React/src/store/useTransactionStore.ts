import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TransactionItem } from "../../component/transaction/TransactionForm";

interface TransactionState {
  transactions: TransactionItem[];
  addTransaction: (trx: TransactionItem) => void;
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set) => ({
      transactions: [],
      addTransaction: (newTrx) =>
        set((state) => ({
          transactions: [newTrx, ...state.transactions],
        })),
    }),
    {
      name: "duitai-storage",
    },
  ),
);
