import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { RenewalsCommandGridView } from "#features/renewals/data-grid-view.tsx";

export const Route = createFileRoute("/(app)/renewals")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  return (
    // <main
    //   className="mx-auto flex min-h-svh w-full max-w-7xl items-start justify-center p-8 pt-12"
    //   aria-labelledby="page-heading"
    // >
    <div className="container-wrapper">
      <h1 id="page-heading" className="sr-only">
        Renewals command data grid
      </h1>
      {isReady ? (
        <RenewalsCommandGridView />
      ) : (
        <div
          className="w-full rounded-xl border border-border bg-card"
          style={{ height: 640 }}
          aria-hidden="true"
        />
      )}
    </div>
    // </main>
  );
}
