import { ensureSession as ensureSessionClient } from "@better-auth-ui/react";
import { ensureSession as ensureSessionServer } from "@better-auth-ui/react/server";
import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "@workspace/auth";
import { authClient, type Session } from "@workspace/auth/client";

import { DefaultError } from "#components/default-error";
import { DefaultLoading } from "#components/default-loading";
import { DefaultNotFound } from "#components/default-notfound";
import type { BreadcrumbValue } from "#components/router-breadcrumb";

import { routeTree } from "./routeTree.gen";

export async function getRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 2, // 2 minutes
      },
    },
  });

  const ensureSession = createIsomorphicFn()
    .server(() => ensureSessionServer(queryClient, auth, { headers: getRequestHeaders() }))
    .client(() => ensureSessionClient(queryClient, authClient as any)) as () => Promise<Session>;

  const router = createRouter({
    routeTree,
    context: { queryClient, session: await ensureSession() },

    scrollRestoration: true,
    scrollRestorationBehavior: "smooth",
    defaultViewTransition: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 1000 * 60 * 2, // Match staleTime to avoid refetch on preload
    // defaultPendingMs: 0,
    // defaultPendingMinMs: 300,
    defaultPendingComponent: DefaultLoading,
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
