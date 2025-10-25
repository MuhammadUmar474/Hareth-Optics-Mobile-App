import { CartItem } from "@/constants/data";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type WishlistItem = Omit<CartItem, "quantity">;

type UserWishlist = {
  [userEmail: string]: WishlistItem[];
};

type WishlistState = {
  userWishlists: UserWishlist;
  currentUserEmail: string | null;
  wishlistItems: WishlistItem[];
  wishlistCount: number;
};

type WishlistActions = {
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: number) => void;
  toggleWishlist: (item: WishlistItem) => void;
  isInWishlist: (id: number) => boolean;
  clearWishlist: () => void;
  setCurrentUser: (email: string | null) => Promise<void>;
  loadUserWishlist: (email: string) => void;
  clearUserWishlist: () => void;
  migrateOldWishlist: (email: string) => Promise<void>;
  initializeWishlist: () => void;
  forceSave: () => Promise<void>;
  saveUserWishlist: (email: string, items: WishlistItem[]) => Promise<void>;
  loadUserWishlistFromStorage: (email: string) => Promise<WishlistItem[]>;
};

export const useWishlistStore = create<WishlistState & WishlistActions>()(
  persist(
    (set, get) => ({
      userWishlists: {},
      currentUserEmail: null,
      wishlistItems: [],
      wishlistCount: 0,

      // Initialize wishlist on app load
      initializeWishlist: () => {
        const { currentUserEmail } = get();
        if (currentUserEmail) {
          get().loadUserWishlist(currentUserEmail);
        }
      },

      setCurrentUser: async (email) => {
        const { userWishlists } = get();
        set({ currentUserEmail: email });

        // Load user-specific wishlist if user is logged in
        if (email) {
          await get().migrateOldWishlist(email);
          const userWishlistItems = await get().loadUserWishlistFromStorage(
            email
          );
          set({
            wishlistItems: userWishlistItems,
            wishlistCount: userWishlistItems.length,
            userWishlists: {
              ...userWishlists,
              [email]: userWishlistItems,
            },
          });
        } else {
          get().clearUserWishlist();
        }
      },

      loadUserWishlist: (email) => {
        const { userWishlists } = get();
        const userWishlist = userWishlists[email] || [];
        set({
          wishlistItems: userWishlist,
          wishlistCount: userWishlist.length,
        });
      },

      addToWishlist: (item) => {
        const { currentUserEmail, userWishlists, wishlistItems } = get();

        if (!currentUserEmail) {
          console.warn("User not logged in, cannot add to wishlist");
          return;
        }

        const exists = wishlistItems.find((i) => i.id === item.id);
        if (exists) {
          return;
        }

        const newWishlistItems = [...wishlistItems, item];
        const updatedUserWishlists = {
          ...userWishlists,
          [currentUserEmail]: newWishlistItems,
        };

        set({
          userWishlists: updatedUserWishlists,
          wishlistItems: newWishlistItems,
          wishlistCount: newWishlistItems.length,
        });
      },

      removeFromWishlist: (id) => {
        const { currentUserEmail, userWishlists, wishlistItems } = get();

        if (!currentUserEmail) {
          console.warn("User not logged in, cannot remove from wishlist");
          return;
        }

        const newWishlistItems = wishlistItems.filter((item) => item.id !== id);
        const updatedUserWishlists = {
          ...userWishlists,
          [currentUserEmail]: newWishlistItems,
        };

        set({
          userWishlists: updatedUserWishlists,
          wishlistItems: newWishlistItems,
          wishlistCount: newWishlistItems.length,
        });
      },

      toggleWishlist: (item) => {
        const { currentUserEmail, userWishlists, wishlistItems } = get();

        if (!currentUserEmail) {
          console.warn("User not logged in, cannot toggle wishlist");
          return;
        }

        const exists = wishlistItems.find((i) => i.id === item.id);
        let newWishlistItems: WishlistItem[];

        if (exists) {
          newWishlistItems = wishlistItems.filter((i) => i.id !== item.id);
        } else {
          newWishlistItems = [...wishlistItems, item];
        }

        const updatedUserWishlists = {
          ...userWishlists,
          [currentUserEmail]: newWishlistItems,
        };

        set({
          userWishlists: updatedUserWishlists,
          wishlistItems: newWishlistItems,
          wishlistCount: newWishlistItems.length,
        });

        // Save to user-specific storage
        get().saveUserWishlist(currentUserEmail, newWishlistItems);
      },

      isInWishlist: (id) => {
        const { wishlistItems } = get();
        return wishlistItems.some((item) => item.id === id);
      },

      clearWishlist: () => {
        const { currentUserEmail, userWishlists } = get();

        if (!currentUserEmail) {
          console.warn("User not logged in, cannot clear wishlist");
          return;
        }

        const updatedUserWishlists = {
          ...userWishlists,
          [currentUserEmail]: [],
        };

        set({
          userWishlists: updatedUserWishlists,
          wishlistItems: [],
          wishlistCount: 0,
        });
      },

      clearUserWishlist: () => {
        set({
          userWishlists: {},
          currentUserEmail: null,
          wishlistItems: [],
          wishlistCount: 0,
        });
      },

      // Migrate old wishlist to user-specific storage
      migrateOldWishlist: async (email) => {
        try {
          const oldWishlist = await AsyncStorage.getItem("wishlist-storage");
          if (oldWishlist) {
            const oldData = JSON.parse(oldWishlist);

            if (
              oldData &&
              oldData.wishlistItems &&
              Array.isArray(oldData.wishlistItems)
            ) {
              await get().saveUserWishlist(email, oldData.wishlistItems);
              await AsyncStorage.removeItem("wishlist-storage");
            }
          }
        } catch (error) {
          console.error(
            "💾 Wishlist Store: Failed to migrate old wishlist:",
            error
          );
        }
      },

      // Force save current state to storage
      forceSave: async () => {
        try {
          const {
            userWishlists,
            currentUserEmail,
            wishlistItems,
            wishlistCount,
          } = get();
          const dataToSave = {
            state: {
              userWishlists,
              currentUserEmail,
              wishlistItems,
              wishlistCount,
            },
            version: 0,
          };
          await AsyncStorage.setItem(
            "wishlist-storage",
            JSON.stringify(dataToSave)
          );
        } catch (error) {
          console.error("💾 Wishlist Store: Force save error:", error);
        }
      },

      // Manual save function for user-specific wishlist
      saveUserWishlist: async (email: string, items: WishlistItem[]) => {
        try {
          const key = `wishlist_${email}`;
          await AsyncStorage.setItem(key, JSON.stringify(items));
        } catch (error) {
          console.error("💾 Wishlist Store: Save user wishlist error:", error);
        }
      },

      // Manual load function for user-specific wishlist
      loadUserWishlistFromStorage: async (
        email: string
      ): Promise<WishlistItem[]> => {
        try {
          const key = `wishlist_${email}`;
          const stored = await AsyncStorage.getItem(key);
          if (stored) {
            const items = JSON.parse(stored);
            return items;
          }
          return [];
        } catch (error) {
          console.error("💾 Wishlist Store: Load user wishlist error:", error);
          return [];
        }
      },
    }),
    {
      name: "wishlist-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        userWishlists: state.userWishlists,
        currentUserEmail: state.currentUserEmail,
        wishlistItems: state.wishlistItems,
        wishlistCount: state.wishlistCount,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && state.currentUserEmail) {
          setTimeout(() => {
            state.loadUserWishlist(state.currentUserEmail!);
          }, 100);
        }
      },
    }
  )
);
