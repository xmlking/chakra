import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/shadcn/card";

import { ThemeSwitcher } from "#components/theme-switcher";
import { ThemeToggle } from "#components/theme-toggle";

declare const __APP_VERSION__: string;
declare const __GIT_TAG__: string;
declare const __GIT_SHA__: string;
declare const __GIT_TIME__: string;

export const Route = createFileRoute("/")({
  staticData: {
    // breadcrumb: "Home",
    breadcrumb: ["Root", "Home"],
    // TODO: https://github.com/Balastrong/tanstack-router-demo/blob/main/src/routes/steps.tsx
    // breadcrumb: (match) => `#${match.params.id}`,
    // breadcrumb: ({ search }: { search: StepsSearchParams }) =>
    //   search.step ? ["Steps", `${search.step}`] : "Steps",
  },
  component: App,
});

// oxlint-disable-next-line react/only-export-components
function App() {
  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>
          Project Overview <ThemeSwitcher /> <ThemeToggle />
        </CardTitle>
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
  );
}
