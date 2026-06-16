import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/shadcn/card";

declare const __APP_VERSION__: string;
declare const __GIT_TAG__: string;
declare const __GIT_SHA__: string;
declare const __GIT_TIME__: string;

export const Route = createFileRoute("/(public)/")({
  staticData: {
    // breadcrumb: "Home",
    // breadcrumb: ["Root", "Home"],
    // TODO: https://github.com/Balastrong/tanstack-router-demo/blob/main/src/routes/steps.tsx
    // breadcrumb: (match) => `#${match.params.id}`,
    // breadcrumb: ({ search }: { search: StepsSearchParams }) =>
    //   search.step ? ["Steps", `${search.step}`] : "Steps",
  },
  component: HomeRoute,
});

// oxlint-disable-next-line react/only-export-components
function HomeRoute() {
  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle>Project Overview</CardTitle>
          <CardDescription>
            Track progress and recent activity for your TanStack Start app.
            <p>Current Version: {__APP_VERSION__}</p>
            <p>Git Tag: {__GIT_TAG__}</p>
            <p>Git SHA: {__GIT_SHA__}</p>
            <p>Git Time: {__GIT_TIME__}</p>
          </CardDescription>
        </CardHeader>
        <CardContent>Your design system is ready. Start building your next component.</CardContent>
      </Card>
    </div>
  );
}
