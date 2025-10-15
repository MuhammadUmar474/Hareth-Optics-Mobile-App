import { CartItem } from "@/constants/data";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type CartState = {
  cartItems: CartItem[];
  cartCount: number;
};

type CartActions = {
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState & CartActions>()(
  persist(
    (set, get) => ({
      cartItems: [],
      cartCount: 0,

      addToCart: (item) =>
        set((state) => {
          const existingItem = state.cartItems.find((i) => i.id === item.id);
          let newCartItems: CartItem[];

          if (existingItem) {
            newCartItems = state.cartItems.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            );
          } else {
            newCartItems = [...state.cartItems, { ...item, quantity: 1 }];
          }

          const cartCount = newCartItems.reduce(
            (sum, item) => sum + item.quantity,
            0
          );

          return { cartItems: newCartItems, cartCount };
        }),

      removeFromCart: (id) =>
        set((state) => {
          const newCartItems = state.cartItems.filter((item) => item.id !== id);
          const cartCount = newCartItems.reduce(
            (sum, item) => sum + item.quantity,
            0
          );
          return { cartItems: newCartItems, cartCount };
        }),

      updateQuantity: (id, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            const newCartItems = state.cartItems.filter(
              (item) => item.id !== id
            );
            const cartCount = newCartItems.reduce(
              (sum, item) => sum + item.quantity,
              0
            );
            return { cartItems: newCartItems, cartCount };
          }

          const newCartItems = state.cartItems.map((item) =>
            item.id === id ? { ...item, quantity } : item
          );

          const cartCount = newCartItems.reduce(
            (sum, item) => sum + item.quantity,
            0
          );

          return { cartItems: newCartItems, cartCount };
        }),

      clearCart: () => set({ cartItems: [], cartCount: 0 }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

