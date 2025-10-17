import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { authApi } from '../services/auth/authApi';
import { AuthState, LoginCredentials, SignupCredentials } from '../types/auth';

interface AuthStore extends AuthState {
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
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
      loading: false,
      error: null,

      // Actions
      login: async (credentials: LoginCredentials) => {   
        set({ loading: true, error: null });
        
        try {
          const response = await authApi.login(credentials);
          
          if (response.customerUserErrors.length > 0) {
            
            const errorMessage = response.customerUserErrors
              .map(error => error.message)
              .join(', ');
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
          } else {
            const errorMessage = response.customerUserErrors.length > 0 
              ? response.customerUserErrors.map(error => error.message).join(', ')
              : 'Login failed. Please try again.';
            set({ error: errorMessage, loading: false });
            throw new Error(errorMessage);
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Login failed. Please try again.',
            loading: false,
          });
          throw error; // Re-throw to component
        }
      },

      signup: async (credentials: SignupCredentials) => {
        set({ loading: true, error: null });
        
        try {
          const response = await authApi.signup(credentials);
          
          if (response.customerUserErrors.length > 0) {
            const errorMessage = response.customerUserErrors
              .map(error => error.message)
              .join(', ');
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
            } catch {
              // If auto-login fails, still show signup success but don't authenticate
              set({ loading: false, error: null });
              throw new Error("Account created successfully, but auto-login failed. Please login manually.");
            }
          } else {
            const errorMessage = response.customerUserErrors.length > 0 
              ? response.customerUserErrors.map(error => error.message).join(', ')
              : 'Signup failed. Please try again.';
            set({ error: errorMessage, loading: false });
            throw new Error(errorMessage);
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Signup failed. Please try again.',
            loading: false,
          });
          throw error;
        }
      },

      logout: () => {
        // Clear auth token from API client
        authApi.clearAuthToken();
        
        set({
          isAuthenticated: false,
          accessToken: null,
          expiresAt: null,
          user: null,
          loading: false,
          error: null,
        });
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
        
        if (now >= expirationDate) {
          get().logout();
          return;
        }

        authApi.setAuthToken(accessToken);
        set({ isAuthenticated: true });
      },
    }),
    {
      name: 'auth-store',
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
