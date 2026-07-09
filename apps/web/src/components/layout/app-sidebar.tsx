import { OrganizationSwitcher } from "@workspace/ui/components/auth/organization/organization-switcher";
import { UserButton } from "@workspace/ui/components/auth/user/user-button";
import { DropdownMenuSeparator } from "@workspace/ui/components/shadcn/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
  // SidebarRail,
} from "@workspace/ui/components/shadcn/sidebar";
import { useIsMobile } from "@workspace/ui/hooks/use-mobile";
import { BellIcon, CircleUserRoundIcon, CreditCardIcon, SparklesIcon } from "lucide-react";
import * as React from "react";

import { navGroups } from "#config/sidebar.config";

// import { NavDocuments } from "./nav-documents"
import { NavGroup } from "./nav-group";
// import { NavUser } from "./nav-user";
// import { OrganizationSwitcher } from "./organization-switcher";
import { SidebarSearch } from "./sidebar-search";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const isMobile = useIsMobile();
  const sidebar = useSidebar();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <OrganizationSwitcher hideSlug={false} side={isMobile ? "bottom" : "right"} />
        <SidebarSearch />
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((group, index) => (
          <NavGroup
            key={group.label}
            group={group}
            className={index === navGroups.length - 1 ? "mt-auto" : undefined}
          />
        ))}
        {/* <NavDocuments group={documents} className="group-data-[collapsible=icon]:hidden"/> */}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <UserButton
              hideSettings
              links={[
                {
                  href: "/upgrade-to-pro",
                  label: "Upgrade to Pro",
                  icon: <SparklesIcon />,
                  visibility: "authenticated",
                },
                <DropdownMenuSeparator key="separator" />,
                {
                  href: "/user/account",
                  label: "Account",
                  icon: <CircleUserRoundIcon />,
                  visibility: "authenticated",
                },
                {
                  href: "#",
                  label: "Billing",
                  icon: <CreditCardIcon />,
                  visibility: "authenticated",
                },
                {
                  href: "#",
                  label: "Notifications",
                  icon: <BellIcon />,
                  visibility: "authenticated",
                },
              ]}
              className="flex w-full justify-between"
              side={isMobile ? "top" : "right"}
              size={sidebar.state === "collapsed" ? "icon" : "default"}
              variant="ghost"
            />
          </SidebarMenuItem>
        </SidebarMenu>
        {/* <NavUser /> */}
      </SidebarFooter>
      {/* <SidebarRail /> */}
    </Sidebar>
  );
}
