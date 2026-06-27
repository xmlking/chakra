import { viewPaths } from "@better-auth-ui/core";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import { SidebarInset, SidebarProvider } from "@workspace/ui/components/shadcn/sidebar";

import { AppHeader } from "#components/layout/app-header2";
import { AppSidebar } from "#components/layout/app-sidebar";
import { safeRedirect } from "#features/auth/safe-redirect";

const SIDEBAR_COOKIE_NAME = "sidebar_state";

export const Route = createFileRoute("/(app2)")({
  async beforeLoad({ context: { session }, location }) {
    const redirectTarget = safeRedirect(location.href);
    if (!session) {
      throw redirect({
        to: "/auth/$path",
        replace: true,
        params: { path: viewPaths.auth.signIn },
        search: { redirectTo: redirectTarget },
      });
    }

    const isSidebarOpen = createIsomorphicFn()
      .server(async () => getCookie(SIDEBAR_COOKIE_NAME) === "true")
      .client(async () => (await cookieStore.get(SIDEBAR_COOKIE_NAME))?.value === "true");

    const defaultOpen = await isSidebarOpen();
    return { session, defaultOpen };
  },

  component: AppLayout,
});

function AppLayout() {
  const { defaultOpen } = Route.useRouteContext();

  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      // to overwrite default sidebar-width, header-height, pass them in style
      style={
        {
          // "--sidebar-width": "calc(var(--spacing) * 72)",
          "--sidebar-width-icon": "calc(var(--spacing) * 12)",
          "--header-height": "calc(var(--spacing) * 16)",
        } as React.CSSProperties
      }
    >
      <AppSidebar collapsible="icon" /* collapsible="offcanvas" */ />
      <SidebarInset>
        <AppHeader />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
