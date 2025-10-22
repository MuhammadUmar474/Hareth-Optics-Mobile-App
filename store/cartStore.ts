import { PrescriptionData } from "@/components/product/lens-type";
import {
  CartLineInput,
  CartLineUpdateInput,
  homeApi,
  ShopifyCart,
} from "@/services/home/homeApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

interface CartState {
  cart: ShopifyCart | null;
  loading: boolean;
  error: string | null;
  cartCount: number;
  isLoadingCart: boolean;
}

interface CartActions {
  // Actions
  createCart: (lines: CartLineInput[]) => Promise<boolean>;
  updateCartLines: (lines: CartLineUpdateInput[]) => Promise<boolean>;
  removeFromCart: (lineIds: string[]) => Promise<boolean>;

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
  loading: false,
  error: null,
  cartCount: 0,
  isLoadingCart: false,
};

export const useCartStore = create<CartStore>((set, get) => ({
  ...initialState,

  // Helper function to update cart count
  updateCartCount: (cart: ShopifyCart | null) => {
    const cartCount = cart
      ? cart.lines.edges.reduce((total, { node }) => total + node.quantity, 0)
      : 0;
    set({ cartCount });
  },

  createCart: async (lines: CartLineInput[]) => {
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
        error: error instanceof Error ? error.message : "Failed to create cart",
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
        error: error instanceof Error ? error.message : "Failed to update cart",
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
          error instanceof Error ? error.message : "Failed to remove from cart",
      });
      return false;
    }
  },

  clearError: () => set({ error: null }),

  reset: () => set(initialState),

  // Clear cart and storage
  clearCart: async () => {
    try {
      await AsyncStorage.removeItem("shopify_cart");
      set(initialState);
    } catch (error) {
      console.error("💾 Cart Store: Failed to clear cart:", error);
    }
  },

  // Persistence methods
  loadCart: async () => {
    const { isLoadingCart } = get();

    if (isLoadingCart) {
      return;
    }

    try {
      set({ isLoadingCart: true });
      const savedCart = await AsyncStorage.getItem("shopify_cart");
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
          await AsyncStorage.removeItem("shopify_cart");
          set({ cart: null, cartCount: 0, isLoadingCart: false });
        }
      } else {
        set({ cart: null, cartCount: 0, isLoadingCart: false });
      }
    } catch (error) {
      console.error("💾 Cart Store: Failed to load cart from storage:", error);
      try {
        await AsyncStorage.removeItem("shopify_cart");
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
      const { cart } = get();
      if (cart) {
        await AsyncStorage.setItem("shopify_cart", JSON.stringify(cart));
      }
    } catch (error) {
      console.error("💾 Cart Store: Failed to save cart to storage:", error);
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
}));

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
