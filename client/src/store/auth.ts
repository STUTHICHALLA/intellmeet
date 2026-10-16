import { create } from "zustand";
import { api } from "../lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: "",

  signup: async (name, email, password) => {
    try {
      const { data } = await api.post("/auth/signup", { name, email, password });
      localStorage.setItem("accessToken", data.accessToken);
      set({ user: data.user, error: "" });
      return true;
    } catch (e: any) {
      set({ error: e.response?.data?.message || "Signup failed" });
      return false;
    }
  },

  login: async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("accessToken", data.accessToken);
      set({ user: data.user, error: "" });
      return true;
    } catch (e: any) {
      set({ error: e.response?.data?.message || "Login failed" });
      return false;
    }
  },

  logout: async () => {
    await api.post("/auth/logout").catch(() => {});
    localStorage.removeItem("accessToken");
    set({ user: null });
  },

  loadUser: async () => {
    try {
      const { data } = await api.post("/auth/refresh");
      localStorage.setItem("accessToken", data.accessToken);
      set({ user: data.user, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },
}));