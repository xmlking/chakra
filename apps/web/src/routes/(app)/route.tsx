import { viewPaths } from "@better-auth-ui/core";
import { ensureSession as ensureSessionClient } from "@better-auth-ui/react";
import { ensureSession as ensureSessionServer } from "@better-auth-ui/react/server";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { getCookie } from "@tanstack/react-start/server";
import { auth } from "@workspace/auth";
import { authClient } from "@workspace/auth/client";
import { SidebarInset, SidebarProvider } from "@workspace/ui/components/shadcn/sidebar";

import { KBar } from "#components/kbar/index";
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

  return (
    <KBar>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </KBar>
  );
}
