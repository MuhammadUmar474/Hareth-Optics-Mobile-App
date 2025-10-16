import { RTL_LANGUAGES, useLangStore } from "@/store/langStore";
import { useTranslation } from "react-i18next";

export const useLocal = () => {
  const language = useLangStore((state) => state.language);
  const { t } = useTranslation();
  const isRtl = RTL_LANGUAGES.includes(language);
  return { isRtl, language, t};
};