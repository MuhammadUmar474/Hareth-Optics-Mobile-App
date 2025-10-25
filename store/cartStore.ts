import { PrescriptionData } from "@/components/product/lens-type";
import {
  CartLineInput,
  CartLineUpdateInput,
  homeApi,
  ShopifyCart,
} from "@/services/home/homeApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CartState {
  cart: ShopifyCart | null;
  currentUserEmail: string | null;
  loading: boolean;
  error: string | null;
  cartCount: number;
  isLoadingCart: boolean;
}

interface CartActions {
  // Actions
  createCart: (lines: CartLineInput[]) => Promise<boolean>;
  addToCart: (lines: CartLineInput[]) => Promise<boolean>;
  updateCartLines: (lines: CartLineUpdateInput[]) => Promise<boolean>;
  removeFromCart: (lineIds: string[]) => Promise<boolean>;

  // User-specific actions
  setCurrentUser: (email: string | null) => void;
  clearUserCart: () => Promise<void>;
  migrateOldCart: (email: string) => Promise<void>;
  initializeCart: () => Promise<void>;

  // Persistence actions
  loadCart: () => Promise<void>;
  saveCart: () => Promise<void>;
  clearCart: () => Promise<void>;

  // Utility actions
  updateCartCount: (cart: ShopifyCart | null) => void;
  clearError: () => void;
  reset: () => void;
  getCartItemCount: () => number;
  getCartTotal: () => number;
}

type CartStore = CartState & CartActions;

const initialState: CartState = {
  cart: null,
  currentUserEmail: null,
  loading: false,
  error: null,
  cartCount: 0,
  isLoadingCart: false,
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Helper function to update cart count
      updateCartCount: (cart: ShopifyCart | null) => {
        const cartCount = cart
          ? cart.lines.edges.reduce(
              (total, { node }) => total + node.quantity,
              0
            )
          : 0;
        set({ cartCount });
      },

      // Initialize cart on app load
      initializeCart: async () => {
        const { currentUserEmail } = get();
        if (currentUserEmail) {
          await get().loadCart();
        }
      },

      // User-specific cart management
      setCurrentUser: async (email: string | null) => {
        const { currentUserEmail } = get();

        // If user changed, clear current cart and load user-specific cart
        if (currentUserEmail !== email) {
          set({
            currentUserEmail: email,
            cart: null,
            cartCount: 0,
          });

          // Load user-specific cart if user is logged in
          if (email) {
            // First try to migrate old cart if it exists
            await get().migrateOldCart(email);
            get().loadCart();
          } else {
            // Clear cart for logged out user
            get().clearCart();
          }
        }
      },

      // Migrate old cart to user-specific storage
      migrateOldCart: async (email: string) => {
        try {
          const oldCart = await AsyncStorage.getItem("shopify_cart");
          if (oldCart) {
            const cartData = JSON.parse(oldCart);
            if (
              cartData &&
              cartData.lines &&
              cartData.lines.edges &&
              Array.isArray(cartData.lines.edges)
            ) {
              const cartKey = `shopify_cart_${email}`;
              await AsyncStorage.setItem(cartKey, oldCart);
              await AsyncStorage.removeItem("shopify_cart");
            }
          }
        } catch (error) {
          console.error("💾 Cart Store: Failed to migrate old cart:", error);
        }
      },

      clearUserCart: async () => {
        const { currentUserEmail } = get();
        if (currentUserEmail) {
          try {
            await AsyncStorage.removeItem(`shopify_cart_${currentUserEmail}`);
          } catch (error) {
            console.error("💾 Cart Store: Failed to clear user cart:", error);
          }
        }
        set({ cart: null, cartCount: 0 });
      },

      createCart: async (lines: CartLineInput[]) => {
        const { cart } = get();
        if (cart) {
          const result = await get().addToCart(lines);
          return result;
        }

        set({ loading: true, error: null });

        try {
          const response = await homeApi.createCart(lines);
          if (response.cartCreate.userErrors.length > 0) {
            const errorMessage = response.cartCreate.userErrors
              .map((error) => error.message)
              .join(", ");
            set({
              loading: false,
              error: errorMessage,
            });
            return false;
          }

          if (response.cartCreate.cart) {
            set({
              cart: response.cartCreate.cart,
              loading: false,
              error: null,
            });
            get().updateCartCount(response.cartCreate.cart);
            await get().saveCart();
            return true;
          }

          set({
            loading: false,
            error: "Failed to create cart",
          });
          return false;
        } catch (error) {
          set({
            loading: false,
            error:
              error instanceof Error ? error.message : "Failed to create cart",
          });
          return false;
        }
      },

      addToCart: async (lines: CartLineInput[]) => {
        const { cart } = get();
        if (!cart) {
          console.error("🛒 Cart Store: No cart found for addToCart");
          set({ error: "No cart found" });
          return false;
        }

        set({ loading: true, error: null });

        try {
          const response = await homeApi.addToCart(cart.id, lines);

          if (response.cartLinesAdd.userErrors.length > 0) {
            const errorMessage = response.cartLinesAdd.userErrors
              .map((error: any) => error.message)
              .join(", ");
            console.error("🛒 Cart Store: API user errors:", errorMessage);
            set({
              loading: false,
              error: errorMessage,
            });
            return false;
          }

          if (response.cartLinesAdd.cart) {
            set({
              cart: response.cartLinesAdd.cart,
              loading: false,
              error: null,
            });
            get().updateCartCount(response.cartLinesAdd.cart);
            await get().saveCart();
            return true;
          }

          console.error("🛒 Cart Store: No cart returned from API");
          set({
            loading: false,
            error: "Failed to add to cart",
          });
          return false;
        } catch (error) {
          console.error("🛒 Cart Store: addToCart error:", error);
          set({
            loading: false,
            error:
              error instanceof Error ? error.message : "Failed to add to cart",
          });
          return false;
        }
      },

      updateCartLines: async (lines: CartLineUpdateInput[]) => {
        const { cart } = get();
        if (!cart) {
          set({ error: "No cart found" });
          return false;
        }

        set({ loading: true, error: null });

        try {
          const response = await homeApi.updateCartLines(cart.id, lines);

          if (response.cartLinesUpdate.userErrors.length > 0) {
            const errorMessage = response.cartLinesUpdate.userErrors
              .map((error) => error.message)
              .join(", ");
            set({
              loading: false,
              error: errorMessage,
            });
            return false;
          }

          if (response.cartLinesUpdate.cart) {
            set({
              cart: response.cartLinesUpdate.cart,
              loading: false,
              error: null,
            });
            get().updateCartCount(response.cartLinesUpdate.cart);
            await get().saveCart();
            return true;
          }

          set({
            loading: false,
            error: "Failed to update cart",
          });
          return false;
        } catch (error) {
          set({
            loading: false,
            error:
              error instanceof Error ? error.message : "Failed to update cart",
          });
          return false;
        }
      },

      removeFromCart: async (lineIds: string[]) => {
        const { cart } = get();
        if (!cart) {
          set({ error: "No cart found" });
          return false;
        }
        set({ loading: true, error: null });

        try {
          const response = await homeApi.removeFromCart(cart.id, lineIds);
          if (response.cartLinesRemove.userErrors.length > 0) {
            const errorMessage = response.cartLinesRemove.userErrors
              .map((error) => error.message)
              .join(", ");
            set({
              loading: false,
              error: errorMessage,
            });
            return false;
          }

          if (response.cartLinesRemove.cart) {
            set({
              cart: response.cartLinesRemove.cart,
              loading: false,
              error: null,
            });
            get().updateCartCount(response.cartLinesRemove.cart);
            await get().saveCart();
            return true;
          }

          set({
            loading: false,
            error: "Failed to remove from cart",
          });
          return false;
        } catch (error) {
          set({
            loading: false,
            error:
              error instanceof Error
                ? error.message
                : "Failed to remove from cart",
          });
          return false;
        }
      },

      clearError: () => set({ error: null }),

      reset: () => set(initialState),

      // Clear cart and storage
      clearCart: async () => {
        try {
          const { currentUserEmail } = get();
          if (currentUserEmail) {
            await AsyncStorage.removeItem(`shopify_cart_${currentUserEmail}`);
          }
          set({ cart: null, cartCount: 0, currentUserEmail: null });
        } catch (error) {
          console.error("💾 Cart Store: Failed to clear cart:", error);
        }
      },

      loadCart: async () => {
        const { isLoadingCart, currentUserEmail } = get();

        if (isLoadingCart) {
          return;
        }

        try {
          set({ isLoadingCart: true });

          // If no user is logged in, clear cart
          if (!currentUserEmail) {
            set({ cart: null, cartCount: 0, isLoadingCart: false });
            return;
          }

          // Load user-specific cart
          const cartKey = `shopify_cart_${currentUserEmail}`;
          const savedCart = await AsyncStorage.getItem(cartKey);

          if (savedCart) {
            const cartData = JSON.parse(savedCart);

            // Validate cart data structure
            if (
              cartData &&
              cartData.lines &&
              cartData.lines.edges &&
              Array.isArray(cartData.lines.edges)
            ) {
              const cartCount = cartData.lines.edges.reduce(
                (total: number, { node }: any) => {
                  return total + (node?.quantity || 0);
                },
                0
              );
              set({ cart: cartData, cartCount, isLoadingCart: false });
            } else {
              await AsyncStorage.removeItem(cartKey);
              set({ cart: null, cartCount: 0, isLoadingCart: false });
            }
          } else {
            set({ cart: null, cartCount: 0, isLoadingCart: false });
          }
        } catch (error) {
          console.error(
            "💾 Cart Store: Failed to load cart from storage:",
            error
          );
          try {
            if (currentUserEmail) {
              await AsyncStorage.removeItem(`shopify_cart_${currentUserEmail}`);
            }
          } catch (clearError) {
            console.error(
              "💾 Cart Store: Failed to clear corrupted cart:",
              clearError
            );
          }
          set({ cart: null, cartCount: 0, isLoadingCart: false });
        }
      },

      saveCart: async () => {
        try {
          const { cart, currentUserEmail } = get();
          if (cart && currentUserEmail) {
            const cartKey = `shopify_cart_${currentUserEmail}`;
            await AsyncStorage.setItem(cartKey, JSON.stringify(cart));
          }
        } catch (error) {
          console.error(
            "💾 Cart Store: Failed to save cart to storage:",
            error
          );
        }
      },

      getCartItemCount: () => {
        const { cart } = get();
        if (!cart) return 0;
        return cart.lines.edges.reduce(
          (total, { node }) => total + node.quantity,
          0
        );
      },

      getCartTotal: () => {
        const { cart } = get();
        if (!cart) return 0;
        return cart.lines.edges.reduce((total, { node }) => {
          const priceAmount = node.merchandise.price?.amount || "0.00";
          const itemPrice = parseFloat(priceAmount);
          return total + itemPrice * node.quantity;
        }, 0);
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        currentUserEmail: state.currentUserEmail,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && state.currentUserEmail) {
          state.loadCart();
        }
      },
    }
  )
);

export const prescriptionToCartAttributes = (
  prescription: PrescriptionData,
  productId?: string
) => {
  const attributes = [
    { key: "Lens Type", value: prescription.lensType },
    { key: "Left Eye (L)", value: prescription.leftEye },
    { key: "Right Eye (R)", value: prescription.rightEye },
    { key: "Lens Tint", value: prescription.lensTint },
    { key: "Blue Light Filter", value: prescription.blueLightFilter },
  ];

  if (productId) {
    attributes.push({ key: "Product ID", value: productId });
  }

  return attributes;
};
