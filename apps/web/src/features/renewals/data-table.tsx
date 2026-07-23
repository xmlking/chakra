// oxlint-disable typescript/no-base-to-string
"use client";

import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { DataGrid } from "@workspace/ui/components/reui/data-grid/data-grid";
import { DataGridScrollArea } from "@workspace/ui/components/reui/data-grid/data-grid-scroll-area";
import { DataGridTable } from "@workspace/ui/components/reui/data-grid/data-grid-table";
import {
  createFilter,
  Filters,
  type Filter,
  type FilterFieldConfig,
} from "@workspace/ui/components/reui/filters";
import { Button } from "@workspace/ui/components/shadcn/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/shadcn/card";
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
import { Separator } from "@workspace/ui/components/shadcn/separator";
import { Switch } from "@workspace/ui/components/shadcn/switch";
import { cn } from "@workspace/ui/lib/utils";
import {
  FilterIcon,
  Settings2Icon,
  CheckIcon,
  Building2Icon,
  LayersIcon,
  GitBranchIcon,
  TriangleAlertIcon,
  CalendarClockIcon,
  UserRoundIcon,
  PlusIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import { createRenewalColumns, RiskBadge, StageBadge } from "./columns";
import {
  getRenewalWindowValue,
  RENEWAL_OWNERS,
  RENEWAL_RECORDS,
  RENEWAL_RISK_ORDER,
  RENEWAL_SEGMENT_ORDER,
  RENEWAL_STAGE_ORDER,
  RENEWAL_WINDOW_OPTIONS,
  type IRenewalRecord,
  type RenewalRisk,
  type RenewalStage,
} from "./data";
import { SelectionBar } from "./ui/selection-bar";

function getActiveFilters(filters: Filter[]) {
  return filters.filter((filter) => {
    const { values } = filter;
    if (!values || values.length === 0) return false;
    if (values.every((value) => typeof value === "string" && value.trim() === "")) {
      return false;
    }
    if (values.every((value) => value === null || value === undefined)) {
      return false;
    }
    if (values.every((value) => Array.isArray(value) && value.length === 0)) {
      return false;
    }
    return true;
  });
}

function filterFieldValue(item: IRenewalRecord, field: string): unknown {
  if (field === "renewalWindow") {
    return getRenewalWindowValue(item.daysToRenewal);
  }
  return item[field as keyof IRenewalRecord];
}

function applyFiltersToData(data: IRenewalRecord[], filters: Filter[]): IRenewalRecord[] {
  const active = getActiveFilters(filters);
  let result = [...data];

  active.forEach((filter) => {
    const { field, operator, values } = filter;

    result = result.filter((item) => {
      const raw = filterFieldValue(item, field);
      const fieldValue = raw != null ? raw : "";

      switch (operator) {
        case "is":
          return values.includes(fieldValue);
        case "is_not":
          return !values.includes(fieldValue);
        case "is_any_of":
          return values.some((value) => fieldValue === value);
        case "is_not_any_of":
          return !values.some((value) => fieldValue === value);
        case "contains": {
          const tokens = values.map((value) => String(value).trim()).filter(Boolean);
          if (tokens.length === 0) return true;
          return tokens.some((token) =>
            String(fieldValue).toLowerCase().includes(token.toLowerCase()),
          );
        }
        case "not_contains":
          return !values.some((value) =>
            String(fieldValue).toLowerCase().includes(String(value).toLowerCase()),
          );
        case "starts_with":
          return values.some((value) =>
            String(fieldValue).toLowerCase().startsWith(String(value).toLowerCase()),
          );
        case "ends_with":
          return values.some((value) =>
            String(fieldValue).toLowerCase().endsWith(String(value).toLowerCase()),
          );
        case "equals":
          return fieldValue === values[0];
        case "not_equals":
          return fieldValue !== values[0];
        case "greater_than":
          return Number(fieldValue) > Number(values[0]);
        case "less_than":
          return Number(fieldValue) < Number(values[0]);
        case "greater_than_or_equal":
          return Number(fieldValue) >= Number(values[0]);
        case "less_than_or_equal":
          return Number(fieldValue) <= Number(values[0]);
        case "between":
          if (values.length >= 2) {
            const min = Number(values[0]);
            const max = Number(values[1]);
            return Number(fieldValue) >= min && Number(fieldValue) <= max;
          }
          return true;
        case "not_between":
          if (values.length >= 2) {
            const min = Number(values[0]);
            const max = Number(values[1]);
            return Number(fieldValue) < min || Number(fieldValue) > max;
          }
          return true;
        case "empty":
          return fieldValue === "" || fieldValue == null;
        case "not_empty":
          return fieldValue !== "" && fieldValue != null;
        default:
          return true;
      }
    });
  });

  return result;
}

function renderSelectedCount(values: unknown[]) {
  if (values.length === 0) return "Select...";
  if (values.length > 1) return `${values.length} selected`;
  return null;
}

function formatCompactCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function createDefaultRenewalFilters(): Filter[] {
  return [createFilter("accountName", "contains", [""])];
}

const DEFAULT_COLUMN_ORDER = [
  "select",
  "account",
  "renewalWindow",
  "arr",
  "health",
  "usage",
  "stage",
  "risk",
  "invoiceStatus",
  "sponsorStatus",
  "region",
  "actions",
];

type TableDensity = "compact" | "comfortable";
type DisplayColumn =
  | "health"
  | "usage"
  | "stage"
  | "risk"
  | "invoiceStatus"
  | "sponsorStatus"
  | "region";

const TABLE_DENSITY_OPTIONS: { value: TableDensity; label: string }[] = [
  { value: "compact", label: "Compact" },
  { value: "comfortable", label: "Comfortable" },
];

const DISPLAY_COLUMNS: { key: DisplayColumn; label: string }[] = [
  { key: "health", label: "Health" },
  { key: "usage", label: "Usage" },
  { key: "stage", label: "Stage" },
  { key: "risk", label: "Risk" },
  { key: "invoiceStatus", label: "Invoice" },
  { key: "sponsorStatus", label: "Sponsor" },
  { key: "region", label: "Region" },
];

interface ToolbarProps {
  filters: Filter[];
  fields: FilterFieldConfig[];
  onFiltersChange: (filters: Filter[]) => void;
  onClearFilters: () => void;
  showClearButton: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  tableDensity: TableDensity;
  onTableDensityChange: (value: TableDensity) => void;
  columnsResizable: boolean;
  onColumnsResizableChange: (value: boolean) => void;
  columnsMovable: boolean;
  onColumnsMovableChange: (value: boolean) => void;
  visibleColumns: Record<DisplayColumn, boolean>;
  onToggleColumn: (columnId: DisplayColumn) => void;
}

function Toolbar({
  filters,
  fields,
  onFiltersChange,
  onClearFilters,
  showClearButton,
  searchQuery,
  onSearchChange,
  tableDensity,
  onTableDensityChange,
  columnsResizable,
  onColumnsResizableChange,
  columnsMovable,
  onColumnsMovableChange,
  visibleColumns,
  onToggleColumn,
}: ToolbarProps) {
  return (
    <div className="flex flex-col gap-3 px-5 py-3 lg:flex-row lg:items-center lg:justify-between">
      {/* Actions */}
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
        <InputGroup className="w-48">
          <InputGroupAddon align="inline-start">
            <SearchIcon className="size-4" />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery.length > 0 && (
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                size="sm"
                variant="ghost"
                className="size-6 p-0.5"
                onClick={() => onSearchChange("")}
              >
                <XIcon className="size-3.5" aria-hidden="true" />
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </InputGroup>

        <Filters
          filters={filters}
          fields={fields}
          onChange={onFiltersChange}
          size="default"
          trigger={
            <Button type="button" variant="outline" aria-label="Renewal filters">
              <FilterIcon aria-hidden="true" />
              Filters
            </Button>
          }
        />

        {showClearButton ? (
          <Button type="button" variant="outline" onClick={onClearFilters}>
            Clear filters
          </Button>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2 lg:justify-end">
        <Popover>
          <PopoverTrigger
            render={
              <Button type="button" variant="outline" aria-label="Table settings">
                <Settings2Icon className="size-4" aria-hidden="true" />
                Settings
              </Button>
            }
          />
          <PopoverContent align="end" className="w-[320px] p-0">
            <FieldGroup className="gap-3 px-3.5 py-3">
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">Table</div>
                <div className="space-y-0">
                  <Field
                    orientation="horizontal"
                    className="min-h-9 items-center justify-between gap-3"
                  >
                    <FieldLabel className="text-sm font-normal">Density</FieldLabel>
                    <Select
                      value={tableDensity}
                      onValueChange={(value) => onTableDensityChange(value as TableDensity)}
                      items={TABLE_DENSITY_OPTIONS}
                    >
                      <SelectTrigger size="sm" className="w-[132px] shrink-0">
                        <SelectValue />
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
                    <FieldLabel className="text-sm font-normal">Resizable columns</FieldLabel>
                    <Switch
                      size="sm"
                      checked={columnsResizable}
                      onCheckedChange={onColumnsResizableChange}
                    />
                  </Field>

                  <Field
                    orientation="horizontal"
                    className="min-h-9 items-center justify-between gap-3"
                  >
                    <FieldLabel className="text-sm font-normal">Movable columns</FieldLabel>
                    <Switch
                      size="sm"
                      checked={columnsMovable}
                      onCheckedChange={onColumnsMovableChange}
                    />
                  </Field>
                </div>
              </div>

              <FieldSeparator className="-mx-3.5" />

              <div className="space-y-2.5">
                <div className="text-xs font-medium text-muted-foreground">Display columns</div>
                <div className="flex flex-wrap gap-1.5">
                  {DISPLAY_COLUMNS.map((column) => {
                    const active = visibleColumns[column.key];

                    return (
                      <Button
                        key={column.key}
                        type="button"
                        size="xs"
                        variant={active ? "secondary" : "outline"}
                        className={cn("rounded-full", active && "border-foreground/10")}
                        onClick={() => onToggleColumn(column.key)}
                      >
                        {active ? <CheckIcon className="size-3.5" aria-hidden="true" /> : null}
                        {column.label}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </FieldGroup>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

export function DataTable() {
  const [renewals, setRenewals] = useState<IRenewalRecord[]>(RENEWAL_RECORDS);
  const [tableDensity, setTableDensity] = useState<TableDensity>("compact");
  const [columnsResizable, setColumnsResizable] = useState(true);
  const [columnsMovable, setColumnsMovable] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "renewalWindow", desc: false },
    { id: "arr", desc: true },
  ]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    health: true,
    stage: true,
    risk: true,
    usage: false,
    invoiceStatus: false,
    sponsorStatus: false,
    region: false,
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnOrder, setColumnOrder] = useState(DEFAULT_COLUMN_ORDER);
  const [filters, setFilters] = useState<Filter[]>(createDefaultRenewalFilters);
  const [searchQuery, setSearchQuery] = useState("");
  const [bulkOwnerValue, setBulkOwnerValue] = useState(RENEWAL_OWNERS[0].value);
  const [bulkStageValue, setBulkStageValue] = useState<RenewalStage>("Commercial review");

  const filterFields: FilterFieldConfig[] = useMemo(
    () => [
      {
        key: "accountName",
        label: "Account",
        icon: <Building2Icon className="size-3.5" aria-hidden="true" />,
        type: "text",
        className: "w-[200px]",
        placeholder: "Search...",
      },
      {
        key: "segment",
        label: "Segment",
        icon: <LayersIcon className="size-3.5" aria-hidden="true" />,
        type: "select",
        searchable: false,
        className: "w-[160px]",
        options: RENEWAL_SEGMENT_ORDER.map((segment) => ({
          value: segment,
          label: segment,
        })),
      },
      {
        key: "stage",
        label: "Stage",
        icon: <GitBranchIcon className="size-3.5" aria-hidden="true" />,
        type: "select",
        searchable: false,
        className: "w-[180px]",
        options: RENEWAL_STAGE_ORDER.map((stage) => ({
          value: stage,
          label: stage,
        })),
        customValueRenderer: (values) => {
          const state = renderSelectedCount(values);
          if (state) return state;
          return <StageBadge stage={values[0] as RenewalStage} />;
        },
      },
      {
        key: "risk",
        label: "Risk",
        icon: <TriangleAlertIcon className="size-3.5" aria-hidden="true" />,
        type: "select",
        searchable: false,
        className: "w-[140px]",
        options: RENEWAL_RISK_ORDER.map((risk) => ({
          value: risk,
          label: risk,
        })),
        customValueRenderer: (values) => {
          const state = renderSelectedCount(values);
          if (state) return state;
          return <RiskBadge risk={values[0] as RenewalRisk} />;
        },
      },
      {
        key: "renewalWindow",
        label: "Renewal window",
        icon: <CalendarClockIcon className="size-3.5" aria-hidden="true" />,
        type: "select",
        searchable: false,
        className: "w-[170px]",
        options: RENEWAL_WINDOW_OPTIONS.map((option) => ({
          value: option.value,
          label: option.label,
        })),
      },
      {
        key: "ownerName",
        label: "Owner",
        icon: <UserRoundIcon className="size-3.5" aria-hidden="true" />,
        type: "select",
        searchable: false,
        className: "w-[170px]",
        options: RENEWAL_OWNERS.map((owner) => ({
          value: owner.label,
          label: owner.label,
        })),
      },
    ],
    [],
  );

  const filteredData = useMemo(() => {
    const filterResult = applyFiltersToData(renewals, filters);

    // Apply search query
    if (!searchQuery) {
      return filterResult;
    }

    const searchLower = searchQuery.toLowerCase();
    return filterResult.filter((item) =>
      Object.values(item).join(" ").toLowerCase().includes(searchLower),
    );
  }, [filters, renewals, searchQuery]);
  const visibleColumns = useMemo<Record<DisplayColumn, boolean>>(
    () => ({
      health: columnVisibility.health !== false,
      usage: columnVisibility.usage !== false,
      stage: columnVisibility.stage !== false,
      risk: columnVisibility.risk !== false,
      invoiceStatus: columnVisibility.invoiceStatus !== false,
      sponsorStatus: columnVisibility.sponsorStatus !== false,
      region: columnVisibility.region !== false,
    }),
    [columnVisibility],
  );

  const dueInThirtyCount = useMemo(
    () => filteredData.filter((renewal) => renewal.daysToRenewal <= 30).length,
    [filteredData],
  );

  const blockerCount = useMemo(
    () =>
      filteredData.filter(
        (renewal) => renewal.invoiceStatus !== "Ready" || renewal.sponsorStatus !== "Confirmed",
      ).length,
    [filteredData],
  );

  const arrAtRisk = useMemo(
    () =>
      filteredData.reduce(
        (total, renewal) =>
          renewal.risk === "High" || renewal.risk === "Critical" ? total + renewal.arr : total,
        0,
      ),
    [filteredData],
  );

  const handleOpenAccount = useCallback((renewal: IRenewalRecord) => {
    toast.info("Open account workspace", {
      description: `${renewal.accountName} · ${renewal.ownerName}`,
    });
  }, []);

  const handleCreateBrief = useCallback((renewal: IRenewalRecord) => {
    toast.success("Renewal brief created", {
      description: `${renewal.accountName} is ready for executive review.`,
    });
  }, []);

  const handleEscalateReview = useCallback((renewal: IRenewalRecord) => {
    setRenewals((current) =>
      current.map((record) =>
        record.id === renewal.id
          ? {
              ...record,
              risk: "Critical",
              stage: record.stage === "Committed" ? record.stage : "Legal review",
            }
          : record,
      ),
    );

    toast.success("Exec escalation created", {
      description: `${renewal.accountName} moved into an urgent board-review track.`,
    });
  }, []);

  const columns = useMemo(
    () =>
      createRenewalColumns({
        onOpenAccount: handleOpenAccount,
        onCreateBrief: handleCreateBrief,
        onEscalateReview: handleEscalateReview,
      }),
    [handleCreateBrief, handleEscalateReview, handleOpenAccount],
  );

  const table = useReactTable({
    columns,
    data: filteredData,
    getRowId: (row) => row.id,
    state: {
      sorting,
      columnVisibility,
      columnOrder,
      rowSelection,
    },
    enableRowSelection: true,
    columnResizeMode: "onChange",
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const selectedRows = table.getSelectedRowModel().rows.map((row) => row.original.id);

  const selectedCount = selectedRows.length;
  const showClearButton = filters.length > 0;

  const handleFiltersChange = useCallback((nextFilters: Filter[]) => {
    setFilters(nextFilters);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters(createDefaultRenewalFilters());
  }, []);

  const handleClearSelection = useCallback(() => {
    setRowSelection({});
  }, []);

  const handleToggleColumn = useCallback((columnId: DisplayColumn) => {
    setColumnVisibility((current) => ({
      ...current,
      [columnId]: current[columnId] === false,
    }));
  }, []);

  const handleApplySelected = useCallback(() => {
    if (selectedRows.length === 0) return;

    const nextOwner = RENEWAL_OWNERS.find((owner) => owner.value === bulkOwnerValue);
    if (!nextOwner) return;

    setRenewals((current) =>
      current.map((renewal) =>
        selectedRows.includes(renewal.id)
          ? {
              ...renewal,
              ownerName: nextOwner.label,
              ownerAvatar: nextOwner.avatar,
              stage: bulkStageValue,
            }
          : renewal,
      ),
    );

    setRowSelection({});
    toast.success("Renewals updated", {
      description: `${selectedRows.length} account${selectedRows.length === 1 ? "" : "s"} moved to ${nextOwner.label} and ${bulkStageValue}.`,
    });
  }, [bulkOwnerValue, bulkStageValue, selectedRows]);

  return (
    <DataGrid
      table={table}
      recordCount={filteredData.length}
      emptyMessage="No renewals match this view. Clear filters or widen the search."
      tableLayout={{
        columnsResizable,
        columnsMovable,
        columnsVisibility: true,
        dense: tableDensity === "compact",
        width: "auto",
      }}
    >
      <Card className={cn("w-full gap-0 p-0")}>
        {/* Header */}
        <CardHeader className="flex flex-row items-center justify-between gap-4 border-b px-5 py-4">
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <CardTitle>Renewals Review</CardTitle>
            <CardDescription className="text-xs">{`${dueInThirtyCount} due in 30d, ${blockerCount} blocked, ${formatCompactCurrency(arrAtRisk)} ARR at risk.`}</CardDescription>
          </div>
          <CardAction className="self-center">
            <Button
              type="button"
              size="sm"
              onClick={() =>
                toast.success("Transaction started", {
                  description: "New renewal entry opened.",
                })
              }
            >
              <PlusIcon aria-hidden="true" />
              New transaction
            </Button>
          </CardAction>
        </CardHeader>

        {/* Content */}
        <CardContent className={cn("p-0")}>
          <Toolbar
            filters={filters}
            fields={filterFields}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
            showClearButton={showClearButton}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            tableDensity={tableDensity}
            onTableDensityChange={setTableDensity}
            columnsResizable={columnsResizable}
            onColumnsResizableChange={setColumnsResizable}
            columnsMovable={columnsMovable}
            onColumnsMovableChange={setColumnsMovable}
            visibleColumns={visibleColumns}
            onToggleColumn={handleToggleColumn}
          />

          {selectedCount > 0 ? (
            <SelectionBar
              selectedCount={selectedCount}
              ownerValue={bulkOwnerValue}
              stageValue={bulkStageValue}
              ownerOptions={RENEWAL_OWNERS}
              onOwnerChange={setBulkOwnerValue}
              onStageChange={setBulkStageValue}
              onApply={handleApplySelected}
              onClear={handleClearSelection}
            />
          ) : (
            <Separator />
          )}

          <DataGridScrollArea className="h-[540px]">
            <DataGridTable />
          </DataGridScrollArea>
        </CardContent>
      </Card>
    </DataGrid>
  );
}
