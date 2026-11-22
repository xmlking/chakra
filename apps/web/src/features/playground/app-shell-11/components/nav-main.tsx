"use client"

import { useState } from "react"
import { cn } from "cn"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@workspace/ui/components/shadcn/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@workspace/ui/components/shadcn/sidebar"
import { NAV_MAIN, type NavChild, type NavItem } from "./data"
import { ChevronRightIcon } from "lucide-react"

function NavSubItem({ child }: { child: NavChild }) {
  return (
    <SidebarMenuSubItem>
      {/* Sidebar */}
      <SidebarMenuSubButton render={<a href="#" />} isActive={child.isActive}>
        <span>{child.label}</span>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  )
}

function NavSubMenu({ id, items }: { id: string; items: NavChild[] }) {
  return (
    <SidebarMenuSub id={`subnav-${id}`}>
      {items.map((child) => (
        <NavSubItem key={child.id} child={child} />
      ))}
    </SidebarMenuSub>
  )
}

// ── CollapsibleNavItem ──
// Isolated component so only this item re-renders on open/close toggle.

// Collapsed (icon) rail: the inline submenu would push the next item down, so
// the children open in a side dropdown anchored to the icon button instead.
function CollapsedNavItem({
  item,
}: {
  item: NavItem & { children: NavChild[] }
}) {
  return (
    <SidebarMenuItem>
      {/* Sidebar */}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <SidebarMenuButton
              tooltip={item.label}
              isActive={item.isActive}
              aria-label={item.label}
            />
          }
        >
          {item.icon}
          <span>{item.label}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="right"
          align="start"
          sideOffset={8}
          className="min-w-48"
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel>{item.label}</DropdownMenuLabel>
            {item.children.map((child) => (
              <DropdownMenuItem key={child.id} render={<a href="#" />}>
                {child.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}

// Expanded rail: the submenu expands inline under its parent button.
function ExpandedNavItem({
  item,
  open,
  onToggle,
}: {
  item: NavItem & { children: NavChild[] }
  open: boolean
  onToggle: () => void
}) {
  return (
    <SidebarMenuItem>
      {/* Sidebar */}
      <SidebarMenuButton
        tooltip={item.label}
        isActive={item.isActive}
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`subnav-${item.id}`}
      >
        {item.icon}
        <span className="truncate">{item.label}</span>
        <ChevronRightIcon className={cn(
                          "ml-auto size-4 shrink-0 opacity-60 transition-transform duration-200",
                          open && "rotate-90"
                        )} aria-hidden="true" />
      </SidebarMenuButton>

      {open && <NavSubMenu id={item.id} items={item.children} />}
    </SidebarMenuItem>
  )
}

function CollapsibleNavItem({
  item,
}: {
  item: NavItem & { children: NavChild[] }
}) {
  const { state } = useSidebar()
  // Kept on the always-mounted parent so the expanded open state survives a
  // collapse/expand cycle instead of resetting when the branch swaps.
  const [open, setOpen] = useState(() => item.children.some((c) => c.isActive))

  return state === "collapsed" ? (
    <CollapsedNavItem item={item} />
  ) : (
    <ExpandedNavItem
      item={item}
      open={open}
      onToggle={() => setOpen((prev) => !prev)}
    />
  )
}

function LeafNavItem({ item }: { item: NavItem }) {
  return (
    <SidebarMenuItem>
      {/* Sidebar */}
      <SidebarMenuButton
        tooltip={item.label}
        isActive={item.isActive}
        render={<a href="#" />}
      >
        {item.icon}
        <span className="truncate">{item.label}</span>
        {item.badge !== undefined && (
          <SidebarMenuBadge>
            <div className="relative mr-1 size-1.5 rounded-full bg-emerald-500 before:absolute before:inset-0 before:animate-ping before:rounded-full before:bg-emerald-400 before:opacity-80 before:duration-1500 after:absolute after:inset-0 after:animate-ping after:rounded-full after:bg-emerald-400 after:opacity-40 after:delay-500 after:duration-1500" />
          </SidebarMenuBadge>
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export function NavMain() {
  return (
    <SidebarGroup>
      {/* Sidebar */}
      <SidebarGroupLabel className="in-data-[state=collapsed]:hidden">
        Workspace
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="gap-0.25">
          {NAV_MAIN.map((item) =>
            item.children ? (
              <CollapsibleNavItem
                key={item.id}
                item={item as NavItem & { children: NavChild[] }}
              />
            ) : (
              <LeafNavItem key={item.id} item={item} />
            )
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}