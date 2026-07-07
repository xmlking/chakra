import { queryOptions } from "@tanstack/react-query";

export const liveHealthQueryOptions = queryOptions({
  queryKey: ["health", "live"],
  queryFn: async () => {
    const response = await fetch("/api/health/live");

    if (!response.ok) {
      throw new Error("Failed to fetch health status");
    }

    return response.json() as Promise<{
      appVersion: string;
      buildSha: string;
      buildTag: string;
      buildTime: string;
      environment: string;
      status: string;
      timestamp: string;
      uptimeMs: number;
      url: string;
    }>;
  },
});
