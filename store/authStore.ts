import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AuthState = {
  token: string | null;
  refreshToken: string | null;
  userId: string | null;
  customerAccessToken: string | null;
};

type AuthActions = {
  authenticate: (payload: {
    token: string;
    refreshToken: string;
    userId: string;
    customerAccessToken?: string;
  }) => void;

  setCustomerAccessToken: (customerAccessToken: string) => void;
  unauthenticate: () => void;
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      userId: null,
      customerAccessToken: null,

      authenticate: ({ token, refreshToken, userId, customerAccessToken }) =>
        set({ token, refreshToken, userId, customerAccessToken }),

      setCustomerAccessToken: (customerAccessToken) =>
        set({ customerAccessToken }),

      unauthenticate: () =>
        set({ token: null, refreshToken: null, userId: null, customerAccessToken: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage), 
    }
  )
);
