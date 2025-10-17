// store/langStore.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type AppLanguage = "en" | "ar" | "he";

type LangState = {
  language: AppLanguage;
  isRtl: boolean;
};

type LangActions = {
  setLanguage: (lang: AppLanguage) => void;
};

export const RTL_LANGUAGES: AppLanguage[] = ["ar", "he"];

export const useLangStore = create<LangState & LangActions>()(
  persist(
    (set) => ({
      language: "en",
      isRtl: RTL_LANGUAGES.includes("en"),
      setLanguage: (lang) => set({ language: lang, isRtl: RTL_LANGUAGES.includes(lang) }),
    }),
    {
      name: "lang-storage",
      storage: createJSONStorage(() => AsyncStorage),
      // Ensure partial state is handled to avoid serialization issues
      partialize: (state) => ({ language: state.language, isRtl: state.isRtl }),
    }
  )
);