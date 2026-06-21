import { getLocale, locales, setLocale } from "@workspace/i18n/runtime";
import { Button } from "@workspace/ui/components/shadcn/button";
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
import { Check, ChevronDown, Languages } from "lucide-react";

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

function getCurrentLocale() {
  return LOCALES.find((locale) => locale.code === getLocale()) ?? LOCALES[0];
}

/**
 * Compact dashboard header switcher
 */
export function LocaleSwitcher() {
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
