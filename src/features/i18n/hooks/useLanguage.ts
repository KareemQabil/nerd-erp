import { useTranslation } from "react-i18next";
import { i18nService } from "../services/i18nService";
import { LANGUAGES, type Language, type LanguageConfig } from "../types/i18n";

/**
 * Custom hook for language management
 * Provides language switching and current language information
 */
export function useLanguage() {
  const { i18n } = useTranslation();

  const currentLanguage = i18n.language as Language;
  const currentLanguageConfig: LanguageConfig =
    LANGUAGES[currentLanguage] || LANGUAGES.en;

  /**
   * Change the application language
   */
  const changeLanguage = async (language: Language) => {
    await i18nService.changeLanguage(language);
  };

  /**
   * Toggle between English and Arabic
   */
  const toggleLanguage = async () => {
    const newLanguage: Language = currentLanguage === "en" ? "ar" : "en";
    await changeLanguage(newLanguage);
  };

  return {
    currentLanguage,
    currentLanguageConfig,
    changeLanguage,
    toggleLanguage,
    availableLanguages: Object.values(LANGUAGES),
    isRTL: currentLanguageConfig.dir === "rtl",
  };
}
