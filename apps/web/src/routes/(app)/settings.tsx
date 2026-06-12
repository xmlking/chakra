import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/settings")({
  component: SettingsRoute,
});

function SettingsRoute() {
  return <div>Settings</div>;
}
