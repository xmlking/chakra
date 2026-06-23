import { UserButton } from "@workspace/ui/components/auth/user/user-button";
import { Button } from "@workspace/ui/components/shadcn/button";
import { Separator } from "@workspace/ui/components/shadcn/separator";
import { SidebarTrigger } from "@workspace/ui/components/shadcn/sidebar";
import { ThemeSwitcher } from "@workspace/ui/components/theme-switcher";
import { BellIcon } from "lucide-react";

import { LayoutToggle } from "#components/layout-toggle";
import { LocaleSwitcher } from "#components/locale-switcher";
import { RouterBreadcrumb } from "#components/router-breadcrumb";

export function AppHeader() {
  return (
    // to make header sticky, added: `sticky top-0 z-50 bg-background` */}
    <header className="sticky top-0 z-50 flex h-(--header-height) shrink-0 items-center gap-2 bg-background transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      {/* Left */}
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 hidden h-4 md:block data-vertical:self-auto"
        />
        <nav aria-label="Breadcrumb" className="hidden md:block">
          <RouterBreadcrumb />
        </nav>

        {/* Right  */}
        <div className="ml-auto flex items-center gap-2">
          <LocaleSwitcher />
          <LayoutToggle className="hidden lg:flex" />
          {/* <ModeToggle /> */}
          <ThemeSwitcher />
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <BellIcon />
            <span className="sr-only">Notifications</span>
          </Button>
          <UserButton size="icon" align="end" />
        </div>
      </div>
    </header>
  );
}
