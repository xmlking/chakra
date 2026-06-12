import { Bot, LayoutDashboard, Settings, Building2 } from "lucide-react";

export const navigation = [
  {
    title: "Dashboard",
    to: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Agents",
    to: "/agents",
    icon: Bot,
  },
  {
    title: "Organizations",
    to: "/organizations",
    icon: Building2,
  },
  {
    title: "Settings",
    to: "/settings",
    icon: Settings,
  },
];
