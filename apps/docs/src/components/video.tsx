import { cn } from "@workspace/ui/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

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
