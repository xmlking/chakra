import { createFileRoute } from "@tanstack/react-router";

import { FormPage } from "#features/form-demo/form-page";

export const Route = createFileRoute("/(app)/playground/form-demo")({
  staticData: {
    breadcrumb: ["Playground", "Form Demo"],
  },
  component: FormPage,
});
