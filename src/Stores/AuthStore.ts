import { create } from "zustand";
import { useCartStore } from "./CartState";
import { createJSONStorage, persist } from "zustand/middleware";

interface User {
  fullName?: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  login: (
    data: {
      email: string;
      password: string;
    },
    key: any,
  ) => Promise<{ message: string; status: number; success: boolean }>;
  register: (
    data: {
      fullName: string;
      email: string;
      password: string;
    },
    key: any,
  ) => Promise<{ message: string; status: number; success: boolean }>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,

      setUser: (user) => set({ user }),

      login: async (data, key) => {
        set({ isLoading: true });
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
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (data, key) => {
        set({ isLoading: true });
        try {
          const res = await fetch("/api/auth/register", {
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

            const { cartItems, syncCartWithServer } = useCartStore.getState();
            if (cartItems.length > 0) {
              await syncCartWithServer();
            }
            return { success: true, ...result };
          }
          return { success: false, ...result };
        } catch (err) {
          return { success: false, message: "Network error occurred" };
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        set({ isLoading: true });

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
          set({ isLoading: false });
        }
      },
    }),

    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
