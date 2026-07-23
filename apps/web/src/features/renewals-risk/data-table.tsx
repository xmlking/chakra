// oxlint-disable typescript/no-base-to-string
"use client";
"use no memo";

import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type PaginationState,
  type RowPinningState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { Badge } from "@workspace/ui/components/reui/badge";
import { DataGrid, DataGridContainer } from "@workspace/ui/components/reui/data-grid/data-grid";
import { DataGridPagination } from "@workspace/ui/components/reui/data-grid/data-grid-pagination";
import { DataGridScrollArea } from "@workspace/ui/components/reui/data-grid/data-grid-scroll-area";
import { DataGridTable } from "@workspace/ui/components/reui/data-grid/data-grid-table";
import {
  createFilter,
  Filters,
  type Filter,
  type FilterFieldConfig,
} from "@workspace/ui/components/reui/filters";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/shadcn/avatar";
import { Button } from "@workspace/ui/components/shadcn/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
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
  Building2Icon,
  UserRoundIcon,
  GitBranchIcon,
  TriangleAlertIcon,
  BellRingIcon,
  PlusIcon,
  FilterIcon,
  Settings2Icon,
  CheckIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import { createRenewalRiskColumns } from "./columns";
import {
  ALERT_STATES,
  DEFAULT_PINNED_RENEWAL_IDS,
  getRenewalSearchBlob,
  RENEWAL_OWNERS,
  RENEWAL_RISKS,
  RENEWAL_STAGES,
  RISK_TAGS,
  type IRenewalRiskRecord,
  type RenewalStage,
  type RiskTag,
} from "./data";

const DEFAULT_COLUMN_ORDER = [
  "pin",
  "account",
  "stage",
  "owner",
  "signals",
  "health",
  "arr",
  "renewalWindow",
  "alerts",
  "actions",
];

type TableDensity = "compact" | "comfortable";
type DisplayProperty =
  | "stage"
  | "owner"
  | "signals"
  | "health"
  | "arr"
  | "renewalWindow"
  | "alerts";

const TABLE_DENSITY_OPTIONS: { value: TableDensity; label: string }[] = [
  { value: "compact", label: "Compact" },
  { value: "comfortable", label: "Comfortable" },
];

const DISPLAY_PROPERTIES: { key: DisplayProperty; label: string }[] = [
  { key: "stage", label: "Stage" },
  { key: "owner", label: "Owner" },
  { key: "signals", label: "Signals" },
  { key: "health", label: "Health" },
  { key: "arr", label: "ARR" },
  { key: "renewalWindow", label: "Renewal" },
  { key: "alerts", label: "Alerts" },
];

const stageDotClass: Record<RenewalStage, string> = {
  "Save Plan": "bg-rose-500",
  "Executive Review": "bg-amber-500",
  "Commercial Review": "bg-sky-500",
  "Security Review": "bg-violet-500",
  "Legal Review": "bg-orange-500",
  Procurement: "bg-cyan-500",
  "Verbal Commit": "bg-emerald-500",
};

const signalBadgeClass: Record<RiskTag, string> = {
  "Champion Change": "bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300",
  "Usage Dip": "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
  "Security Review": "bg-violet-100 text-violet-800 dark:bg-violet-950/50 dark:text-violet-300",
  Procurement: "bg-cyan-100 text-cyan-800 dark:bg-cyan-950/50 dark:text-cyan-300",
  "Pricing Pushback": "bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300",
  "Legal Redlines": "bg-orange-100 text-orange-800 dark:bg-orange-950/50 dark:text-orange-300",
  "Expansion Delay": "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300",
  "Executive Sponsor Gap": "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300",
  "Adoption Plateau": "bg-lime-100 text-lime-800 dark:bg-lime-950/50 dark:text-lime-300",
  "Multi-Year Ask": "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCompactCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function getActiveFilters(filters: Filter[]) {
  return filters.filter((filter) => {
    const { operator, values } = filter;

    if (operator === "empty" || operator === "not_empty") return true;
    if (!values || values.length === 0) return false;

    if (values.every((value) => typeof value === "string" && value.trim() === "")) {
      return false;
    }

    if (values.every((value) => value == null)) return false;

    if (values.every((value) => Array.isArray(value) && value.length === 0)) {
      return false;
    }

    return true;
  });
}

function filterFieldValue(item: IRenewalRiskRecord, field: string): unknown {
  switch (field) {
    case "account":
      return getRenewalSearchBlob(item);
    case "owner":
      return item.owner.name;
    case "signals":
      return item.signals;
    default:
      return item[field as keyof IRenewalRiskRecord];
  }
}

function applyFiltersToData(data: IRenewalRiskRecord[], filters: Filter[]) {
  const active = getActiveFilters(filters);

  return active.reduce(
    (result, filter) => {
      const { field, operator, values } = filter;

      return result.filter((item) => {
        const raw = filterFieldValue(item, field);

        if (Array.isArray(raw)) {
          switch (operator) {
            case "is_any_of":
              return values.some((value) => raw.includes(value as RiskTag));
            case "is_not_any_of":
              return !values.some((value) => raw.includes(value as RiskTag));
            case "includes_all":
              return values.every((value) => raw.includes(value as RiskTag));
            case "excludes_all":
              return values.every((value) => !raw.includes(value as RiskTag));
            case "empty":
              return raw.length === 0;
            case "not_empty":
              return raw.length > 0;
            default:
              return true;
          }
        }

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
          case "empty":
            return fieldValue === "" || fieldValue == null;
          case "not_empty":
            return fieldValue !== "" && fieldValue != null;
          default:
            return true;
        }
      });
    },
    [...data],
  );
}

function createDefaultRenewalFilters(): Filter[] {
  return [createFilter("account", "contains", [""])];
}

function renderSelectedCount(values: unknown[]) {
  if (values.length === 0) return "Select...";
  if (values.length > 1) return `${values.length} selected`;
  return null;
}

function sanitizeRowPinning(
  rowPinning: RowPinningState,
  data: IRenewalRiskRecord[],
): RowPinningState {
  const validIds = new Set(data.map((item) => item.id));

  return {
    top: (rowPinning.top ?? []).filter((id) => validIds.has(String(id))),
    bottom: (rowPinning.bottom ?? []).filter((id) => validIds.has(String(id))),
  };
}

export function DataTable() {
  const [tableDensity, setTableDensity] = useState<TableDensity>("compact");
  const [columnsResizable, setColumnsResizable] = useState(true);
  const [columnsMovable, setColumnsMovable] = useState(true);
  const [visibleProperties, setVisibleProperties] = useState<Record<DisplayProperty, boolean>>({
    stage: true,
    owner: true,
    signals: true,
    health: true,
    arr: true,
    renewalWindow: true,
    alerts: true,
  });
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([{ id: "renewalWindow", desc: false }]);
  const [rowPinning, setRowPinning] = useState<RowPinningState>({
    top: DEFAULT_PINNED_RENEWAL_IDS,
    bottom: [],
  });
  const [filters, setFilters] = useState<Filter[]>(createDefaultRenewalFilters);
  const [searchQuery, setSearchQuery] = useState("");

  const activeFilters = useMemo(() => getActiveFilters(filters), [filters]);

  const filteredRenewals = useMemo(() => {
    const filterResult = applyFiltersToData(RENEWAL_RISKS, filters);

    // Apply search query
    if (!searchQuery) {
      return filterResult;
    }

    const searchLower = searchQuery.toLowerCase();
    return filterResult.filter((item) =>
      Object.values(item).join(" ").toLowerCase().includes(searchLower),
    );
  }, [filters, searchQuery]);

  const visibleRowPinning = useMemo(
    () => sanitizeRowPinning(rowPinning, filteredRenewals),
    [filteredRenewals, rowPinning],
  );

  const columnVisibility = useMemo<VisibilityState>(
    () => ({
      stage: visibleProperties.stage,
      owner: visibleProperties.owner,
      signals: visibleProperties.signals,
      health: visibleProperties.health,
      arr: visibleProperties.arr,
      renewalWindow: visibleProperties.renewalWindow,
      alerts: visibleProperties.alerts,
    }),
    [visibleProperties],
  );

  const resetPagination = useCallback(() => {
    setPagination((current) => (current.pageIndex === 0 ? current : { ...current, pageIndex: 0 }));
  }, []);

  const handleFiltersChange = useCallback(
    (nextFilters: Filter[]) => {
      setFilters(nextFilters);
      resetPagination();
    },
    [resetPagination],
  );

  const toggleProperty = useCallback((property: DisplayProperty) => {
    setVisibleProperties((current) => ({
      ...current,
      [property]: !current[property],
    }));
  }, []);

  const columns = useMemo(
    () =>
      createRenewalRiskColumns({
        onAction: (action, renewal) => {
          if (action === "open") {
            toast.info("Open account workspace", {
              description: `${renewal.account} · ${renewal.productLine}`,
            });
            return;
          }

          if (action === "save_plan") {
            toast.success("Save plan assigned", {
              description: `${renewal.account} is now routed into the rescue motion for ${renewal.owner.name}.`,
            });
            return;
          }

          toast.message("Executive review scheduled", {
            description: `${renewal.account} has been queued for the next renewals escalation review.`,
          });
        },
      }),
    [],
  );

  const table = useReactTable({
    data: filteredRenewals,
    columns,
    state: {
      sorting,
      pagination,
      columnVisibility,
      rowPinning: visibleRowPinning,
    },
    initialState: {
      columnOrder: DEFAULT_COLUMN_ORDER,
    },
    getRowId: (row) => row.id,
    enableRowPinning: true,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onRowPinningChange: setRowPinning,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const ownerOptions = useMemo(
    () =>
      RENEWAL_OWNERS.map((owner) => ({
        value: owner.name,
        label: owner.name,
        icon: (
          <Avatar className="size-5">
            <AvatarImage src={owner.avatar} alt={owner.name} />
            <AvatarFallback>{owner.initials}</AvatarFallback>
          </Avatar>
        ),
      })),
    [],
  );

  const stageOptions = useMemo(
    () =>
      RENEWAL_STAGES.map((stage) => ({
        value: stage,
        label: stage,
        icon: (
          <span
            className={cn("size-2 shrink-0 rounded-full", stageDotClass[stage])}
            aria-hidden="true"
          />
        ),
      })),
    [],
  );

  const signalOptions = useMemo(
    () =>
      RISK_TAGS.map((signal) => ({
        value: signal,
        label: signal,
      })),
    [],
  );

  const alertOptions = useMemo(
    () =>
      ALERT_STATES.map((state) => ({
        value: state,
        label: state,
      })),
    [],
  );

  const filterFields: FilterFieldConfig[] = useMemo(
    () => [
      {
        key: "account",
        label: "Account",
        icon: <Building2Icon className="size-3.5" aria-hidden="true" />,
        type: "text",
        className: "w-40",
        placeholder: "Search...",
      },
      {
        key: "owner",
        label: "Owner",
        icon: <UserRoundIcon className="size-3.5" aria-hidden="true" />,
        type: "select",
        searchable: true,
        className: "w-44",
        options: ownerOptions,
        customValueRenderer: (values, options) => {
          const state = renderSelectedCount(values);
          if (state) return state;

          const option = options.find((item) => item.value === values[0]);
          if (!option) return String(values[0]);

          return (
            <div className="flex items-center gap-2">
              {option.icon}
              <span className="truncate">{option.label}</span>
            </div>
          );
        },
      },
      {
        key: "stage",
        label: "Stage",
        icon: <GitBranchIcon className="size-3.5" aria-hidden="true" />,
        type: "select",
        searchable: false,
        className: "w-44",
        options: stageOptions,
        customValueRenderer: (values) => {
          const state = renderSelectedCount(values);
          if (state) return state;

          const stage = values[0] as RenewalStage;

          return (
            <Badge variant="outline">
              <span
                className={cn("size-1.5 shrink-0 rounded-full!", stageDotClass[stage])}
                aria-hidden="true"
              />
              {stage}
            </Badge>
          );
        },
      },
      {
        key: "signals",
        label: "Signals",
        icon: <TriangleAlertIcon className="size-3.5" aria-hidden="true" />,
        type: "multiselect",
        searchable: true,
        className: "w-44",
        options: signalOptions,
        customValueRenderer: (values) => {
          const state = renderSelectedCount(values);
          if (state) return state;

          const signal = values[0] as RiskTag;

          return (
            <Badge variant="secondary" className={cn("border-0", signalBadgeClass[signal])}>
              {signal}
            </Badge>
          );
        },
      },
      {
        key: "alertState",
        label: "Alerts",
        icon: <BellRingIcon className="size-3.5" aria-hidden="true" />,
        type: "select",
        searchable: false,
        className: "w-36",
        options: alertOptions,
      },
    ],
    [alertOptions, ownerOptions, signalOptions, stageOptions],
  );

  const totalArr = useMemo(() => RENEWAL_RISKS.reduce((sum, renewal) => sum + renewal.arr, 0), []);
  const criticalCount = useMemo(
    () => RENEWAL_RISKS.filter((renewal) => renewal.alertState === "Critical").length,
    [],
  );
  const nextThirtyDaysCount = useMemo(
    () => RENEWAL_RISKS.filter((renewal) => renewal.daysToRenewal <= 30).length,
    [],
  );

  const visiblePinnedRenewals = useMemo(() => {
    const pinnedIds = new Set(visibleRowPinning.top ?? []);
    return filteredRenewals.filter((renewal) => pinnedIds.has(renewal.id));
  }, [filteredRenewals, visibleRowPinning.top]);
  const visiblePinnedArr = useMemo(
    () => visiblePinnedRenewals.reduce((sum, renewal) => sum + renewal.arr, 0),
    [visiblePinnedRenewals],
  );

  return (
    <DataGrid
      table={table}
      recordCount={filteredRenewals.length}
      emptyMessage="No renewals match this queue view. Clear filters or widen the risk scope."
      tableLayout={{
        columnsPinnable: true,
        columnsResizable,
        columnsMovable,
        columnsVisibility: true,
        dense: tableDensity === "compact",
        width: "auto",
      }}
    >
      {/* Card */}
      <Card className={cn("w-full gap-0 p-0")}>
        {/* Header */}
        <CardHeader className="gap-1 border-b px-5 py-4">
          <CardTitle>Renewals Risk</CardTitle>
          <CardDescription className="text-xs">
            <span className="inline-flex flex-wrap items-center gap-1.5">
              <span>{RENEWAL_RISKS.length} renewals</span>
              <span className="size-1 shrink-0 rounded-full bg-input" aria-hidden />
              <span>{formatCompactCurrency(totalArr)} ARR</span>
              <span className="size-1 shrink-0 rounded-full bg-input" aria-hidden />
              <span>{criticalCount} critical</span>
              <span className="size-1 shrink-0 rounded-full bg-input" aria-hidden />
              <span>{nextThirtyDaysCount} in 30d</span>
            </span>
          </CardDescription>
          <CardAction className="self-center">
            <Button
              type="button"
              onClick={() =>
                toast.success("Save plan drafted", {
                  description:
                    "Connect this action to your renewals workspace or escalation workflow.",
                })
              }
            >
              <PlusIcon aria-hidden="true" />
              Create save plan
            </Button>
          </CardAction>
        </CardHeader>

        {/* Content */}
        <CardContent className={cn("p-0")}>
          <div className="px-5 py-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <InputGroup className="w-48">
                  <InputGroupAddon align="inline-start">
                    <SearchIcon className="size-4" />
                  </InputGroupAddon>
                  <InputGroupInput
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery.length > 0 && (
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        size="sm"
                        variant="ghost"
                        className="size-6 p-0.5"
                        onClick={() => setSearchQuery("")}
                      >
                        <XIcon className="size-3.5" aria-hidden="true" />
                      </InputGroupButton>
                    </InputGroupAddon>
                  )}
                </InputGroup>

                <Filters
                  filters={filters}
                  fields={filterFields}
                  onChange={handleFiltersChange}
                  trigger={
                    <Button
                      type="button"
                      variant={activeFilters.length > 0 ? "secondary" : "outline"}
                      aria-label="Filters"
                    >
                      <FilterIcon aria-hidden="true" />
                      Filters
                      {activeFilters.length > 0 ? (
                        <Badge size="sm" variant="secondary" radius="full">
                          {activeFilters.length}
                        </Badge>
                      ) : null}
                    </Button>
                  }
                />

                {activeFilters.length > 0 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => handleFiltersChange(createDefaultRenewalFilters())}
                  >
                    Clear
                  </Button>
                ) : null}
              </div>

              <Popover>
                <PopoverTrigger
                  render={
                    <Button type="button" variant="outline">
                      <Settings2Icon aria-hidden="true" />
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
                            onValueChange={(value) => setTableDensity(value as TableDensity)}
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
                            onCheckedChange={setColumnsResizable}
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
                            onCheckedChange={setColumnsMovable}
                          />
                        </Field>
                      </div>
                    </div>

                    <FieldSeparator className="-mx-3.5" />

                    <div className="space-y-2.5">
                      <div className="text-xs font-medium text-muted-foreground">
                        Display columns
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {DISPLAY_PROPERTIES.map((property) => {
                          const active = visibleProperties[property.key];

                          return (
                            <Button
                              key={property.key}
                              type="button"
                              size="xs"
                              variant={active ? "secondary" : "outline"}
                              className={cn("rounded-full", active && "border-foreground/10")}
                              onClick={() => toggleProperty(property.key)}
                            >
                              {active ? (
                                <CheckIcon className="size-3.5" aria-hidden="true" />
                              ) : null}
                              {property.label}
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

          <Separator />

          {visiblePinnedRenewals.length > 0 ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2 bg-muted/30 px-5 py-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                    Pinned risk
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {visiblePinnedRenewals.length} renewals stay on top
                  </span>
                </div>
                <span className="text-xs font-medium text-foreground tabular-nums">
                  {formatCurrency(visiblePinnedArr)} ARR pinned
                </span>
              </div>
              <Separator />
            </>
          ) : null}

          <DataGridContainer border={false}>
            <DataGridScrollArea>
              <DataGridTable />
            </DataGridScrollArea>
          </DataGridContainer>
        </CardContent>

        <CardFooter className={cn("border-t px-5 py-3")}>
          <div className="flex w-full justify-end">
            <DataGridPagination />
          </div>
        </CardFooter>
      </Card>
    </DataGrid>
  );
}
