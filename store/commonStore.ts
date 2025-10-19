import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Category = {
  id: string;
  title: string;
  handle?: string;
  url?: string;
  items?: Category[];
};

type CategoriesState = {
  categories: Category[];
};

type CategoriesActions = {
  setCategories: (categories: Category[]) => void;
  clearCategories: () => void;
};

export const useCommonStore = create<CategoriesState & CategoriesActions>()(
  persist(
    (set) => ({
      categories: [],

      setCategories: (categories) => set({ categories }),

      clearCategories: () => set({ categories: [] }),
    }),
    {
      name: "common-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        categories: state.categories,
      }),
    }
  )
);
