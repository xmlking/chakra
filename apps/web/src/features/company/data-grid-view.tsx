"use no memo";

import {
  useTable,
  type ColumnOrderState,
  type ColumnPinningState,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table";
import { DataGrid, dataGridFeatures } from "@workspace/ui/components/reui/data-grid/data-grid";
import { DataGridPagination } from "@workspace/ui/components/reui/data-grid/data-grid-pagination";
import { DataGridScrollArea } from "@workspace/ui/components/reui/data-grid/data-grid-scroll-area";
import { DataGridTable } from "@workspace/ui/components/reui/data-grid/data-grid-table";
import { Filters } from "@workspace/ui/components/reui/filters/filters";
import {
  createFilterQuery,
  createFilterRule,
  flattenFilterConditions,
  isFilterRule,
  type FilterCondition,
} from "@workspace/ui/components/reui/filters/filters-query";
import type { FilterField, FilterQuery } from "@workspace/ui/components/reui/filters/filters-types";
import {
  Frame,
  FrameDescription,
  FrameFooter,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@workspace/ui/components/reui/frame";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/shadcn/alert-dialog";
import { Button } from "@workspace/ui/components/shadcn/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@workspace/ui/components/shadcn/field";
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
import { PlusIcon, FilterIcon, Settings2Icon, RotateCcwIcon, Trash2Icon } from "lucide-react";
/**
 * CRM Companies grid: toolbar -> DataGrid, with the header cascader editing the
 * column set and the sheets owning record CRUD. Customize data.tsx first.
 */
import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";

import {
  ACTIONS_COLUMN_ID,
  createCompanyColumns,
  getAttributeValue,
  priorityConfig,
  SELECT_COLUMN_ID,
  stageDotClass,
  statusConfig,
  TAIL_COLUMN_IDS,
} from "./columns";
import {
  ATTRIBUTE_BY_ID,
  ATTRIBUTE_FILTER_TYPE,
  ATTRIBUTE_TYPE_ICONS,
  ATTRIBUTE_TYPE_LABELS,
  COMPANIES,
  DEFAULT_ATTRIBUTE_IDS,
  getCompanySearchBlob,
  IDENTITY_ATTRIBUTE_ID,
  LOCKED_ATTRIBUTE_IDS,
  type AttributeType,
  type CompanyAttribute,
  type CompanyRowAction,
  type ICompany,
} from "./data";
import { AddColumnCascader } from "./ui/add-column-cascader";
import { CompanyCreateDialog, type CompanyFormValues } from "./ui/company-create-dialog";
import { CompanyDetailsSheet } from "./ui/company-details-sheet";

type TableDensity = "compact" | "comfortable";

/** One confirm dialog serves the row menu and the bulk bar. */
type PendingDelete = { kind: "row"; company: ICompany } | { kind: "bulk"; ids: string[] };

const TABLE_DENSITY_OPTIONS: { value: TableDensity; label: string }[] = [
  { value: "compact", label: "Compact" },
  { value: "comfortable", label: "Comfortable" },
];

/**
 * An ORDERING lock, not an affordance: `columnsPinnable` stays off so neither
 * gutter is sticky, and the pinned buckets stop a Move walking past them.
 */
const CONTROL_COLUMN_PINNING: ColumnPinningState = {
  start: [SELECT_COLUMN_ID],
  end: [ACTIONS_COLUMN_ID],
};

const INITIAL_ATTRIBUTE_IDS = [
  LOCKED_ATTRIBUTE_IDS[0],
  LOCKED_ATTRIBUTE_IDS[1],
  LOCKED_ATTRIBUTE_IDS[2],
  ...DEFAULT_ATTRIBUTE_IDS,
];

/**
 * The one default row: Company | contains | empty. It stands in for a search
 * box and stays inactive until typed into (see getActiveFilters).
 */
function createDefaultCompanyFilters(): FilterQuery {
  return createFilterQuery([
    createFilterRule({
      id: "company-name-1",
      path: [IDENTITY_ATTRIBUTE_ID],
      operator: "contains",
      value: "",
    }),
  ]);
}

// ── Filter helpers ──

function getActiveFilters(filters: FilterCondition[]) {
  return filters.filter((filter) => {
    const { operator, values } = filter;
    // `empty` and `not_empty` carry no value at all, so the checks below would
    // throw the whole condition away.
    if (operator === "empty" || operator === "not_empty") return true;
    if (!values || values.length === 0) return false;
    if (values.every((value) => typeof value === "string" && value.trim() === "")) return false;
    if (values.every((value) => value == null)) return false;
    return true;
  });
}

/**
 * Filters read the SAME accessor the columns render from, so a column added by
 * the picker is filterable on the identical value with no second mapping.
 */
function companyFilterValue(company: ICompany, attributeId: string): unknown {
  // The identity field doubles as the grid's search box, so it matches the
  // whole record rather than only the name.
  if (attributeId === IDENTITY_ATTRIBUTE_ID) return getCompanySearchBlob(company);
  return getAttributeValue(company, attributeId);
}

/** `null` means the condition places no constraint, so a negated rule keeps the row. */
function matchFilterValue(
  fieldValue: unknown,
  operator: string,
  values: unknown[],
): boolean | null {
  const list = Array.isArray(fieldValue) ? fieldValue.map(String) : null;
  const num = Number(fieldValue);
  const bound = (index: number) => Number(values[index]);

  switch (operator) {
    // text + select
    case "is":
    case "is_any_of":
      return values.some((value) => String(value) === String(fieldValue));
    case "is_not":
    case "is_none_of":
      return !values.some((value) => String(value) === String(fieldValue));
    case "contains": {
      const tokens = values.map((value) => String(value).trim()).filter(Boolean);
      if (tokens.length === 0) return null;
      return tokens.some((token) => String(fieldValue).toLowerCase().includes(token.toLowerCase()));
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

    // multiselect
    case "has_any_of":
      return list ? values.some((value) => list.includes(String(value))) : false;
    case "has_all_of":
      return list ? values.every((value) => list.includes(String(value))) : false;
    case "has_none_of":
      return list ? !values.some((value) => list.includes(String(value))) : true;

    // number
    case "eq":
      return num === bound(0);
    case "neq":
      return num !== bound(0);
    case "gt":
      return num > bound(0);
    case "gte":
      return num >= bound(0);
    case "lt":
      return num < bound(0);
    case "lte":
      return num <= bound(0);
    case "between":
      return num >= bound(0) && num <= bound(1);
    case "not_between":
      return num < bound(0) || num > bound(1);

    case "empty":
      return fieldValue === "" || fieldValue == null || list?.length === 0;
    case "not_empty":
      return fieldValue !== "" && fieldValue != null && list?.length !== 0;
    default:
      return null;
  }
}

function applyFilters(data: ICompany[], filters: FilterCondition[]) {
  const active = getActiveFilters(filters);
  let result = [...data];

  active.forEach(({ field, operator, values, negated }) => {
    result = result.filter((company) => {
      const raw = companyFilterValue(company, field);
      const matched = matchFilterValue(raw ?? "", operator, values);
      if (matched === null) return true;
      return negated ? !matched : matched;
    });
  });

  return result;
}

/** Colored dots per option, mirroring the cell badges without duplicating text. */
const FILTER_OPTION_DOTS: Record<string, Record<string, string>> = {
  "deal-stage": stageDotClass,
  "lifecycle-status": Object.fromEntries(
    Object.entries(statusConfig).map(([key, config]) => [key, config.dot]),
  ),
  "lifecycle-priority": Object.fromEntries(
    Object.entries(priorityConfig).map(([key, config]) => [key, config.dot]),
  ),
};

/** Distinct values an attribute actually takes across the records on screen. */
function collectOptions(companies: ICompany[], attributeId: string): string[] {
  const seen = new Set<string>();
  companies.forEach((company) => {
    const raw = getAttributeValue(company, attributeId);
    if (Array.isArray(raw)) {
      raw.forEach((entry) => entry != null && seen.add(String(entry)));
      return;
    }
    // oxlint-disable-next-line typescript/no-base-to-string
    if (raw !== null && raw !== undefined && raw !== "") seen.add(String(raw));
  });
  return [...seen].sort();
}

/** Picker rows use a dot, not the cell badge, so the label is not duplicated. */
function OptionDot({ className }: { className: string }) {
  return <span aria-hidden="true" className={cn("size-1.5 shrink-0 rounded-full", className)} />;
}

function renderSelectedFilterOption(
  values: unknown[],
  options: { value: unknown; label: string; icon?: ReactNode }[],
) {
  if (values.length === 0) return "Select...";
  if (values.length > 1) return `${values.length} selected`;

  const option = options.find((item) => item.value === values[0]);
  if (!option) return String(values[0]);

  return (
    <span className="flex min-w-0 items-center gap-1.5">
      {option.icon}
      <span className="truncate">{option.label}</span>
    </span>
  );
}

// ── View ──

export function DataGridView() {
  const [companies, setCompanies] = useState<ICompany[]>(COMPANIES);
  const [visibleAttributeIds, setVisibleAttributeIds] = useState<string[]>(INITIAL_ATTRIBUTE_IDS);
  const [createdAttributes, setCreatedAttributes] = useState<CompanyAttribute[]>([]);
  const [filterQuery, setFilterQuery] = useState<FilterQuery>(createDefaultCompanyFilters);
  const [tableDensity, setTableDensity] = useState<TableDensity>("comfortable");
  const [columnLines, setColumnLines] = useState(false);
  const [rowStripes, setRowStripes] = useState(false);
  const [showTypeIcons, setShowTypeIcons] = useState(true);
  const [columnsResizable, setColumnsResizable] = useState(true);
  const [columnsMovable, setColumnsMovable] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    // Must be one of DataGridPagination's `sizes` ([5,10,25,50,100]): the radix
    // Select mirrors the matching item's text, so an unlisted size renders blank.
    pageSize: 10,
  });
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>(CONTROL_COLUMN_PINNING);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  // Monotonic and never reused: a length- or suffix-derived id collides after
  // duplicate/delete. A ref, not state, so column defs are not rebuilt per add.
  const idSeqRef = useRef(0);
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);
  // Bumped only when a prune actually drops rules; see the Filters key below.
  const [pruneSeq, setPruneSeq] = useState(0);

  const filterConditions = useMemo(() => flattenFilterConditions(filterQuery), [filterQuery]);

  const resetPagination = useCallback(() => {
    setPagination((current) => (current.pageIndex === 0 ? current : { ...current, pageIndex: 0 }));
  }, []);

  // ── Attributes ──

  const createdById = useMemo(
    () => new Map(createdAttributes.map((attribute) => [attribute.id, attribute])),
    [createdAttributes],
  );

  const attributes = useMemo(
    () =>
      visibleAttributeIds
        .map((id) => ATTRIBUTE_BY_ID.get(id) ?? createdById.get(id))
        .filter((attribute): attribute is CompanyAttribute => Boolean(attribute)),
    [visibleAttributeIds, createdById],
  );

  const pickerValue = visibleAttributeIds;

  const handleAttributesChange = useCallback(
    (next: string[]) => {
      const selected = new Set(next);
      LOCKED_ATTRIBUTE_IDS.forEach((id) => selected.add(id));

      setVisibleAttributeIds((current) => {
        const kept = current.filter((id) => selected.has(id));
        const added = [...selected].filter((id) => !kept.includes(id));
        return [...kept, ...added];
      });

      // A chip for a column that is no longer in the grid would keep filtering
      // rows by something the user can neither see nor edit, so it leaves too.
      const keptRules = filterQuery.rules.filter(
        (node) => !isFilterRule(node) || selected.has(node.path[0]),
      );
      if (keptRules.length !== filterQuery.rules.length) {
        setFilterQuery(createFilterQuery(keptRules));
        setPruneSeq((seq) => seq + 1);
      }
    },
    [filterQuery],
  );

  const handleCreateAttribute = useCallback(
    (type: AttributeType) => {
      const label = ATTRIBUTE_TYPE_LABELS[type];
      const attribute: CompanyAttribute = {
        id: `custom-${type}-${createdAttributes.length + 1}`,
        label: `New ${label.toLowerCase()}`,
        type,
        size: 160,
        sortable: false,
      };

      setCreatedAttributes((current) => [...current, attribute]);
      setVisibleAttributeIds((ids) => [...ids, attribute.id]);
      toast.success("Attribute created", {
        description: `A ${label.toLowerCase()} column was added. It has no values yet.`,
      });
    },
    [createdAttributes],
  );

  // ── Records ──

  const filteredCompanies = useMemo(
    () => applyFilters(companies, filterConditions),
    [companies, filterConditions],
  );

  // Seeded so the sheet mounts CLOSED before its first open, and retained on
  // close: an overlay mounted already-open or unmounted on close never animates.
  const [retainedDetailsId, setRetainedDetailsId] = useState<string | null>(
    () => COMPANIES[0]?.id ?? null,
  );
  if (detailsId !== null && detailsId !== retainedDetailsId) {
    setRetainedDetailsId(detailsId);
  }

  const detailsCompany = useMemo(
    () => companies.find((company) => company.id === retainedDetailsId) ?? null,
    [companies, retainedDetailsId],
  );

  const handleSaveCompany = useCallback((id: string, patch: Partial<ICompany>) => {
    setCompanies((current) =>
      current.map((company) => (company.id === id ? { ...company, ...patch } : company)),
    );
    toast.success("Company updated", {
      description: "The record and its pipeline rollup were saved.",
    });
  }, []);

  const handleCreateCompany = useCallback(
    (values: CompanyFormValues) => {
      const nextId = (idSeqRef.current += 1);
      setCompanies((current) => {
        const company: ICompany = {
          id: `cmp-${nextId}`,
          name: values.name,
          domain: values.domain,
          logo: null,
          description: values.description,
          categories: [],
          ownerId: values.ownerId,
          managerId: values.ownerId,
          contactId: values.ownerId,
          stage: values.stage,
          arr: values.arr,
          closeDate: "2027-01-31",
          probability: 20,
          industry: values.industry,
          employees: values.employees,
          location: values.location,
          countryCode: "US",
          phone: "",
          lastActivityDays: 0,
          renewalDate: "2027-06-30",
          health: 60,
          rating: 0,
          status: "Onboarding",
          priority: "Medium",
          tier: "Core",
          underContract: false,
          plan: values.plan,
          seats: 0,
          notes: "",
        };
        return [company, ...current];
      });
      resetPagination();
      toast.success("Company added", {
        description: `${values.name} is now in the pipeline.`,
      });
    },
    [resetPagination],
  );

  const handleConfirmDelete = useCallback(() => {
    if (!pendingDelete) return;
    const doomed = pendingDelete.kind === "row" ? [pendingDelete.company.id] : pendingDelete.ids;
    const doomedSet = new Set(doomed);

    setCompanies((current) => current.filter((company) => !doomedSet.has(company.id)));
    setDetailsId((current) => (current && doomedSet.has(current) ? null : current));
    setRowSelection({});
    toast.success(doomed.length === 1 ? "Company deleted" : "Companies deleted", {
      description:
        pendingDelete.kind === "row"
          ? `${pendingDelete.company.name} was removed from the pipeline.`
          : `${doomed.length} companies were removed from the pipeline.`,
    });
    setPendingDelete(null);
  }, [pendingDelete]);

  const handleRowAction = useCallback((action: CompanyRowAction, company: ICompany) => {
    if (action === "view") {
      setDetailsId(company.id);
      return;
    }
    if (action === "delete") {
      setPendingDelete({ kind: "row", company });
      return;
    }
    const nextId = (idSeqRef.current += 1);
    setCompanies((current) => {
      const index = current.findIndex((item) => item.id === company.id);
      const copy: ICompany = {
        ...company,
        id: `cmp-${nextId}`,
        name: `${company.name} (copy)`,
        stage: "Discovery",
        status: "Onboarding",
      };
      const next = [...current];
      next.splice(index + 1, 0, copy);
      return next;
    });
    toast.success("Company duplicated", {
      description: `A draft copy of ${company.name} was created.`,
    });
  }, []);

  // ── Table ──

  const columns = useMemo(() => {
    // oxlint-disable-next-line react/refs
    return createCompanyColumns({
      attributes,
      showTypeIcons,
      onAction: handleRowAction,
    });
  }, [attributes, showTypeIcons, handleRowAction]);

  /**
   * A newly added attribute lands before the trailing action columns instead of
   * after them, which is where TanStack would otherwise append an unknown id.
   */
  const orderedColumnIds = useMemo(() => {
    const defined = columns.map((column) => column.id as string);
    if (columnOrder.length === 0) return defined;

    const definedSet = new Set(defined);
    const kept = columnOrder.filter((id) => definedSet.has(id));
    const keptSet = new Set(kept);
    const missing = defined.filter((id) => !keptSet.has(id));
    if (missing.length === 0) return kept;

    const tailStart = kept.findIndex((id) => TAIL_COLUMN_IDS.has(id));
    if (tailStart === -1) return [...kept, ...missing];
    return [...kept.slice(0, tailStart), ...missing, ...kept.slice(tailStart)];
  }, [columns, columnOrder]);

  const table = useTable({
    features: dataGridFeatures,
    data: filteredCompanies,
    columns,
    getRowId: (row) => row.id,
    state: {
      sorting,
      pagination,
      columnOrder: orderedColumnIds,
      columnPinning,
      rowSelection,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnOrderChange: setColumnOrder,
    onColumnPinningChange: setColumnPinning,
    onRowSelectionChange: setRowSelection,
  });

  /**
   * One command for the whole column model: the added set, its order, the
   * attributes created from the picker, and any dragged widths.
   */
  const handleResetColumns = useCallback(() => {
    setVisibleAttributeIds(INITIAL_ATTRIBUTE_IDS);
    setCreatedAttributes([]);
    setColumnOrder([]);
    table.resetColumnSizing();

    const kept = new Set(INITIAL_ATTRIBUTE_IDS);
    const keptRules = filterQuery.rules.filter(
      (node) => !isFilterRule(node) || kept.has(node.path[0]),
    );
    if (keptRules.length !== filterQuery.rules.length) {
      setFilterQuery(createFilterQuery(keptRules));
      setPruneSeq((seq) => seq + 1);
    }
    toast.success("Columns reset", {
      description: "The default attribute set, order and widths are back.",
    });
  }, [filterQuery, table]);

  // ── Filters ──

  /**
   * One filter field per VISIBLE column, off the same attribute registry and
   * accessor, so the column menu and the filter menu can never drift apart.
   */
  const filterFields: FilterField[] = useMemo(
    () =>
      attributes
        .map((attribute) => {
          const type = ATTRIBUTE_FILTER_TYPE[attribute.type];
          if (!type) return null;

          const field: FilterField = {
            id: attribute.id,
            label: attribute.label,
            icon: ATTRIBUTE_TYPE_ICONS[attribute.type],
            type,
          };

          if (type === "text") {
            field.defaultOperator = "contains";
            field.placeholder =
              attribute.id === IDENTITY_ATTRIBUTE_ID
                ? "Search companies..."
                : `Search ${attribute.label.toLowerCase()}...`;
            return field;
          }

          if (type === "select" || type === "multiselect") {
            const dots = FILTER_OPTION_DOTS[attribute.id];
            field.searchable = true;
            field.options = collectOptions(companies, attribute.id).map((value) => ({
              value,
              label: value,
              icon: dots?.[value] ? <OptionDot className={dots[value]} /> : undefined,
            }));
            field.renderValue = ({ values, options }) =>
              renderSelectedFilterOption(values, options);
          }

          return field;
        })
        .filter((field): field is FilterField => field !== null),
    [attributes, companies],
  );

  const handleFiltersChange = useCallback(
    (next: FilterQuery) => {
      setFilterQuery(next);
      resetPagination();
    },
    [resetPagination],
  );

  const hasActiveFilters = getActiveFilters(filterConditions).length > 0;

  const activeCount = companies.filter((company) => company.status === "Active").length;
  // Churned is a closed relationship, not an open problem, so it is counted
  // separately from the accounts that still need someone to act.
  const atRiskCount = companies.filter((company) => company.status === "At risk").length;

  const selectedIds = useMemo(
    () => Object.keys(rowSelection).filter((id) => rowSelection[id]),
    [rowSelection],
  );

  return (
    <>
      <DataGrid
        table={table}
        recordCount={filteredCompanies.length}
        emptyMessage="No companies match this view. Clear the filters or search for a different account."
        tableLayout={{
          dense: tableDensity === "compact",
          cellBorder: columnLines,
          stripped: rowStripes,
          columnsResizable,
          columnsMovable,
          // Off on purpose: the pinning state below is an ordering lock, and
          // this flag is the affordance that would make both gutters sticky.
          columnsPinnable: false,
          headerSticky: true,
        }}
      >
        <Frame dense variant="default" spacing="sm" className="w-full">
          <FrameHeader className="flex-row items-center justify-between gap-3 max-sm:flex-col max-sm:items-start">
            <div className="flex flex-col gap-px">
              <FrameTitle className="text-balance">Companies</FrameTitle>
              <FrameDescription className="text-xs">
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                  <span>{activeCount} active</span>
                  <span
                    aria-hidden
                    className="size-1 shrink-0 rounded-full bg-muted-foreground/40"
                  />
                  <span>{atRiskCount} at risk</span>
                </span>
              </FrameDescription>
            </div>

            <Button type="button" className="shrink-0" onClick={() => setCreateOpen(true)}>
              <PlusIcon aria-hidden="true" />
              Add company
            </Button>
          </FrameHeader>

          <FramePanel className="bg-card p-0! shadow-none!">
            {/* Toolbar */}
            <div className="flex flex-col gap-2 px-(--frame-panel-header-px) py-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-2">
                {/* Keyed on prunes: the bar's count announcement is its own
                      state, so a rule pruned from outside leaves it stale. */}
                <Filters
                  key={pruneSeq}
                  query={filterQuery}
                  fields={filterFields}
                  onQueryChange={handleFiltersChange}
                  size="default"
                  trigger={
                    <Button type="button" variant="outline" aria-label="Filters">
                      <FilterIcon data-icon="inline-start" aria-hidden="true" />
                      Filter
                    </Button>
                  }
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                {hasActiveFilters ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setFilterQuery(createDefaultCompanyFilters());
                      resetPagination();
                    }}
                  >
                    Clear
                  </Button>
                ) : null}

                <AddColumnCascader
                  value={pickerValue}
                  createdAttributes={createdAttributes}
                  onValueChange={handleAttributesChange}
                  onCreateAttribute={handleCreateAttribute}
                />

                <Popover>
                  <PopoverTrigger
                    render={
                      <Button type="button" variant="outline">
                        <Settings2Icon className="size-4" aria-hidden="true" />
                        Settings
                      </Button>
                    }
                  />
                  <PopoverContent align="end" className="w-72 p-0">
                    <FieldGroup className="gap-3 px-3.5 py-3">
                      <FieldSet className="gap-0">
                        <FieldLegend variant="label" className="mb-1">
                          Appearance
                        </FieldLegend>

                        <Field
                          orientation="horizontal"
                          className="min-h-9 items-center justify-between gap-3"
                        >
                          <FieldLabel htmlFor="columns-5-density" className="text-sm font-normal">
                            Density
                          </FieldLabel>
                          <Select
                            value={tableDensity}
                            items={TABLE_DENSITY_OPTIONS}
                            onValueChange={(value) =>
                              value && setTableDensity(value as TableDensity)
                            }
                          >
                            {/* w-36 equals the select popup's min-width, so
                                the anchored popup lands exactly on the trigger. */}
                            <SelectTrigger
                              id="columns-5-density"
                              size="sm"
                              className="w-36 shrink-0"
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent align="start" alignItemWithTrigger={false}>
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
                          <FieldLabel
                            htmlFor="columns-5-column-lines"
                            className="text-sm font-normal"
                          >
                            Column lines
                          </FieldLabel>
                          <Switch
                            id="columns-5-column-lines"
                            size="sm"
                            checked={columnLines}
                            onCheckedChange={setColumnLines}
                          />
                        </Field>

                        <Field
                          orientation="horizontal"
                          className="min-h-9 items-center justify-between gap-3"
                        >
                          <FieldLabel
                            htmlFor="columns-5-row-stripes"
                            className="text-sm font-normal"
                          >
                            Row stripes
                          </FieldLabel>
                          <Switch
                            id="columns-5-row-stripes"
                            size="sm"
                            checked={rowStripes}
                            onCheckedChange={setRowStripes}
                          />
                        </Field>
                      </FieldSet>

                      <FieldSeparator />

                      <FieldSet className="gap-0">
                        <FieldLegend variant="label" className="mb-1">
                          Columns
                        </FieldLegend>

                        <Field
                          orientation="horizontal"
                          className="min-h-9 items-center justify-between gap-3"
                        >
                          <FieldLabel
                            htmlFor="columns-5-type-icons"
                            className="text-sm font-normal"
                          >
                            Type icons
                          </FieldLabel>
                          <Switch
                            id="columns-5-type-icons"
                            size="sm"
                            checked={showTypeIcons}
                            onCheckedChange={setShowTypeIcons}
                          />
                        </Field>

                        <Field
                          orientation="horizontal"
                          className="min-h-9 items-center justify-between gap-3"
                        >
                          <FieldLabel htmlFor="columns-5-resizable" className="text-sm font-normal">
                            Resizable columns
                          </FieldLabel>
                          <Switch
                            id="columns-5-resizable"
                            size="sm"
                            checked={columnsResizable}
                            onCheckedChange={setColumnsResizable}
                          />
                        </Field>

                        <Field
                          orientation="horizontal"
                          className="min-h-9 items-center justify-between gap-3"
                        >
                          <FieldLabel htmlFor="columns-5-movable" className="text-sm font-normal">
                            Movable columns
                          </FieldLabel>
                          <Switch
                            id="columns-5-movable"
                            size="sm"
                            checked={columnsMovable}
                            onCheckedChange={setColumnsMovable}
                          />
                        </Field>
                      </FieldSet>

                      <FieldSeparator />

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={handleResetColumns}
                      >
                        <RotateCcwIcon className="size-4" aria-hidden="true" />
                        Reset columns
                      </Button>
                    </FieldGroup>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {selectedIds.length > 0 ? (
              <>
                <Separator />
                {/* Bulk bar: the row checkboxes exist to drive this. */}
                <div className="flex flex-wrap items-center justify-between gap-2 bg-muted/40 px-(--frame-panel-header-px) py-2">
                  <span className="text-sm font-medium text-foreground">
                    {selectedIds.length} selected
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setRowSelection({})}
                    >
                      Clear
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => setPendingDelete({ kind: "bulk", ids: selectedIds })}
                    >
                      <Trash2Icon className="size-4" aria-hidden="true" />
                      Delete
                    </Button>
                  </div>
                </div>
              </>
            ) : null}
            <Separator />

            <DataGridScrollArea>
              <DataGridTable />
            </DataGridScrollArea>

            <Separator />

            <FrameFooter>
              <DataGridPagination />
            </FrameFooter>
          </FramePanel>
        </Frame>
      </DataGrid>

      {/* Stays mounted with a real boolean: mounting already-open seeds Base
          UI's transition status past `starting`, so neither half ever runs. */}
      {detailsCompany ? (
        <CompanyDetailsSheet
          company={detailsCompany}
          open={detailsId !== null}
          onOpenChange={(next) => {
            if (!next) setDetailsId(null);
          }}
          onSave={handleSaveCompany}
          onDelete={(company) => setPendingDelete({ kind: "row", company })}
        />
      ) : null}

      <CompanyCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={handleCreateCompany}
      />

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(next) => {
          if (!next) setPendingDelete(null);
        }}
      >
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingDelete?.kind === "bulk" ? "Delete Companies?" : "Delete Company?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              This removes{" "}
              <span className="font-medium text-foreground">
                {pendingDelete?.kind === "bulk"
                  ? `${pendingDelete.ids.length} companies`
                  : pendingDelete?.company.name}
              </span>{" "}
              and their pipeline history. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
