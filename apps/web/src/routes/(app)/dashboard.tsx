import { ensureSession as ensureSessionClient } from "@better-auth-ui/react";
import { ensureSession as ensureSessionServer } from "@better-auth-ui/react/server";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "@workspace/auth";
import { authClient } from "@workspace/auth/client";
import { Skeleton } from "@workspace/ui/components/shadcn/skeleton";

import { DashboardSkeleton } from "#features/dashboard/dashboard-skeleton.tsx";

export const Route = createFileRoute("/(app)/dashboard")({
  staticData: {
    breadcrumb: "Dashboard",
    // breadcrumb: ["Root", "Dashboard"],
    // TODO: https://github.com/Balastrong/tanstack-router-demo/blob/main/src/routes/steps.tsx
    // breadcrumb: (match) => `#${match.params.id}`,
    // breadcrumb: ({ search }: { search: StepsSearchParams }) =>
    //   search.step ? ["Steps", `${search.step}`] : "Steps",
  },
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
  // const { session } = Route.useRouteContext();

  return (
    <main className="flex-1 space-y-8 overflow-y-auto p-6">
      {/* Hero Section */}
      <div className="flex flex-col items-center gap-6 gap-8 py-10 md:flex-row">
        <Skeleton className="h-64 w-full rounded-xl md:w-1/2" />
        <div className="w-full space-y-4 md:w-1/2">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-2/3" />
          <div className="flex gap-4 pt-4">
            <Skeleton className="h-10 w-24 rounded-md" />
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>
        </div>
      </div>

      {/* Below-the-fold Content Feed */}
      <div className="space-y-6 border-t pt-10">
        <Skeleton className="mb-6 h-8 w-48" />

        {/* List of Loading Cards */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
          <div
            key={item}
            className="flex flex-col gap-6 rounded-lg border bg-card p-6 text-card-foreground shadow-sm md:flex-row"
          >
            <Skeleton className="h-32 w-full shrink-0 rounded-md md:w-48" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex gap-3 pt-2">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-28 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
