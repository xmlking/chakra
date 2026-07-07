import { createFileRoute } from "@tanstack/react-router";

import { DashboardPageSkeleton } from "#features/dashboard/dashboard-page-skeleton";
import { DashboardPage } from "#features/dashboard/dashboard-page2";

export const Route = createFileRoute("/(app2)/dashboard2")({
  staticData: {
    breadcrumb: "Overview",
    // breadcrumb: ["Root", "Dashboard"],
    // TODO: https://github.com/Balastrong/tanstack-router-demo/blob/main/src/routes/steps.tsx
    // breadcrumb: (match) => `${match.params.page}`,
    // breadcrumb: ({ search }: { search: StepsSearchParams }) =>
    //   search.step ? ["Steps", `${search.step}`] : "Steps",
  },
  component: DashboardPage,
  pendingComponent: DashboardPageSkeleton,
});
