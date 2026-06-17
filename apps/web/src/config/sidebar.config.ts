import {
  BarChart3Icon,
  BotIcon,
  Building2Icon,
  ClipboardListIcon,
  CpuIcon,
  LayoutDashboardIcon,
  Link2Icon,
  ShieldCheckIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";

import type { NavGroup } from "#types/index";

export const navGroups: NavGroup[] = [
  {
    label: "Platform",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboardIcon,
        shortcut: ["d", "d"],
        isActive: false,
        items: [],
      },
      {
        title: "Analytics",
        url: "#",
        icon: BarChart3Icon,
        isActive: false,
        items: [],
      },
      {
        title: "Agents",
        url: "#",
        icon: BotIcon,
        isActive: false,
        items: [],
      },
      {
        title: "Devices",
        url: "#",
        icon: CpuIcon,
        isActive: false,
        items: [],
      },
      {
        title: "Policies",
        url: "#",
        icon: ShieldCheckIcon,
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
];
