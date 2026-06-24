import { OrganizationSwitcher } from "@workspace/ui/components/auth/organization/organization-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  // SidebarRail,
} from "@workspace/ui/components/shadcn/sidebar";
import { useIsMobile } from "@workspace/ui/hooks/use-mobile";
import * as React from "react";

import { navGroups } from "#config/sidebar.config";

// import { NavDocuments } from "./nav-documents"
import { NavGroup } from "./nav-group";
import { NavUser } from "./nav-user";
// import { OrganizationSwitcher } from "./organization-switcher";
import { SidebarSearch } from "./sidebar-search";

const user = {
  name: "Jordan Lee",
  email: "jordan@acme.io",
  avatar: "/avatars/shadcn.jpg",
  initials: "JL",
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const isMobile = useIsMobile();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <OrganizationSwitcher hideSlug={false} side={isMobile ? "bottom" : "right"} />
        <SidebarSearch />
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((group, index) => (
          <NavGroup
            key={`${group.label}-${index}`}
            group={group}
            className={index === navGroups.length - 1 ? "mt-auto" : undefined}
          />
        ))}
        {/* <NavDocuments group={documents} className="group-data-[collapsible=icon]:hidden"/> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      {/* <SidebarRail /> */}
    </Sidebar>
  );
}
