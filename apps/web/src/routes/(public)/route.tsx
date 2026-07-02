import { Outlet, createFileRoute } from "@tanstack/react-router";

import { LandingFooter } from "#features/landing/components/landing-footer";
import { LandingHeader } from "#features/landing/components/landing-header";

export const Route = createFileRoute("/(public)")({
  component: HomeLayout,
});

function HomeLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <LandingHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <LandingFooter />
    </div>
  );
}
