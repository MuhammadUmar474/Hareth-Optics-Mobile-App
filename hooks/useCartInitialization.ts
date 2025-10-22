import { useCartStore } from "@/store/cartStore";
import { useEffect, useRef } from "react";
import { AppState } from "react-native";

/**
 * Hook to initialize cart on app start and handle app state changes
 * This ensures cart data is loaded when the app starts and refreshed when app becomes active
 */
export const useCartInitialization = () => {
  const { loadCart, cart, cartCount } = useCartStore();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      loadCart();
    }
  }, []);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === "active") {
        loadCart();
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription?.remove();
    };
  }, []);

  return { cart, cartCount };
};
