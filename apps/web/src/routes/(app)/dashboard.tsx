import { ensureSession as ensureSessionClient } from "@better-auth-ui/react";
import { ensureSession as ensureSessionServer } from "@better-auth-ui/react/server";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "@workspace/auth";
import { authClient } from "@workspace/auth/client";

import { DashboardSkeleton } from "#features/dashboard/dashboard-skeleton.tsx";

export const Route = createFileRoute("/(app)/dashboard")({
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
  head: () => ({
    meta: [{ title: "Dashboard | Chakra" }],
  }),
  component: Dashboard,
  pendingComponent: DashboardSkeleton,
});

function Dashboard() {
  const { session } = Route.useRouteContext();

  return (
    <div className="my-auto flex flex-col items-center">
      <h1 className="text-2xl">Hello, {session.user.email}</h1>

      <Link to="/auth/$path" params={{ path: "sign-out" }}>
        Sign Out
      </Link>
    </div>
  );
}
