import { useTheme } from "@lonik/themer";
import { useHydrated } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/shadcn/button";
import { MoonIcon, SunIcon } from "lucide-react";

const themeOrder = ["system", "light", "dark"] as const;
type ThemeValue = (typeof themeOrder)[number];

const nextTheme = (value: ThemeValue): ThemeValue => {
  const index = themeOrder.indexOf(value);
  return themeOrder[(index + 1) % themeOrder.length]!;
};

interface ThemeToggleProps extends React.ComponentProps<typeof Button> {}

export function ThemeToggle({ className, ...props }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const currentTheme: ThemeValue = (theme as ThemeValue) ?? "system";
  const hydrated = useHydrated();

  return (
    <Button
      variant="outline"
      size="icon"
      type="button"
      onClick={() => setTheme(nextTheme(currentTheme))}
      className={className}
      {...props}
    >
      {hydrated && (
        <>
          <SunIcon className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <MoonIcon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </>
      )}
    </Button>
  );
}
