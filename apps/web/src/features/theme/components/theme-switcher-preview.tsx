"use client";

import { Button } from "@workspace/ui/components/shadcn/button";
import { Separator } from "@workspace/ui/components/shadcn/separator";
import { useTheme } from "@workspace/ui/components/theme-provider";
import { sortedThemes, themes } from "@workspace/ui/lib/themes-config";
import { cn } from "@workspace/ui/lib/utils";
import { Check, Moon, Palette, Sun } from "lucide-react";
import { m } from "motion/react";

function parseTheme(theme: string | undefined): {
  colorTheme: string;
  mode: "light" | "dark";
} {
  if (!theme) return { colorTheme: "default", mode: "dark" };
  if (theme.endsWith("-dark")) {
    return { colorTheme: theme.replace("-dark", ""), mode: "dark" };
  }
  if (theme.endsWith("-light")) {
    return { colorTheme: theme.replace("-light", ""), mode: "light" };
  }
  return { colorTheme: "default", mode: "dark" };
}

interface ThemeSwitcherPreviewProps {
  showMainMenu?: boolean;
  showSubMenu?: boolean;
  onThemeSelect?: (name: string) => void;
}

export function ThemeSwitcherPreview({
  showMainMenu = false,
  showSubMenu = false,
  onThemeSelect,
}: ThemeSwitcherPreviewProps) {
  const { theme, setTheme } = useTheme();

  const { colorTheme, mode } = parseTheme(theme);
  const isDark = mode === "dark";
  const currentThemeConfig = themes.find((t) => t.name === colorTheme) || themes[0];

  const setColorTheme = (name: string) => {
    setTheme(`${name}-${isDark ? "dark" : "light"}`);
    onThemeSelect?.(name);
  };

  const setMode = (newMode: "light" | "dark") => {
    setTheme(`${colorTheme}-${newMode}`);
  };

  return (
    <div suppressHydrationWarning className="relative inline-block">
      {/* Trigger Button */}
      <Button variant="outline" size="icon" className="h-10 w-10 rounded-lg">
        {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
      </Button>

      {/* Main Menu */}
      {showMainMenu && (
        <m.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="absolute top-12 left-0 z-10 w-48 rounded-lg border bg-popover p-1 shadow-lg"
        >
          {/* Current Theme Label */}
          <div className="flex items-center gap-2 px-2 py-1.5 text-sm font-semibold">
            <div
              className="h-3 w-3 rounded-full"
              style={{
                backgroundColor: isDark
                  ? currentThemeConfig.primaryDark
                  : currentThemeConfig.primaryLight,
              }}
            />
            {currentThemeConfig.title}
          </div>
          <div className="my-1 h-px bg-border" />

          {/* Light/Dark Toggle */}
          <button
            type="button"
            onClick={() => setMode("light")}
            className={cn(
              "flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent",
              mode === "light" && "bg-accent",
            )}
          >
            <Sun className="h-4 w-4" />
            <span className="flex-1 text-left">Light</span>
            {mode === "light" && <Check className="h-4 w-4 text-primary" />}
          </button>
          <button
            type="button"
            onClick={() => setMode("dark")}
            className={cn(
              "flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent",
              mode === "dark" && "bg-accent",
            )}
          >
            <Moon className="h-4 w-4" />
            <span className="flex-1 text-left">Dark</span>
            {mode === "dark" && <Check className="h-4 w-4 text-primary" />}
          </button>

          <div className="my-1 h-px bg-border" />

          {/* Color Theme with arrow */}
          <div
            className={cn(
              "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm",
              showSubMenu && "bg-accent",
            )}
          >
            <Palette className="h-4 w-4" />
            <span className="flex-1 text-left">Color Theme</span>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </m.div>
      )}

      {/* Sub Menu - Theme List */}
      {showSubMenu && (
        <m.div
          initial={{ opacity: 0, x: 10, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="absolute top-30 left-50 z-20 w-52 overflow-hidden rounded-lg border bg-popover p-1 shadow-lg"
        >
          <div className="max-h-80 scrollbar-thin overflow-y-auto">
            {sortedThemes.map((t, i) => (
              <m.button
                key={t.name}
                initial={{ opacity: 0, x: 5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.03 }}
                onClick={() => setColorTheme(t.name)}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-3 rounded-sm px-2 py-1.5 text-sm hover:bg-accent",
                  colorTheme === t.name && "bg-accent",
                )}
              >
                <div
                  className="h-4 w-4 shrink-0 rounded-full border border-border"
                  style={{
                    backgroundColor: isDark ? t.primaryDark : t.primaryLight,
                  }}
                />
                <span className="flex-1 truncate text-left">{t.title}</span>
                {colorTheme === t.name && <Check className="h-4 w-4 shrink-0 text-primary" />}
              </m.button>
            ))}
          </div>
          <Separator />
          <div className="px-2 py-1.5 text-center text-xs text-muted-foreground">
            Themes by{" "}
            <a
              href="https://tweakcn.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              tweakcn
            </a>
          </div>
        </m.div>
      )}
    </div>
  );
}
