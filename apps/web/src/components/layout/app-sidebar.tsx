import { useSetActiveOrganization } from "@better-auth-ui/react/plugins/organization";
import { useQueryClient } from "@tanstack/react-query";
import { authClient } from "@workspace/auth/client";
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
import { projectKeys } from "#features/form-demo/api/queries";

// import { NavDocuments } from "./nav-documents"
import { NavGroup } from "./nav-group";
// import { NavUser } from "./nav-user";
import { SidebarSearch } from "./sidebar-search";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const isMobile = useIsMobile();
  const sidebar = useSidebar();
  const queryClient = useQueryClient();
  const { mutateAsync: setActiveOrganization } = useSetActiveOrganization(authClient);

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <OrganizationSwitcher
          hideSlug={false}
          side={isMobile ? "bottom" : "right"}
          setActive={async (organization) => {
            await setActiveOrganization({ organizationId: organization?.id ?? null });
            // HINT: Invalidate all relevant queries when the active organization changes to ensure fresh data.
            await Promise.all([queryClient.invalidateQueries({ queryKey: projectKeys.all })]);
          }}
        />

        <SidebarSearch />
      </SidebarHeader>
      <SidebarContent>
        {/* Scroll inside this wrapper so the app navigation keeps a native scrollbar. this will reset `no-scrollbar` of SidebarContent */}
        <div className="flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto group-data-[collapsible=icon]:overflow-hidden">
          {navGroups.map((group, index) => (
            <NavGroup
              key={group.label || index}
              group={group}
              className={index === navGroups.length - 1 ? "mt-auto" : undefined}
            />
          ))}
          {/* <NavDocuments group={documents} className="group-data-[collapsible=icon]:hidden"/> */}
        </div>
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
                  href: "/settings/notifications",
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
