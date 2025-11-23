import { Globe } from "lucide-react";
import { useLanguage } from "@/core/i18n/hooks/useLanguage";
import { motion } from "motion/react";

interface LanguageSwitcherProps {
  className?: string;
  showLabel?: boolean;
}

export function LanguageSwitcher({
  className,
  showLabel = false,
}: LanguageSwitcherProps) {
  const { currentLanguage, toggleLanguage } = useLanguage();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleLanguage}
      className={`relative flex items-center justify-center gap-2 p-2 rounded-xl transition-all bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-[#c2c7ce] ${className}`}
      title={
        currentLanguage === "en" ? "Switch to Arabic" : "Switch to English"
      }
    >
      <Globe className="w-5 h-5" />

      {showLabel ? (
        <span className="text-sm font-medium">
          {currentLanguage === "en" ? "العربية" : "English"}
        </span>
      ) : (
        <span className="text-xs font-bold">
          {currentLanguage === "en" ? "AR" : "EN"}
        </span>
      )}
    </motion.button>
  );
}
