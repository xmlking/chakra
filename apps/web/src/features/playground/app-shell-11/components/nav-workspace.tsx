"use client"

import { useState } from "react"
import { cn } from "cn"
import { useTheme } from "next-themes"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/shadcn/avatar"
import { Button } from "@workspace/ui/components/shadcn/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@workspace/ui/components/shadcn/dropdown-menu"
import { Item, ItemMedia } from "@workspace/ui/components/shadcn/item"
import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@workspace/ui/components/shadcn/sidebar"
import { WORKSPACES, type Workspace } from "./data"
import { SunIcon, MoonIcon, MonitorIcon, CheckIcon, MoreHorizontalIcon, PlusIcon, UserIcon, CreditCardIcon, SettingsIcon, PaletteIcon, LogOutIcon } from "lucide-react"

const THEMES = [
  {
    value: "light",
    label: "Light",
    icon: (
      <SunIcon className="size-3.5" aria-hidden="true" />
    ),
  },
  {
    value: "dark",
    label: "Dark",
    icon: (
      <MoonIcon className="size-3.5" aria-hidden="true" />
    ),
  },
  {
    value: "system",
    label: "System",
    icon: (
      <MonitorIcon className="size-3.5" aria-hidden="true" />
    ),
  },
]

const WORKSPACE_LOGO_SIZE_CLASS_NAME = {
  default: "size-8",
  sm: "size-6",
  lg: "size-10",
} as const

// ── Theme Toggle ──

function ThemeSegmentedToggle() {
  const { theme, setTheme } = useTheme()
  const currentTheme = theme ?? "system"

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="bg-muted/60 inline-flex items-center gap-0.5 rounded-full p-0.5"
    >
      {THEMES.map(({ value, label, icon }) => {
        const isActive = currentTheme === value
        return (
          <Button
            key={value}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={label}
            variant="ghost"
            size="icon-xs"
            onClick={() => setTheme(value)}
            className={cn(
              "rounded-full",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {icon}
          </Button>
        )
      })}
    </div>
  )
}

// ── Workspace Helpers ──

function getWorkspaceInitials(name: string): string {
  return name.charAt(0).toUpperCase()
}

function WorkspaceAvatar({
  workspace,
  className,
  size = "default",
}: {
  workspace: Workspace
  className?: string
  size?: "default" | "sm" | "lg"
}) {
  const initials = getWorkspaceInitials(workspace.name)

  if (workspace.logo && !workspace.imageUrl) {
    return (
      <Item
        render={<span />}
        className={cn(
          "w-auto border-0 p-0",
          "flex shrink-0 items-center justify-center [&_svg]:size-full",
          WORKSPACE_LOGO_SIZE_CLASS_NAME[size],
          className
        )}
      >
        <ItemMedia variant="icon" className="size-full">
          {workspace.logo}
        </ItemMedia>
      </Item>
    )
  }

  return (
    <Avatar size={size} className={cn("shrink-0", className)}>
      {workspace.imageUrl ? (
        <AvatarImage src={workspace.imageUrl} alt={workspace.name} />
      ) : null}
      <AvatarFallback
        className={cn(
          "bg-background border-border text-foreground border text-sm font-medium",
          workspace.avatarClassName
        )}
      >
        {workspace.logo ?? initials}
      </AvatarFallback>
    </Avatar>
  )
}

function WorkspaceItem({
  workspace,
  isActive,
  onSelect,
}: {
  workspace: Workspace
  isActive: boolean
  onSelect: (id: string) => void
}) {
  return (
    <DropdownMenuItem onClick={() => onSelect(workspace.id)}>
      <WorkspaceAvatar workspace={workspace} className="size-5!" />
      <span className="flex-1 truncate text-sm font-medium">
        {workspace.name}
      </span>
      {isActive && (
        <CheckIcon className="ml-auto size-3.5 shrink-0 opacity-60" aria-hidden="true" />
      )}
    </DropdownMenuItem>
  )
}

// ── Nav Workspace ──

export function NavWorkspace() {
  const [activeWorkspaceId, setActiveWorkspaceId] = useState("codex")
  const { isMobile } = useSidebar()

  const activeWorkspace =
    WORKSPACES.find((w) => w.id === activeWorkspaceId) ?? WORKSPACES[0]

  return (
    <SidebarMenu className="h-full justify-center">
      {/* Sidebar */}
      <SidebarMenuItem className="flex h-full items-center">
        <DropdownMenu>
          <DropdownMenuTrigger
            className="focus-visible:ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground flex h-full w-full min-w-0 items-center gap-2 overflow-hidden bg-transparent px-3 text-left text-sm outline-hidden transition-colors group-data-[collapsible=icon]:gap-0 focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50"
            render={<button type="button" aria-label="Open workspace menu" />}
          >
            <WorkspaceAvatar workspace={activeWorkspace} size="sm" />
            <span className="truncate text-sm font-medium group-data-[collapsible=icon]:hidden">
              {activeWorkspace.name}
            </span>
            <MoreHorizontalIcon className="mr-1 ml-auto size-4 shrink-0 opacity-50 group-data-[collapsible=icon]:hidden" aria-hidden="true" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side={isMobile ? "top" : "right"}
            align="end"
            sideOffset={8}
            className="w-60"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-muted-foreground text-xs font-normal">
                Organizations
              </DropdownMenuLabel>
              {WORKSPACES.map((workspace) => (
                <WorkspaceItem
                  key={workspace.id}
                  workspace={workspace}
                  isActive={activeWorkspaceId === workspace.id}
                  onSelect={setActiveWorkspaceId}
                />
              ))}
              <DropdownMenuItem>
                <PlusIcon aria-hidden="true" className="mx-0.5" />
                New Organization
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-muted-foreground text-xs font-normal">
                Account
              </DropdownMenuLabel>

              <DropdownMenuItem>
                <UserIcon aria-hidden="true" />
                Profile
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCardIcon aria-hidden="true" />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <SettingsIcon aria-hidden="true" />
                Preferences
              </DropdownMenuItem>
              {/* The swatches set a value in place, so the menu outlives the click. */}
              <DropdownMenuItem
                closeOnClick={false}
                className="cursor-default focus:bg-transparent!"
              >
                <PaletteIcon aria-hidden="true" />
                Theme
                <div className="ml-auto">
                  <ThemeSegmentedToggle />
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem>
                <LogOutIcon aria-hidden="true" />
                Sign Out
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}