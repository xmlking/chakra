import { Badge, type BadgeProps } from "@workspace/ui/components/reui/badge";
import { IconTile } from "@workspace/ui/components/reui/icon-tile";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/shadcn/avatar";
import { Button } from "@workspace/ui/components/shadcn/button";
import { Progress } from "@workspace/ui/components/shadcn/progress";
import { cn } from "cn";

import { type Person, type Vendor } from "./data";
import { STATUS_ICONS, UI_ICONS } from "./icons";
import { type CellKind, type Coverage, type CoverageTone } from "./plan-math";

/** Trims a label to its cap height, so items-center centres the letters. */
export const CAP_BOX = "[text-box:trim-both_cap_alphabetic]";
/** CAP_BOX that still ellipsizes, clipping only sideways. */
export const CAP_TRUNCATE = `${CAP_BOX} overflow-x-clip text-ellipsis whitespace-nowrap`;

// ── Status ──

interface StatusFace {
  label: string;
  /** What the status asks of the coordinator, for popovers and the key. */
  hint: string;
  /** Tints the tile's glyph and every other glyph of this status. */
  tone: string;
  /** The matrix cell's fill, the light badge's recipe. */
  wash: string;
  badge: NonNullable<BadgeProps["variant"]>;
}

export const STATUS_FACE: Record<CellKind, StatusFace> = {
  missed: {
    label: "Missed",
    hint: "The day passed without a visit",
    tone: "text-destructive",
    wash: "bg-destructive/10 dark:bg-destructive/15",
    badge: "destructive-light",
  },
  proposed: {
    label: "Awaiting",
    hint: "Booked, the vendor has not confirmed",
    tone: "text-warning",
    wash: "bg-warning/10 dark:bg-warning/15",
    badge: "warning-light",
  },
  confirmed: {
    label: "Confirmed",
    hint: "Booked and confirmed",
    tone: "text-info",
    wash: "bg-info/10 dark:bg-info/15",
    badge: "info-light",
  },
  done: {
    label: "Done",
    hint: "Signed off by the crew",
    tone: "text-success",
    wash: "bg-success/10 dark:bg-success/15",
    badge: "success-light",
  },
  due: {
    label: "Unbooked",
    hint: "The cycle runs out with nothing booked",
    tone: "text-muted-foreground",
    // Only the run sheet lists an unbooked day; the matrix leaves it free.
    wash: "",
    badge: "outline",
  },
};

/** The matrix face: the bare glyph in its tone on a wash that fills the
 *  whole day cell. */
export function StatusCellFace({ kind, dimmed }: { kind: CellKind; dimmed: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-full items-center justify-center transition-opacity duration-200 motion-reduce:transition-none [&_svg]:size-4",
        STATUS_FACE[kind].wash,
        STATUS_FACE[kind].tone,
        dimmed && "opacity-30",
      )}
    >
      {STATUS_ICONS[kind]}
    </span>
  );
}

/** The list and menu tile: the stock plain tile, its glyph's shape and tone
 *  carrying the status. */
export function StatusTile({ kind, className }: { kind: CellKind; className?: string }) {
  return (
    <IconTile size="xs" aria-hidden="true" className={cn(STATUS_FACE[kind].tone, className)}>
      {STATUS_ICONS[kind]}
    </IconTile>
  );
}

export function StatusBadge({ kind }: { kind: CellKind }) {
  return <Badge variant={STATUS_FACE[kind].badge}>{STATUS_FACE[kind].label}</Badge>;
}

// ── People ──

const initialsOf = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

export function PersonAvatar({ person, size = "sm" }: { person: Person; size?: "sm" | "default" }) {
  return (
    <Avatar size={size} className="shrink-0">
      <AvatarImage src={person.avatar} alt="" />
      <AvatarFallback>{initialsOf(person.name)}</AvatarFallback>
    </Avatar>
  );
}

/** Avatar, name and an optional second line (role or vendor). */
export function PersonFace({ person, meta }: { person: Person; meta?: string }) {
  return (
    <span className="flex min-w-0 items-center gap-2">
      <PersonAvatar person={person} size={meta ? "default" : "sm"} />
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="truncate text-sm text-foreground">{person.name}</span>
        {meta ? <span className="truncate text-xs text-muted-foreground">{meta}</span> : null}
      </span>
    </span>
  );
}

// ── Coverage ──

/** Static classes, one per tone, so the bar never builds a class at runtime. */
const BAR_TONE: Record<CoverageTone, string> = {
  success: "**:data-[slot=progress-indicator]:bg-success",
  warning: "**:data-[slot=progress-indicator]:bg-warning",
  destructive: "**:data-[slot=progress-indicator]:bg-destructive",
};

/** The block's one mini-bar: stock Progress on an h-1.5 track, toned by risk. */
export function CoverageBar({ coverage }: { coverage: Coverage }) {
  const percent = coverage.total === 0 ? 0 : (coverage.onTrack / coverage.total) * 100;
  return (
    <span className="flex min-w-0 items-center gap-2">
      <Progress
        value={percent}
        aria-hidden="true"
        className={cn(
          "min-w-0 flex-1 **:data-[slot=progress-track]:h-1.5",
          BAR_TONE[coverage.tone],
        )}
      />
      <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
        {coverage.onTrack}/{coverage.total}
        <span className="sr-only"> services on track</span>
      </span>
    </span>
  );
}

/** The words stay in ink; the bar above carries the tone. */
export function CoverageNote({ coverage }: { coverage: Coverage }) {
  return <span className="truncate text-xs text-foreground">{coverage.note}</span>;
}

// ── Small parts ──

/** A small dot between rendered segments, never a typed glyph. */
export function DotSeparator({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("size-1 shrink-0 rounded-full bg-muted-foreground/40", className)}
    />
  );
}

/** The vendor's dispatch line, which is how a booking gets its yes, and an
 *  email that carries the visit. */
export function VendorContact({ vendor, subject }: { vendor: Vendor; subject: string }) {
  return (
    <span className="flex min-w-0 items-center gap-1.5">
      <Button
        nativeButton={false}
        variant="outline"
        size="sm"
        className="min-w-0 tabular-nums"
        render={
          <a
            href={`tel:${vendor.phone.replace(/[^\d+]/g, "")}`}
            aria-label={`Call ${vendor.name}, ${vendor.phone}`}
          />
        }
      >
        {UI_ICONS.phone}
        <span className="truncate">{vendor.phone}</span>
      </Button>
      <Button
        nativeButton={false}
        variant="outline"
        size="icon-sm"
        render={
          <a
            href={`mailto:${vendor.email}?subject=${encodeURIComponent(subject)}`}
            aria-label={`Email ${vendor.name}`}
          />
        }
      >
        {UI_ICONS.mail}
      </Button>
    </span>
  );
}
