import { createRouter } from "@tanstack/react-router";

import { ErrorBoundary } from "#components/error-boundary";
import { NotFound } from "#components/not-found";
import { Providers } from "#components/providers";

import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    scrollRestorationBehavior: "smooth",
    defaultPreload: "intent",
    defaultPreloadStaleTime: 1000_000,
    defaultNotFoundComponent: NotFound,
    // defaultErrorComponent: AppError,
    defaultErrorComponent: ({ error, reset }) => <ErrorBoundary error={error} reset={reset} />,
    InnerWrap: ({ children }) => {
      return <Providers>{children}</Providers>;
    },
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
