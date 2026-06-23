import { createFileRoute } from "@tanstack/react-router";

import { DashboardContent } from "#features/dashboard/dashboard-content2";
import { DashboardSkeleton } from "#features/dashboard/dashboard-skeleton";

export const Route = createFileRoute("/(app2)/dashboard2")({
  staticData: {
    breadcrumb: "Overview",
    // breadcrumb: ["Root", "Dashboard"],
    // TODO: https://github.com/Balastrong/tanstack-router-demo/blob/main/src/routes/steps.tsx
    // breadcrumb: (match) => `${match.params.page}`,
    // breadcrumb: ({ search }: { search: StepsSearchParams }) =>
    //   search.step ? ["Steps", `${search.step}`] : "Steps",
  },
  component: DashboardContent,
  pendingComponent: DashboardSkeleton,
});
