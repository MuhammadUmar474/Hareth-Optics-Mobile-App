import { useAuthStore } from '@/store/shopifyStore';
import { useWishlistStore } from '@/store/wishlistStore';
import React, { useEffect } from 'react';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { checkAuthStatus, isAuthenticated, user } = useAuthStore();
  const { setCurrentUser } = useWishlistStore();

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Sync wishlist with current user when auth status changes
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      setCurrentUser(user.email);
    } else {
      setCurrentUser(null);
    }
  }, [isAuthenticated, user?.email, setCurrentUser]);

  return <>{children}</>;
};
