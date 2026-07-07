import { createFileRoute, useParams } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/shadcn/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/shadcn/empty";
import { ConstructionIcon } from "lucide-react";

import { DashboardPageSkeleton } from "#features/dashboard/dashboard-page-skeleton";

export const Route = createFileRoute("/(app)/admin/$page")({
  staticData: {
    breadcrumb: (match) => ["admin", `${match.params.page}`],
  },
  component: DashboardPlaceholder,
  pendingComponent: DashboardPageSkeleton,
});

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function DashboardPlaceholder() {
  const { page } = useParams({ from: "/(app)/admin/$page" });
  const title = titleCase(page);

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ConstructionIcon />
          </EmptyMedia>
          <EmptyTitle>{title} is coming soon</EmptyTitle>
          <EmptyDescription>
            This section is part of the demo workspace. The navigation and layout are fully wired up
            — drop your real {page} UI in here.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" size="sm">
            Request early access
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
