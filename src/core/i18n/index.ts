/**
 * i18n Feature - Internationalization
 * Exports all public APIs for the i18n feature
 */

// Components
export { LanguageSwitcher } from "./components/LanguageSwitcher";

// Services
export { i18nService } from "./services/i18nService";

// Hooks
export { useLanguage } from "./hooks/useLanguage";

// Types
export type { Language, LanguageConfig } from "./types/i18n";
export { LANGUAGES, DEFAULT_LANGUAGE } from "./types/i18n";
