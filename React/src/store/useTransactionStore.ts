import { create } from "zustand";
import { apiFetch } from "../utils/api";
import type { TransactionItem } from "../../component/transaction/TransactionForm";

interface ApiTransactionResponse {
  id: string;
  amount: string | number;
  type: "INCOME" | "EXPENSE";
  description: string | null;
  date: string;
  category: { name: string } | null;
}

interface TransactionState {
  transactions: TransactionItem[];
  isLoading: boolean;
  fetchTransactions: () => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addTransaction: (trx: TransactionItem) => Promise<void>;
  updateTransaction: (id: string, updatedTrx: TransactionItem) => Promise<void>;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  isLoading: false,

  fetchTransactions: async () => {
    set({ isLoading: true });
    try {
      const rawData = await apiFetch<ApiTransactionResponse[]>("/transactions");

      const mappedData: TransactionItem[] = rawData.map((item) => ({
        id: item.id,
        type: item.type === "INCOME" ? "income" : "expense",
        amount: Number(item.amount),
        note: item.description || "",
        date: item.date,
        category: item.category?.name || "Lainnya",
      }));

      set({ transactions: mappedData, isLoading: false });
    } catch (error) {
      console.error("Gagal narik data transaksi:", error);
      set({ isLoading: false });
    }
  },

  addTransaction: async (newTrx) => {
    try {
      await apiFetch("/transactions", {
        method: "POST",
        body: JSON.stringify({
          amount: newTrx.amount,
          type: newTrx.type.toUpperCase(),
          description: newTrx.note,
          categoryName: newTrx.category,
        }),
      });

      await get().fetchTransactions();
    } catch (error) {
      console.error("Gagal nambah transaksi:", error);
      throw error;
    }
  },

  updateTransaction: async (id, updatedTrx) => {
    try {
      await apiFetch(`/transactions/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          amount: updatedTrx.amount,
          type: updatedTrx.type.toUpperCase(),
          description: updatedTrx.note,
          categoryName: updatedTrx.category,
        }),
      });
      await get().fetchTransactions();
    } catch (error) {
      console.error("Gagal update transaksi:", error);
      throw error;
    }
  },

  deleteTransaction: async (id) => {
    try {
      await apiFetch(`/transactions/${id}`, {
        method: "DELETE",
      });
      await get().fetchTransactions();
    } catch (error) {
      console.error("Gagal hapus transaksi:", error);
      throw error;
    }
  },
}));
