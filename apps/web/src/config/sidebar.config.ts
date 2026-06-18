import {
  LayoutDashboardIcon,
  FolderKanbanIcon,
  InboxIcon,
  UsersIcon,
  BarChart3Icon,
  FileTextIcon,
  SettingsIcon,
  LifeBuoyIcon,
  Link2Icon,
  ClipboardListIcon,
  Building2Icon,
} from "lucide-react";

import type { NavGroup } from "#types/index";

export const navGroups: NavGroup[] = [
  {
    label: "Platform",
    items: [
      {
        title: "Overview",
        url: "/dashboard",
        icon: LayoutDashboardIcon,
        shortcut: ["g", "o"],
      },
      {
        title: "Projects",
        url: "/dashboard/projects",
        icon: FolderKanbanIcon,
        shortcut: ["g", "p"],
      },
      { title: "Inbox", url: "/dashboard/inbox", icon: InboxIcon },
      { title: "Team", url: "/dashboard/team", icon: UsersIcon },
      {
        title: "Analytics",
        url: "/dashboard/analytics",
        icon: BarChart3Icon,
        shortcut: ["g", "a"],
      },
    ],
  },
  {
    label: "Management",
    items: [
      {
        title: "Users",
        url: "#",
        icon: UsersIcon,
        isActive: false,
        items: [],
      },
      {
        title: "Organizations",
        url: "/organization/chakra-inc/settings",
        icon: Building2Icon,
        isActive: false,
        items: [],
      },
    ],
  },
  {
    label: "Configuration",
    items: [
      {
        title: "Settings",
        url: "/settings/account",
        icon: SettingsIcon,
        shortcut: ["s", "s"],
        isActive: false,
        items: [],
      },
      {
        title: "Integrations",
        url: "#",
        icon: Link2Icon,
        isActive: false,
        items: [],
      },
      {
        title: "Audit Logs",
        url: "#",
        icon: ClipboardListIcon,
        isActive: false,
        items: [],
      },
    ],
  },
  {
    label: "Resources",
    items: [
      {
        title: "Documentation",
        url: "/dashboard/docs",
        icon: FileTextIcon,
      },
      { title: "Settings", url: "/dashboard/settings", icon: SettingsIcon },
      { title: "Support", url: "/dashboard/support", icon: LifeBuoyIcon },
    ],
  },
];
