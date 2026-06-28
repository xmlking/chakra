// oxlint-disable react-doctor/no-multi-comp - Remove un-used comps
import { m } from "@workspace/i18n/messages";
import { getLocale, locales, setLocale } from "@workspace/i18n/runtime";
import { Button, buttonVariants } from "@workspace/ui/components/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/shadcn/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/shadcn/select";
import { cn } from "@workspace/ui/lib/utils";
import { type VariantProps } from "class-variance-authority";
import { Check, ChevronDown, Languages } from "lucide-react";

type ButtonProps = VariantProps<typeof buttonVariants>;

type LocaleSwitcherProps = {
  size?: ButtonProps["size"];
  variant?: ButtonProps["variant"];
  className?: string;
};

const LOCALES = [
  {
    code: "en",
    label: "English",
    flag: "🇺🇸",
  },
  {
    code: "es",
    label: "Español",
    flag: "🇪🇸",
  },
] as const satisfies ReadonlyArray<{
  code: (typeof locales)[number];
  label: string;
  flag: string;
}>;

/**
 * Compact dashboard header switcher
 */
export function LocaleSwitcher({
  size = "icon",
  variant = "ghost",
  className,
}: LocaleSwitcherProps) {
  const currentLocale = getLocale();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            aria-label="Switch language"
            className={className}
            size={size}
            variant={variant}
          />
        }
      >
        <Languages aria-hidden="true" size={18} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44">
        {locales.map((locale) => {
          const isActive = locale === currentLocale;
          return (
            <DropdownMenuItem
              key={locale}
              className={cn(
                "flex cursor-pointer items-center justify-between",
                isActive && "bg-accent",
              )}
              onClick={() => setLocale(locale)}
            >
              <div className="flex items-center gap-2">
                <span>{m.language_flag(undefined, { locale })}</span>
                <span className="flex-1">{m.language_name(undefined, { locale })}</span>
              </div>
              {isActive && <Check aria-hidden="true" className="opacity-60" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function getCurrentLocale() {
  return LOCALES.find((locale) => locale.code === getLocale()) ?? LOCALES[0];
}

/**
 * Full dashboard header switcher
 */
export function LocaleSwitcherFull() {
  const currentLocale = getLocale();
  const current = getCurrentLocale();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="sm" className="h-9 gap-2 px-2" />}>
        <Languages className="size-4 text-muted-foreground" />
        <span>{current.flag}</span>
        <span className="text-xs font-medium uppercase">{current.code}</span>
        <ChevronDown className="size-3 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-44">
        {LOCALES.map((locale) => (
          <DropdownMenuItem
            key={locale.code}
            onClick={() => setLocale(locale.code)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span>{locale.flag}</span>
              <span>{locale.label}</span>
            </div>

            {locale.code === currentLocale && <Check className="size-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Settings page field
 */
export function LocaleSelectField() {
  const currentLocale = getLocale();

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium" htmlFor="locale">
        Language
      </label>

      <Select
        value={currentLocale}
        onValueChange={(value) => setLocale(value as (typeof locales)[number])}
      >
        <SelectTrigger id="locale" className="w-full">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          {LOCALES.map((locale) => (
            <SelectItem key={locale.code} value={locale.code}>
              <div className="flex items-center gap-2">
                <span>{locale.flag}</span>
                <span>{locale.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <p className="text-sm text-muted-foreground">Choose your preferred language.</p>
    </div>
  );
}
