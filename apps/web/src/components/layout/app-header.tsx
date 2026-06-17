import { Button } from "@workspace/ui/components/shadcn/button";
import { ThemeSwitcher } from "@workspace/ui/components/theme-switcher";
import { BellIcon } from "lucide-react";

import { ModeToggle } from "#components/mode-toggle";
import { RouterBreadcrumb } from "#components/router-breadcrumb";

import { MobileNav } from "./mobile-nav";

export function AppHeader() {
  return (
    <header
      className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur-sm"
      aria-label="Application header"
    >
      {/* Left: mobile sidebar trigger + breadcrumbs */}
      <div className="flex flex-1 items-center gap-2 overflow-hidden">
        <MobileNav />

        <nav aria-label="Breadcrumb" className="hidden min-w-0 sm:block">
          <RouterBreadcrumb />
        </nav>
      </div>

      {/* Right: notifications, theme switcher */}
      <div className="flex shrink-0 items-center gap-1">
        <Button size="icon" variant="ghost" aria-label="Notifications">
          <BellIcon className="size-4" />
        </Button>
        <ModeToggle />
        <ThemeSwitcher />
        {/* <UserMenu /> */}
      </div>
    </header>
  );
}
