import { CartItem } from "@/constants/data";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type WishlistItem = Omit<CartItem, "quantity">;

type WishlistState = {
  wishlistItems: WishlistItem[];
  wishlistCount: number;
};

type WishlistActions = {
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: number) => void;
  toggleWishlist: (item: WishlistItem) => void;
  isInWishlist: (id: number) => boolean;
  clearWishlist: () => void;
};

export const useWishlistStore = create<WishlistState & WishlistActions>()(
  persist(
    (set, get) => ({
      wishlistItems: [],
      wishlistCount: 0,

      addToWishlist: (item) =>
        set((state) => {
          const exists = state.wishlistItems.find((i) => i.id === item.id);
          if (exists) {
            return state;
          }
          const newWishlistItems = [...state.wishlistItems, item];
          return {
            wishlistItems: newWishlistItems,
            wishlistCount: newWishlistItems.length,
          };
        }),

      removeFromWishlist: (id) =>
        set((state) => {
          const newWishlistItems = state.wishlistItems.filter(
            (item) => item.id !== id
          );
          return {
            wishlistItems: newWishlistItems,
            wishlistCount: newWishlistItems.length,
          };
        }),

      toggleWishlist: (item) =>
        set((state) => {
          const exists = state.wishlistItems.find((i) => i.id === item.id);
          let newWishlistItems: WishlistItem[];

          if (exists) {
            newWishlistItems = state.wishlistItems.filter(
              (i) => i.id !== item.id
            );
          } else {
            newWishlistItems = [...state.wishlistItems, item];
          }

          return {
            wishlistItems: newWishlistItems,
            wishlistCount: newWishlistItems.length,
          };
        }),

      isInWishlist: (id) => {
        return get().wishlistItems.some((item) => item.id === id);
      },

      clearWishlist: () => set({ wishlistItems: [], wishlistCount: 0 }),
    }),
    {
      name: "wishlist-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

