import { MutationCache, QueryClient, type QueryKey } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { log } from "evlog";
import { toast } from "sonner";

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
        staleTime: 2 * 60_000, // 2 minutes
        gcTime: 5 * 60_000, // 5 minutes
        // retry: 1,
      },
    },
    /**
     * Inspired by https://www.youtube.com/watch?v=QP1_vuzOYJs
     */
    mutationCache: new MutationCache({
      onSuccess: (_data, _variables, _context, mutation) => {
        if (mutation.meta?.successMessage) {
          toast.success(mutation.meta?.successMessage, {
            duration: 5000,
          });
        }
      },
      onError: (error, _variables, _context, mutation) => {
        log.error({ error });
        // if (error?.status === 401) {
        //   // perform logout
        //   localStorage.removeItem("token"); // or whatever you store
        //   window.location.href = "/login"; // or navigate with router
        // }
        let errorMsg = error.message;
        if (mutation.meta?.errorMessage) {
          errorMsg = mutation.meta.errorMessage;
        }
        const mutationKey = mutation.options.mutationKey?.[0] as string;
        toast.error(mutationKey, {
          description: errorMsg,
          duration: Infinity,
          closeButton: true,
        });
      },
      onSettled: async (_data, _error, _variables, _context, mutation) => {
        {
          if (mutation.meta?.invalidateQuery) {
            await queryClient.invalidateQueries({
              queryKey: mutation.meta?.invalidateQuery,
            });
          }
        }
      },
    }),
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },

    scrollRestoration: true,
    scrollRestorationBehavior: "smooth",
    // This enables a default cross-fade animation for all route transitions.
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

declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      invalidateQuery?: QueryKey;
      successMessage?: string;
      errorMessage?: string;
    };
  }
}
