import { cn } from "cn"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@workspace/ui/components/shadcn/sidebar"

import { Logo } from "./logo"
import { NavMain } from "./nav-main"
import { NavTeamMembers } from "./nav-team-members"
import { NavWorkspace } from "./nav-workspace"
import { NotificationsPopover } from "./notifications-popover"
import { SearchForm } from "./search-form"
import { SpendingLimit } from "./spending-limit"

// ── Sidebar Rail Toggle (from sidebar-1 pattern) ──

function SidebarRailToggle() {
  const { state, toggleSidebar } = useSidebar()
  const isExpanded = state === "expanded"

  return (
    <button
      type="button"
      aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
      onClick={toggleSidebar}
      style={{
        left: isExpanded ? "var(--sidebar-width)" : "var(--sidebar-width-icon)",
      }}
      className={cn(
        "group/rail fixed top-1/2 z-30 flex h-12 w-7 -translate-y-1/2 cursor-pointer items-center pl-2 outline-none",
        "transition-[left] duration-200 ease-linear"
      )}
    >
      <span className="flex flex-col items-center">
        <span
          aria-hidden="true"
          className={cn(
            "bg-foreground/40 block h-2 w-0.5 rounded-t-full",
            "origin-bottom transition-all duration-100 ease-linear",
            isExpanded
              ? "group-hover/rail:bg-foreground/60 group-hover/rail:rotate-40"
              : "group-hover/rail:bg-foreground/60 group-hover/rail:-rotate-40"
          )}
        />
        <span
          aria-hidden="true"
          className={cn(
            "bg-foreground/40 block h-2 w-0.5 rounded-b-full",
            "origin-top transition-all duration-100 ease-linear",
            isExpanded
              ? "group-hover/rail:bg-foreground/60 group-hover/rail:-rotate-40"
              : "group-hover/rail:bg-foreground/60 group-hover/rail:rotate-40"
          )}
        />
      </span>

      <span
        className={cn(
          "border-border bg-foreground text-background absolute left-full -ml-2 border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap shadow-xs",
          "rounded-md",
          "pointer-events-none transition-all duration-200 ease-out",
          "-translate-x-0.5 opacity-0",
          "group-hover/rail:translate-x-0 group-hover/rail:opacity-100"
        )}
      >
        {isExpanded ? "Collapse" : "Expand"}
      </span>
    </button>
  )
}

// ── App Sidebar ──

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      {/* Header */}
      <SidebarHeader className="border-sidebar-border flex min-h-(--app-header-height) shrink-0 flex-row items-center border-b px-2 py-0 in-data-[state=collapsed]:px-0">
        <div className="inline-flex min-h-10 items-center gap-2 px-0.5 in-data-[state=collapsed]:pl-2.5">
          <Logo />
          <span className="text-sm font-medium in-data-[state=collapsed]:hidden">
            ReUI
          </span>
        </div>
      </SidebarHeader>

      {/* Sidebar */}
      <SidebarContent>
        <div className="py-2">
          <SearchForm />
        </div>

        <NotificationsPopover />

        <NavMain />
        <NavTeamMembers />

        <div className="mt-auto">
          <SpendingLimit />
        </div>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-sidebar-border h-(--app-bottom-bar-height) shrink-0 justify-center border-t p-0">
        <NavWorkspace />
      </SidebarFooter>

      <SidebarRailToggle />
    </Sidebar>
  )
}