import { createContext, useContext, useEffect, useState } from "react";
import { allThemeValues, DEFAULT_THEME } from "#lib/themes-config";
import { ScriptOnce } from "@tanstack/react-router"

type Theme = string;

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: DEFAULT_THEME,
  setTheme: () => null,
};

function getThemeScript(storageKey: string, defaultTheme: Theme) {
  const key = JSON.stringify(storageKey)
  const fallback = JSON.stringify(defaultTheme)

  return `(function(){var s=localStorage.getItem(${key});if(s){document.documentElement.setAttribute('data-theme',s);}else{var d=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.setAttribute('data-theme',d?'default-dark':'default-light');}})();`
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = DEFAULT_THEME,
  storageKey = "tweakcn-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () =>
      (typeof window !== "undefined"
        ? localStorage.getItem(storageKey)
        : null) || defaultTheme,
  );

  useEffect(() => {
    const root = window.document.documentElement;

    // Remove all theme attributes
    root.removeAttribute("data-theme");

    // Set new theme
    root.setAttribute("data-theme", theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      <ScriptOnce>{getThemeScript(storageKey, defaultTheme)}</ScriptOnce>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};

// Re-export theme values for convenience
export { allThemeValues, DEFAULT_THEME };
