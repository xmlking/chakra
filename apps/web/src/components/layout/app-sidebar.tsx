import { OrganizationSwitcher } from "@workspace/ui/components/auth/organization/organization-switcher";
import { ScrollArea } from "@workspace/ui/components/shadcn/scroll-area";

import { navGroups } from "#config/sidebar.config";

import { CommandSearch } from "./command-search";
import { NavGroupSection } from "./nav-group";
import { UserNav } from "./user-nav";

export function AppSidebar() {
  return (
    <aside
      aria-label="Application sidebar"
      className="hidden w-64 shrink-0 flex-col border-r bg-background lg:flex"
    >
      {/* Top: org switcher */}
      <div className="flex h-16 shrink-0 items-center border-b px-3">
        <OrganizationSwitcher className="w-full" align="start" />
      </div>

      {/* Search */}
      <div className="shrink-0 px-3 py-2">
        <CommandSearch />
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-2">
        <nav aria-label="Main navigation" className="flex flex-col gap-4">
          {navGroups.map((group) => (
            <NavGroupSection key={group.label} group={group} />
          ))}
        </nav>
      </ScrollArea>

      {/* Bottom: user menu */}
      <UserNav />
    </aside>
  );
}
