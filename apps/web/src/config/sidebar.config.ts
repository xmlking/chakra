import {
  LayoutDashboardIcon,
  FolderKanbanIcon,
  InboxIcon,
  UsersIcon,
  BarChart3Icon,
  FileTextIcon,
  SettingsIcon,
  LifeBuoyIcon,
  Building2Icon,
  Settings2Icon,
  BookOpenIcon,
  BotIcon,
  TerminalSquareIcon,
  HomeIcon,
  UserIcon,
  LandmarkIcon,
} from "lucide-react";

import type { NavGroup } from "#types";

export const navGroups: NavGroup[] = [
  {
    items: [
      {
        title: "Home",
        url: "/",
        icon: HomeIcon,
        shortcut: ["g", "h"],
      },
      {
        title: "Overview",
        url: "/dashboard",
        icon: LayoutDashboardIcon,
        shortcut: ["g", "o"],
      },
      {
        title: "Projects",
        url: "/dashboard/projects",
        icon: FolderKanbanIcon, // FolderIcon
        shortcut: ["g", "p"],
      },
      { title: "Inbox", url: "/dashboard/inbox", icon: InboxIcon },
      { title: "Team", url: "/dashboard/team", icon: UsersIcon },
      {
        title: "Analytics",
        url: "/dashboard/analytics",
        icon: BarChart3Icon,
        // icon: ChartBarIcon,
        shortcut: ["g", "a"],
      },
    ],
  },
  {
    label: "Platform",
    items: [
      {
        title: "Reports",
        url: "/reports",
        icon: TerminalSquareIcon,
        isActive: true,
        items: [
          {
            title: "History",
            url: "/reports/history",
          },
          {
            title: "Starred",
            url: "/reports/starred",
          },
          {
            title: "Settings",
            url: "/reports/settings",
          },
        ],
      },
      {
        title: "Settings",
        url: "/settings",
        icon: Settings2Icon,
        items: [
          {
            title: "General",
            url: "/settings/general",
          },

          {
            title: "Feature Flags",
            url: "/settings/feature-flags",
          },
          {
            title: "Notifications",
            url: "/settings/notifications",
          },
          {
            title: "Team",
            url: "/settings/team",
          },
          {
            title: "Billing",
            url: "/settings/billing",
          },
          {
            title: "Limits",
            url: "/settings/limits",
          },
        ],
      },
      {
        title: "Playground",
        url: "/playground",
        icon: BotIcon, // BugIcon
        items: [
          {
            title: "Test",
            url: "/playground",
          },
          {
            title: "Workflow",
            url: "/playground/workflow",
          },
          {
            title: "Error",
            url: "/playground/error",
          },
          {
            title: "Form Demo",
            url: "/playground/form-demo",
          },
          {
            title: "Version",
            url: "/api/health/live",
          },
        ],
      },
      {
        title: "Documentation",
        url: "/docs",
        icon: BookOpenIcon,
        items: [
          {
            title: "Introduction",
            url: "/docs/introduction",
          },
          {
            title: "Get Started",
            url: "/docs/get-started",
          },
          {
            title: "Tutorials",
            url: "/docs/tutorials",
          },
          {
            title: "Changelog",
            url: "/docs/change-log",
          },
        ],
      },
    ],
  },
  {
    label: "Security",
    items: [
      {
        title: "User",
        url: "/user/account",
        icon: UserIcon,
        shortcut: ["s", "s"],
        isActive: false,
        items: [],
      },
      {
        title: "Organization",
        url: "/organization/settings",
        icon: LandmarkIcon,
        isActive: false,
        items: [],
      },
    ],
  },
  {
    label: "Management",
    items: [
      {
        title: "Users",
        url: "/admin/users",
        icon: UsersIcon,
        isActive: false,
        items: [],
      },
      {
        title: "Organizations",
        url: "/admin/organizations",
        icon: Building2Icon,
        isActive: false,
        items: [],
      },
    ],
  },

  {
    // label: "Resources",
    items: [
      { title: "Documentation", url: "/dashboard/docs", icon: FileTextIcon },
      { title: "Settings", url: "/dashboard/settings", icon: SettingsIcon },
      { title: "Support", url: "/support", icon: LifeBuoyIcon },
    ],
  },
];
