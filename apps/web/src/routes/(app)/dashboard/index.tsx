import { createFileRoute } from "@tanstack/react-router";

import { DashboardPage } from "#features/dashboard/dashboard-page";
import { DashboardPageSkeleton } from "#features/dashboard/dashboard-page-skeleton";

export const Route = createFileRoute("/(app)/dashboard/")({
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
