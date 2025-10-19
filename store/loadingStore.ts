import { create } from "zustand";

interface LoadingState {
  isLoadingLatestProducts: boolean;
  isLoadingBestSelling: boolean;
  isLoadingCategories: boolean;
  isLoadingTrending: boolean;
  setLoadingLatestProducts: (loading: boolean) => void;
  setLoadingBestSelling: (loading: boolean) => void;
  setLoadingCategories: (loading: boolean) => void;
  setLoadingTrending: (loading: boolean) => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoadingLatestProducts: false,
  isLoadingBestSelling: false,
  isLoadingCategories: false,
  isLoadingTrending: false,
  setLoadingLatestProducts: (loading: boolean) => 
    set({ isLoadingLatestProducts: loading }),
  setLoadingBestSelling: (loading: boolean) => 
    set({ isLoadingBestSelling: loading }),
  setLoadingCategories: (loading: boolean) => 
    set({ isLoadingCategories: loading }),
  setLoadingTrending: (loading: boolean) => 
    set({ isLoadingTrending: loading }),
}));
