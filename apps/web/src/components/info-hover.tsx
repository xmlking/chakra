"use client";

import { Button } from "@workspace/ui/components/shadcn/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@workspace/ui/components/shadcn/hover-card";
import { CircleHelp, Info } from "lucide-react";
import type { ReactNode } from "react";

export function InfoHover({ children }: { children: ReactNode }) {
  return (
    <HoverCard>
      <HoverCardTrigger
        delay={120}
        closeDelay={100}
        // oxlint-disable-next-line react-perf/jsx-no-jsx-as-prop, react-doctor/jsx-no-jsx-as-prop -- Base UI's render prop intentionally accepts JSX.
        render={
          // oxlint-disable-next-line react-perf/jsx-no-jsx-as-prop -- Base UI's render prop intentionally accepts JSX.
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="text-muted-foreground hover:bg-transparent hover:text-foreground"
            aria-label="More information"
          >
            <CircleHelp className="size-3.5" aria-hidden="true" />
          </Button>
        }
      />
      <HoverCardContent className="w-80" side="top" align="start">
        {children}
      </HoverCardContent>
    </HoverCard>
  );
}

// One row of a hover card: an icon carrying the color, a line of text. The icon's color is the
// only thing that signals role (info / reassurance / status / restriction / warning) -- keep
// these to the same small set used elsewhere in the console (destructive, emerald, warning,
// muted) rather than inventing new ones per card.
export function HoverRow({
  icon: Icon,
  tone,
  children,
}: {
  icon: typeof Info;
  tone: "info" | "safe" | "active" | "restricted" | "warning";
  children: ReactNode;
}) {
  const toneClass = {
    info: "text-muted-foreground",
    safe: "text-emerald-600 dark:text-emerald-400",
    active: "text-emerald-600 dark:text-emerald-400",
    restricted: "text-muted-foreground",
    warning: "text-warning",
  }[tone];
  return (
    <div className="flex items-start gap-1.5">
      <Icon className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${toneClass}`} />
      <p className={`text-xs ${tone === "info" ? "text-sm text-foreground" : toneClass}`}>
        {children}
      </p>
    </div>
  );
}
