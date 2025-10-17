import { useAuthStore } from '@/store/shopifyStore';
import React, { useEffect } from 'react';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { checkAuthStatus } = useAuthStore();

  useEffect(() => {
    checkAuthStatus();
  }, [ checkAuthStatus ]);

  return <>{children}</>;
};
