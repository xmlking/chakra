"use client";

import { type DragEndEvent, type UniqueIdentifier } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useTable, type ColumnDef } from "@tanstack/react-table";
import { useTanStackTableDevtools } from "@tanstack/react-table-devtools";
import {
  DataGrid,
  dataGridFeatures,
  type DataGridFeatures,
} from "@workspace/ui/components/reui/data-grid/data-grid";
import { DataGridScrollArea } from "@workspace/ui/components/reui/data-grid/data-grid-scroll-area";
import { DataGridTableDndRows } from "@workspace/ui/components/reui/data-grid/data-grid-table-dnd-rows";
import {
  Frame,
  FrameDescription,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@workspace/ui/components/reui/frame";
import { Button } from "@workspace/ui/components/shadcn/button";
import { RotateCcwIcon } from "lucide-react";
// Reorderable sprint backlog grid. Drag the row handle (or the row menu's
// move actions) to set delivery priority; the rank column reflects the live
// order. Manual order is the single source of truth, so the grid runs without
// sorting, filtering, or pagination, which would all fight row reordering.
import { useCallback, useMemo, useState } from "react";

import { BacklogEmptyState } from "../empty-state";
import { createBacklogColumns, type BacklogRowAction } from "./columns";
import { BACKLOG_ITEMS, type BacklogItem } from "./data";

function sortByOrder(items: BacklogItem[]) {
  return [...items].sort((a, b) => a.displayOrder - b.displayOrder);
}

// Renumber displayOrder to match the array position so rank stays contiguous.
function normalizeOrder(items: BacklogItem[]) {
  return items.map((item, index) => ({ ...item, displayOrder: index + 1 }));
}

const SEED_ITEMS = normalizeOrder(sortByOrder(BACKLOG_ITEMS));
const SEED_SIGNATURE = SEED_ITEMS.map((item) => item.id).join("|");

export function DataGridView() {
  const [items, setItems] = useState<BacklogItem[]>(SEED_ITEMS);

  const dataIds = useMemo<UniqueIdentifier[]>(() => items.map((item) => item.id), [items]);

  // Pristine = same items in the same order as the seed; gates the reset action.
  const isPristine = dataIds.join("|") === SEED_SIGNATURE;

  const handleAction = useCallback((action: BacklogRowAction, item: BacklogItem) => {
    setItems((current) => {
      if (action === "remove") {
        return normalizeOrder(current.filter((row) => row.id !== item.id));
      }

      const index = current.findIndex((row) => row.id === item.id);
      if (index < 0) return current;

      const target = action === "move-top" ? 0 : current.length - 1;
      return normalizeOrder(arrayMove(current, index, target));
    });
  }, []);

  const columns = useMemo<ColumnDef<DataGridFeatures, BacklogItem>[]>(
    () => createBacklogColumns({ total: items.length, onAction: handleAction }),
    [items.length, handleAction],
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useTable({
    key: "drag-drop-data-table",
    features: dataGridFeatures,
    // No pagination row model on v8, so every row rendered. The shared
    // bundle registers one, and manualPagination is v9's way to say the
    // data is already the page - it keeps the pagination APIs while
    // leaving the rows unsliced.
    manualPagination: true,
    data: items,
    columns,
    getRowId: (row) => row.id,
  });
  useTanStackTableDevtools(table, { enabled: import.meta.env.DEV });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active || !over || active.id === over.id) return;

    const oldIndex = dataIds.indexOf(active.id);
    const newIndex = dataIds.indexOf(over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    setItems((current) => normalizeOrder(arrayMove(current, oldIndex, newIndex)));
  };

  const handleReset = () => setItems(SEED_ITEMS);

  return (
    <DataGrid
      table={table}
      recordCount={items.length}
      emptyMessage={<BacklogEmptyState onRestore={handleReset} />}
      tableLayout={{
        dense: true,
        rowsDraggable: true,
        // Off, and it does more than hide the grips. It also picks the sizing
        // regime: on, the declared widths hold and a `meta.autoSize` column
        // swallows whatever the container has spare, which needs that column to
        // be resizable and so left a dead strip at the end once Task was fixed.
        // Off, every column shares the surplus in proportion, so the table
        // still fills its panel and the columns keep their relative weights.
        columnsResizable: false,
        columnsMovable: false,
        columnsVisibility: false,
        width: "fixed",
      }}
      tableClassNames={{
        bodyRow: "[&[style*='cursor:_grabbing']>td]:border-t",
      }}
    >
      <Frame variant="default" spacing="sm" className="w-full bg-card!">
        <FrameHeader className="flex-row items-center justify-between gap-3 text-foreground">
          <div className="flex min-w-0 flex-col gap-0.5">
            <FrameTitle>Sprint Backlog</FrameTitle>
            <FrameDescription className="flex items-center gap-1.5 text-xs">
              Drag to prioritize
              <span aria-hidden className="size-1 shrink-0 rounded-full bg-muted-foreground/40" />
              <span className="whitespace-nowrap">{items.length} items</span>
            </FrameDescription>
          </div>

          <Button
            type="button"
            variant="outline"
            className="text-foreground"
            disabled={isPristine}
            onClick={handleReset}
          >
            <RotateCcwIcon aria-hidden="true" />
            Reset order
          </Button>
        </FrameHeader>

        <FramePanel className="bg-card p-0! shadow-none!">
          <DataGridScrollArea>
            <DataGridTableDndRows dataIds={dataIds} handleDragEnd={handleDragEnd} />
          </DataGridScrollArea>
        </FramePanel>
      </Frame>
    </DataGrid>
  );
}
