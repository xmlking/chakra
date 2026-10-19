import { QueryClient } from "@tanstack/react-query";
import { describe, expect, it } from "vite-plus/test";

import {
  invalidateOrganizationQueries,
  invalidateTaggedQueries,
  organizationCacheMeta,
} from "./cache-invalidation";

describe("organization cache invalidation", () => {
  it("invalidates only tagged queries belonging to the requested organization", async () => {
    const queryClient = new QueryClient();
    const projectKey = ["organization", "org-1", "projects"] as const;
    const settingsKey = ["organization", "org-1", "settings"] as const;
    const otherOrgKey = ["organization", "org-2", "projects"] as const;

    await Promise.all([
      queryClient.fetchQuery({
        queryKey: projectKey,
        queryFn: async () => [],
        meta: organizationCacheMeta("org-1", ["projects"]),
      }),
      queryClient.fetchQuery({
        queryKey: settingsKey,
        queryFn: async () => ({}),
        meta: organizationCacheMeta("org-1", ["settings"]),
      }),
      queryClient.fetchQuery({
        queryKey: otherOrgKey,
        queryFn: async () => [],
        meta: organizationCacheMeta("org-2", ["projects"]),
      }),
    ]);

    await invalidateTaggedQueries(queryClient, "org-1", ["projects"]);

    expect(queryClient.getQueryState(projectKey)?.isInvalidated).toBe(true);
    expect(queryClient.getQueryState(settingsKey)?.isInvalidated).toBe(false);
    expect(queryClient.getQueryState(otherOrgKey)?.isInvalidated).toBe(false);
    queryClient.clear();
  });

  it("invalidates all tagged queries for one organization after an SSE reconnect", async () => {
    const queryClient = new QueryClient();
    const org1Key = ["organization", "org-1", "projects"] as const;
    const org2Key = ["organization", "org-2", "projects"] as const;

    await Promise.all([
      queryClient.fetchQuery({
        queryKey: org1Key,
        queryFn: async () => [],
        meta: organizationCacheMeta("org-1", ["projects"]),
      }),
      queryClient.fetchQuery({
        queryKey: org2Key,
        queryFn: async () => [],
        meta: organizationCacheMeta("org-2", ["projects"]),
      }),
    ]);

    await invalidateOrganizationQueries(queryClient, "org-1");

    expect(queryClient.getQueryState(org1Key)?.isInvalidated).toBe(true);
    expect(queryClient.getQueryState(org2Key)?.isInvalidated).toBe(false);
    queryClient.clear();
  });
});
