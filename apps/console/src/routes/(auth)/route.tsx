import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)")({
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Outlet />
    </div>
  );
}
