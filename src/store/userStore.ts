import { create } from "zustand";
import api from "../lib/axios";

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

interface UserState {
  user: User | null;
  fetchUser: () => Promise<void>;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,

  fetchUser: async () => {
    try {
      if (typeof window === "undefined") return;

      // ĐỔI SANG DÙNG LOCALSTORAGE
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await api.get("/auth/me");
      set({ user: response.data.data });
    } catch (error) {
      console.error("Lỗi lấy thông tin User:", error);
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
      }
      set({ user: null });
    }
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      window.location.href = "/login";
    }
    set({ user: null });
  },
}));
