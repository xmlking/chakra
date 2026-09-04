"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@workspace/ui/components/reui/badge";
import { type DataGridFeatures } from "@workspace/ui/components/reui/data-grid/data-grid";
import { DataGridColumnHeader } from "@workspace/ui/components/reui/data-grid/data-grid-column-header";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@workspace/ui/components/shadcn/avatar";
import { Button } from "@workspace/ui/components/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/shadcn/dropdown-menu";
import {
  MoreHorizontalIcon,
  PencilIcon,
  PaperclipIcon,
  CalendarIcon,
  MessageSquareIcon,
} from "lucide-react";
import { memo, type ComponentProps, type ReactNode } from "react";

import { storyBylines, type Byline, type Placement, type Story } from "./data";

export type StoryAction = "open" | "proof" | "schedule";

// Placement is prominence, not trouble, so it climbs primary to info to plain
// rather than borrowing the destructive and warning tones that mean something
// is wrong elsewhere in the corpus.
const placementVariant: Record<Placement, ComponentProps<typeof Badge>["variant"]> = {
  Lead: "primary-light",
  Feature: "info-light",
  Brief: "outline",
};

// ── Shared cells ──

const BylineAvatar = memo(function BylineAvatar({ person }: { person: Byline }) {
  return (
    <Avatar className="size-5 shrink-0" title={`${person.name}, ${person.role}`}>
      <AvatarImage src={person.avatarSrc} alt="" />
      <AvatarFallback className="text-[9px] font-medium">{person.initials}</AvatarFallback>
    </Avatar>
  );
});

/**
 * Writers first, the responsible editor last. Three fit before the group rolls
 * the rest into a count, which keeps the column width honest at any byline size.
 */
function BylineCell({ story }: { story: Story }) {
  const people = storyBylines(story);
  const visible = people.slice(0, 3);
  const overflow = people.length - visible.length;

  return (
    <AvatarGroup className="-space-x-1">
      {visible.map((person) => (
        <BylineAvatar key={person.id} person={person} />
      ))}
      {overflow > 0 ? (
        <AvatarGroupCount className="size-5 text-[9px] font-medium tabular-nums">
          {`+${overflow}`}
        </AvatarGroupCount>
      ) : null}
      <span className="sr-only">{people.map((person) => person.name).join(", ")}</span>
    </AvatarGroup>
  );
}

/** Count chip: a stored fact with its own glyph, never colour-only. */
function CountChip({ icon, value, label }: { icon: ReactNode; value: number; label: string }) {
  return (
    <Badge variant="outline" className="gap-1.5 bg-background">
      {icon}
      <span className="tabular-nums">{value}</span>
      <span className="sr-only">{label}</span>
    </Badge>
  );
}

function DateCell({ label }: { label: string }) {
  return <span className="text-sm text-muted-foreground tabular-nums">{label}</span>;
}

function StoryActionsCell({
  story,
  onAction,
}: {
  story: Story;
  onAction: (action: StoryAction, story: Story) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            aria-label={`Actions for ${story.slug}`}
          />
        }
      >
        <MoreHorizontalIcon aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => onAction("open", story)}>
            <PencilIcon aria-hidden="true" />
            Open draft
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAction("proof", story)}>
            <PaperclipIcon aria-hidden="true" />
            View assets
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onAction("schedule", story)}>
            <CalendarIcon aria-hidden="true" />
            Move publish date
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ── Column definitions ──

/**
 * Built once and shared by every section. Each section is its own table, so
 * columns only line up across sections while all of them use this same array,
 * every column carries an explicit `size`, and resizing stays off.
 */
export function createStoryColumns({
  showSlug,
  onAction,
}: {
  showSlug: boolean;
  onAction: (action: StoryAction, story: Story) => void;
}): ColumnDef<DataGridFeatures, Story>[] {
  return [
    {
      accessorKey: "title",
      id: "story",
      header: ({ column }) => <DataGridColumnHeader title="Story" column={column} />,
      cell: ({ row }) => (
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium text-foreground">{row.original.title}</span>
          {showSlug ? (
            <span className="truncate font-mono text-xs text-muted-foreground">
              {row.original.slug}
            </span>
          ) : null}
        </div>
      ),
      size: 220,
      minSize: 200,
      enableSorting: true,
    },
    {
      accessorKey: "angle",
      id: "angle",
      header: ({ column }) => <DataGridColumnHeader title="Angle" column={column} />,
      cell: ({ row }) => (
        <span className="block truncate text-sm text-muted-foreground" title={row.original.angle}>
          {row.original.angle}
        </span>
      ),
      size: 200,
      enableSorting: false,
    },
    {
      accessorKey: "bylineIds",
      id: "byline",
      header: ({ column }) => <DataGridColumnHeader title="Byline" column={column} />,
      cell: ({ row }) => <BylineCell story={row.original} />,
      size: 104,
      enableSorting: false,
    },
    {
      accessorKey: "filedAt",
      id: "filed",
      header: ({ column }) => <DataGridColumnHeader title="Filed" column={column} />,
      cell: ({ row }) => <DateCell label={row.original.filedLabel} />,
      size: 80,
      enableSorting: true,
    },
    {
      accessorKey: "publishAt",
      id: "publish",
      header: ({ column }) => <DataGridColumnHeader title="Publish" column={column} />,
      cell: ({ row }) => <DateCell label={row.original.publishLabel} />,
      size: 92,
      enableSorting: true,
    },
    {
      accessorKey: "placement",
      id: "placement",
      header: ({ column }) => <DataGridColumnHeader title="Placement" column={column} />,
      cell: ({ row }) => (
        <Badge variant={placementVariant[row.original.placement]}>{row.original.placement}</Badge>
      ),
      size: 116,
      enableSorting: false,
    },
    {
      accessorKey: "assets",
      id: "assets",
      header: ({ column }) => <DataGridColumnHeader title="Assets" column={column} />,
      cell: ({ row }) => (
        <CountChip
          value={row.original.assets}
          label="assets attached"
          icon={<PaperclipIcon className="size-3.5 text-muted-foreground" aria-hidden="true" />}
        />
      ),
      size: 80,
      enableSorting: true,
    },
    {
      accessorKey: "notes",
      id: "notes",
      header: ({ column }) => <DataGridColumnHeader title="Notes" column={column} />,
      cell: ({ row }) => (
        <CountChip
          value={row.original.notes}
          label="desk notes"
          icon={<MessageSquareIcon className="size-3.5 text-muted-foreground" aria-hidden="true" />}
        />
      ),
      size: 80,
      enableSorting: true,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <StoryActionsCell story={row.original} onAction={onAction} />
        </div>
      ),
      size: 52,
      enableHiding: false,
      enableSorting: false,
    },
  ];
}
