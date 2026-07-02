import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/playground/form-demo")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(app)/playground/form-demo"!</div>;
}
