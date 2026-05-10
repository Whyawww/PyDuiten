import { create } from "zustand";

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  photo?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem("user_data") || "null"),
  token: localStorage.getItem("auth_token"),
  isAuthenticated: !!localStorage.getItem("auth_token"),

  login: (userData, token) => {
    localStorage.setItem("auth_token", token);
    localStorage.setItem("user_data", JSON.stringify(userData));
    set({ user: userData, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
    document.documentElement.classList.remove("dark");
    set({ user: null, token: null, isAuthenticated: false });
  },
  updateUser: (updatedData) => {
    set((state) => {
      if (!state.user) return state;
      const newUser = { ...state.user, ...updatedData };
      localStorage.setItem("user_data", JSON.stringify(newUser));
      return { user: newUser };
    });
  },
}));
