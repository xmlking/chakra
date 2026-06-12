import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { AppHeader } from "#components/navigation/app-header";
import { AppSidebar } from "#components/navigation/app-sidebar";
import { getSession } from "#lib/auth.functions";

export const Route = createFileRoute("/(app)")({
  beforeLoad: async ({ location }) => {
    const session = await getSession();
    if (!session) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      });
    }
    return { user: session.user };
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
