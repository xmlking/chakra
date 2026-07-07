import { createFileRoute } from "@tanstack/react-router";

import { DashboardPageSkeleton } from "#features/dashboard/dashboard-page-skeleton.tsx";
import { NotificationsPage } from "#features/notifications/notifications-page";

export const Route = createFileRoute("/(app)/settings/notifications")({
  component: NotificationsPage,
  pendingComponent: DashboardPageSkeleton,
});
