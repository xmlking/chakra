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
  Settings2Icon,
  BookOpenIcon,
  BotIcon,
  TerminalSquareIcon,
  DatabaseIcon,
  FileChartColumnIcon,
  FileIcon,
  HomeIcon,
} from "lucide-react";

import type { NavGroup } from "#types/index";

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
        title: "Playground",
        url: "#",
        icon: TerminalSquareIcon,
        isActive: true,
        items: [
          {
            title: "History",
            url: "#",
          },
          {
            title: "Starred",
            url: "#",
          },
          {
            title: "Settings",
            url: "#",
          },
        ],
      },
      {
        title: "Models",
        url: "#",
        icon: BotIcon,
        items: [
          {
            title: "Genesis",
            url: "#",
          },
          {
            title: "Explorer",
            url: "#",
          },
          {
            title: "Quantum",
            url: "#",
          },
        ],
      },
      {
        title: "Documentation",
        url: "#",
        icon: BookOpenIcon,
        items: [
          {
            title: "Introduction",
            url: "#",
          },
          {
            title: "Get Started",
            url: "#",
          },
          {
            title: "Tutorials",
            url: "#",
          },
          {
            title: "Changelog",
            url: "#",
          },
        ],
      },
      {
        title: "Settings",
        url: "#",
        icon: Settings2Icon,
        items: [
          {
            title: "General",
            url: "#",
          },
          {
            title: "Team",
            url: "#",
          },
          {
            title: "Billing",
            url: "#",
          },
          {
            title: "Limits",
            url: "#",
          },
        ],
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
    // label: "Resources",
    items: [
      { title: "Documentation", url: "/dashboard/docs", icon: FileTextIcon },
      { title: "Settings", url: "/dashboard/settings", icon: SettingsIcon },
      { title: "Support", url: "/dashboard/support", icon: LifeBuoyIcon },
    ],
  },
];

export const documents: NavGroup = {
  // label: "",
  items: [
    {
      title: "Data Library",
      url: "#",
      icon: DatabaseIcon,
    },
    {
      title: "Reports",
      url: "#",
      icon: FileChartColumnIcon,
    },
    {
      title: "Word Assistant",
      url: "#",
      icon: FileIcon,
    },
  ],
};
