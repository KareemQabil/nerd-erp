import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { DEFAULT_LANGUAGE, type Language } from '../types/i18n';

// Import translation files
import enTranslations from '../locales/en.json';
import arTranslations from '../locales/ar.json';

/**
 * i18n Service - Generic service for internationalization
 * Handles initialization and configuration of i18next
 */
class I18nService {
  private initialized = false;

  /**
   * Initialize i18next with translations and configuration
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    await i18n
      .use(LanguageDetector) // Detect user language
      .use(initReactI18next) // Pass i18n instance to react-i18next
      .init({
        resources: {
          en: {
            translation: enTranslations,
          },
          ar: {
            translation: arTranslations,
          },
        },
        fallbackLng: DEFAULT_LANGUAGE,
        debug: false,
        interpolation: {
          escapeValue: false, // React already escapes values
        },
        detection: {
          order: ['localStorage', 'navigator'],
          caches: ['localStorage'],
        },
      });

    this.initialized = true;
    this.updateDocumentDirection();
  }

  /**
   * Change the current language
   */
  async changeLanguage(language: Language): Promise<void> {
    await i18n.changeLanguage(language);
    this.updateDocumentDirection();
  }

  /**
   * Get the current language
   */
  getCurrentLanguage(): Language {
    return (i18n.language || DEFAULT_LANGUAGE) as Language;
  }

  /**
   * Update document direction based on current language
   */
  private updateDocumentDirection(): void {
    const currentLang = this.getCurrentLanguage();
    const direction = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = direction;
    document.documentElement.lang = currentLang;
  }

  /**
   * Get i18n instance
   */
  getInstance() {
    return i18n;
  }
}

// Export singleton instance
export const i18nService = new I18nService();
