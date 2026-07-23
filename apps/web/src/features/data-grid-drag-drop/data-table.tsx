// oxlint-disable typescript/no-base-to-string
"use client";
"use no memo";

import { type DragEndEvent, type UniqueIdentifier } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@workspace/ui/components/reui/badge";
import { DataGrid } from "@workspace/ui/components/reui/data-grid/data-grid";
import { DataGridScrollArea } from "@workspace/ui/components/reui/data-grid/data-grid-scroll-area";
import { DataGridTableDndRows } from "@workspace/ui/components/reui/data-grid/data-grid-table-dnd-rows";
import {
  createFilter,
  Filters,
  type Filter,
  type FilterFieldConfig,
} from "@workspace/ui/components/reui/filters";
import { Button } from "@workspace/ui/components/shadcn/button";
import {
  Card,
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
import { FilterIcon, Settings2Icon } from "lucide-react";
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

function applyFiltersToData(data: BacklogItem[], filters: Filter[]) {
  const active = getActiveFilters(filters);

  return active.reduce(
    (result, filter) => {
      const { field, operator, values } = filter;

      return result.filter((item) => {
        const fieldValue = item[field as keyof BacklogItem];

        switch (operator) {
          case "contains": {
            const tokens = values.map((value) => String(value).trim()).filter(Boolean);

            if (tokens.length === 0) return true;

            return tokens.some((token) =>
              String(fieldValue).toLowerCase().includes(token.toLowerCase()),
            );
          }
          case "is":
            return values.includes(fieldValue);
          case "is_not":
            return !values.includes(fieldValue);
          case "is_any_of":
            return values.some((value) => fieldValue === value);
          case "is_not_any_of":
            return !values.some((value) => fieldValue === value);
          case "empty":
            return fieldValue === "" || fieldValue == null;
          case "not_empty":
            return fieldValue !== "" && fieldValue == null;
          default:
            return true;
        }
      });
    },
    [...data],
  );
}

function createDefaultFilters(): Filter[] {
  return [createFilter("title", "contains", [""])];
}

const SEED_ITEMS = normalizeOrder(sortByOrder(BACKLOG_ITEMS));

type TableDensity = "compact" | "comfortable";
type DisplayProperty = "status" | "type" | "owner" | "team" | "cycle" | "effort";

const TABLE_DENSITY_OPTIONS: { value: TableDensity; label: string }[] = [
  { value: "compact", label: "Compact" },
  { value: "comfortable", label: "Comfortable" },
];

const DISPLAY_PROPERTIES: { key: DisplayProperty; label: string }[] = [
  { key: "status", label: "Status" },
  { key: "type", label: "Type" },
  { key: "owner", label: "Owner" },
  { key: "team", label: "Team" },
  { key: "cycle", label: "Cycle" },
  { key: "effort", label: "Effort" },
];

interface ToolbarProps {
  filters: Filter[];
  fields: FilterFieldConfig[];
  onFiltersChange: (filters: Filter[]) => void;
  onClearFilters: () => void;
  showClearButton: boolean;
  tableDensity: TableDensity;
  onTableDensityChange: (value: TableDensity) => void;
  visibleProperties: Record<DisplayProperty, boolean>;
  onToggleProperty: (property: DisplayProperty) => void;
}

function Toolbar({
  filters,
  fields,
  onFiltersChange,
  onClearFilters,
  showClearButton,
  tableDensity,
  onTableDensityChange,
  visibleProperties,
  onToggleProperty,
}: ToolbarProps) {
  const activeFilters = useMemo(() => getActiveFilters(filters), [filters]);

  return (
    <div className="flex flex-col gap-3 px-5 py-3 lg:flex-row lg:items-center lg:justify-between">
      {/* Actions */}
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
        <Filters
          filters={filters}
          fields={fields}
          onChange={onFiltersChange}
          size="default"
          trigger={
            <Button type="button" variant="outline" aria-label="Backlog filters">
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
                </div>
              </div>

              <FieldSeparator className="-mx-3.5" />

              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">Columns</div>
                <div className="space-y-0">
                  {DISPLAY_PROPERTIES.map((property) => (
                    <Field
                      key={property.key}
                      orientation="horizontal"
                      className="min-h-9 items-center justify-between gap-3"
                    >
                      <FieldLabel className="text-sm font-normal">{property.label}</FieldLabel>
                      <Switch
                        size="sm"
                        checked={visibleProperties[property.key]}
                        onCheckedChange={() => onToggleProperty(property.key)}
                      />
                    </Field>
                  ))}
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
  const [items, setItems] = useState<BacklogItem[]>(SEED_ITEMS);
  const [tableDensity, setTableDensity] = useState<TableDensity>("compact");
  const [filters, setFilters] = useState<Filter[]>(createDefaultFilters());
  const [visibleProperties, setVisibleProperties] = useState<Record<DisplayProperty, boolean>>({
    status: true,
    type: true,
    owner: true,
    team: true,
    cycle: true,
    effort: true,
  });

  const activeFilters = useMemo(() => getActiveFilters(filters), [filters]);

  const filteredItems = useMemo(() => applyFiltersToData(items, filters), [items, filters]);

  const dataIds = useMemo<UniqueIdentifier[]>(
    () => filteredItems.map((item) => item.id),
    [filteredItems],
  );

  const showClearButton = activeFilters.length > 0;

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

  const handleFiltersChange = useCallback((nextFilters: Filter[]) => {
    setFilters(nextFilters);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters(createDefaultFilters());
  }, []);

  const toggleProperty = useCallback((property: DisplayProperty) => {
    setVisibleProperties((current) => ({
      ...current,
      [property]: !current[property],
    }));
  }, []);

  const typeOptions = useMemo(
    () => [
      { value: "Feature", label: "Feature" },
      { value: "Improvement", label: "Improvement" },
      { value: "Research", label: "Research" },
      { value: "Security", label: "Security" },
    ],
    [],
  );

  const statusOptions = useMemo(
    () => [
      { value: "In Progress", label: "In Progress" },
      { value: "In Review", label: "In Review" },
      { value: "Ready", label: "Ready" },
      { value: "Blocked", label: "Blocked" },
      { value: "Planned", label: "Planned" },
    ],
    [],
  );

  const teamOptions = useMemo(
    () => [
      { value: "Collaboration", label: "Collaboration" },
      { value: "Identity", label: "Identity" },
      { value: "Platform", label: "Platform" },
      { value: "Compliance", label: "Compliance" },
      { value: "Revenue", label: "Revenue" },
      { value: "Search", label: "Search" },
      { value: "Mobile", label: "Mobile" },
      { value: "Security", label: "Security" },
    ],
    [],
  );

  const filterFields: FilterFieldConfig[] = useMemo(
    () => [
      {
        key: "title",
        label: "Title",
        type: "text",
        className: "w-40",
        placeholder: "Search...",
      },
      {
        key: "type",
        label: "Type",
        type: "select",
        searchable: true,
        className: "w-40",
        options: typeOptions,
      },
      {
        key: "status",
        label: "Status",
        type: "select",
        searchable: false,
        className: "w-44",
        options: statusOptions,
      },
      {
        key: "team",
        label: "Team",
        type: "select",
        searchable: true,
        className: "w-44",
        options: teamOptions,
      },
    ],
    [statusOptions, teamOptions, typeOptions],
  );

  const columns = useMemo<ColumnDef<BacklogItem>[]>(
    () => createBacklogColumns({ total: filteredItems.length, onAction: handleAction }),
    [filteredItems.length, handleAction],
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: items,
    columns,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active || !over || active.id === over.id) return;

    const oldIndex = dataIds.indexOf(active.id);
    const newIndex = dataIds.indexOf(over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    setItems((current) => normalizeOrder(arrayMove(current, oldIndex, newIndex)));
  };

  return (
    <DataGrid
      table={table}
      recordCount={filteredItems.length}
      emptyMessage={<BacklogEmptyState />}
      tableLayout={{
        dense: tableDensity === "compact",
        rowsDraggable: true,
        columnsResizable: true,
        columnsMovable: false,
        columnsVisibility: false,
        width: "fixed",
      }}
      tableClassNames={{
        bodyRow: "[&[style*='cursor:_grabbing']>td]:border-t",
      }}
    >
      <Card className="w-full">
        <CardHeader className="flex-row items-center justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-0.5">
            <CardTitle>Sprint Backlog</CardTitle>
            <CardDescription className="flex items-center gap-1.5 text-xs">
              Drag to prioritize
              <span aria-hidden className="size-1 shrink-0 rounded-full bg-muted-foreground/40" />
              <span className="whitespace-nowrap">{filteredItems.length} items</span>
            </CardDescription>
          </div>
        </CardHeader>

        <Toolbar
          filters={filters}
          fields={filterFields}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
          showClearButton={showClearButton}
          tableDensity={tableDensity}
          onTableDensityChange={setTableDensity}
          visibleProperties={visibleProperties}
          onToggleProperty={toggleProperty}
        />

        <CardContent className="p-0">
          <DataGridScrollArea>
            <DataGridTableDndRows dataIds={dataIds} handleDragEnd={handleDragEnd} />
          </DataGridScrollArea>
        </CardContent>
      </Card>
    </DataGrid>
  );
}
