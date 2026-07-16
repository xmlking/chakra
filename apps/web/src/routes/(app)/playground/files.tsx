import { createFileRoute } from "@tanstack/react-router";

import { FilesPage } from "#features/files/files-page.tsx";

export const Route = createFileRoute("/(app)/playground/files")({
  staticData: {
    breadcrumb: () => "Files",
  },
  component: FilesPage,
});
