import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/dashboard")({
  component: DashboardRoute,
});

function DashboardRoute() {
  const { user } = Route.useRouteContext();

  return <div>Welcome, {user?.name}!</div>;
}
