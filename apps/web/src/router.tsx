import { MutationCache, QueryClient, type QueryKey } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { UnauthorizedError } from "@workspace/shared";
import { toast } from "@workspace/ui/components/shadcn/toast";

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
          toast.add({
            title: mutation.meta?.successMessage,
            type: "success",
            timeout: 5000,
          });
        }
      },
      onError: (error, _variables, _context, mutation) => {
        // log.error({ error });

        if (error instanceof UnauthorizedError) {
          // perform logout
          window.location.href = "/auth/sign-in"; // or navigate with router
        }
        // if (error instanceof FormattedError) {
        //   toast.add({ title: error.message, type: "warning" });
        // } else if (error instanceof ZodError) {
        //   toast.add({ title: "Please check the form for errors.", type: "error" });
        // } else if (error instanceof NotFoundError) {
        //   toast.add({ title: "The requested resource was not found.", type: "error" });
        // } else {
        if (mutation.meta?.errorMessage) {
          // const mutationKey = mutation.options.mutationKey?.[0] as string;
          const id = toast.add({
            title: mutation.meta.errorMessage,
            type: "error",
            actionProps: {
              children: "Close",
              onClick() {
                toast.close(id);
              },
            },
          });
        }
      },
      onSettled: async (_data, _error, _variables, _context, mutation) => {
        await Promise.all(
          mutation.meta?.invalidateQueries?.map((queryKey) =>
            queryClient.invalidateQueries({ queryKey }),
          ) ?? [],
        );
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
      invalidateQueries?: QueryKey[];
      successMessage?: string;
      errorMessage?: string;
    };
  }
}
