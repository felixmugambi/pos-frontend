import { create } from "zustand";
import { api } from "@/lib/api";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  loading: false,
  hydrated: false,

  login: async (credentials) => {
    try {
      set({ loading: true, error: null });
  
      const data = await api.login(credentials);
  
      // safety check (VERY IMPORTANT)
      if (!data?.token || !data?.user) {
        throw new Error("Invalid login response");
      }
  
      localStorage.setItem("token", data.token);
  
      set({
        user: data.user,
        token: data.token,
        loading: false,
        hydrated: true,
      });
  
      return true; // ✅ success flag
    } catch (err) {
      set({
        loading: false,
        user: null,
        token: null,
        error: err.message,
      });
  
      throw err; // 🔥 important so UI can catch it
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({
      user: null,
      token: null,
      hydrated: true, // 🔥 important
    });
  },

  initAuth: async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      set({ hydrated: true });
      return;
    }

    try {
      set({ loading: true });

      const data = await api.getMe();

      set({
        user: data.user,
        token,
        loading: false,
        hydrated: true,
      });

    } catch (err) {
      localStorage.removeItem("token");

      set({
        user: null,
        token: null,
        loading: false,
        hydrated: true,
      });
    }
  },
}));