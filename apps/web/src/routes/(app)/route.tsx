import { viewPaths } from "@better-auth-ui/core";
import {
  ensureSession as ensureSessionClient,
  useAuth,
  useAuthenticate,
} from "@better-auth-ui/react";
import { ensureSession as ensureSessionServer } from "@better-auth-ui/react/server";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { getCookie } from "@tanstack/react-start/server";
import { auth } from "@workspace/auth";
import { authClient } from "@workspace/auth/client";
import { SidebarInset, SidebarProvider } from "@workspace/ui/components/shadcn/sidebar";
import { Spinner } from "@workspace/ui/components/shadcn/spinner";

import { AppHeader } from "#components/layout/app-header";
import { AppSidebar } from "#components/layout/app-sidebar";
import { safeRedirect } from "#features/auth/safe-redirect";

const SIDEBAR_COOKIE_NAME = "sidebar_state";

export const Route = createFileRoute("/(app)")({
  async beforeLoad({ context: { queryClient }, location }) {
    const ensureSession = createIsomorphicFn()
      .server(() => ensureSessionServer(queryClient, auth, { headers: getRequestHeaders() }))
      // @ts-ignore
      .client(() => ensureSessionClient(queryClient, authClient));

    const session = await ensureSession();

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

  // Reactive protection
  // Alongside beforeLoad for server-rendered routes, as a second layer that keeps the UI in sync after the initial load.
  const { authClient } = useAuth();
  const { data: session } = useAuthenticate(authClient);
  if (!session) {
    return (
      <div className="my-auto flex justify-center">
        <Spinner color="current" />
      </div>
    );
  }

  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      // to overwrite default sidebar-width, header-height, pass them in style
      style={
        {
          // "--sidebar-width": "calc(var(--spacing) * 72)",
          "--sidebar-width-icon": "calc(var(--spacing) * 12)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" collapsible="icon" /* collapsible="offcanvas" */ />
      <SidebarInset>
        <AppHeader />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
