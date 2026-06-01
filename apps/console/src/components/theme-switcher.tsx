import { useTheme } from "@lonik/themer";
import { useHydrated } from "@tanstack/react-router";
import { MoonIcon, SunIcon, SunMoonIcon } from "lucide-react";

const themeOrder = ["system", "light", "dark"] as const;
type ThemeValue = (typeof themeOrder)[number];

const nextTheme = (value: ThemeValue): ThemeValue => {
  const index = themeOrder.indexOf(value);
  return themeOrder[(index + 1) % themeOrder.length]!;
};

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const currentTheme: ThemeValue = (theme as ThemeValue) ?? "system";
  const hydrated = useHydrated();

  const icon =
    currentTheme === "light" ? (
      <SunIcon className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
    ) : currentTheme === "dark" ? (
      <MoonIcon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
    ) : (
      <SunMoonIcon size={16} />
    );

  return (
    <button
      suppressHydrationWarning
      type="button"
      aria-label={`Theme: ${currentTheme}. Click to switch theme`}
      title={`Theme: ${currentTheme}`}
      className="border-default-200 bg-default-50 text-default-500 hover:bg-default-100 inline-flex size-8 cursor-pointer items-center justify-center rounded-md border"
      onClick={() => setTheme(nextTheme(currentTheme))}
    >
      {hydrated && icon}
    </button>
  );
}
