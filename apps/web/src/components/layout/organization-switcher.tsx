"use client";

import type { OrganizationAuthClient } from "@better-auth-ui/react";
import {
  useActiveOrganization,
  useAuth,
  useListOrganizations,
  useSession,
  useSetActiveOrganization,
} from "@better-auth-ui/react";
import { Link } from "@tanstack/react-router";
import { CreateOrganizationDialog } from "@workspace/ui/components/auth/organization/create-organization-dialog";
import { OrganizationView } from "@workspace/ui/components/auth/organization/organization-view";
import { UserView } from "@workspace/ui/components/auth/user/user-view";
import { buttonVariants } from "@workspace/ui/components/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/shadcn/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/shadcn/sidebar";
import { cn } from "@workspace/ui/lib/utils";
import type { Organization } from "better-auth/client";
import { ChevronsUpDownIcon, PlusCircle, Settings as SettingsIcon } from "lucide-react";
import { useState } from "react";

interface OrganizationSwitcherProps {
  hideSlug?: boolean;
  side?: "top" | "right" | "bottom" | "left";
}

export function OrganizationSwitcher({
  hideSlug = false,
  side = "right",
}: OrganizationSwitcherProps) {
  const { authClient } = useAuth();
  const { data: session, isPending: sessionPending } = useSession(authClient);

  const { data: activeOrganization, isPending: activeOrganizationPending } = useActiveOrganization(
    authClient as OrganizationAuthClient,
  );

  const { data: organizations, isPending: organizationsPending } = useListOrganizations(
    authClient as OrganizationAuthClient,
  );

  const { mutate: setActiveOrganization, isPending: isSwitchingOrg } = useSetActiveOrganization(
    authClient as OrganizationAuthClient,
  );

  const isPending =
    sessionPending ||
    (!!session && (organizationsPending || activeOrganizationPending)) ||
    isSwitchingOrg;

  const [createOpen, setCreateOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const otherOrganizations =
    organizations?.filter((organization) => organization.id !== activeOrganization?.id) ?? [];

  const hasOtherEntries = otherOrganizations.length > 0 || !!activeOrganization;

  function handleSetActive(organization: Organization | null) {
    setActiveOrganization({ organizationId: organization?.id ?? null });
  }

  if (!session) {
    return null;
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger
              render={
                <SidebarMenuButton
                  size="lg"
                  disabled={isPending}
                  className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
                />
              }
            >
              {isPending || !session ? null : activeOrganization ? (
                <OrganizationView hideRole hideSlug={hideSlug} />
              ) : (
                <UserView hideSubtitle />
              )}
              <ChevronsUpDownIcon className="ml-auto" />
            </DropdownMenuTrigger>

            <DropdownMenuContent className="min-w-56" align="start" side={side} sideOffset={4}>
              {activeOrganization ? (
                <div className="flex items-center justify-between gap-4 px-2 py-2">
                  <OrganizationView
                    hideRole
                    hideSlug={hideSlug}
                    organization={activeOrganization}
                  />

                  <Link
                    to="/organization/$path"
                    params={{ path: "settings" }}
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                  >
                    <SettingsIcon className="size-4 text-muted-foreground" />
                  </Link>
                </div>
              ) : session?.user ? (
                <div className="flex items-center justify-between gap-4 px-2 py-2">
                  <UserView hideSubtitle />

                  <Link
                    to="/user/$path"
                    params={{ path: "account" }}
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                  >
                    <SettingsIcon className="size-4 text-muted-foreground" />
                  </Link>
                </div>
              ) : null}

              <DropdownMenuSeparator />

              {!!activeOrganization && (
                <DropdownMenuItem onClick={() => handleSetActive(null)}>
                  <UserView hideSubtitle />
                </DropdownMenuItem>
              )}

              {otherOrganizations.map((organization) => (
                <DropdownMenuItem
                  key={organization.id}
                  onClick={() => handleSetActive(organization)}
                >
                  <OrganizationView hideRole hideSlug={hideSlug} organization={organization} />
                </DropdownMenuItem>
              ))}

              {hasOtherEntries && <DropdownMenuSeparator />}

              <DropdownMenuItem
                onClick={() => {
                  setDropdownOpen(false);
                  setCreateOpen(true);
                }}
              >
                <PlusCircle className="size-4 text-muted-foreground" />
                Create organization
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <CreateOrganizationDialog open={createOpen} onOpenChange={setCreateOpen} />
    </>
  );
}
