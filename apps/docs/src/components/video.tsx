import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

export function Video(props: ComponentPropsWithoutRef<"video">) {
  return (
    <video
      preload="auto"
      autoPlay
      muted
      loop
      playsInline
      {...props}
      className={cn("bg-fd-background w-full rounded-xl border", props.className)}
    />
  );
}
