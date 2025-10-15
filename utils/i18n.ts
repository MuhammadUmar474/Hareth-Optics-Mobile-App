import { useLangStore } from "@/store/langStore";
import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { I18nManager } from "react-native";


import ar from "@/utils/translations/ar.json";
import en from "@/utils/translations/en.json";

export const resources = {
  en: { translation: en },
  ar: { translation: ar },
} as const;

export type AppTranslations = typeof resources["en"]["translation"];

export const initI18n = () => {
  const lang =
    useLangStore.getState().language ||
    (Localization.locale.startsWith("ar") ? "ar" : "en");

  if (!i18n.isInitialized) {
    i18n.use(initReactI18next).init({
      resources,
      lng: lang,
      fallbackLng: "en",
      compatibilityJSON: "v3",
      interpolation: { escapeValue: false },
    });
  } else {
    i18n.changeLanguage(lang);
  }

  const shouldBeRTL = lang === "ar";
  if (I18nManager.isRTL !== shouldBeRTL) {
    I18nManager.allowRTL(shouldBeRTL);
    I18nManager.forceRTL(shouldBeRTL);
  }

  return i18n;
};

export default i18n;
