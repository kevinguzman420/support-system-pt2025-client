import type { IUser } from "@/lib/mock-data";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Store = {
  user: IUser | null;
  setUser: (user: IUser) => void;
  clearUser: () => void;
};

export const userStore = create<Store>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "user",
    }
  )
);