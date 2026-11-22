"use client";

import {
  useTable,
  type ColumnVisibilityState,
  type ExpandedState,
  type SortingState,
} from "@tanstack/react-table";
import { Badge } from "@workspace/ui/components/reui/badge";
import {
  DataGrid,
  DataGridContainer,
  dataGridFeatures,
} from "@workspace/ui/components/reui/data-grid/data-grid";
import { DataGridScrollArea } from "@workspace/ui/components/reui/data-grid/data-grid-scroll-area";
import {
  DataGridTable,
  DataGridTableFootRow,
  DataGridTableFootRowCell,
} from "@workspace/ui/components/reui/data-grid/data-grid-table";
import {
  Frame,
  FrameDescription,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@workspace/ui/components/reui/frame";
import { Button } from "@workspace/ui/components/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/shadcn/dropdown-menu";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@workspace/ui/components/shadcn/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@workspace/ui/components/shadcn/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/shadcn/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/shadcn/select";
import { Switch } from "@workspace/ui/components/shadcn/switch";
import { ToggleGroup, ToggleGroupItem } from "@workspace/ui/components/shadcn/toggle-group";
import { cn } from "@workspace/ui/lib/utils";
import { CheckIcon, DownloadIcon, SearchIcon, Settings2Icon, TruckIcon, XIcon } from "lucide-react";
// Bill of materials explorer in DataGrid tree mode: a product breaks down into
// systems, assemblies, sub-assemblies and purchased parts at arbitrary depth.
// Cost, quantity, lead time and supply risk all roll up the tree, so the job of
// the surface is to let an engineer expand toward whatever is driving the number.
import { useCallback, useMemo, useState, type ComponentProps } from "react";
import { toast } from "sonner";

import { createBomColumns, supplyVariant, type BomAction } from "./columns";
import {
  BOM_REVISION,
  BOM_TREE,
  buildBomRows,
  countAtRisk,
  criticalPath,
  expandedSignature,
  filterBomNodes,
  formatCurrency,
  formatQuantity,
  getFirstPathExpandedState,
  getLevelExpandedState,
  PRODUCT_NAME,
  SUPPLY_STATUS_OPTIONS,
  totalCost,
  totalParts,
  type BomRow,
  type SupplyStatus,
} from "./data";

type TableDensity = "compact" | "comfortable";

type BomColumnKey = "partNumber" | "unitCost" | "leadTime" | "supply";

const TABLE_DENSITY_OPTIONS: { value: TableDensity; label: string }[] = [
  { value: "compact", label: "Compact" },
  { value: "comfortable", label: "Comfortable" },
];

const DISPLAY_COLUMN_OPTIONS: { key: BomColumnKey; label: string }[] = [
  { key: "partNumber", label: "Number" },
  { key: "unitCost", label: "Unit Cost" },
  { key: "leadTime", label: "Lead Time" },
  { key: "supply", label: "Supply" },
];

// "All" is a sentinel, not this tree's depth: the walk in getLevelExpandedState
// is bounded by the data, so a deeper product structure expands fully here with
// no change. Keep it that way rather than hard-coding the current depth, or a
// match below the hard-coded level becomes unreachable under a filter.
const EXPAND_ALL_LEVEL = Number.MAX_SAFE_INTEGER;

const DEPTH_OPTIONS: { level: number; label: string; description: string }[] = [
  { level: 0, label: "Collapse", description: "Collapse to systems" },
  { level: 1, label: "1", description: "Expand to level 1" },
  { level: 2, label: "2", description: "Expand to level 2" },
  { level: EXPAND_ALL_LEVEL, label: "All", description: "Expand all levels" },
];

// The build is a property of the product, so its headline figures come from the
// whole tree and stay put while a filter narrows what the grid shows. The footer
// carries the totals for the visible rows.
const BUILD_ROWS = buildBomRows(BOM_TREE);
const BUILD_COST = totalCost(BUILD_ROWS);
const BUILD_CRITICAL_PATH = criticalPath(BUILD_ROWS);
const BUILD_AT_RISK = countAtRisk(BUILD_ROWS);

// The header sits on the Frame's tinted surface, where a `secondary` badge
// blends into the background and reads as plain text. Metrics default to
// `outline` so they keep an edge; only a real signal spends colour.
function BuildMetric({
  label,
  value,
  variant = "outline",
}: {
  label: string;
  value: string;
  variant?: ComponentProps<typeof Badge>["variant"];
}) {
  return (
    <div className="flex min-w-0 items-center gap-2 sm:border-l sm:pl-3 sm:first:border-l-0 sm:first:pl-0">
      <span className="truncate text-xs font-medium text-muted-foreground">{label}</span>
      <Badge variant={variant} className="tabular-nums">
        {value}
      </Badge>
    </div>
  );
}

export function DataGridView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSupply, setSelectedSupply] = useState<SupplyStatus[]>([]);
  const [tableDensity, setTableDensity] = useState<TableDensity>("comfortable");
  const [showDetail, setShowDetail] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>({
    partNumber: true,
    unitCost: true,
    leadTime: true,
    supply: true,
  });
  // Unsorted by default: the seeded order IS the product structure, which is
  // the fact the surface exists to show. A sort is something an engineer asks
  // for, and it reorders inside each assembly rather than flattening the tree.
  const [sorting, setSorting] = useState<SortingState>([]);
  const [expandedRows, setExpandedRows] = useState<ExpandedState>(() =>
    getFirstPathExpandedState(BUILD_ROWS),
  );

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const isFiltered = normalizedQuery.length > 0 || selectedSupply.length > 0;
  const isDense = tableDensity === "compact";

  const bomRows = useMemo(
    () =>
      buildBomRows(
        filterBomNodes(BOM_TREE, {
          query: normalizedQuery,
          supply: selectedSupply,
        }),
      ),
    [normalizedQuery, selectedSupply],
  );

  // Reset expansion whenever the filter changes, adjusting state during render
  // rather than in an effect. A filtered tree is pruned to matches plus their
  // ancestors, so every surviving branch opens and a deep match is never left
  // hidden behind a collapsed ancestor; clearing the filter returns to the
  // default depth. `expandedRows` stays the table's only source of truth, which
  // is what keeps a hand toggle consistent: TanStack drops the row's key on
  // collapse, so anything merged in on top of it would silently reopen.
  const filterKey = `${normalizedQuery}|${selectedSupply.join(",")}`;
  const [appliedFilterKey, setAppliedFilterKey] = useState(filterKey);

  if (appliedFilterKey !== filterKey) {
    setAppliedFilterKey(filterKey);
    setExpandedRows(
      isFiltered
        ? getLevelExpandedState(bomRows, EXPAND_ALL_LEVEL)
        : getFirstPathExpandedState(bomRows),
    );
  }

  // Totals for the rows currently in the grid, shown in the footer.
  const visibleCost = totalCost(bomRows);
  const visibleLines = totalParts(bomRows);
  const visibleCriticalPath = criticalPath(bomRows);
  const activeFilterCount = selectedSupply.length;

  // Which depth preset the tree currently matches, or -1 after a hand toggle,
  // so the control never claims a state the tree is not in.
  const activeDepth = useMemo(() => {
    if (expandedRows === true) return EXPAND_ALL_LEVEL;

    const current = expandedSignature(expandedRows);
    const match = DEPTH_OPTIONS.find(
      (option) => expandedSignature(getLevelExpandedState(bomRows, option.level)) === current,
    );

    return match ? match.level : -1;
  }, [expandedRows, bomRows]);

  const handleSupplyToggle = useCallback((supply: SupplyStatus, checked: boolean) => {
    setSelectedSupply((current) => {
      if (checked) {
        return current.includes(supply) ? current : [...current, supply];
      }

      return current.filter((item) => item !== supply);
    });
  }, []);

  // ToggleGroup carries string values, so the depth level round-trips as text.
  const handleDepthChange = useCallback(
    (values: unknown[]) => {
      const [next] = values;
      if (typeof next !== "string") return;
      setExpandedRows(getLevelExpandedState(bomRows, Number(next)));
    },
    [bomRows],
  );

  const handleBomAction = useCallback((action: BomAction, row: BomRow) => {
    if (action === "open") {
      toast.info("View part", {
        description: `${row.node.partNumber} / ${row.node.name}`,
      });
      return;
    }

    if (action === "copy") {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        void navigator.clipboard.writeText(row.node.partNumber);
      }

      toast.success("Part number copied", {
        description: row.node.partNumber,
      });
      return;
    }

    toast.message("Find supplier", {
      description: `Connect ${row.node.partNumber} to your sourcing workflow.`,
    });
  }, []);

  const handleExport = useCallback(() => {
    toast.success("Export bill of materials", {
      description: "Connect this action to your PLM or ERP export.",
    });
  }, []);

  const columns = useMemo(
    () =>
      createBomColumns({
        buildCost: BUILD_COST,
        criticalPathDays: BUILD_CRITICAL_PATH,
        dense: isDense,
        showDetail,
        onAction: handleBomAction,
      }),
    [isDense, showDetail, handleBomAction],
  );

  const table = useTable({
    features: dataGridFeatures,
    // No pagination row model on v8, so every row rendered. The shared
    // bundle registers one, and manualPagination is v9's way to say the
    // data is already the page - it keeps the pagination APIs while
    // leaving the rows unsliced.
    manualPagination: true,
    data: bomRows,
    columns,
    getRowId: (row) => row.id,
    getSubRows: (row) => row.children,
    getRowCanExpand: (row) => Boolean(row.original.children?.length),
    state: {
      columnVisibility,
      expanded: expandedRows,
      sorting,
    },
    onExpandedChange: setExpandedRows,
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    // Sorted before expanded, so TanStack reorders sub-rows inside their own
    // parent and a sort never lifts a part out from under its assembly.
  });

  function toggleColumn(key: BomColumnKey, checked: boolean) {
    setColumnVisibility((current) => ({
      ...current,
      [key]: checked,
    }));
  }

  function clearFilters() {
    setSearchQuery("");
    setSelectedSupply([]);
  }

  // Grand-total footer: one cell per visible column so it tracks column toggles.
  // The first and last cells repeat the body's edge padding, which the foot row
  // does not inherit, so the label stays on the body's left spine.
  const visibleLeafColumns = table.getVisibleLeafColumns();
  const lastColumnIndex = visibleLeafColumns.length - 1;

  const footerContent =
    bomRows.length > 0 ? (
      <DataGridTableFootRow>
        {visibleLeafColumns.map((column, index) => {
          const edgeClassName = cn(
            index === 0 && "ps-3 lg:ps-4",
            index === lastColumnIndex && "pe-3 lg:pe-4",
          );

          if (column.id === "part") {
            return (
              <DataGridTableFootRowCell key={column.id} className={edgeClassName}>
                <div className="flex min-w-0 items-center gap-2">
                  <span className="truncate text-sm font-semibold text-foreground">
                    {PRODUCT_NAME}
                  </span>
                  <Badge variant="outline" className="shrink-0 tabular-nums">
                    {`${visibleLines} lines`}
                  </Badge>
                </div>
              </DataGridTableFootRowCell>
            );
          }

          if (column.id === "extendedCost") {
            return (
              <DataGridTableFootRowCell
                key={column.id}
                className={cn("text-right!", edgeClassName)}
              >
                <span className="text-sm font-semibold text-foreground tabular-nums">
                  {formatCurrency(visibleCost)}
                </span>
              </DataGridTableFootRowCell>
            );
          }

          if (column.id === "leadTime") {
            return (
              <DataGridTableFootRowCell
                key={column.id}
                className={cn("text-right!", edgeClassName)}
              >
                <span className="text-sm font-semibold text-foreground tabular-nums">
                  {`${visibleCriticalPath}d`}
                </span>
              </DataGridTableFootRowCell>
            );
          }

          return <DataGridTableFootRowCell key={column.id} className={edgeClassName} />;
        })}
      </DataGridTableFootRow>
    ) : undefined;

  return (
    <DataGrid
      table={table}
      recordCount={visibleLines}
      emptyMessage="No parts match this view."
      tableLayout={{
        dense: isDense,
        rowBorder: true,
        footerBackground: true,
        // Full column controls: every header becomes a menu that can sort,
        // hide, move and resize its column. Resize commits on release (the primitive
        // default) rather than on every pointer move, so a drag does not
        // re-layout the tree on each frame.
        columnsVisibility: true,
        columnsResizable: true,
        columnsMovable: true,
        width: "fixed",
      }}
      tableClassNames={{
        // Depth reads from the indent, the icon and the label weight, so rows
        // stay on one surface rather than banding the root level.
        bodyRow: cn(
          isDense ? "[&>td]:h-9" : "[&>td]:h-11",
          showDetail && (isDense ? "[&>td]:h-12" : "[&>td]:h-14"),
        ),
        edgeCell: "first:ps-3 last:pe-3 lg:first:ps-4 lg:last:pe-4",
      }}
    >
      <section className="flex w-full max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <Frame>
          {/* Header */}
          <FrameHeader className="flex-col items-start gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 flex-col">
              <FrameTitle>Bill Of Materials</FrameTitle>
              <FrameDescription className="flex min-w-0 items-center gap-1.5">
                <span className="truncate">{PRODUCT_NAME}</span>
                <span
                  aria-hidden="true"
                  className="size-1 shrink-0 rounded-full bg-muted-foreground/40"
                />
                <span className="shrink-0">{BOM_REVISION}</span>
              </FrameDescription>
            </div>

            <div className="flex min-w-0 flex-wrap items-center gap-3">
              <BuildMetric
                label="Build cost"
                value={formatCurrency(BUILD_COST)}
                variant="outline"
              />
              <BuildMetric label="Critical path" value={`${BUILD_CRITICAL_PATH}d`} />
              <BuildMetric
                label="At risk"
                value={formatQuantity(BUILD_AT_RISK)}
                variant={BUILD_AT_RISK > 0 ? "warning-light" : "outline"}
              />
              <Button type="button" variant="outline" onClick={handleExport}>
                <DownloadIcon data-icon="inline-start" aria-hidden="true" />
                Export
              </Button>
            </div>
          </FrameHeader>

          <FramePanel className="bg-card p-0! shadow-none!">
            {/* Toolbar */}
            <div className="flex flex-col gap-3 border-b px-3 py-3 lg:flex-row lg:items-center lg:justify-between lg:px-4">
              <InputGroup className="w-full min-w-0 lg:max-w-xs">
                <InputGroupAddon align="inline-start">
                  <SearchIcon className="size-4 text-muted-foreground" aria-hidden="true" />
                </InputGroupAddon>
                <InputGroupInput
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search parts..."
                  aria-label="Search parts"
                />
                {searchQuery.length > 0 ? (
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      size="icon-xs"
                      aria-label="Clear search"
                      onClick={() => setSearchQuery("")}
                    >
                      <XIcon className="size-4" aria-hidden="true" />
                    </InputGroupButton>
                  </InputGroupAddon>
                ) : null}
              </InputGroup>

              <div className="flex min-w-0 flex-wrap items-center gap-1.5 lg:justify-end">
                {/* Depth control: the tree-native alternative to expand-all. */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground">Depth</span>
                  <ToggleGroup
                    multiple={false}
                    value={activeDepth < 0 ? [] : [String(activeDepth)]}
                    onValueChange={handleDepthChange}
                    variant="outline"
                    spacing={0}
                    aria-label="Tree depth"
                    className="shrink-0"
                  >
                    {DEPTH_OPTIONS.map((option) => (
                      <ToggleGroupItem
                        key={option.level}
                        value={String(option.level)}
                        aria-label={option.description}
                      >
                        {option.label}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>

                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger
                    render={
                      <Button type="button" variant="outline">
                        <TruckIcon data-icon="inline-start" aria-hidden="true" />
                        Supply
                        {activeFilterCount > 0 ? (
                          <Badge variant="secondary">{activeFilterCount}</Badge>
                        ) : null}
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="end" className="min-w-48">
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>Supply status</DropdownMenuLabel>
                      {/* Options render as the same Badge the Supply column
                          shows, so the thing being picked looks like the cell
                          it will match. */}
                      {SUPPLY_STATUS_OPTIONS.map((supply) => (
                        <DropdownMenuCheckboxItem
                          key={supply}
                          checked={selectedSupply.includes(supply)}
                          closeOnClick={false}
                          onCheckedChange={(checked) =>
                            handleSupplyToggle(supply, checked === true)
                          }
                        >
                          <Badge variant={supplyVariant[supply]}>{supply}</Badge>
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuGroup>
                    {activeFilterCount > 0 ? (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          closeOnClick={false}
                          onClick={() => setSelectedSupply([])}
                        >
                          Reset supply
                        </DropdownMenuItem>
                      </>
                    ) : null}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Popover>
                  <PopoverTrigger
                    render={
                      <Button type="button" variant="outline">
                        <Settings2Icon data-icon="inline-start" aria-hidden="true" />
                        Display
                      </Button>
                    }
                  />
                  <PopoverContent align="end" className="w-[300px] p-0">
                    <FieldGroup className="gap-3 px-3.5 py-3">
                      <div className="flex flex-col gap-2">
                        <div className="text-xs font-medium text-muted-foreground">Table</div>
                        <Field
                          orientation="horizontal"
                          className="min-h-9 items-center justify-between gap-3"
                        >
                          <FieldLabel className="text-sm font-normal">Density</FieldLabel>
                          <Select
                            value={tableDensity}
                            onValueChange={(value) => setTableDensity(value as TableDensity)}
                          >
                            <SelectTrigger size="sm" className="w-[132px] shrink-0">
                              <SelectValue>
                                {
                                  TABLE_DENSITY_OPTIONS.find(
                                    (option) => option.value === tableDensity,
                                  )?.label
                                }
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent align="end">
                              <SelectGroup>
                                {TABLE_DENSITY_OPTIONS.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </Field>
                        <Field
                          orientation="horizontal"
                          className="min-h-9 items-center justify-between gap-3"
                        >
                          <FieldLabel htmlFor="bom-part-detail" className="text-sm font-normal">
                            Part detail
                          </FieldLabel>
                          <Switch
                            id="bom-part-detail"
                            checked={showDetail}
                            onCheckedChange={setShowDetail}
                          />
                        </Field>
                      </div>

                      <FieldSeparator className="-mx-3.5" />

                      <div className="flex flex-col gap-2">
                        <div className="text-xs font-medium text-muted-foreground">
                          Display properties
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {DISPLAY_COLUMN_OPTIONS.map((option) => {
                            const active = columnVisibility[option.key] !== false;

                            return (
                              <Button
                                key={option.key}
                                type="button"
                                size="sm"
                                variant={active ? "secondary" : "outline"}
                                className={cn("rounded-full", active && "border-foreground/10")}
                                aria-pressed={active}
                                onClick={() => toggleColumn(option.key, !active)}
                              >
                                {active ? (
                                  <CheckIcon className="size-4" aria-hidden="true" />
                                ) : null}
                                {option.label}
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    </FieldGroup>
                  </PopoverContent>
                </Popover>

                {isFiltered ? (
                  <Button type="button" variant="ghost" onClick={clearFilters}>
                    Clear
                  </Button>
                ) : null}
              </div>
            </div>

            {/* Tree grid */}
            <DataGridContainer>
              <DataGridScrollArea>
                <DataGridTable footerContent={footerContent} />
              </DataGridScrollArea>
            </DataGridContainer>
          </FramePanel>
        </Frame>
      </section>
    </DataGrid>
  );
}
