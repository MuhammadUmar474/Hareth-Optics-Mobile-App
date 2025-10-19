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
  setCurrentUser: (email: string | null) => void;
  loadUserWishlist: (email: string) => void;
  clearUserWishlist: () => void;
};

export const useWishlistStore = create<WishlistState & WishlistActions>()(
  persist(
    (set, get) => ({
      userWishlists: {},
      currentUserEmail: null,
      wishlistItems: [],
      wishlistCount: 0,

      setCurrentUser: (email) => {
        set({ currentUserEmail: email });
        if (email) {
          get().loadUserWishlist(email);
        } else {
          set({ wishlistItems: [], wishlistCount: 0 });
        }
      },

      loadUserWishlist: (email) => {
        const { userWishlists } = get();
        const userWishlist = userWishlists[email] || [];
        set({ 
          wishlistItems: userWishlist, 
          wishlistCount: userWishlist.length 
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
          wishlistCount: 0 
        });
      },
    }),
    {
      name: "wishlist-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        userWishlists: state.userWishlists,
        currentUserEmail: state.currentUserEmail,
      }),
    }
  )
);

