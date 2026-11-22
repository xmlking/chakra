import { type Column, type ColumnDef } from "@tanstack/react-table";
import { type DataGridFeatures } from "@workspace/ui/components/reui/data-grid/data-grid";
import { DataGridColumnHeader } from "@workspace/ui/components/reui/data-grid/data-grid-column-header";
import {
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from "@workspace/ui/components/reui/data-grid/data-grid-table";
import { cn } from "cn";
import { useMemo } from "react";

import { type Kitchen } from "./data";
import { DayCell } from "./day-cell";
import { DayHeader } from "./day-header";
import { ActionsCell, CoverageCell, KitchenCell } from "./kitchen-cells";
import { DAY_OFFSETS, WINDOW_DAYS } from "./plan-math";

type KitchenColumn = ColumnDef<DataGridFeatures, Kitchen>;

/** The tile every day cell holds, and the day chip's width above it. */
const DAY_TILE = 24;
/** The day floor: 4px, the tile, 4px and the 1px column line. */
const DAY_MIN = 33;
const DAY_MAX = 45;
const SELECT_SIZE = 49;
const KITCHEN_MIN = 152;
const COVERAGE_SIZE = 136;
const ACTIONS_SIZE = 45;

/** Free width goes to the days before Kitchen, at an odd size so the air
 *  either side of a tile stays equal. */
export function daySizeFor(gridWidth: number) {
  const fixed = SELECT_SIZE + KITCHEN_MIN + COVERAGE_SIZE + ACTIONS_SIZE;
  const fit = Math.floor((gridWidth - fixed) / WINDOW_DAYS);
  const odd = fit % 2 === 0 ? fit - 1 : fit;
  return Math.min(DAY_MAX, Math.max(DAY_MIN, odd));
}

/** The air either side of a day's tile, which the day chip keeps too. */
export const dayAirOf = (daySize: number) => (daySize - 1 - DAY_TILE) / 2;

/** The day cell fills itself; its button is the whole td. The focus frame
 *  rides above the status wash. */
const DAY_CELL = "relative p-0 before:pointer-events-none before:z-10";
// The face keeps the tiles' side air (--day-air). Today, a hovered day and
// a day whose run sheet is open wash the whole header cell.
const DAY_HEAD =
  "h-auto p-(--day-air) text-center has-data-today:bg-muted has-[button:hover]:bg-muted has-aria-expanded:bg-muted";

/** 8px either side of the menu button: the dots' ink lands near the
 *  frame's 16px inset. */
const ACTIONS_CELL = "px-2";

/** Kitchen is pinned to stay put while the days scroll, not by choice, so
 *  its header keeps the plain sort: no pin menu, no unpin button. */
function KitchenHeader({ column }: { column: Column<DataGridFeatures, Kitchen, unknown> }) {
  const sortOnly = useMemo<typeof column>(
    () => Object.assign(Object.create(column), { getCanPin: () => false }),
    [column],
  );
  return <DataGridColumnHeader column={sortOnly} />;
}

function dayColumn(offset: number, size: number): KitchenColumn {
  return {
    id: `d${offset}`,
    header: () => <DayHeader offset={offset} />,
    cell: ({ row }) => <DayCell kitchen={row.original} offset={offset} />,
    enableSorting: false,
    enableResizing: false,
    enableHiding: false,
    size,
    meta: {
      headerTitle: `Day ${offset + 1}`,
      headerClassName: DAY_HEAD,
      cellClassName: DAY_CELL,
    },
  };
}

// Day columns are window offsets: the header and cells read the window's
// first day from the plan view, so only the day width rebuilds the set.
export const columnsFor = (daySize: number): KitchenColumn[] => [
  {
    id: "select",
    enableCellSelection: false,
    header: () => <DataGridTableRowSelectAll />,
    cell: ({ row }) => <DataGridTableRowSelect row={row} />,
    enableSorting: false,
    enableResizing: false,
    enableHiding: false,
    // Frame inset 16, box 16, the same 16 after it, and the 1px column line.
    size: SELECT_SIZE,
  },
  {
    accessorKey: "name",
    id: "kitchen",
    enableCellSelection: false,
    header: ({ column }) => <KitchenHeader column={column} />,
    cell: ({ row }) => <KitchenCell kitchen={row.original} />,
    enableHiding: false,
    minSize: KITCHEN_MIN,
    size: KITCHEN_MIN,
    meta: { headerTitle: "Kitchen", autoSize: true },
  },
  ...DAY_OFFSETS.map((offset) => dayColumn(offset, daySize)),
  {
    // Sorting is manual: the view ranks kitchens by their coverage.
    accessorFn: () => 0,
    id: "coverage",
    enableCellSelection: false,
    header: ({ column }) => <DataGridColumnHeader column={column} />,
    cell: ({ row }) => <CoverageCell kitchen={row.original} />,
    enableHiding: false,
    enableResizing: false,
    // Its header stays a plain sort, with no pin menu.
    enablePinning: false,
    // Room for the longest note, "Cooling booked late", on the cell's spine.
    size: COVERAGE_SIZE,
    meta: { headerTitle: "Coverage" },
  },
  {
    id: "actions",
    enableCellSelection: false,
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <ActionsCell kitchen={row.original} />,
    enableSorting: false,
    enableResizing: false,
    enableHiding: false,
    // 8 + the 28px menu button + 8 and the 1px column line.
    size: ACTIONS_SIZE,
    meta: { cellClassName: ACTIONS_CELL },
  },
];
