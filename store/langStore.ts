import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type AppLanguage = "en" | "ar";

type LangState = {
  language: AppLanguage;
};

type LangActions = {
  setLanguage: (lang: AppLanguage) => void;
};

export const useLangStore = create<LangState & LangActions>()(
  persist(
    (set) => ({
      language: "en",
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: "lang-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);


