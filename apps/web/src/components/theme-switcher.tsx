import { useTheme } from "@lonik/themer";
import { useHydrated } from "@tanstack/react-router";
import { Moon, Sun, SunMoon } from "lucide-react";

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
      <Sun size={16} />
    ) : currentTheme === "dark" ? (
      <Moon size={16} />
    ) : (
      <SunMoon size={16} />
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
