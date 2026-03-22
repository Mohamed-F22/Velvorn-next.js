import { create } from "zustand";
import { useCartStore } from "./CartState";

interface User {
  fullName?: string;
  email: string;
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (
    data: {
      email: string;
      password: string;
    },
    key: any,
  ) => Promise<{ message: string; status: number; success: boolean }>;
  register: (data: {
    fullName: string;
    email: string;
    password: string;
  }) => Promise<{ message: string; status: number }>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  setUser: (user) => set({ user }),

  login: async (data, key) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Idempotency-Key": key,
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        set({ user: result.user });

        const { cartItems, syncCartWithServer, fetchUserCart } =
          useCartStore.getState();

        if (cartItems.length > 0) {
          await syncCartWithServer();
        } else {
          await fetchUserCart();
        }

        return { success: true, ...result };
      }

      return { success: false, ...result };
    } catch (err) {
      return { success: false, message: "Network error occurred" };
    }
  },

  register: async (data) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        return result;
      }

      if (result.user) {
        set({ user: result.user });
      }
      return result;
    } catch (err) {
      console.error("Register", err);
    }
  },

  logout: async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Logout failed");
      }
    } finally {
      set({ user: null });
      useCartStore.getState().clearCart();
    }
  },
}));
