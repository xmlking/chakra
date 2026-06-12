import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/register")({
  component: RegisterRoute,
});

function RegisterRoute() {
  return <div>Registration Form</div>;
}
