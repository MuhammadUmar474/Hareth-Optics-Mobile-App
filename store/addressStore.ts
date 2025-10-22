import { homeApi, MailingAddressInput, ShopifyAddress } from "@/services/home/homeApi";
import { create } from "zustand";

interface AddressState {
  addresses: ShopifyAddress[];
  defaultAddressId: string | null;
  loading: boolean;
  error: string | null;
}

interface AddressActions {
  // Actions
  fetchAddresses: (customerAccessToken: string) => Promise<void>;
  createAddress: (customerAccessToken: string, address: MailingAddressInput) => Promise<string | null>;
  updateAddress: (customerAccessToken: string, id: string, address: MailingAddressInput) => Promise<boolean>;
  deleteAddress: (customerAccessToken: string, id: string) => Promise<boolean>;
  setDefaultAddress: (customerAccessToken: string, addressId: string) => Promise<boolean>;
  
  // Utility actions
  clearError: () => void;
  reset: () => void;
}

type AddressStore = AddressState & AddressActions;

const initialState: AddressState = {
  addresses: [],
  defaultAddressId: null,
  loading: false,
  error: null,
};

export const useAddressStore = create<AddressStore>((set, get) => ({
  ...initialState,

  fetchAddresses: async (customerAccessToken: string) => {
    set({ loading: true, error: null });
    
    try {
      const response = await homeApi.getCustomerAddresses(customerAccessToken);
      
      if (response.customer?.addresses) {
        const addresses = response.customer.addresses.edges.map(edge => edge.node);
        const defaultAddressId = response.customer.defaultAddress?.id || null;
        set({ 
          addresses,
          defaultAddressId,
          loading: false,
          error: null 
        });
      } else {
        set({ 
          addresses: [],
          defaultAddressId: null,
          loading: false,
          error: null 
        });
      }
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : "Failed to fetch addresses" 
      });
    }
  },

  createAddress: async (customerAccessToken: string, address: MailingAddressInput) => {
    set({ loading: true, error: null });
    
    try {
      const response = await homeApi.createCustomerAddress(customerAccessToken, address);
      
      if (response.customerAddressCreate.customerUserErrors.length > 0) {
        const errorMessage = response.customerAddressCreate.customerUserErrors
          .map(error => error.message)
          .join(", ");
        set({ 
          loading: false, 
          error: errorMessage 
        });
        return null;
      }
      
      if (response.customerAddressCreate.customerAddress) {
        const newAddress = response.customerAddressCreate.customerAddress;
        set(state => ({
          addresses: [...state.addresses, newAddress],
          loading: false,
          error: null
        }));
        return newAddress.id;
      }
      
      set({ 
        loading: false, 
        error: "Failed to create address" 
      });
      return null;
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : "Failed to create address" 
      });
      return null;
    }
  },

  updateAddress: async (customerAccessToken: string, id: string, address: MailingAddressInput) => {
    set({ loading: true, error: null });
    
    try {
      const response = await homeApi.updateCustomerAddress(customerAccessToken, id, address);
      
      if (response.customerAddressUpdate.customerUserErrors.length > 0) {
        const errorMessage = response.customerAddressUpdate.customerUserErrors
          .map(error => error.message)
          .join(", ");
        set({ 
          loading: false, 
          error: errorMessage 
        });
        return false;
      }
      
      if (response.customerAddressUpdate.customerAddress) {
        const updatedAddress = response.customerAddressUpdate.customerAddress;
        set(state => ({
          addresses: state.addresses.map(addr => 
            addr.id === id ? updatedAddress : addr
          ),
          loading: false,
          error: null
        }));
        return true;
      }
      
      set({ 
        loading: false, 
        error: "Failed to update address" 
      });
      return false;
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : "Failed to update address" 
      });
      return false;
    }
  },

  deleteAddress: async (customerAccessToken: string, id: string) => {
    set({ loading: true, error: null });
    
    try {
      const response = await homeApi.deleteCustomerAddress(customerAccessToken, id);
      
      if (response.customerAddressDelete.customerUserErrors.length > 0) {
        const errorMessage = response.customerAddressDelete.customerUserErrors
          .map(error => error.message)
          .join(", ");
        set({ 
          loading: false, 
          error: errorMessage 
        });
        return false;
      }
      
      if (response.customerAddressDelete.deletedCustomerAddressId) {
        set(state => ({
          addresses: state.addresses.filter(addr => addr.id !== id),
          defaultAddressId: state.defaultAddressId === id ? null : state.defaultAddressId,
          loading: false,
          error: null
        }));
        return true;
      }
      
      set({ 
        loading: false, 
        error: "Failed to delete address" 
      });
      return false;
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : "Failed to delete address" 
      });
      return false;
    }
  },

  setDefaultAddress: async (customerAccessToken: string, addressId: string) => {
    set({ loading: true, error: null });
    
    try {
      const response = await homeApi.setDefaultCustomerAddress(customerAccessToken, addressId);
      
      if (response.customerDefaultAddressUpdate.customerUserErrors.length > 0) {
        const errorMessage = response.customerDefaultAddressUpdate.customerUserErrors
          .map(error => error.message)
          .join(", ");
        set({ 
          loading: false, 
          error: errorMessage 
        });
        return false;
      }
      
      set({ 
        defaultAddressId: addressId,
        loading: false,
        error: null
      });
      return true;
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : "Failed to set default address" 
      });
      return false;
    }
  },

  clearError: () => set({ error: null }),
  
  reset: () => set(initialState),
}));
