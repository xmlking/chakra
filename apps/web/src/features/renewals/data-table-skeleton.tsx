"use client";

import { Separator } from "@workspace/ui/components/shadcn/separator";
import { Skeleton } from "@workspace/ui/components/shadcn/skeleton";

export function DataTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      {/* Header */}
      <div className="space-y-1 px-5 py-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-64" />
      </div>

      <Separator />

      {/* Toolbar */}
      <div className="flex flex-col gap-3 px-5 py-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-2">
          <Skeleton className="h-9 w-20" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-20" />
        </div>
      </div>

      <Separator />

      {/* Table content */}
      <div className="space-y-px">
        {/* Header row */}
        <div className="flex items-center gap-3 border-b border-border px-5 py-3">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32 flex-1" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>

        {/* Data rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 border-b border-border px-5 py-3">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32 flex-1" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
