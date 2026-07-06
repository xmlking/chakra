import { createFileRoute } from "@tanstack/react-router";

import { DemoForm } from "#features/playground/form-demo/demo-form.tsx";

export const Route = createFileRoute("/(app)/playground/form-demo")({
  staticData: {
    breadcrumb: ["Playground", "Demo Form"],
  },
  component: DemoForm,
});
