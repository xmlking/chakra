import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/shadcn/card";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Project Overview</CardTitle>
        <CardDescription>
          Track progress and recent activity for your TanStack Start app.
        </CardDescription>
      </CardHeader>
      <CardContent>Your design system is ready. Start building your next component.</CardContent>
    </Card>
  );
}
