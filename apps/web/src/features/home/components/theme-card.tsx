"use client";

import { Button } from "@workspace/ui/components/shadcn/button";
import { cn } from "@workspace/ui/lib/utils";
import { Check, Code2 } from "lucide-react";
import { useTheme } from "next-themes";

interface ThemeCardProps {
  name: string;
  title: string;
  primaryLight: string;
  primaryDark: string;
  fontSans: string;
  description?: string;
}

export function ThemeCard({ name, title, primaryLight, primaryDark, fontSans }: ThemeCardProps) {
  const { theme, setTheme } = useTheme();

  const currentTheme = theme?.replace("-light", "").replace("-dark", "");
  const isDark = theme?.endsWith("-dark") ?? true;
  const isActive = currentTheme === name;

  const handleApply = () => {
    setTheme(`${name}-${isDark ? "dark" : "light"}`);
  };

  const primaryColor = isDark ? primaryDark : primaryLight;

  return (
    <>
      <button
        type="button"
        suppressHydrationWarning
        onClick={handleApply}
        className={cn(
          "group relative flex cursor-pointer flex-col rounded-xl border bg-card p-4 transition-all duration-200",
          "hover:border-primary/50 hover:shadow-lg",
          isActive && "border-primary ring-2 ring-primary",
        )}
      >
        {/* Active indicator */}
        {isActive && (
          <div className="absolute -top-2 -right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="h-3.5 w-3.5" />
          </div>
        )}

        {/* Install button - appears on hover */}
        <Button
          variant="secondary"
          size="icon"
          className={cn(
            "absolute top-2 right-2 z-10 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100",
            isActive && "top-4",
          )}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Code2 className="h-4 w-4" />
          <span className="sr-only">View install code</span>
        </Button>

        {/* Color Preview */}
        <div className="mb-4 flex items-center gap-3">
          <div
            className="h-12 w-12 rounded-lg border shadow-sm"
            style={{ backgroundColor: primaryColor }}
          />
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold">{title}</h3>
            <p className="truncate text-xs text-muted-foreground" style={{ fontFamily: fontSans }}>
              {fontSans.split(",")[0]}
            </p>
          </div>
        </div>

        {/* Mini UI Preview - Uses actual theme CSS variables */}
        <div
          data-theme={`${name}-${isDark ? "dark" : "light"}`}
          className="mb-4 overflow-hidden border bg-background text-foreground"
          style={{ borderRadius: "var(--radius)" }}
        >
          {/* Mini card */}
          <div className="m-2 border bg-card p-2" style={{ borderRadius: "var(--radius)" }}>
            {/* Header with text */}
            <div className="mb-2 flex items-center gap-2">
              <div className="h-5 w-5 bg-primary" style={{ borderRadius: "var(--radius)" }} />
              <div className="flex-1 space-y-1">
                <div className="h-2 w-12 rounded-sm bg-card-foreground/80" />
                <div className="h-1.5 w-8 rounded-sm bg-muted-foreground/50" />
              </div>
            </div>
            {/* Button row */}
            <div className="flex gap-1.5">
              <div
                className="flex h-4 flex-1 items-center justify-center bg-primary"
                style={{ borderRadius: "var(--radius)" }}
              >
                <div className="h-1.5 w-6 rounded-sm bg-primary-foreground/80" />
              </div>
              <div
                className="flex h-4 flex-1 items-center justify-center bg-secondary"
                style={{ borderRadius: "var(--radius)" }}
              >
                <div className="h-1.5 w-6 rounded-sm bg-secondary-foreground/80" />
              </div>
            </div>
          </div>
        </div>
      </button>
    </>
  );
}
