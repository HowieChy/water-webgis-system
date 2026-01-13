import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  token: string | null;
  userInfo: any | null;
  login: (token: string, userInfo: any) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      token: null,
      userInfo: null,
      login: (token, userInfo) => set({ token, userInfo }),
      logout: () => set({ token: null, userInfo: null }),
    }),
    {
      name: "water-webgis-user-storage",
    }
  )
);
