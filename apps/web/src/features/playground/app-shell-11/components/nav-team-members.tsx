import { Fragment, useState } from "react"
import { cn } from "cn"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/shadcn/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/shadcn/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/shadcn/sidebar"
import { TEAM_MEMBER_ACTIONS, TEAM_MEMBERS, type TeamMember } from "./data"
import { MoreHorizontalIcon, ChevronDownIcon } from "lucide-react"

// ── Status Dot ──

function StatusDot({ status }: { status: TeamMember["status"] }) {
  return (
    <span
      className={cn(
        "border-sidebar absolute right-0 bottom-0 size-2 border",
        "rounded-full",
        status === "online" && "bg-emerald-500",
        status === "away" && "bg-amber-400",
        status === "offline" && "bg-muted-foreground/40"
      )}
      aria-hidden="true"
    />
  )
}

// ── Member Action Menu ──

function MemberActionMenu({ member }: { member: TeamMember }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <SidebarMenuAction
            showOnHover
            aria-label={`Actions for ${member.name}`}
          />
        }
      >
        <MoreHorizontalIcon aria-hidden="true" />
      </DropdownMenuTrigger>
      {/* Content */}
      <DropdownMenuContent
        side="right"
        align="start"
        sideOffset={4}
        className="w-44"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-muted-foreground text-xs font-normal">
            {member.name}
          </DropdownMenuLabel>
          {TEAM_MEMBER_ACTIONS.map((action) => (
            <Fragment key={action.id}>
              {action.destructive && <DropdownMenuSeparator />}
              <DropdownMenuItem
                variant={action.destructive ? "destructive" : "default"}
                className="[&_svg]:size-3.5 [&_svg]:opacity-60"
              >
                {action.icon}
                {action.label}
              </DropdownMenuItem>
            </Fragment>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ── Team Member Item ──

function TeamMemberItem({ member }: { member: TeamMember }) {
  return (
    <SidebarMenuItem>
      {/* Sidebar */}
      <SidebarMenuButton
        tooltip={`${member.name} · ${member.role}`}
        render={<a href="#" />}
      >
        <div className="relative shrink-0">
          <Avatar className="size-5">
            <AvatarImage src={member.avatar} alt={member.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-[8px] font-semibold">
              {member.initials}
            </AvatarFallback>
          </Avatar>
          <StatusDot status={member.status} />
        </div>
        <span className="min-w-0 truncate text-sm">{member.name}</span>
      </SidebarMenuButton>
      <MemberActionMenu member={member} />
    </SidebarMenuItem>
  )
}

// ── Nav Operators ──

export function NavTeamMembers() {
  const [open, setOpen] = useState(true)

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      {/* Sidebar */}
      <SidebarGroupLabel
        render={
          <button
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            aria-controls="team-members-list"
          />
        }
        className="focus-visible:ring-sidebar-ring w-full cursor-pointer focus-visible:ring-2 focus-visible:outline-none"
      >
        Operators
        <ChevronDownIcon className={cn(
                          "ml-auto size-4 shrink-0 opacity-60 transition-transform duration-200",
                          !open && "-rotate-90"
                        )} aria-hidden="true" />
      </SidebarGroupLabel>

      {open && (
        <SidebarGroupContent id="team-members-list">
          <SidebarMenu className="gap-0.25">
            {TEAM_MEMBERS.map((member) => (
              <TeamMemberItem key={member.id} member={member} />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      )}
    </SidebarGroup>
  )
}