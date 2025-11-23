import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeProvider";
import { motion } from "motion/react";

interface ThemeSwitcherProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeSwitcher({
  className,
  showLabel = false,
}: ThemeSwitcherProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className={`relative flex items-center justify-center gap-2 p-2 rounded-xl transition-all ${
        theme === "dark"
          ? "bg-[rgba(255,255,255,0.05)] text-yellow-400 hover:bg-[rgba(255,255,255,0.1)]"
          : "bg-[rgba(0,0,0,0.05)] text-slate-700 hover:bg-[rgba(0,0,0,0.1)]"
      } ${className}`}
      title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {theme === "dark" ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}

      {showLabel && (
        <span className="text-sm font-medium">
          {theme === "dark" ? "Dark Mode" : "Light Mode"}
        </span>
      )}
    </motion.button>
  );
}
