"use client";

import { type ColumnDef, type Row, type SortFn } from "@tanstack/react-table";
import { Badge } from "@workspace/ui/components/reui/badge";
import { type DataGridFeatures } from "@workspace/ui/components/reui/data-grid/data-grid";
import { DataGridColumnHeader } from "@workspace/ui/components/reui/data-grid/data-grid-column-header";
import { DataGridTableRowExpand } from "@workspace/ui/components/reui/data-grid/data-grid-table";
import { IconTile } from "@workspace/ui/components/reui/icon-tile";
import { Button } from "@workspace/ui/components/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/shadcn/dropdown-menu";
import { cn } from "@workspace/ui/lib/utils";
import {
  ClockIcon,
  CopyIcon,
  ExternalLinkIcon,
  EyeIcon,
  MoreHorizontalIcon,
  TruckIcon,
} from "lucide-react";
import { type ComponentProps } from "react";

import {
  BOM_KIND_ICONS,
  BOM_NODE_ICONS,
  formatCurrency,
  formatQuantity,
  formatShare,
  SUPPLY_SEVERITY,
  type BomRow,
  type SupplyStatus,
} from "./data";

export type BomAction = "open" | "copy" | "source";

// Tone tracks SUPPLY_SEVERITY in data.tsx: neutral, informational, schedule
// risk, blocker. Keep the two in the same order or a parent's rolled-up worst
// status will read calmer than the child it came from. Exported because the
// toolbar filter renders its options as these same badges.
export const supplyVariant: Record<SupplyStatus, ComponentProps<typeof Badge>["variant"]> = {
  Stocked: "secondary",
  "Single source": "info-light",
  "Long lead": "warning-light",
  Shortage: "destructive-light",
};

// Risk, not the alphabet: ascending walks Stocked -> Single source -> Long lead
// -> Shortage, the order a buyer escalates through. Alphabetical would read Long
// lead, Shortage, Single source, Stocked, which scatters the two ends of the
// scale. Reads the same severity map the parent rollup uses, so a sorted branch
// and the status it inherited never disagree.
const sortBySupply: SortFn<DataGridFeatures, BomRow> = (rowA, rowB) =>
  SUPPLY_SEVERITY[rowA.original.supply] - SUPPLY_SEVERITY[rowB.original.supply];

// Depth indent per tree level, in px. Matches the primitive's own default and
// sits on the 4px scale; paired with the leaf spacer widths below.
const TREE_INDENT = 20;

// ── Part column ──

function PartCell({
  row,
  dense,
  showDetail,
}: {
  row: Row<DataGridFeatures, BomRow>;
  dense: boolean;
  showDetail: boolean;
}) {
  const { node } = row.original;
  const isBranch = row.getCanExpand();

  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <span className="flex shrink-0 items-center">
        <DataGridTableRowExpand row={row} indent={TREE_INDENT} />
        {/* Pads a leaf out to the toggle width so a part and an assembly at the
            same depth share one label spine. The primitive's own leaf spacer is
            8px and its toggle is size-7, or size-6 once the grid is dense, so
            these two widths must track the density switch. */}
        {isBranch ? null : (
          <span aria-hidden="true" className={cn("shrink-0", dense ? "w-4" : "w-5")} />
        )}
      </span>

      {/* One muted tone across both variants so the tile reads as a quiet
          index mark; the raised surface alone separates branch from leaf. */}
      <IconTile
        variant={isBranch ? "elevated" : "outline"}
        size="xs"
        aria-hidden="true"
        className="shrink-0 text-muted-foreground"
      >
        {BOM_NODE_ICONS[node.id] ?? BOM_KIND_ICONS[node.kind]}
      </IconTile>

      <div className="flex min-w-0 flex-col">
        <span className="flex min-w-0 items-center gap-2">
          <span
            className={cn(
              "min-w-0 cursor-pointer truncate text-sm text-foreground transition-colors hover:text-primary",
              isBranch ? "font-semibold" : "font-medium",
            )}
          >
            {node.name}
          </span>
          {/* The multiplier is declared on the assembly, so it is shown there
              rather than on every part it doubles. Leaf quantities are already
              resolved per build in the Qty column. */}
          {isBranch && node.qty > 1 ? (
            <Badge variant="outline" className="shrink-0 tabular-nums">
              {`x${node.qty} per build`}
            </Badge>
          ) : null}
        </span>
        {showDetail ? (
          <span className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
            <span className="truncate">{node.detail}</span>
            {node.supplier ? (
              <>
                <span
                  aria-hidden="true"
                  className="size-1 shrink-0 rounded-full bg-muted-foreground/40"
                />
                <span className="shrink-0">{node.supplier}</span>
              </>
            ) : null}
          </span>
        ) : null}
      </div>
    </div>
  );
}

/**
 * The part number is the row's stable handle, so it carries the navigation.
 * The indicator only appears on hover or keyboard focus, which keeps a column
 * of 40 codes calm while still reading as reachable.
 */
function PartNumberLink({ partNumber }: { partNumber: string }) {
  return (
    <button
      type="button"
      aria-label={`Open part ${partNumber}`}
      className="group/part-number inline-flex min-w-0 items-center gap-1 font-mono text-xs tracking-tight text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground"
    >
      <span className="truncate">{partNumber}</span>
      <ExternalLinkIcon
        className="size-3 shrink-0 -translate-x-0.5 opacity-0 transition duration-150 group-hover/part-number:translate-x-0 group-hover/part-number:opacity-100 group-focus-visible/part-number:translate-x-0 group-focus-visible/part-number:opacity-100"
        aria-hidden="true"
      />
    </button>
  );
}

// ── Numeric cells ──

/** Right-aligned numeric slot shared by branch and leaf rows. */
function NumericSlot({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex w-full items-center justify-end", className)}>{children}</div>;
}

// Ring geometry is the corpus cell-scale donut (data-grid-grouping-1's
// completion ring): r=9 inside a 24 viewBox at size-5 paints a ~2px band around
// a ~13px hole, which stays legible in an h-11 row and a dense h-9 one alike.
const RING_RADIUS = 9;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

/**
 * The focal cell. Branch rows carry a share-of-build donut beside the rolled-up
 * figure, so the expensive subtree is visible before any number is read; leaf
 * shares are mostly fractions of a percent, where an indicator reads as noise.
 */
function CostCell({ value, total, emphasis }: { value: number; total: number; emphasis: boolean }) {
  const share = total > 0 ? Math.min(100, (value / total) * 100) : 0;

  return (
    <NumericSlot className="gap-2.5">
      {emphasis ? (
        // Ring plus numeral, the pairing the corpus uses for cell-scale rings:
        // the arc gives an instant read across rows, the numeral the precision
        // a 3% slice cannot carry on its own.
        <span className="flex shrink-0 items-center gap-1.5">
          <svg viewBox="0 0 24 24" className="size-6 shrink-0 text-primary" aria-hidden="true">
            <circle
              cx="12"
              cy="12"
              r={RING_RADIUS}
              fill="none"
              className="stroke-muted"
              strokeWidth="3"
            />
            <circle
              cx="12"
              cy="12"
              r={RING_RADIUS}
              fill="none"
              className="stroke-current"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={RING_CIRCUMFERENCE - (share / 100) * RING_CIRCUMFERENCE}
              transform="rotate(-90 12 12)"
            />
          </svg>
          <span className="text-xs text-muted-foreground tabular-nums">
            {formatShare(value, total)}
          </span>
        </span>
      ) : null}
      <span
        className={cn(
          "text-sm text-foreground tabular-nums",
          emphasis ? "font-semibold" : "font-medium",
        )}
      >
        {formatCurrency(value)}
      </span>
    </NumericSlot>
  );
}

function LeadTimeCell({ days, critical }: { days: number; critical: boolean }) {
  return (
    <NumericSlot>
      <Badge variant="outline" className={cn("gap-1.5 bg-background", critical && "text-warning")}>
        <ClockIcon className="size-3.5" aria-hidden="true" />
        <span className="tabular-nums">{`${days}d`}</span>
      </Badge>
    </NumericSlot>
  );
}

// ── Row actions ──

function BomActionsCell({
  row,
  onAction,
}: {
  row: BomRow;
  onAction: (action: BomAction, row: BomRow) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            aria-label={`Actions for ${row.node.partNumber}`}
          />
        }
      >
        <MoreHorizontalIcon aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => onAction("open", row)}>
            <EyeIcon aria-hidden="true" />
            View part
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAction("copy", row)}>
            <CopyIcon aria-hidden="true" />
            Copy number
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onAction("source", row)}>
            <TruckIcon aria-hidden="true" />
            Find supplier
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ── Column definitions ──

export function createBomColumns({
  buildCost,
  criticalPathDays,
  dense,
  showDetail,
  onAction,
}: {
  /** Full-product build cost, so share bars stay comparable under a filter. */
  buildCost: number;
  criticalPathDays: number;
  dense: boolean;
  showDetail: boolean;
  onAction: (action: BomAction, row: BomRow) => void;
}): ColumnDef<DataGridFeatures, BomRow>[] {
  return [
    {
      // Sorts on the raw part name, and TanStack sorts sub-rows inside their
      // own parent, so a sort reorders each assembly's contents without ever
      // lifting a part out from under the assembly it belongs to.
      accessorFn: (row) => row.node.name,
      id: "part",
      header: ({ column }) => <DataGridColumnHeader title="Part" column={column} visibility />,
      cell: ({ row }) => <PartCell row={row} dense={dense} showDetail={showDetail} />,
      enableHiding: false,
      sortFn: "text",
      enableSorting: true,
      minSize: 300,
      meta: {
        headerTitle: "Part",
        autoSize: true,
      },
    },
    {
      accessorFn: (row) => row.node.partNumber,
      id: "partNumber",
      header: ({ column }) => <DataGridColumnHeader title="Number" column={column} visibility />,
      cell: ({ row }) => <PartNumberLink partNumber={row.original.node.partNumber} />,
      size: 108,
      // Every code carries the same PREFIX-DIGITS shape, so a plain text
      // compare already groups the systems, assemblies and parts in order.
      sortFn: "text",
      enableSorting: true,
      meta: {
        headerTitle: "Number",
      },
    },
    {
      accessorFn: (row) => row.effectiveQty,
      id: "qty",
      header: ({ column }) => (
        <DataGridColumnHeader
          title="Qty"
          column={column}
          visibility
          className="w-full justify-end text-right"
        />
      ),
      cell: ({ row }) => (
        <NumericSlot>
          <span className="text-sm text-foreground tabular-nums">
            {formatQuantity(row.original.effectiveQty)}
          </span>
        </NumericSlot>
      ),
      size: 76,
      // The resolved per-build quantity, which is exactly what the cell
      // renders, so the order matches what is on screen.
      sortFn: "basic",
      enableSorting: true,
      meta: {
        headerTitle: "Qty",
        headerClassName: "text-right!",
        cellClassName: "text-right!",
      },
    },
    {
      // An assembly has no unit price, and the accessor already resolves that
      // to 0, so the built rows gather at the ascending end rather than
      // scattering through the priced parts.
      accessorFn: (row) => row.node.unitCost ?? 0,
      id: "unitCost",
      header: ({ column }) => (
        <DataGridColumnHeader
          title="Unit Cost"
          column={column}
          visibility
          className="w-full justify-end text-right"
        />
      ),
      cell: ({ row }) => (
        <NumericSlot>
          {row.original.node.unitCost === null ? (
            // Assemblies are built, not bought, so they carry no unit price.
            <span className="text-sm text-muted-foreground">--</span>
          ) : (
            <span className="text-sm text-foreground tabular-nums">
              {formatCurrency(row.original.node.unitCost)}
            </span>
          )}
        </NumericSlot>
      ),
      size: 110,
      sortFn: "basic",
      enableSorting: true,
      meta: {
        headerTitle: "Unit Cost",
        headerClassName: "text-right!",
        cellClassName: "text-right!",
      },
    },
    {
      accessorFn: (row) => row.extendedCost,
      id: "extendedCost",
      header: ({ column }) => (
        <DataGridColumnHeader
          title="Extended Cost"
          column={column}
          visibility
          className="w-full justify-end text-right"
        />
      ),
      cell: ({ row }) => (
        <CostCell
          value={row.original.extendedCost}
          total={buildCost}
          emphasis={row.getCanExpand()}
        />
      ),
      size: 196,
      minSize: 170,
      enableHiding: false,
      // The rolled-up subtree cost, the same figure the donut and the numeral
      // report, so descending puts the expensive branch first.
      sortFn: "basic",
      enableSorting: true,
      meta: {
        headerTitle: "Extended Cost",
        headerClassName: "text-right!",
        cellClassName: "text-right!",
      },
    },
    {
      accessorFn: (row) => row.leadTimeDays,
      id: "leadTime",
      header: ({ column }) => (
        <DataGridColumnHeader
          title="Lead Time"
          column={column}
          visibility
          className="w-full justify-end text-right"
        />
      ),
      cell: ({ row }) => (
        <LeadTimeCell
          days={row.original.leadTimeDays}
          critical={row.original.leadTimeDays >= criticalPathDays}
        />
      ),
      size: 116,
      // The longest lead time anywhere in the subtree, so descending surfaces
      // whatever is actually setting the critical path.
      sortFn: "basic",
      enableSorting: true,
      meta: {
        headerTitle: "Lead Time",
        headerClassName: "text-right!",
      },
    },
    {
      accessorFn: (row) => row.supply,
      id: "supply",
      header: ({ column }) => <DataGridColumnHeader title="Supply" column={column} visibility />,
      cell: ({ row }) => (
        <Badge variant={supplyVariant[row.original.supply]}>{row.original.supply}</Badge>
      ),
      size: 124,
      sortFn: sortBySupply,
      enableSorting: true,
      meta: {
        headerTitle: "Supply",
      },
    },
    {
      // Control column: the row menu is the whole cell, so it is never sorted
      // or hidden and carries no header menu of its own.
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <BomActionsCell row={row.original} onAction={onAction} />
        </div>
      ),
      size: 56,
      enableHiding: false,
      enableSorting: false,
    },
  ];
}
