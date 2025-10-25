import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { authApi } from "../services/auth/authApi";
import {
  AuthState,
  CustomerDetails,
  CustomerUpdateInput,
  LoginCredentials,
  SignupCredentials,
} from "../types/auth";
import { useCartStore } from "./cartStore";
import { useWishlistStore } from "./wishlistStore";

let refreshTimer: ReturnType<typeof setTimeout> | null = null;

const scheduleTokenRefresh = (expiresAt: string) => {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
  }

  const expirationDate = new Date(expiresAt);
  const now = new Date();
  const timeUntilExpiry = expirationDate.getTime() - now.getTime();

  // Schedule refresh 5 minutes before expiry
  const refreshTime = timeUntilExpiry - 5 * 60 * 1000;

  if (refreshTime > 0) {
    refreshTimer = setTimeout(async () => {
      try {
        const { refreshToken } = useAuthStore.getState();
        await refreshToken();
      } catch (error) {
        console.error("❌ Auto token refresh failed:", error);
      }
    }, refreshTime);
  }
};

const clearTokenRefreshTimer = () => {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
};

interface AuthStore extends AuthState {
  // Additional state
  customerDetails: CustomerDetails | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  fetchCustomerDetails: () => Promise<void>;
  updateCustomer: (customerData: CustomerUpdateInput) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  checkAuthStatus: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      accessToken: null,
      expiresAt: null,
      user: null,
      customerDetails: null,
      loading: false,
      error: null,

      // Actions
      login: async (credentials: LoginCredentials) => {
        set({ loading: true, error: null });

        try {
          const response = await authApi.login(credentials);

          if (response.customerUserErrors.length > 0) {
            const errorMessage = response.customerUserErrors
              .map((error) => error.message)
              .join(", ");
            set({ error: errorMessage, loading: false });
            throw new Error(errorMessage);
          }

          if (response.customerAccessToken) {
            const { accessToken, expiresAt } = response.customerAccessToken;

            authApi.setAuthToken(accessToken);

            set({
              isAuthenticated: true,
              accessToken,
              expiresAt,
              user: { email: credentials.email },
              loading: false,
              error: null,
            });

            // Set current user in wishlist and cart stores
            await useWishlistStore.getState().setCurrentUser(credentials.email);
            await useCartStore.getState().setCurrentUser(credentials.email);

            scheduleTokenRefresh(expiresAt);

            try {
              await get().fetchCustomerDetails();
            } catch (error) {
              console.error("❌ Failed to fetch customer details:", error);
            }
          } else {
            const errorMessage =
              response.customerUserErrors.length > 0
                ? response.customerUserErrors
                    .map((error) => error.message)
                    .join(", ")
                : "Login failed. Please try again.";
            set({ error: errorMessage, loading: false });
            throw new Error(errorMessage);
          }
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Login failed. Please try again.",
            loading: false,
          });
          throw error;
        }
      },

      signup: async (credentials: SignupCredentials) => {
        set({ loading: true, error: null });

        try {
          const response = await authApi.signup(credentials);

          if (response.customerUserErrors.length > 0) {
            const errorMessage = response.customerUserErrors
              .map((error) => error.message)
              .join(", ");
            set({ error: errorMessage, loading: false });
            throw new Error(errorMessage);
          }

          if (response.customer) {
            // Auto-login after successful signup
            try {
              await get().login({
                email: credentials.email,
                password: credentials.password,
              });

              // Update user with full name from signup
              const { firstName, lastName } = credentials;
              const fullName = `${firstName} ${lastName}`.trim();

              set((state) => ({
                ...state,
                user: state.user
                  ? {
                      ...state.user,
                      name: fullName,
                      firstName,
                      lastName,
                    }
                  : null,
              }));

              // Schedule automatic token refresh after successful auto-login
              const { expiresAt } = get();
              if (expiresAt) {
                scheduleTokenRefresh(expiresAt);
              }
            } catch {
              // If auto-login fails, still show signup success but don't authenticate
              set({ loading: false, error: null });
              throw new Error(
                "Account created successfully, but auto-login failed. Please login manually."
              );
            }
          } else {
            const errorMessage =
              response.customerUserErrors.length > 0
                ? response.customerUserErrors
                    .map((error) => error.message)
                    .join(", ")
                : "Signup failed. Please try again.";
            set({ error: errorMessage, loading: false });
            throw new Error(errorMessage);
          }
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Signup failed. Please try again.",
            loading: false,
          });
          throw error;
        }
      },

      logout: async () => {
        const { accessToken } = get();

        set({ loading: true, error: null });

        try {
          if (accessToken) {
            await authApi.logout(accessToken);
          } else {
          }
        } catch (error) {
          console.error("❌ Logout API error:", error);
        } finally {
          authApi.clearAuthToken();
          clearTokenRefreshTimer();

          set({
            isAuthenticated: false,
            accessToken: null,
            expiresAt: null,
            user: null,
            customerDetails: null,
            loading: false,
            error: null,
          });

          // Clear wishlist and cart user
          await useWishlistStore.getState().setCurrentUser(null);
          await useCartStore.getState().setCurrentUser(null);
        }
      },

      refreshToken: async () => {
        const { accessToken } = get();

        if (!accessToken) return;

        set({ loading: true, error: null });

        try {
          const response = await authApi.refreshToken(accessToken);

          if (response.customerAccessToken) {
            const { accessToken: newToken, expiresAt } =
              response.customerAccessToken;

            authApi.setAuthToken(newToken);

            set({
              accessToken: newToken,
              expiresAt,
              loading: false,
              error: null,
            });

            // Schedule next automatic token refresh
            scheduleTokenRefresh(expiresAt);
          } else {
            throw new Error("No new token received from refresh");
          }
        } catch (error) {
          console.error("❌ Token refresh failed:", error);
          set({
            error:
              error instanceof Error ? error.message : "Token refresh failed",
            loading: false,
          });

          // If refresh fails, logout the user
          get().logout();
        }
      },

      fetchCustomerDetails: async () => {
        const { accessToken } = get();

        if (!accessToken) return;

        try {
          const response = await authApi.getCustomerDetails(accessToken);

          if (response.customer) {
            set({
              customerDetails: response.customer,
            });
          } else {
            throw new Error("No customer details received");
          }
        } catch (error) {
          console.error("❌ Failed to fetch customer details:", error);
          throw error;
        }
      },

      setLoading: (loading) => set({ loading }),

      setError: (error) => set({ error }),

      clearError: () => set({ error: null }),

      checkAuthStatus: async () => {
        const { accessToken, expiresAt } = get();
        if (!accessToken || !expiresAt) {
          set({ isAuthenticated: false });
          return;
        }

        const now = new Date();
        const expirationDate = new Date(expiresAt);
        const timeUntilExpiry = expirationDate.getTime() - now.getTime();
        const minutesUntilExpiry = Math.round(timeUntilExpiry / (1000 * 60));

        // If token has expired, logout
        if (now >= expirationDate) {
          await get().logout();
          return;
        }

        // If token expires in less than 5 minutes, refresh it
        if (minutesUntilExpiry <= 5) {
          try {
            await get().refreshToken();
          } catch {
            console.error("❌ Token refresh failed, user will be logged out");
            return;
          }
        }

        authApi.setAuthToken(accessToken);
        set({ isAuthenticated: true });
      },

      /**
       * Update customer details
       */
      updateCustomer: async (customerData: CustomerUpdateInput) => {
        const { accessToken } = get();
        
        if (!accessToken) {
          throw new Error("No access token available");
        }

        set({ loading: true, error: null });

        try {
          const response = await authApi.updateCustomer(accessToken, customerData);
          
          if (response.data.customerUpdate.customerUserErrors.length > 0) {
            const errorMessage = response.data.customerUpdate.customerUserErrors[0].message;
            set({ loading: false, error: errorMessage });
            throw new Error(errorMessage);
          }

          const updatedCustomer = response.data.customerUpdate.customer;
          const newAccessToken = response.data.customerUpdate.customerAccessToken;

          if (updatedCustomer) {
            set({ 
              customerDetails: updatedCustomer,
              loading: false,
              error: null 
            });

            if (newAccessToken) {
              set({
                accessToken: newAccessToken.accessToken,
                expiresAt: newAccessToken.expiresAt,
              });
            }
          } else {
            throw new Error("Failed to update customer details");
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to update customer details";
          set({ loading: false, error: errorMessage });
          throw error;
        }
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        expiresAt: state.expiresAt,
        user: state.user,
      }),
    }
  )
);
