import { Button } from "@workspace/ui/components/shadcn/button";
import { Bell, Search } from "lucide-react";

import { MobileNav } from "#components/navigation/mobile-nav";
import { ThemeSwitcher } from "#components/theme-switcher";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center border-b bg-background px-4">
      <MobileNav />

      <div className="flex-1">
        <div className="relative max-w-md">
          <Search className="absolute top-3 left-3 size-4 text-muted-foreground" />

          <input
            aria-label="Search"
            placeholder="Search..."
            className="h-10 w-full rounded-md border bg-background pr-4 pl-10 text-sm"
          />
        </div>
      </div>

      <Button size="icon" variant="ghost">
        <Bell />
      </Button>

      <div className="flex items-center gap-2">
        <ThemeSwitcher />
        {/* <UserMenu /> */}
      </div>
    </header>
  );
}
