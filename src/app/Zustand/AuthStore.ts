import { create } from "zustand";

interface User {
  fullName?: string;
  email: string;
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (data: {
    email: string;
    password: string;
  }) => Promise<{ message: string; status: number }>;
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

  login: async (data) => {
    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        return result;
      }

      set({ user: result.user });
      return result;
    } catch (err) {
      console.error("Login", err);
    }
  },

  register: async (data) => {
    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
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
      const res = await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Logout failed");
      }
    } finally {
      set({ user: null });
    }
  },
}));
