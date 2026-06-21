import { UserButton } from "@workspace/ui/components/auth/user/user-button";
import { Button } from "@workspace/ui/components/shadcn/button";
import { Separator } from "@workspace/ui/components/shadcn/separator";
import { SidebarTrigger } from "@workspace/ui/components/shadcn/sidebar";
import { ThemeSwitcher } from "@workspace/ui/components/theme-switcher";
import { BellIcon } from "lucide-react";

import { LayoutToggle } from "#components/layout-toggle";
import { LocaleSwitcher } from "#components/locale-switcher";
// import { ModeToggle } from "#components/mode-toggle";
import { RouterBreadcrumb } from "#components/router-breadcrumb";

// import { MobileNav } from "./mobile-nav";

export function AppHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-4">
      {/* Left */}
      <SidebarTrigger className="-ml-1" />
      {/* <MobileNav /> */}
      <Separator
        orientation="vertical"
        className="mr-2 hidden h-4 md:block data-vertical:self-center"
      />
      <nav aria-label="Breadcrumb" className="hidden md:block">
        <RouterBreadcrumb />
      </nav>

      {/* Right  */}
      <div className="ml-auto flex items-center gap-2">
        <LocaleSwitcher />
        <LayoutToggle className="hidden lg:flex" />
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <BellIcon />
          <span className="sr-only">Notifications</span>
        </Button>
        {/* <ModeToggle /> */}
        <ThemeSwitcher />
        <UserButton size="icon" align="end" />
        {/* <UserMenu /> */}
      </div>
    </header>
  );
}
