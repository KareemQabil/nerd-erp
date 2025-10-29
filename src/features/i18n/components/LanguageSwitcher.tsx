import React from "react";
import { Languages } from "lucide-react";
import { useLanguage } from "@/features/i18n/hooks/useLanguage";

/**
 * Language Switcher Component
 * Provides a button to toggle between English and Arabic
 */
export const LanguageSwitcher: React.FC = () => {
  const { currentLanguageConfig, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-foreground bg-secondary rounded-md hover:bg-secondary/80 transition-colors"
      title={`Switch to ${
        currentLanguageConfig.code === "en" ? "العربية" : "English"
      }`}
    >
      <Languages className="w-4 h-4" />
      <span className="hidden sm:inline">
        {currentLanguageConfig.nativeName}
      </span>
    </button>
  );
};
