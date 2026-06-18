import { useRouter } from "@tanstack/react-router";
import {
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarSearch,
  type Action,
} from "kbar";
import { MoonIcon, SunIcon, MonitorIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { navGroups } from "#config/sidebar.config";

import { RenderResults } from "./render-result";

export function KBar({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { setTheme } = useTheme();

  // Navigation actions are generated from the shared sidebar nav config.
  const actions: Action[] = (() => {
    const navigateTo = async (url: string) => {
      await router.navigate({ to: url });
    };

    const navActions: Action[] = navGroups.flatMap((group) => {
      const acc: Action[] = [];
      for (const item of group.items) {
        if (item.disabled || item.url === "#") continue;
        const Icon = item.icon;
        acc.push({
          id: `${item.url}-action`,
          name: item.title,
          shortcut: item.shortcut,
          keywords: `${item.title.toLowerCase()} ${item.label ?? ""}`.trim(),
          section: group.label,
          subtitle: item.description ?? `Go to ${item.title}`,
          icon: Icon ? <Icon className="size-4" /> : undefined,
          perform: () => navigateTo(item.url),
        });
      }
      return acc;
    });

    const themeActions: Action[] = [
      {
        id: "theme-light",
        name: "Light",
        keywords: "theme light mode appearance",
        section: "Theme",
        subtitle: "Switch to light mode",
        icon: <SunIcon className="size-4" />,
        perform: () => setTheme("light"),
      },
      {
        id: "theme-dark",
        name: "Dark",
        keywords: "theme dark mode appearance",
        section: "Theme",
        subtitle: "Switch to dark mode",
        icon: <MoonIcon className="size-4" />,
        perform: () => setTheme("dark"),
      },
      {
        id: "theme-system",
        name: "System",
        keywords: "theme system mode appearance auto",
        section: "Theme",
        subtitle: "Match your system preference",
        icon: <MonitorIcon className="size-4" />,
        perform: () => setTheme("system"),
      },
    ];

    return [...navActions, ...themeActions];
  })();

  return (
    <KBarProvider actions={actions}>
      <KBarPortal>
        <KBarPositioner className="fixed inset-0 z-9999 bg-background/80 p-0! backdrop-blur-sm">
          <KBarAnimator className="relative mt-64! w-full max-w-[600px] -translate-y-12! overflow-hidden rounded-lg border bg-card text-card-foreground shadow-lg">
            <div className="sticky top-0 z-10 border-b border-border bg-card">
              <KBarSearch className="w-full border-none bg-card px-6 py-4 text-lg outline-hidden focus:ring-0 focus:ring-offset-0 focus:outline-hidden" />
            </div>
            <div className="max-h-[400px]">
              <RenderResults />
            </div>
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </KBarProvider>
  );
}
