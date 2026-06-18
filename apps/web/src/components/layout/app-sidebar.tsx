import { Link, useRouterState } from "@tanstack/react-router";
import { Avatar, AvatarFallback } from "@workspace/ui/components/shadcn/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@workspace/ui/components/shadcn/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/shadcn/input-group";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@workspace/ui/components/shadcn/sidebar";
import { useKBar } from "kbar";
import {
  BoxIcon,
  CommandIcon,
  GalleryVerticalEndIcon,
  AudioWaveformIcon,
  ChevronsUpDownIcon,
  PlusIcon,
  CheckIcon,
  SearchIcon,
  BadgeCheckIcon,
  CreditCardIcon,
  BellIcon,
  LogOutIcon,
  SparklesIcon,
} from "lucide-react";
import { useState } from "react";

import { navGroups } from "#config/sidebar.config";

const teams = [
  { name: "Acme Inc", logo: BoxIcon, plan: "Pro workspace" },
  { name: "Acme Corp.", logo: GalleryVerticalEndIcon, plan: "Startup" },
  { name: "Evil Corp.", logo: AudioWaveformIcon, plan: "Free" },
];

const user = {
  name: "Jordan Lee",
  email: "jordan@acme.io",
  initials: "JL",
};

function TeamSwitcher() {
  const [activeTeam, setActiveTeam] = useState(teams[0]);
  const ActiveLogo = activeTeam.logo;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <SidebarMenuButton
            size="lg"
            tooltip={activeTeam.name}
            className="data-[popup-open]:bg-sidebar-accent data-[popup-open]:text-sidebar-accent-foreground"
          />
        }
      >
        <span className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <ActiveLogo className="size-4" />
        </span>
        <div className="flex flex-col gap-0.5 leading-none">
          <span className="font-semibold">{activeTeam.name}</span>
          <span className="text-xs text-muted-foreground">{activeTeam.plan}</span>
        </div>
        <ChevronsUpDownIcon className="ml-auto size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--anchor-width) min-w-56 rounded-lg"
        align="start"
        side="bottom"
        sideOffset={4}
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs text-muted-foreground">Teams</DropdownMenuLabel>
          {teams.map((team) => {
            const TeamLogo = team.logo;
            return (
              <DropdownMenuItem
                key={team.name}
                onClick={() => setActiveTeam(team)}
                className="gap-2 p-2"
              >
                <span className="flex size-6 items-center justify-center rounded-md border border-border">
                  <TeamLogo className="size-3.5 shrink-0" />
                </span>
                {team.name}
                {team.name === activeTeam.name ? <CheckIcon className="ml-auto size-4" /> : null}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 p-2">
          <span className="flex size-6 items-center justify-center rounded-md border border-border bg-background">
            <PlusIcon className="size-4" />
          </span>
          <span className="text-muted-foreground">Add team</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NavUser() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <SidebarMenuButton
            size="lg"
            tooltip={user.name}
            className="data-[popup-open]:bg-sidebar-accent data-[popup-open]:text-sidebar-accent-foreground"
          />
        }
      >
        <Avatar className="size-8 rounded-lg">
          <AvatarFallback className="rounded-lg">{user.initials}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-0.5 leading-none">
          <span className="font-medium">{user.name}</span>
          <span className="text-xs text-muted-foreground">{user.email}</span>
        </div>
        <ChevronsUpDownIcon className="ml-auto size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--anchor-width) min-w-56 rounded-lg"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        <div className="flex items-center gap-2 px-1 py-1.5 text-left">
          <Avatar className="size-8 rounded-lg">
            <AvatarFallback className="rounded-lg">{user.initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-medium">{user.name}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <SparklesIcon />
            Upgrade to Pro
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BadgeCheckIcon />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCardIcon />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem>
            <BellIcon />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOutIcon />
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { query } = useKBar();

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <TeamSwitcher />
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarGroup className="px-0 py-0 group-data-[collapsible=icon]:hidden">
          <SidebarGroupContent>
            <InputGroup className="h-9 cursor-pointer bg-sidebar" onClick={() => query.toggle()}>
              <InputGroupInput
                placeholder="Search..."
                readOnly
                className="cursor-pointer"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") query.toggle();
                }}
              />
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
                <kbd className="pointer-events-none inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground select-none">
                  <CommandIcon className="size-3" />K
                </kbd>
              </InputGroupAddon>
            </InputGroup>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarHeader>

      <SidebarContent>
        {navGroups.map((group, index) => (
          <SidebarGroup
            key={group.label}
            className={index === navGroups.length - 1 ? "mt-auto" : undefined}
          >
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={pathname === item.url}
                      tooltip={item.title}
                      render={<Link to={item.url} target={item.external ? "_blank" : undefined} />}
                    >
                      {item.icon ? <item.icon /> : null}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <NavUser />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
