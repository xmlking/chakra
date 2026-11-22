import { type ReactNode } from "react"

import { CodexDark } from "@workspace/ui/components/shadcn/svgs/codexDark"
import { CodexLight } from "@workspace/ui/components/shadcn/svgs/codexLight"
import { LayoutDashboardIcon, FolderIcon, SquareCheckIcon, CircleDotIcon, UsersIcon, BarChart3Icon, UserIcon, MessageSquareIcon, UserMinusIcon, ExternalLinkIcon, UserPlusIcon, FlagIcon, CopyIcon, ArchiveIcon } from "lucide-react"

// ── Left Sidebar Types ──

export type NavChild = {
  id: string
  label: string
  isActive?: boolean
}

export type NavItem = {
  id: string
  label: string
  icon: ReactNode
  badge?: string | number
  isActive?: boolean
  children?: NavChild[]
}

export type Workspace = {
  id: string
  name: string
  tier?: string
  logo?: ReactNode
  imageUrl?: string
  avatarClassName?: string
}

export type Project = {
  id: string
  name: string
  progress: number
  color: string
}

export type ItemAction = {
  id: string
  label: string
  icon: ReactNode
  destructive: boolean
}

// ── Team Member Type ──

export type TeamMember = {
  id: string
  name: string
  role: string
  avatar: string
  initials: string
  status: "online" | "away" | "offline"
}

// ── Team Members ──

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "tm1",
    name: "Maya Chen",
    role: "Customer Lead",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&dpr=2&q=80",
    initials: "DP",
    status: "online",
  },
  {
    id: "tm2",
    name: "Owen Price",
    role: "Solutions Lead",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&dpr=2&q=80",
    initials: "MR",
    status: "online",
  },
  {
    id: "tm3",
    name: "Noah Singh",
    role: "Onboarding PM",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&dpr=2&q=80",
    initials: "RB",
    status: "away",
  },
  {
    id: "tm4",
    name: "Iris Hale",
    role: "Renewals Lead",
    avatar:
      "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=96&h=96&dpr=2&q=80",
    initials: "IH",
    status: "online",
  },
  {
    id: "tm5",
    name: "Sofia Bennett",
    role: "Knowledge Ops",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&dpr=2&q=80",
    initials: "SB",
    status: "online",
  },
  {
    id: "tm6",
    name: "Liam Carter",
    role: "QA Analyst",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=96&h=96&dpr=2&q=80",
    initials: "LC",
    status: "offline",
  },
]

// ── Schedule Type ──

export type Schedule = {
  id: string
  label: string
}

export const SCHEDULES: Schedule[] = [
  { id: "today", label: "Today" },
  { id: "at-risk", label: "At-risk accounts" },
  { id: "handoff-review", label: "Handoff review" },
  { id: "playbook-audit", label: "Playbook audit" },
  { id: "exec-brief", label: "Exec brief" },
]

// ── Workspaces ──

export const WORKSPACES: Workspace[] = [
  {
    id: "claude",
    name: "Claude",
    tier: "Enterprise",
    imageUrl: "https://github.com/claude.png",
    avatarClassName: "",
  },
  {
    id: "vercel",
    name: "Vercel",
    tier: "Pro",
    imageUrl: "https://github.com/vercel.png",
    avatarClassName: "",
  },
  {
    id: "codex",
    name: "Codex",
    tier: "Team",
    logo: (
      <>
        <CodexLight className="size-full dark:hidden" aria-hidden="true" />
        <CodexDark className="hidden size-full dark:block" aria-hidden="true" />
      </>
    ),
  },
]

// ── Left Nav Main ──

export const NAV_MAIN: NavItem[] = [
  {
    id: "dashboard",
    label: "Today",
    icon: (
      <LayoutDashboardIcon aria-hidden="true" />
    ),
    isActive: true,
  },
  {
    id: "projects",
    label: "Handoffs",
    icon: (
      <FolderIcon aria-hidden="true" />
    ),
  },
  {
    id: "tasks",
    label: "Follow-ups",
    icon: (
      <SquareCheckIcon aria-hidden="true" />
    ),
  },
  {
    id: "issues",
    label: "Brief Queue",
    icon: (
      <CircleDotIcon aria-hidden="true" />
    ),
    children: [
      { id: "unassigned", label: "Unassigned" },
      { id: "drafting", label: "Drafting" },
      { id: "approved", label: "Approved" },
    ],
  },
  {
    id: "team",
    label: "Accounts",
    icon: (
      <UsersIcon aria-hidden="true" />
    ),
    children: [
      { id: "segments", label: "Segments" },
      { id: "owners", label: "Owners" },
      { id: "permissions", label: "Permissions" },
    ],
  },
  {
    id: "reports",
    label: "Insights",
    icon: (
      <BarChart3Icon aria-hidden="true" />
    ),
  },
]

// ── Operator Actions ──

export type TeamMemberAction = {
  id: string
  label: string
  icon: ReactNode
  destructive: boolean
}

export const TEAM_MEMBER_ACTIONS: TeamMemberAction[] = [
  {
    id: "profile",
    label: "View Profile",
    icon: (
      <UserIcon aria-hidden="true" />
    ),
    destructive: false,
  },
  {
    id: "message",
    label: "Send Message",
    icon: (
      <MessageSquareIcon aria-hidden="true" />
    ),
    destructive: false,
  },
  {
    id: "assign",
    label: "Assign Task",
    icon: (
      <SquareCheckIcon aria-hidden="true" />
    ),
    destructive: false,
  },
  {
    id: "remove",
    label: "Remove Operator",
    icon: (
      <UserMinusIcon aria-hidden="true" />
    ),
    destructive: true,
  },
]

// ── Active Playbooks ──

export const ACTIVE_PROJECTS: Project[] = [
  {
    id: "design-sys",
    name: "Enterprise handoff kit",
    progress: 72,
    color: "stroke-blue-500",
  },
  {
    id: "api-int",
    name: "Migration playbook",
    progress: 45,
    color: "stroke-violet-500",
  },
  {
    id: "mobile-app",
    name: "QBR brief library",
    progress: 88,
    color: "stroke-emerald-500",
  },
  {
    id: "analytics",
    name: "Renewal risk notes",
    progress: 30,
    color: "stroke-orange-500",
  },
  {
    id: "auth-mod",
    name: "Support escalation map",
    progress: 60,
    color: "stroke-rose-500",
  },
]

// ── Item Actions ──

export const ITEM_ACTIONS: ItemAction[] = [
  {
    id: "open",
    label: "Open Playbook",
    icon: (
      <ExternalLinkIcon aria-hidden="true" />
    ),
    destructive: false,
  },
  {
    id: "assign",
    label: "Assign Owner",
    icon: (
      <UserPlusIcon aria-hidden="true" />
    ),
    destructive: false,
  },
  {
    id: "milestone",
    label: "Set Due Date",
    icon: (
      <FlagIcon aria-hidden="true" />
    ),
    destructive: false,
  },
  {
    id: "duplicate",
    label: "Duplicate",
    icon: (
      <CopyIcon aria-hidden="true" />
    ),
    destructive: false,
  },
  {
    id: "archive",
    label: "Archive",
    icon: (
      <ArchiveIcon aria-hidden="true" />
    ),
    destructive: true,
  },
]

// ── Notification Types ──

export type NotificationType =
  | "mention"
  | "comment"
  | "share"
  | "invite"
  | "billing"
  | "security"
  | "feature"
  | "deployment"
  | "usage"
  | "system"
  | "task"
  | "approval"
  | "integration"
  | "achievement"
  | "feedback"
  | "team_join"
  | "reaction"
  | "review"
  | "event"

export type NotificationVariant = "info" | "success" | "warning" | "destructive"

export type NotificationAction = {
  label: string
  variant?: "default" | "outline" | "destructive"
  action?: string
}

export type NotificationAttachment = {
  name: string
  size: string
  url?: string
}

export type NotificationAvatar = {
  src: string
  fallback: string
}

export type NotificationGroupMember = {
  src: string
  fallback: string
  online?: boolean
}

export type NotificationMeta = {
  label: string
  value: string
  color?: string
}

export type Notification = {
  id: string
  type: NotificationType
  variant?: NotificationVariant
  title: string
  body?: string
  time: string
  unread?: boolean
  avatar?: NotificationAvatar
  username?: string
  link?: string
  badge?: string
  actions?: NotificationAction[]
  attachment?: NotificationAttachment
  meta?: NotificationMeta
  progress?: number
  progressVariant?: "default" | "success"
  avatarGroup?: NotificationGroupMember[]
  avatarGroupCount?: number
  rating?: number
  eventDate?: string
  eventTime?: string
}

// ── Notifications Data ──

export const NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "mention",
    title: "mentioned you in",
    body: '"Can you review the changes?"',
    time: "2m ago",
    unread: false,
    avatar: {
      src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&dpr=2&q=80",
      fallback: "SR",
    },
    username: "@sarah_smith",
    link: "#PR-1024",
  },
  {
    id: "n2",
    type: "approval",
    variant: "warning",
    title: "Pending approval",
    body: "Enterprise handoff kit needs approval before the customer review.",
    time: "5m ago",
    unread: true,
    actions: [
      { label: "Approve", variant: "default" },
      { label: "Review", variant: "outline" },
    ],
    meta: { label: "Priority", value: "High", color: "text-warning" },
  },
  {
    id: "n3",
    type: "share",
    title: "shared",
    body: "Renewal summary",
    time: "15m ago",
    unread: true,
    avatar: {
      src: "https://images.unsplash.com/photo-1485206412256-701ccc5b93ca?w=96&h=96&dpr=2&q=80",
      fallback: "MA",
    },
    username: "@maverick",
    attachment: {
      name: "northwind-renewal.pdf",
      size: "2mb",
    },
  },
  {
    id: "n4",
    type: "task",
    variant: "info",
    title: "Task assigned to you",
    body: "Prep a follow-up brief for the mobile rollout account.",
    time: "30m ago",
    unread: true,
    meta: { label: "Due", value: "Tomorrow", color: "text-destructive" },
  },
  {
    id: "n4b",
    type: "team_join",
    variant: "success",
    title: "4 operators joined Atlas Desk",
    body: "Sarah, Mike, Emma and James joined the handoff workspace.",
    time: "45m ago",
    unread: true,
    avatarGroup: [
      {
        src: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=96&h=96&dpr=2&q=80",
        fallback: "SC",
        online: true,
      },
      {
        src: "https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=96&h=96&dpr=2&q=80",
        fallback: "MR",
      },
      {
        src: "https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=96&h=96&dpr=2&q=80",
        fallback: "EW",
      },
    ],
    avatarGroupCount: 1,
  },
  {
    id: "n4c",
    type: "reaction",
    variant: "info",
    title: "Reactions on your comment",
    body: "Sarah and 2 others reacted to your comment in #handoffs.",
    time: "1h ago",
    avatarGroup: [
      {
        src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&dpr=2&q=80",
        fallback: "SR",
        online: true,
      },
      {
        src: "https://images.unsplash.com/photo-1485206412256-701ccc5b93ca?w=96&h=96&dpr=2&q=80",
        fallback: "MA",
      },
    ],
    avatarGroupCount: 1,
    badge: "👍 5",
  },
  {
    id: "n4d",
    type: "review",
    variant: "success",
    title: "New review received",
    body: "Emma left feedback on the migration playbook.",
    time: "2h ago",
    avatar: {
      src: "https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=96&h=96&dpr=2&q=80",
      fallback: "EW",
    },
    username: "@emma",
    rating: 4,
  },
  {
    id: "n4e",
    type: "event",
    variant: "info",
    title: "Upcoming event reminder",
    body: "Playbook review with the customer team.",
    time: "3h ago",
    unread: true,
    eventDate: "Mar 3, 2026",
    eventTime: "10:00 to 11:00 AM",
    meta: { label: "Where", value: "Google Meet", color: "text-info" },
    actions: [
      { label: "Join", variant: "default" },
      { label: "Decline", variant: "outline" },
    ],
  },
  {
    id: "n5",
    type: "invite",
    variant: "info",
    title: "Workspace Invitation",
    body: "Alex invited you to join Atlas Desk.",
    time: "1h ago",
    unread: false,
    actions: [
      { label: "Accept", variant: "default" },
      { label: "Decline", variant: "outline" },
    ],
  },
  {
    id: "n6",
    type: "integration",
    variant: "success",
    title: "Slack connected",
    body: "Slack handoff alerts are now synced with Atlas Desk.",
    time: "2h ago",
  },
  {
    id: "n7",
    type: "billing",
    variant: "info",
    title: "Credit pack renewed",
    body: "Your monthly AI draft credits were renewed.",
    time: "3h ago",
    badge: "$49.00",
  },
  {
    id: "n8",
    type: "achievement",
    variant: "success",
    title: "Monthly milestone reached!",
    body: "100 of 100 customer follow-ups completed this month.",
    time: "4h ago",
    progress: 100,
    progressVariant: "success",
    meta: { label: "Goal", value: "100 tasks", color: "text-success" },
  },
  {
    id: "n9",
    type: "security",
    variant: "destructive",
    title: "New sign-in detected",
    body: "We noticed a new login from Mac OS, Chrome.",
    time: "Yesterday",
  },
  {
    id: "n10",
    type: "feedback",
    variant: "info",
    title: "Feedback requested",
    body: "How was your experience with the new handoff workflow?",
    time: "Yesterday",
    actions: [
      { label: "Rate", variant: "default" },
      { label: "Later", variant: "outline" },
    ],
  },
  {
    id: "n11",
    type: "feature",
    variant: "warning",
    title: "Introducing AI Copilot",
    body: "Draft summaries and playbook steps faster with Ask ReUI.",
    time: "2 days ago",
  },
  {
    id: "n12",
    type: "comment",
    variant: "info",
    title: "New comment on Brief #84",
    body: '"I think we should prioritize this for the next sprint..."',
    time: "3 days ago",
  },
  {
    id: "n13",
    type: "deployment",
    variant: "success",
    title: "Deployment successful",
    body: "Customer update published to the launch queue.",
    time: "4 days ago",
    meta: { label: "Env", value: "Production", color: "text-success" },
  },
  {
    id: "n14",
    type: "usage",
    variant: "warning",
    title: "Draft credits at 80%",
    body: "You've used 80% of this cycle's AI draft credits.",
    time: "5 days ago",
    progress: 80,
  },
  {
    id: "n15",
    type: "system",
    variant: "info",
    title: "Scheduled maintenance",
    body: "We'll be performing maintenance on Feb 28, 2026 at 2:00 AM UTC.",
    time: "1 week ago",
  },
]

// ── Right Sidebar Types (from Sidebar 5) ──

export type CalendarItem = {
  id: string
  label: string
  color: string
  enabled: boolean
}

export type CalendarAccount = {
  id: string
  email: string
  items: CalendarItem[]
}

export type AvatarMember = {
  src?: string
  fallback: string
  color: string
}

export type UpcomingEvent = {
  id: string
  title: string
  startTime: string
  endTime: string
  calendarColor: string
  attendees?: AvatarMember[]
}

export type CalendarColor = {
  id: string
  value: string
}

// ── Right Sidebar User ──

export const USER = {
  name: "Nick Bold",
  email: "nick@company.io",
  initials: "NB",
  avatar:
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80",
}

// ── Calendar Accounts ──

export const CALENDAR_ACCOUNTS: CalendarAccount[] = [
  {
    id: "work",
    email: "nick@company.io",
    items: [
      { id: "work-main", label: "Work", color: "#4f46e5", enabled: true },
      {
        id: "work-personal",
        label: "Personal",
        color: "#16a34a",
        enabled: true,
      },
      {
        id: "work-meetings",
        label: "Meetings",
        color: "#9333ea",
        enabled: true,
      },
    ],
  },
  {
    id: "personal",
    email: "nick@gmail.com",
    items: [
      {
        id: "personal-main",
        label: "Personal",
        color: "#ea580c",
        enabled: true,
      },
      {
        id: "personal-family",
        label: "Family",
        color: "#e11d48",
        enabled: false,
      },
    ],
  },
]

// ── Upcoming Events ──

export const UPCOMING_EVENTS: UpcomingEvent[] = [
  {
    id: "e1",
    title: "Weekly Team Standup",
    startTime: "9:00 AM",
    endTime: "9:30 AM",
    calendarColor: "#4f46e5",
    attendees: [
      {
        fallback: "SC",
        color: "bg-violet-500",
        src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=96&h=96&dpr=2&q=80",
      },
      {
        fallback: "ML",
        color: "bg-emerald-500",
        src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&dpr=2&q=80",
      },
      {
        fallback: "EP",
        color: "bg-pink-500",
        src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&dpr=2&q=80",
      },
    ],
  },
  {
    id: "e2",
    title: "Design Review · Component Library v3",
    startTime: "11:00 AM",
    endTime: "12:00 PM",
    calendarColor: "#9333ea",
    attendees: [
      {
        fallback: "AP",
        color: "bg-teal-500",
        src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&dpr=2&q=80",
      },
    ],
  },
  {
    id: "e3",
    title: "Coffee with Alex",
    startTime: "2:00 PM",
    endTime: "2:30 PM",
    calendarColor: "#ea580c",
  },
]

// ── Color Options ──

export const COLOR_OPTIONS: CalendarColor[] = [
  { id: "tomato", value: "#e11d48" },
  { id: "flamingo", value: "#dc2626" },
  { id: "tangerine", value: "#ea580c" },
  { id: "banana", value: "#eab308" },
  { id: "sage", value: "#16a34a" },
  { id: "basil", value: "#0d9488" },
  { id: "peacock", value: "#2563eb" },
  { id: "blueberry", value: "#4f46e5" },
  { id: "lavender", value: "#9333ea" },
  { id: "grape", value: "#c026d3" },
  { id: "graphite", value: "#6b7280" },
  { id: "obsidian", value: "#1f2937" },
]

// ── Timezone ──

export const TIMEZONE = {
  abbreviation: "ET",
  region: "America/New_York",
  label: "Eastern Time",
  offset: "-04:00",
}

// ── Demo Reference Date ──

// customize: fixed demo "today"; all relative calendar dates derive from it
export const DEMO_REFERENCE_DATE = new Date("2026-02-24T00:00:00")

// ── Helpers ──

function daysFromReference(offset: number): string {
  const d = new Date(DEMO_REFERENCE_DATE)
  d.setDate(d.getDate() + offset)
  return d.toISOString().slice(0, 10)
}

// ── Dates With Events ──

export const DATES_WITH_EVENTS: Set<string> = new Set([
  daysFromReference(0),
  daysFromReference(1),
  daysFromReference(3),
  daysFromReference(5),
  daysFromReference(-2),
  daysFromReference(-4),
  daysFromReference(7),
  daysFromReference(10),
])