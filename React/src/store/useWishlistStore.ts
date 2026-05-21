import { create } from "zustand";
import { apiFetch } from "../utils/api";
import type { WishlistItem } from "../pages/WishList/page";

interface WishlistStore {
  wishlists: WishlistItem[];
  isLoading: boolean;
  fetchWishlists: () => Promise<void>;
  addWishlist: (name: string, budget: number) => Promise<void>;
  updateWishlist: (id: string, data: Partial<WishlistItem>) => Promise<void>;
  deleteWishlist: (id: string) => Promise<void>;
  reorderWishlists: (
    items: { id: string; priority: number }[],
  ) => Promise<void>;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  wishlists: [],
  isLoading: false,

  fetchWishlists: async () => {
    set({ isLoading: true });
    try {
      const data = await apiFetch<WishlistItem[]>("/wishlists");
      const formatted = data.map((item) => ({
        ...item,
        budget: Number(item.budget),
      }));
      set({ wishlists: formatted.sort((a, b) => a.priority - b.priority) });
    } catch (error) {
      console.error("Gagal fetch wishlist:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  addWishlist: async (name, budget) => {
    try {
      const newItem = await apiFetch<WishlistItem>("/wishlists", {
        method: "POST",
        body: JSON.stringify({ name, budget }),
      });
      set((state) => ({
        wishlists: [
          ...state.wishlists,
          { ...newItem, budget: Number(newItem.budget) },
        ].sort((a, b) => a.priority - b.priority),
      }));
    } catch (error) {
      console.error("Gagal add wishlist:", error);
    }
  },

  updateWishlist: async (id, data) => {
    set((state) => ({
      wishlists: state.wishlists.map((w) =>
        w.id === id ? { ...w, ...data } : w,
      ),
    }));
    try {
      await apiFetch(`/wishlists/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error("Gagal update wishlist:", error);
      get().fetchWishlists();
    }
  },

  deleteWishlist: async (id) => {
    set((state) => ({
      wishlists: state.wishlists.filter((w) => w.id !== id),
    }));
    try {
      await apiFetch(`/wishlists/${id}`, { method: "DELETE" });
    } catch (error) {
      console.error("Gagal hapus wishlist:", error);
      get().fetchWishlists();
    }
  },

  reorderWishlists: async (items) => {
    try {
      await apiFetch("/wishlists/reorder", {
        method: "PATCH",
        body: JSON.stringify({ items }),
      });
    } catch (error) {
      console.error("Gagal reorder:", error);
    }
  },
}));
