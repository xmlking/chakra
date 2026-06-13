import { ensureSession as ensureSessionClient } from "@better-auth-ui/react";
import { ensureSession as ensureSessionServer } from "@better-auth-ui/react/server";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "@workspace/auth";
import { authClient } from "@workspace/auth/client";

import { AppHeader } from "#components/navigation/app-header";
import { AppSidebar } from "#components/navigation/app-sidebar";

export const Route = createFileRoute("/(app)")({
  async beforeLoad({ context: { queryClient }, location }) {
    const ensureSession = createIsomorphicFn()
      .server(() => ensureSessionServer(queryClient, auth, { headers: getRequestHeaders() }))
      // @ts-ignore
      .client(() => ensureSessionClient(queryClient, authClient));

    const session = await ensureSession();

    if (!session) {
      throw redirect({
        to: "/auth/$path",
        params: { path: "sign-in" },
        search: { redirectTo: location.href },
      });
    }
    return { session };
  },

  component: AppLayout,
});

function AppLayout() {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <AppHeader />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
