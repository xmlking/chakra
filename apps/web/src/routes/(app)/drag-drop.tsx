import { createFileRoute } from "@tanstack/react-router";
import { useSyncExternalStore } from "react";

import { DataGridView } from "#features/data-grid-drag-drop/data-grid-view";
import { DataGridSkeleton } from "#features/data-grid-skeleton";

export const Route = createFileRoute("/(app)/drag-drop")({
  staticData: {
    breadcrumb: "Renewals",
  },
  component: RouteComponent,
});

function RouteComponent() {
  const isReady = useSyncExternalStore(
    (notify) => {
      if (typeof window === "undefined") {
        return () => {};
      }

      const frameId = window.requestAnimationFrame(notify);

      return () => {
        window.cancelAnimationFrame(frameId);
      };
    },
    () => true,
    () => false,
  );

  return (
    // <main
    //   className="mx-auto flex min-h-svh w-full max-w-7xl items-start justify-center p-8 pt-12"
    //   aria-labelledby="page-heading"
    // >
    <div className="container-wrapper">
      <h1 id="page-heading" className="sr-only">
        Renewals command data grid
      </h1>
      {isReady ? <DataGridView /> : <DataGridSkeleton />}
    </div>
    // </main>
  );
}
