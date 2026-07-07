import { queryOptions } from "@tanstack/react-query";

import type { Project } from "../schema";
import type { ProjectFilters } from "./types";

export const projectKeys = {
  all: ["projects"] as const,
  list: (filters: ProjectFilters) => [...projectKeys.all, "list", filters] as const,
  detail: (id: number) => [...projectKeys.all, "detail", id] as const,
};

export const listProjectsQueryOptions = () =>
  queryOptions({
    queryKey: projectKeys.all,
    queryFn: () => [] as unknown as Project[], // Replace with actual API call
  });

export const searchProjectsQueryOptions = (filters: ProjectFilters) =>
  queryOptions({
    queryKey: projectKeys.list(filters),
    queryFn: () => [] as unknown as Project[], // Replace with actual API call
  });

export const getProjectQueryOptions = (id: number) =>
  queryOptions({
    queryKey: projectKeys.detail(id),
    queryFn: () => ({}) as Project, // Replace with actual API call
  });
