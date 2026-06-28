import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";

import { DefaultError } from "#components/default-error";
// import { DefaultLoading } from "#components/default-loading";
import { DefaultNotFound } from "#components/default-notfound";
import type { BreadcrumbValue } from "#components/router-breadcrumb";

import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 2, // 2 minutes
      },
    },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },

    scrollRestoration: true,
    scrollRestorationBehavior: "smooth",
    defaultViewTransition: true,
    defaultPreload: "intent",
    // IMPORTANT: Let TanStack Query handle data fetching & caching instead of TanStack Router, default options are found in createQueryClient()
    // https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#passing-all-loader-events-to-an-external-cache
    // This enables Route.loader logic to rerun on every navigation, so when fetching, use queryClient.ensureQueryData() to prevent unnecessary refetches and use cached data when available
    defaultPreloadStaleTime: 0,
    // https://tanstack.com/router/latest/docs/guide/render-optimizations
    defaultStructuralSharing: true,
    // defaultPendingMs: 0,
    // defaultPendingMinMs: 300,
    // defaultPendingComponent: DefaultLoading,
    defaultNotFoundComponent: DefaultNotFound,
    defaultErrorComponent: DefaultError,
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
    // optional:
    // handleRedirects: true,
    // wrapQueryClient: true,
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
  interface StaticDataRouteOption {
    breadcrumb?: BreadcrumbValue;
  }
}
