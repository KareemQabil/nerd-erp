/**
 * Supported languages in the application
 */
export type Language = 'en' | 'ar';

/**
 * Language configuration interface
 */
export interface LanguageConfig {
  code: Language;
  name: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
}

/**
 * Available language configurations
 */
export const LANGUAGES: Record<Language, LanguageConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    dir: 'ltr',
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    dir: 'rtl',
  },
};

/**
 * Default language for the application
 */
export const DEFAULT_LANGUAGE: Language = 'en';
