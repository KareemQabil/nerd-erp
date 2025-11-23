import { createContext, useContext, useEffect, useMemo } from "react";
import useLocalStorageState from "use-local-storage-state";

type Theme = "light" | "dark";

interface ThemeProviderContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  actualTheme: "light" | "dark";
}

const ThemeProviderContext = createContext<
  ThemeProviderContextValue | undefined
>(undefined);

interface ThemeProviderProps {
  readonly children: React.ReactNode;
  readonly defaultTheme?: Theme;
}

export function ThemeProvider({
  children,
  defaultTheme = "light",
}: ThemeProviderProps) {
  const [theme, setTheme] = useLocalStorageState<Theme>("theme", {
    defaultValue: defaultTheme,
  });

  // Get the actual theme based on system preference when theme is "system"
  const getActualTheme = (): "light" | "dark" => {
    if (theme === "light") {
      return globalThis.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return theme;
  };

  const actualTheme = getActualTheme();

  useEffect(() => {
    const root = globalThis.document.documentElement;

    root.classList.remove("light", "dark");
    root.classList.add(actualTheme);
    root.setAttribute("data-theme", actualTheme);

    // Listen to system theme changes when theme is "system"
    if (theme === "light") {
      const mediaQuery = globalThis.matchMedia("(prefers-color-scheme: dark)");

      const handleChange = () => {
        const newTheme = mediaQuery.matches ? "dark" : "light";
        root.classList.remove("light", "dark");
        root.classList.add(newTheme);
        root.setAttribute("data-theme", newTheme);
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme, actualTheme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
      actualTheme,
    }),
    [theme, setTheme, toggleTheme, actualTheme]
  );

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
