"use client";

import {
  useTable,
  type ColumnDef,
  type ColumnVisibilityState,
  type SortingState,
} from "@tanstack/react-table";
import { Badge } from "@workspace/ui/components/reui/badge";
import {
  DataGrid,
  DataGridContainer,
  dataGridFeatures,
  type DataGridFeatures,
} from "@workspace/ui/components/reui/data-grid/data-grid";
import { DataGridScrollArea } from "@workspace/ui/components/reui/data-grid/data-grid-scroll-area";
import { DataGridTable } from "@workspace/ui/components/reui/data-grid/data-grid-table";
import { Button } from "@workspace/ui/components/shadcn/button";
import { cn } from "@workspace/ui/lib/utils";
import { PlusIcon } from "lucide-react";
// One pipeline section: a tinted band followed by its own table, header row and
// all. Each section owns a separate DataGrid instance, which is what lets the
// column names repeat per group instead of once for the whole page.
import { useState } from "react";

import { type Story, type StorySection } from "../data";

export function StorySectionCard({
  section,
  columns,
  dense,
  columnVisibility,
  onAdd,
}: {
  section: StorySection;
  /** The one shared column array. Sections only align while they all use it. */
  columns: ColumnDef<DataGridFeatures, Story>[];
  dense: boolean;
  /** Shared across sections: differing column sets would break alignment. */
  columnVisibility: ColumnVisibilityState;
  onAdd: (section: StorySection) => void;
}) {
  // Sorting is per section on purpose: an editor can sort In Edit by publish
  // date without touching how Drafting is ordered. That is the thing a repeated
  // header row buys that one shared header cannot.
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useTable({
    features: dataGridFeatures,
    // No pagination row model on v8, so every row rendered. The shared
    // bundle registers one, and manualPagination is v9's way to say the
    // data is already the page - it keeps the pagination APIs while
    // leaving the rows unsliced.
    manualPagination: true,
    data: section.stories,
    columns,
    getRowId: (row) => row.id,
    state: { sorting, columnVisibility },
    onSortingChange: setSorting,
  });

  const headingId = `section-${section.key.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    // Only a divider between sections: the FramePanel already draws the
    // outer border, so a box per section would double it.
    <section aria-labelledby={headingId} className="border-b last:border-b-0">
      {/* Band */}
      <div className={cn("flex items-center gap-2 border-b px-3 py-2 lg:px-4", section.tone.band)}>
        <span aria-hidden="true" className={cn("size-2 shrink-0 rounded-full", section.tone.dot)} />
        <h2
          id={headingId}
          className="truncate text-xs font-semibold tracking-wide text-foreground uppercase"
        >
          {section.label}
        </h2>
        <Badge variant="outline" className="shrink-0 bg-background tabular-nums">
          {section.stories.length}
        </Badge>
        {/* Outline, not ghost: the band is tinted, and a ghost button has no
            edge of its own to read against it. */}
        <Button
          type="button"
          size="icon-sm"
          variant="outline"
          className="ms-auto shrink-0"
          aria-label={`Add a story to ${section.label}`}
          onClick={() => onAdd(section)}
        >
          <PlusIcon aria-hidden="true" />
        </Button>
      </div>

      {/* Table. No DataGridPagination anywhere on this page: the primitive's
          last-row border rule matches a paginated grid through a :has() selector
          that would then restyle every sibling section. */}
      <DataGrid
        table={table}
        recordCount={section.stories.length}
        emptyMessage={`Nothing in ${section.label}.`}
        tableLayout={{
          dense,
          rowBorder: true,
          width: "fixed",
          columnsResizable: false,
          columnsVisibility: false,
          columnsMovable: false,
        }}
        tableClassNames={{
          edgeCell: "first:ps-3 last:pe-3 lg:first:ps-4 lg:last:pe-4",
          headerRow: "[&>th]:h-9",
        }}
      >
        {/* DataGridContainer is w-full overflow-hidden, so the scroll area is
            what keeps the right-hand columns reachable on a narrow viewport
            instead of clipped. Every sibling grouping block does the same. */}
        <DataGridContainer>
          <DataGridScrollArea>
            <DataGridTable />
          </DataGridScrollArea>
        </DataGridContainer>
      </DataGrid>
    </section>
  );
}
