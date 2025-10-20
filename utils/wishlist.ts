import { useAuthStore } from "@/store/shopifyStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { router } from "expo-router";
import { Alert } from "react-native";

/**
 * Check if user is authenticated for wishlist actions
 */
export const useWishlistAuth = () => {
  const { isAuthenticated } = useAuthStore();
  const checkAuthAndShowAlert = (action: () => void) => {
    if (!isAuthenticated) {
      Alert.alert(
        "Login Required",
        "You need to be logged in to add items to your wishlist. Please login to continue.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Login",
            style: "default",
            onPress: () => router.push("/(auth)/login"),
          },
        ]
      );
      return false;
    }
    return true;
  };

  const checkAuthForWishlistView = () => {
    // if (!isAuthenticated) {
    //   Alert.alert(
    //     "Login Required",
    //     "You need to be logged in to view your wishlist. Please login to continue.",
    //     [
    //       {
    //         text: "Cancel",
    //         style: "cancel",
    //       },
    //       {
    //         text: "Login",
    //         style: "default",
    //         onPress: () => router.push("/(auth)/login"),
    //       },
    //     ]
    //   );
    //   return false;
    // }
    return true;
  };

  return {
    isAuthenticated,
    checkAuthAndShowAlert,
    checkAuthForWishlistView,
  };
};

/**
 * Hook for wishlist actions with authentication checks
 */
export const useWishlistActions = () => {
  const { isAuthenticated } = useAuthStore();
  const { toggleWishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const { checkAuthAndShowAlert } = useWishlistAuth();

  const handleToggleWishlist = (item: any) => {
    if (checkAuthAndShowAlert(() => toggleWishlist(item))) {
      toggleWishlist(item);
    }
  };

  const handleAddToWishlist = (item: any) => {
    if (checkAuthAndShowAlert(() => addToWishlist(item))) {
      addToWishlist(item);
    }
  };

  const handleRemoveFromWishlist = (id: number) => {
    if (isAuthenticated) {
      removeFromWishlist(id);
    }
  };

  return {
    isAuthenticated,
    toggleWishlist: handleToggleWishlist,
    addToWishlist: handleAddToWishlist,
    removeFromWishlist: handleRemoveFromWishlist,
    isInWishlist,
  };
};
