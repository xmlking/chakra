import { queryOptions } from "@tanstack/react-query";

import type { Project, ProjectFilters } from "../schema";

export const projectKeys = {
  all: ["projects"] as const,
  list: (filters: ProjectFilters) => [...projectKeys.all, "list", filters] as const,
  detail: (id: number) => [...projectKeys.all, "detail", id] as const,
};

export const projectsQueryOptions = (filters: ProjectFilters) =>
  queryOptions({
    queryKey: projectKeys.list(filters),
    queryFn: () => [] as unknown as Project[], // Replace with actual API call
  });
