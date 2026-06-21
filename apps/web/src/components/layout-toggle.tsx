"use client";

import { Button } from "@workspace/ui/components/shadcn/button";
import { cn } from "@workspace/ui/lib/utils";
import { GalleryHorizontalIcon } from "lucide-react";
import type * as React from "react";

import { useLayoutStore } from "#hooks/use-layout";

export function LayoutToggle({ className }: React.ComponentProps<typeof Button>) {
  const { layout, setLayout } = useLayoutStore();

  return (
    <Button
      className={cn("size-8", className)}
      onClick={() => {
        const newLayout = layout === "fixed" ? "full" : "fixed";
        setLayout(newLayout);
      }}
      size="icon"
      title="Toggle layout"
      variant="ghost"
    >
      <span className="sr-only">Toggle layout</span>
      <GalleryHorizontalIcon />
    </Button>
  );
}
