"use no memo";

import type { Row, ColumnDef } from "@tanstack/react-table";
import { Badge } from "@workspace/ui/components/reui/badge";
import { DataGridTableDndRowHandle } from "@workspace/ui/components/reui/data-grid/data-grid-table-dnd-rows";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/shadcn/avatar";
import { Button } from "@workspace/ui/components/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/shadcn/dropdown-menu";
import { Item, ItemMedia } from "@workspace/ui/components/shadcn/item";
import {
  SparklesIcon,
  ShieldCheckIcon,
  FlaskConicalIcon,
  WrenchIcon,
  FlagIcon,
  MoreHorizontalIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  Trash2Icon,
} from "lucide-react";

import { type BacklogItem, type BacklogStatus, type BacklogType } from "./data";

export type BacklogRowAction = "move-top" | "move-bottom" | "remove";

// ── Status badge (label carries the signal; color is redundant, not the only cue) ──

const statusVariant: Record<
  BacklogStatus,
  "primary-outline" | "info-outline" | "success-outline" | "destructive-outline" | "outline"
> = {
  "In Progress": "primary-outline",
  "In Review": "info-outline",
  Ready: "success-outline",
  Blocked: "destructive-outline",
  Planned: "outline",
};

export function StatusBadge({ status }: { status: BacklogStatus }) {
  return <Badge variant={statusVariant[status]}>{status}</Badge>;
}

// ── Type marker (icon shape + label distinguish type; icon stays muted texture) ──

function TypeIcon({ type }: { type: BacklogType }) {
  if (type === "Feature") {
    return <SparklesIcon className="size-3.5 shrink-0" aria-hidden="true" />;
  }

  if (type === "Security") {
    return <ShieldCheckIcon className="size-3.5 shrink-0" aria-hidden="true" />;
  }

  if (type === "Research") {
    return <FlaskConicalIcon className="size-3.5 shrink-0" aria-hidden="true" />;
  }

  return <WrenchIcon className="size-3.5 shrink-0" aria-hidden="true" />;
}

function TaskCell({ item }: { item: BacklogItem }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <Item className="flex size-8 shrink-0 items-center justify-center border-2 border-background bg-muted p-0 shadow-[0_1px_3px_0_rgba(0,0,0,0.14)] dark:border [&_svg]:size-3.5 [&_svg]:text-accent-foreground">
        <ItemMedia variant="icon" className="size-auto">
          <TypeIcon type={item.type} />
        </ItemMedia>
      </Item>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="truncate text-sm font-medium text-foreground">{item.title}</span>
        <span className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
          <span className="tabular-nums">{item.ref}</span>
          <span aria-hidden className="size-1 shrink-0 rounded-full bg-muted-foreground/40" />
          <span className="truncate">{item.type}</span>
        </span>
      </div>
    </div>
  );
}

function OwnerCell({ item }: { item: BacklogItem }) {
  const initials = item.owner.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="flex min-w-0 items-center gap-2">
      <Avatar className="size-6">
        {item.owner.avatar ? <AvatarImage src={item.owner.avatar} alt="" /> : null}
        <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
      </Avatar>
      <span className="min-w-0 truncate text-sm text-foreground">{item.owner.name}</span>
    </div>
  );
}

function TeamCell({ item }: { item: BacklogItem }) {
  return <span className="block min-w-0 truncate text-sm text-foreground">{item.team}</span>;
}

function CycleCell({ item }: { item: BacklogItem }) {
  return <span className="block min-w-0 truncate text-sm text-muted-foreground">{item.cycle}</span>;
}

function DueDateCell({ item }: { item: BacklogItem }) {
  return <span className="text-sm text-foreground tabular-nums">{item.dueDate}</span>;
}

function RankCell({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary tabular-nums">
        <FlagIcon className="size-3.5 shrink-0" aria-hidden="true" />1
      </span>
    );
  }

  return <span className="text-sm text-muted-foreground tabular-nums">{rank}</span>;
}

function ActionsCell({
  item,
  rank,
  total,
  onAction,
}: {
  item: BacklogItem;
  rank: number;
  total: number;
  onAction: (action: BacklogRowAction, item: BacklogItem) => void;
}) {
  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="size-7"
              aria-label={`Actions for ${item.title}`}
            />
          }
        >
          <MoreHorizontalIcon aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end" className="w-44">
          <DropdownMenuGroup>
            <DropdownMenuItem disabled={rank === 1} onClick={() => onAction("move-top", item)}>
              <ArrowUpIcon className="size-4" aria-hidden="true" />
              Move to top
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={rank === total}
              onClick={() => onAction("move-bottom", item)}
            >
              <ArrowDownIcon className="size-4" aria-hidden="true" />
              Move to bottom
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => onAction("remove", item)}>
            <Trash2Icon className="size-4" aria-hidden="true" />
            Remove from sprint
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function createBacklogColumns({
  total,
  onAction,
}: {
  total: number;
  onAction: (action: BacklogRowAction, item: BacklogItem) => void;
}): ColumnDef<BacklogItem>[] {
  return [
    {
      id: "drag",
      header: () => <span className="sr-only">Reorder</span>,
      cell: () => <DataGridTableDndRowHandle />,
      size: 44,
      enableSorting: false,
      enableHiding: false,
      enableResizing: false,
      meta: {
        headerTitle: "Reorder",
        cellClassName: "pe-0!",
      },
    },
    {
      id: "rank",
      header: "#",
      cell: ({ row }: { row: Row<BacklogItem> }) => <RankCell rank={row.index + 1} />,
      size: 56,
      enableSorting: false,
      enableHiding: false,
      enableResizing: false,
      meta: {
        headerTitle: "Priority",
        cellClassName: "ps-0!",
        headerClassName: "ps-0!",
      },
    },
    {
      accessorKey: "title",
      id: "task",
      header: "Task",
      cell: ({ row }: { row: Row<BacklogItem> }) => <TaskCell item={row.original} />,
      size: 260,
      minSize: 200,
      enableSorting: false,
      enableHiding: false,
      enableResizing: true,
      meta: {
        headerTitle: "Task",
        autoSize: true,
      },
    },
    {
      accessorKey: "owner",
      id: "owner",
      header: "Owner",
      cell: ({ row }: { row: Row<BacklogItem> }) => <OwnerCell item={row.original} />,
      size: 165,
      enableSorting: false,
      enableHiding: false,
      enableResizing: false,
      meta: {
        headerTitle: "Owner",
      },
    },
    {
      accessorKey: "team",
      id: "team",
      header: "Team",
      cell: ({ row }: { row: Row<BacklogItem> }) => <TeamCell item={row.original} />,
      size: 130,
      enableSorting: false,
      enableHiding: false,
      enableResizing: false,
      meta: {
        headerTitle: "Team",
      },
    },
    {
      accessorKey: "cycle",
      id: "cycle",
      header: "Cycle",
      cell: ({ row }: { row: Row<BacklogItem> }) => <CycleCell item={row.original} />,
      size: 110,
      enableSorting: false,
      enableHiding: false,
      enableResizing: false,
      meta: {
        headerTitle: "Cycle",
      },
    },
    {
      accessorKey: "dueDate",
      id: "dueDate",
      header: "Due",
      cell: ({ row }: { row: Row<BacklogItem> }) => <DueDateCell item={row.original} />,
      size: 90,
      enableSorting: false,
      enableHiding: false,
      enableResizing: false,
      meta: {
        headerTitle: "Due",
      },
    },
    {
      accessorKey: "status",
      id: "status",
      header: "Status",
      cell: ({ row }: { row: Row<BacklogItem> }) => <StatusBadge status={row.original.status} />,
      size: 125,
      enableSorting: false,
      enableHiding: false,
      enableResizing: false,
      meta: {
        headerTitle: "Status",
      },
    },
    {
      accessorKey: "effort",
      id: "effort",
      header: "Effort",
      cell: ({ row }: { row: Row<BacklogItem> }) => (
        <span className="text-sm text-foreground tabular-nums">
          {row.original.effort}
          <span className="ms-1 text-xs text-muted-foreground">pts</span>
        </span>
      ),
      size: 80,
      enableSorting: false,
      enableHiding: false,
      enableResizing: false,
      meta: {
        headerTitle: "Effort",
      },
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }: { row: Row<BacklogItem> }) => (
        <ActionsCell item={row.original} rank={row.index + 1} total={total} onAction={onAction} />
      ),
      size: 56,
      enableSorting: false,
      enableHiding: false,
      enableResizing: false,
      meta: {
        headerTitle: "Actions",
        cellClassName: "pe-4!",
        headerClassName: "pe-4!",
      },
    },
  ];
}
