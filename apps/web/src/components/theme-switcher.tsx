import { useHydrated } from "@tanstack/react-router";
import { themes } from "@workspace/ui/lib/themes-config";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const isDark = theme?.endsWith("-dark");
  const currentThemeName = theme?.replace("-light", "").replace("-dark", "");
  const currentTheme = themes.find((t) => t.name === currentThemeName) || themes[0];

  const toggleMode = () => {
    if (isDark) {
      setTheme(`${currentThemeName}-light`);
    } else {
      setTheme(`${currentThemeName}-dark`);
    }
  };

  const hydrated = useHydrated();

  const icon = isDark ? (
    <MoonIcon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
  ) : (
    <SunIcon className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
  );

  return (
    <button
      suppressHydrationWarning
      type="button"
      aria-label={`Theme: ${theme ?? currentTheme.name}. Click to switch theme`}
      title={`Theme: ${theme ?? currentTheme.name}`}
      className="border-default-200 bg-default-50 text-default-500 hover:bg-default-100 inline-flex size-8 cursor-pointer items-center justify-center rounded-md border"
      onClick={toggleMode}
    >
      {hydrated && icon}
    </button>
  );
}
