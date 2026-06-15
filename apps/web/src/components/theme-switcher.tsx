import { useHydrated } from "@tanstack/react-router";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const currentTheme = theme ?? "default-dark";
  const hydrated = useHydrated();

  const icon = currentTheme.endsWith("light") ? (
    <SunIcon className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
  ) : (
    <MoonIcon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
  );

  return (
    <button
      suppressHydrationWarning
      type="button"
      aria-label={`Theme: ${currentTheme}. Click to switch theme`}
      title={`Theme: ${currentTheme}`}
      className="border-default-200 bg-default-50 text-default-500 hover:bg-default-100 inline-flex size-8 cursor-pointer items-center justify-center rounded-md border"
      onClick={() =>
        setTheme(
          typeof theme === "string" && theme.endsWith("-dark")
            ? theme.replace(/-dark$/, "-light")
            : typeof theme === "string" && theme.endsWith("-light")
              ? theme.replace(/-light$/, "-dark")
              : currentTheme,
        )
      }
    >
      {hydrated && icon}
    </button>
  );
}
