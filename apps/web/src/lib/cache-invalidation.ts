import type { QueryClient, QueryMeta } from "@tanstack/react-query";

export function organizationCacheMeta(organizationId: string, cacheTags: readonly string[]) {
  return { organizationId, cacheTags: [...cacheTags] };
}

function matchesOrganizationCache(
  meta: QueryMeta | undefined,
  organizationId: string,
  cacheTags?: readonly string[],
) {
  if (meta?.organizationId !== organizationId) return false;
  if (!cacheTags?.length) return true;

  const queryTags = meta.cacheTags;
  const requestedTags = new Set(cacheTags);
  return (
    Array.isArray(queryTags) &&
    queryTags.some((tag) => typeof tag === "string" && requestedTags.has(tag))
  );
}

export function invalidateOrganizationQueries(queryClient: QueryClient, organizationId: string) {
  return queryClient.invalidateQueries({
    predicate: (query) => matchesOrganizationCache(query.meta, organizationId),
  });
}

export function invalidateTaggedQueries(
  queryClient: QueryClient,
  organizationId: string,
  cacheTags: readonly string[],
) {
  return queryClient.invalidateQueries({
    predicate: (query) => matchesOrganizationCache(query.meta, organizationId, cacheTags),
  });
}
