import { Outlet, createFileRoute } from "@tanstack/react-router";

import { HomeFooter } from "#components/layout/home-footer";
import { HomeHeader } from "#components/layout/home-header";

export const Route = createFileRoute("/(public)")({
  component: HomeLayout,
});

function HomeLayout() {
  return (
    <div>
      <HomeHeader />
      <main>
        <Outlet />
      </main>
      <HomeFooter />
    </div>
  );
}
