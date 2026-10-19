import { useQueryClient } from "@tanstack/react-query";
import { authClient } from "@workspace/auth/client";
import { useEffect } from "react";
import { z } from "zod";

import { invalidateOrganizationQueries, invalidateTaggedQueries } from "#lib/cache-invalidation";

const cacheInvalidationSchema = z.object({
  organizationId: z.string(),
  tags: z.array(z.string()),
});

export function CacheInvalidationListener() {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const organizationId = session?.session.activeOrganizationId;

  useEffect(() => {
    if (!organizationId) return;

    const source = new EventSource("/api/cache-events");
    source.addEventListener("ready", () => {
      void invalidateOrganizationQueries(queryClient, organizationId).catch((error: unknown) => {
        console.error(
          "Failed to refresh organization queries after opening cache event stream",
          error,
        );
      });
    });
    source.addEventListener("invalidate", (event) => {
      if (!(event instanceof MessageEvent)) return;

      let data: unknown;
      try {
        data = JSON.parse(event.data);
      } catch (error) {
        console.error("Received malformed cache invalidation event", error);
        return;
      }

      const parsed = cacheInvalidationSchema.safeParse(data);
      if (!parsed.success) {
        console.error("Received invalid cache invalidation event", parsed.error);
        return;
      }
      if (parsed.data.organizationId !== organizationId) return;

      void invalidateTaggedQueries(queryClient, organizationId, parsed.data.tags).catch(
        (error: unknown) => {
          console.error("Failed to invalidate organization queries", error);
        },
      );
    });

    return () => source.close();
  }, [organizationId, queryClient]);

  return null;
}
