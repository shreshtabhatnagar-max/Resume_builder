import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import { AuthResponse } from "@/types";

interface AuthState {
  user: AuthResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: AuthResponse, token: string) => void;
  updateUser: (user: Partial<AuthResponse>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        Cookies.set("auth_token", token, { expires: 7, sameSite: "Lax" });
        set({ user, token, isAuthenticated: true });
      },

      updateUser: (partialUser) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partialUser } : null,
        })),

      logout: () => {
        Cookies.remove("auth_token");
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
