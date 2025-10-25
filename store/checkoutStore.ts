import {
  Checkout,
  checkoutApi,
  CustomerOrder,
  MailingAddressInput,
  ShippingRate
} from "@/services/checkout-api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { useCartStore } from "./cartStore";
import { useAuthStore } from "./shopifyStore";

interface CheckoutState {
  checkout: Checkout | null;
  customerAccessToken: string | null;
  
  shippingAddress: MailingAddressInput | null;
  availableShippingRates: ShippingRate[];
  selectedShippingRate: ShippingRate | null;
  customerOrders: CustomerOrder[];
  
  loading: boolean;
  error: string | null;
  
  currentStep: 'address' | 'shipping' | 'payment' | 'complete';
  isCheckoutInProgress: boolean;
}

interface CheckoutActions {
  createCheckout: (customerAccessToken?: string) => Promise<boolean>;
  updateShippingAddress: (address: MailingAddressInput) => Promise<boolean>;
  getShippingRates: () => Promise<boolean>;
  selectShippingRate: (shippingRate: ShippingRate) => Promise<boolean>;
  associateCustomer: () => Promise<boolean>;
  
  getCustomerOrders: () => Promise<boolean>;
  
  setCurrentStep: (step: CheckoutState['currentStep']) => void;
  setSelectedShippingRate: (rate: ShippingRate | null) => void;
  clearError: () => void;
  reset: () => void;
  
  saveCheckoutState: () => Promise<void>;
  loadCheckoutState: () => Promise<void>;
  clearCheckoutState: () => Promise<void>;
  
  getCheckoutTotal: () => number;
  isCheckoutValid: () => boolean;
}

type CheckoutStore = CheckoutState & CheckoutActions;

const initialState: CheckoutState = {
  checkout: null,
  customerAccessToken: null,
  shippingAddress: null,
  availableShippingRates: [],
  selectedShippingRate: null,
  customerOrders: [],
  loading: false,
  error: null,
  currentStep: 'address',
  isCheckoutInProgress: false,
};

export const useCheckoutStore = create<CheckoutStore>((set, get) => ({
  ...initialState,
  createCheckout: async (customerAccessToken?: string) => {
    const { cart } = useCartStore.getState();
    if (!cart || cart.lines.edges.length === 0) {
      set({ error: "No items in cart" });
      return false;
    }

    set({ loading: true, error: null, isCheckoutInProgress: true });

    try {
      // Use the cart's checkout URL directly (Storefront API approach)
      const mockCheckout = {
        id: cart.id,
        webUrl: cart.checkoutUrl,
        accessToken: customerAccessToken,
        email: undefined,
        phone: undefined,
        subtotalPrice: { amount: "0.00", currencyCode: "KD" },
        totalTax: { amount: "0.00", currencyCode: "KD" },
        totalPrice: { amount: "0.00", currencyCode: "KD" },
        lineItems: cart.lines
      } as unknown as Checkout;

      set({
        checkout: mockCheckout,
        customerAccessToken: customerAccessToken || null,
        loading: false,
        error: null,
        currentStep: 'address',
      });
      await get().saveCheckoutState();
      return true;
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to create checkout",
        isCheckoutInProgress: false,
      });
      return false;
    }
  },

  updateShippingAddress: async (address: MailingAddressInput) => {
    const { checkout } = get();
    if (!checkout) {
      set({ error: "No checkout found" });
      return false;
    }

    set({ loading: true, error: null });

    try {
      // For now, just store the address and proceed
      // In a real implementation, you would update the cart with address info
      set({
        shippingAddress: address,
        loading: false,
        error: null,
        currentStep: 'shipping',
      });
      await get().saveCheckoutState();
      return true;
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to update shipping address",
      });
      return false;
    }
  },


  // Select shipping rate
  selectShippingRate: async (shippingRate: ShippingRate) => {
    const { checkout } = get();
    if (!checkout) {
      set({ error: "No checkout found" });
      return false;
    }

    set({ loading: true, error: null });

    try {
      // For now, just store the selected shipping rate
      // In a real implementation, you would update the cart with shipping info
      set({
        selectedShippingRate: shippingRate,
        loading: false,
        error: null,
        currentStep: 'payment',
      });
      await get().saveCheckoutState();
      return true;
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to select shipping rate",
      });
      return false;
    }
  },

  // Associate customer with checkout
  associateCustomer: async () => {
    const { checkout } = get();
    const { accessToken } = useAuthStore.getState();
    
    if (!checkout) {
      set({ error: "No checkout found" });
      return false;
    }

    if (!accessToken) {
      return true;
    }

    set({ loading: true, error: null });

    try {
      // For now, just proceed without customer association
      // In a real implementation, you would associate the customer with the cart
      set({
        loading: false,
        error: null,
      });
      return true;
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to associate customer",
      });
      return false;
    }
  },

  // Get shipping rates for checkout
  getShippingRates: async () => {
    const { checkout } = get();
    
    if (!checkout) {
      set({ error: "No checkout found" });
      return false;
    }

    set({ loading: true, error: null });

    try {      
      // Since we're using cart checkout URL (Cart ID), we can't use the shipping rates API
      // The shipping rates API requires a proper Checkout ID, not a Cart ID
      // For Storefront API, we'll provide realistic shipping options that represent
      // typical shipping rates that would be available
      
      const realisticShippingRates = [
        {
          handle: "standard-shipping",
          title: "Standard Shipping",
          price: { amount: "5.99", currencyCode: "KD" },
        },
        {
          handle: "express-shipping",
          title: "Express Shipping", 
          price: { amount: "12.99", currencyCode: "KD" },
        },
        {
          handle: "overnight-shipping",
          title: "Overnight Shipping",
          price: { amount: "24.99", currencyCode: "KD" },
        },
      ];
      
      set({
        availableShippingRates: realisticShippingRates,
        loading: false,
        error: null,
      });
      return true;
      
    } catch (error) {
      console.error("💾 Checkout Store: Failed to get shipping rates:", error);
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to get shipping rates",
      });
      return false;
    }
  },

  // Get customer orders
  getCustomerOrders: async () => {
    const { accessToken } = useAuthStore.getState();
    
    if (!accessToken) {
      set({ error: "Customer not logged in" });
      return false;
    }

    set({ loading: true, error: null });

    try {
      const response = await checkoutApi.getCustomerOrders(accessToken);

      if (response.customer?.orders?.edges) {
        const orders = response.customer.orders.edges.map((edge: any) => edge.node);
        set({
          customerOrders: orders,
          loading: false,
          error: null,
        });
        return true;
      }

      set({
        loading: false,
        error: "No orders found",
      });
      return false;
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to get customer orders",
      });
      return false;
    }
  },

  // State management methods
  setCurrentStep: (step) => set({ currentStep: step }),
  
  setSelectedShippingRate: (rate) => set({ selectedShippingRate: rate }),
  
  clearError: () => set({ error: null }),
  
  reset: () => set(initialState),

  // Persistence methods
  saveCheckoutState: async () => {
    try {
      const { checkout, shippingAddress, selectedShippingRate, currentStep } = get();
      const state = {
        checkout,
        shippingAddress,
        selectedShippingRate,
        currentStep,
      };
      await AsyncStorage.setItem("checkout_state", JSON.stringify(state));
    } catch (error) {
      console.error("💾 Checkout Store: Failed to save checkout state:", error);
    }
  },

  loadCheckoutState: async () => {
    try {
      const savedState = await AsyncStorage.getItem("checkout_state");
      if (savedState) {
        const state = JSON.parse(savedState);
        set({
          checkout: state.checkout,
          shippingAddress: state.shippingAddress,
          selectedShippingRate: state.selectedShippingRate,
          currentStep: state.currentStep,
        });
      }
    } catch (error) {
      console.error("💾 Checkout Store: Failed to load checkout state:", error);
    }
  },

  clearCheckoutState: async () => {
    try {
      await AsyncStorage.removeItem("checkout_state");
      set(initialState);
    } catch (error) {
      console.error("💾 Checkout Store: Failed to clear checkout state:", error);
    }
  },

  // Utility methods
  getCheckoutTotal: () => {
    const { checkout } = get();
    if (!checkout) return 0;
    return parseFloat(checkout.totalPrice.amount);
  },

  isCheckoutValid: () => {
    const { checkout, shippingAddress, selectedShippingRate } = get();
    return !!(checkout && shippingAddress && selectedShippingRate);
  },
}));



