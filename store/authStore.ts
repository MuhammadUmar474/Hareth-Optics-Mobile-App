import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AuthState = {
  token: string | null;
  refreshToken: string | null;
  userId: string | null;
};

type AuthActions = {
  authenticate: (payload: {
    token: string;
    refreshToken: string;
    userId: string;
  }) => void;

  unauthenticate: () => void;
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      userId: null,

      authenticate: ({ token, refreshToken, userId }) =>
        set({ token, refreshToken, userId }),

      unauthenticate: () =>
        set({ token: null, refreshToken: null, userId: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage), 
    }
  )
);
