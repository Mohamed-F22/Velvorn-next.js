import { create } from "zustand";

export type AdminUser = {
  id: string;
  fullName: string;
  email: string;
  role: "admin" | "staff";
};

type AdminAuthState = {
  user: AdminUser | null;
  isLoading: boolean;
  hydrated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  setUser: (user: AdminUser | null) => void;
};

export const useAdminAuthStore = create<AdminAuthState>((set) => ({
  user: null,
  isLoading: false,
  hydrated: false,

  setUser: (user) => set({ user }),

  fetchMe: async () => {
    try {
      const res = await fetch("/api/admin/auth/me", { credentials: "include" });
      if (!res.ok) {
        set({ user: null, hydrated: true });
        return;
      }
      const data = await res.json();
      set({ user: data.user, hydrated: true });
    } catch {
      set({ user: null, hydrated: true });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        set({ isLoading: false });
        return { success: false, message: data.message || "Login failed" };
      }
      set({ user: data.user, isLoading: false, hydrated: true });
      return { success: true };
    } catch {
      set({ isLoading: false });
      return { success: false, message: "Login failed" };
    }
  },

  logout: async () => {
    await fetch("/api/admin/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    set({ user: null });
  },
}));
