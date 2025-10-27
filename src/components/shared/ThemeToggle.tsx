import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeProvider";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  const getThemeIcon = () => {
    if (theme === "light") {
      return <Sun className="h-5 w-5" />;
    } else {
      return <Moon className="h-5 w-5" />;
    }
  };

  const getThemeLabel = () => {
    if (theme === "light") return "Light";
    return "Dark";
  };

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={`Switch to ${getThemeLabel()} mode`}
    >
      {getThemeIcon()}
      <span className="hidden sm:inline-block">{getThemeLabel()}</span>
    </button>
  );
};
