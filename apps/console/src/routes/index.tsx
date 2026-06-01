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

export const Route = createFileRoute("/")({ component: App });

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
