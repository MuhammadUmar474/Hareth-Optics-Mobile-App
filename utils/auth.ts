import { useLocal } from '@/hooks/use-lang';
import { useAuthStore } from '@/store/shopifyStore';
import { router } from 'expo-router';
import { Alert } from 'react-native';

export const useAuth = () => {
  const { isAuthenticated, user, logout, loading, error } = useAuthStore();
  
  return {
    isAuthenticated,
    user,
    logout,
    loading,
    error,
  };
};

export const logoutUser = async () => {
  const { logout } = useAuthStore.getState();
  await logout();
};

export const refreshUserToken = async () => {
  const { refreshToken } = useAuthStore.getState();
  await refreshToken();
};


export const useAuthGuard = () => {
  const { isAuthenticated } = useAuthStore();
  const {t}=useLocal();
  const requireAuth = (action: () => void, message?: string) => {
    if (!isAuthenticated) {
      Alert.alert(
        t("alertMsg.authRequired"),
        message || t("alertMsg.loginContinue"),
        [
          {
            text: t("common.cancel"),
            style: "cancel",
          },
          {
            text: t("auth.login"),
            onPress: () => router.push('/(auth)/login'),
          },
        ]
      );
      return;
    }
    action();
  };

  const checkAuthAndNavigate = (route: string, message?: string) => {
    requireAuth(() => {
      router.push(route as any);
    }, message);
  };

  return {
    isAuthenticated,
    requireAuth,
    checkAuthAndNavigate,
  };
};
