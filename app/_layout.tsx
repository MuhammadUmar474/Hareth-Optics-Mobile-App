import { AuthProvider } from "@/components/auth/AuthProvider";
import { COLORS } from "@/constants/colors";
import { useLangStore } from "@/store/langStore";
import { initI18n } from "@/utils/i18n";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { StatusBar, View } from "react-native";
import "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ToastProvider } from "react-native-toast-notifications";

export default function RootLayout() {
  const insets = useSafeAreaInsets();
  const language = useLangStore((s) => s.language);

  useEffect(() => {
    initI18n();
  }, [language]);

  return (
    <ToastProvider>
      <AuthProvider>
        <ThemeProvider value={DefaultTheme}>
          <StatusBar />
          <View style={{ backgroundColor: COLORS.white, height: insets.top }} />
          <Stack>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="product-details" options={{ headerShown: false }} />
            <Stack.Screen name="size-guide" options={{ headerShown: false }} />
            <Stack.Screen name="shopping-cart" options={{ headerShown: false }} />
            <Stack.Screen name="wishlist" options={{ headerShown: false }} />
            <Stack.Screen
              name="delivery-address"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="delivery" options={{ headerShown: false }} />
            <Stack.Screen name="payment" options={{ headerShown: false }} />
            <Stack.Screen name="order-detail" options={{ headerShown: false }} />
            <Stack.Screen name="order-summary" options={{ headerShown: false }} />
            <Stack.Screen
              name="order-confirmation"
              options={{ headerShown: false }}
            />
          </Stack>
        </ThemeProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
