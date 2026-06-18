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

export const Route = createFileRoute("/(app)/dashboard/$page")({
  staticData: {
    // breadcrumb: "Overview",
    // breadcrumb: ["Root", "Dashboard"],
    // TODO: https://github.com/Balastrong/tanstack-router-demo/blob/main/src/routes/steps.tsx
    breadcrumb: (match) => `${match.params.page}`,
    // breadcrumb: ({ search }: { search: StepsSearchParams }) =>
    //   search.step ? ["Steps", `${search.step}`] : "Steps",
  },
  component: DashboardPlaceholder,
});

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function DashboardPlaceholder() {
  const { page } = useParams({ from: "/(app)/dashboard/$page" });
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
