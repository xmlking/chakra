"use client";

// oxlint-disable react/only-export-components react-doctor/only-export-components
// This file keeps "use no memo": its cell templates read state through builder
// calls on a stable row/column, which React Compiler cannot see.
"use no memo";

import { type ColumnDef } from "@tanstack/react-table";
import { Badge, type BadgeProps } from "@workspace/ui/components/reui/badge";
import { type DataGridFeatures } from "@workspace/ui/components/reui/data-grid/data-grid";
import { DataGridColumnHeader } from "@workspace/ui/components/reui/data-grid/data-grid-column-header";
import {
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from "@workspace/ui/components/reui/data-grid/data-grid-table";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/shadcn/avatar";
import { Button } from "@workspace/ui/components/shadcn/button";
import { Checkbox } from "@workspace/ui/components/shadcn/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/shadcn/dropdown-menu";
import { Progress } from "@workspace/ui/components/shadcn/progress";
import { Skeleton } from "@workspace/ui/components/shadcn/skeleton";
import { cn } from "@workspace/ui/lib/utils";
import {
  DatabaseIcon,
  StarIcon,
  LinkIcon,
  MapPinIcon,
  MoreHorizontalIcon,
  EyeIcon,
  CopyIcon,
  Trash2Icon,
} from "lucide-react";
import { type ReactNode } from "react";

import {
  ATTRIBUTE_TYPE_ICONS,
  formatCompactNumber,
  formatCurrency,
  formatDate,
  formatRelativeDays,
  getPerson,
  IDENTITY_ATTRIBUTE_ID,
  type AttributeType,
  type CategoryLabel,
  type CompanyAttribute,
  type CompanyIndustry,
  type CompanyPlan,
  type CompanyPriority,
  type CompanyRowAction,
  type CompanyStage,
  type CompanyStatus,
  type CompanyTier,
  type ICompany,
  type IPerson,
} from "./data";

// ── Semantic state maps ──

/** One typed source of truth per stateful field. */
export const stageBadgeVariant: Record<CompanyStage, BadgeProps["variant"]> = {
  Discovery: "outline",
  Evaluation: "info-light",
  Proposal: "warning-light",
  Committed: "success-light",
  Renewal: "primary-light",
};

/** Dot colors for pickers, where the badge would duplicate the label text. */
export const stageDotClass: Record<CompanyStage, string> = {
  Discovery: "bg-muted-foreground/60",
  Evaluation: "bg-info",
  Proposal: "bg-warning",
  Committed: "bg-success",
  Renewal: "bg-primary",
};

export const statusConfig: Record<CompanyStatus, { variant: BadgeProps["variant"]; dot: string }> =
  {
    Active: { variant: "success-light", dot: "bg-success" },
    Onboarding: { variant: "info-light", dot: "bg-info" },
    "At risk": { variant: "warning-light", dot: "bg-warning" },
    Paused: { variant: "outline", dot: "bg-muted-foreground/60" },
    Churned: { variant: "destructive-light", dot: "bg-destructive" },
  };

export const priorityConfig: Record<
  CompanyPriority,
  { variant: BadgeProps["variant"]; bars: number; dot: string }
> = {
  Critical: { variant: "destructive-light", bars: 4, dot: "bg-destructive" },
  High: { variant: "warning-light", bars: 3, dot: "bg-warning" },
  Medium: { variant: "info-light", bars: 2, dot: "bg-info" },
  Low: { variant: "outline", bars: 1, dot: "bg-muted-foreground/60" },
};

export const tierBadgeVariant: Record<CompanyTier, BadgeProps["variant"]> = {
  Strategic: "primary-light",
  Growth: "info-light",
  Core: "outline",
};

export const planBadgeVariant: Record<CompanyPlan, BadgeProps["variant"]> = {
  Enterprise: "invert-light",
  Business: "info-light",
  Team: "outline",
};

export const industryBadgeVariant: Record<CompanyIndustry, BadgeProps["variant"]> = {
  "AI research": "primary-light",
  "Developer tools": "info-light",
  "Data platform": "focus-light",
  Payments: "success-light",
  Collaboration: "warning-light",
};

const categoryBadgeClass: Record<CategoryLabel, string> = {
  Enterprise: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300",
  "Self-serve": "bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300",
  "Design partner": "bg-violet-100 text-violet-800 dark:bg-violet-950/50 dark:text-violet-300",
  Expansion: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
  Regulated: "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
  "Open source": "bg-cyan-100 text-cyan-800 dark:bg-cyan-950/50 dark:text-cyan-300",
};

// ── Shared cell parts ──

/** The one empty-value rendering, so every unset cell reads the same. */
function EmptyValue() {
  return <span className="text-sm text-muted-foreground/60 tabular-nums">--</span>;
}

const linkClassName =
  "hover:text-primary min-w-0 truncate underline-offset-2 transition-colors hover:underline";

function PersonCell({ person }: { person: IPerson | undefined }) {
  if (!person) return <EmptyValue />;

  return (
    <div className="flex min-w-0 items-center gap-2">
      <Avatar className="size-6 shrink-0">
        {person.avatar ? <AvatarImage src={person.avatar} alt="" /> : null}
        <AvatarFallback className="text-[10px]">{person.initials}</AvatarFallback>
      </Avatar>
      <span className="min-w-0 truncate text-sm text-foreground">{person.name}</span>
    </div>
  );
}

function RecordCell({ person }: { person: IPerson | undefined }) {
  if (!person) return <EmptyValue />;

  return (
    // oxlint-disable-next-line jsx-a11y/anchor-is-valid
    <a
      href="#"
      aria-label={`Open record for ${person.name}`}
      className="flex min-w-0 items-center gap-1.5 text-sm text-foreground"
    >
      <DatabaseIcon className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
      <span className={linkClassName}>{person.name}</span>
    </a>
  );
}

function HealthCell({ value }: { value: number }) {
  const indicatorClass =
    value >= 70
      ? "**:data-[slot=progress-indicator]:bg-success"
      : value >= 45
        ? "**:data-[slot=progress-indicator]:bg-warning"
        : "**:data-[slot=progress-indicator]:bg-destructive";

  return (
    <div className="flex min-w-0 items-center gap-2">
      <Progress
        value={value}
        aria-label="Account health"
        className={cn("min-w-12 flex-1 **:data-[slot=progress-track]:h-1.5", indicatorClass)}
      />
      <span className="shrink-0 text-xs text-muted-foreground tabular-nums">{value}</span>
    </div>
  );
}

function RatingCell({ value }: { value: number }) {
  if (!value) return <EmptyValue />;

  return (
    // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
    <div className="flex items-center gap-0.5" role="img" aria-label={`${value} of 5`}>
      {[1, 2, 3, 4, 5].map((step) => (
        <StarIcon
          key={step}
          className={cn(
            "size-3.5",
            step <= value ? "fill-warning text-warning" : "text-muted-foreground/35",
          )}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function PriorityCell({ value }: { value: CompanyPriority }) {
  const config = priorityConfig[value];

  return (
    <Badge variant={config.variant} className="gap-1.5">
      <span className="flex items-end gap-px" aria-hidden="true">
        {[1, 2, 3, 4].map((bar) => (
          <span
            key={bar}
            className={cn(
              "w-0.5 rounded-full bg-current",
              bar === 1 && "h-1",
              bar === 2 && "h-1.5",
              bar === 3 && "h-2",
              bar === 4 && "h-2.5",
              bar > config.bars && "opacity-25",
            )}
          />
        ))}
      </span>
      {value}
    </Badge>
  );
}

function StatusCell({ value }: { value: CompanyStatus }) {
  const config = statusConfig[value];

  return (
    <Badge variant={config.variant} className="gap-1.5">
      <span className={cn("size-1.5 shrink-0 rounded-full!", config.dot)} aria-hidden="true" />
      {value}
    </Badge>
  );
}

function CategoriesCell({ values }: { values: CategoryLabel[] }) {
  if (values.length === 0) return <EmptyValue />;

  return (
    <div className="flex flex-wrap items-center gap-1">
      {values.map((label) => (
        <Badge
          key={label}
          variant="secondary"
          className={cn("border-0", categoryBadgeClass[label])}
        >
          {label}
        </Badge>
      ))}
    </div>
  );
}

function CompanyCell({ company, onOpen }: { company: ICompany; onOpen: () => void }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      {company.logo ? (
        <span className="flex size-5 shrink-0 items-center justify-center">{company.logo}</span>
      ) : (
        <Avatar className="size-5 shrink-0">
          <AvatarFallback className="text-[9px]">{company.name.slice(0, 1)}</AvatarFallback>
        </Avatar>
      )}
      <div className="min-w-0">
        {/* oxlint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a
          href="#"
          aria-label={`Open ${company.name}`}
          onClick={(event) => {
            event.preventDefault();
            onOpen();
          }}
          className="block truncate text-sm font-medium text-foreground underline-offset-2 transition-colors hover:text-primary hover:underline"
        >
          {company.name}
        </a>
        <span className="block truncate text-xs text-muted-foreground">{company.domain}</span>
      </div>
    </div>
  );
}

/** Owner/contact rendering shared by the grid cells and the create form. */
export function PersonOption({ personId }: { personId: string }) {
  const person = getPerson(personId);
  if (!person) return <EmptyValue />;

  return (
    <span className="flex min-w-0 items-center gap-2">
      <Avatar className="size-5 shrink-0">
        {person.avatar ? <AvatarImage src={person.avatar} alt="" /> : null}
        <AvatarFallback className="text-[9px]">{person.initials}</AvatarFallback>
      </Avatar>
      <span className="min-w-0 truncate">{person.name}</span>
    </span>
  );
}

// ── Typed cell rendering ──

/**
 * One renderer per attribute type. Shared with attributes created from the
 * picker footer, so a created column shows its type's real empty state.
 */
function renderTypedValue(type: AttributeType, value: unknown): ReactNode {
  // Unset reads the same everywhere. A real `false` is a value, not an unset
  // cell, so it falls through to the checkbox case below.
  if (value === undefined || value === null || value === "") {
    return <EmptyValue />;
  }

  switch (type) {
    case "currency":
      return (
        <span className="text-sm font-medium text-foreground tabular-nums">
          {formatCurrency(value as number)}
        </span>
      );
    case "number":
      return (
        <span className="text-sm text-foreground tabular-nums">
          {formatCompactNumber(value as number)}
        </span>
      );
    case "percent":
      return (
        <div className="flex min-w-0 items-center gap-2">
          <Progress
            value={value as number}
            aria-label="Probability"
            className="min-w-10 flex-1 **:data-[slot=progress-track]:h-1.5"
          />
          <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
            {value as number}%
          </span>
        </div>
      );
    case "date":
      return <span className="text-sm text-muted-foreground">{formatDate(value as string)}</span>;
    case "timestamp":
      return (
        <span className="text-sm text-muted-foreground">{formatRelativeDays(value as number)}</span>
      );
    case "checkbox":
      return <Checkbox checked={Boolean(value)} disabled aria-label={value ? "Yes" : "No"} />;
    case "rating":
      return <RatingCell value={value as number} />;
    case "link":
      return (
        // oxlint-disable-next-line jsx-a11y/anchor-is-valid
        <a
          href="#"
          aria-label={`Visit ${value as string}`}
          className={cn("flex items-center gap-1.5 text-sm", linkClassName)}
        >
          <LinkIcon className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <span className="truncate">{value as string}</span>
        </a>
      );
    case "location":
      return (
        <span className="flex min-w-0 items-center gap-1.5 text-sm">
          <MapPinIcon className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <span className="truncate text-foreground">{value as string}</span>
        </span>
      );
    case "phone":
      return <span className="text-sm text-muted-foreground tabular-nums">{value as string}</span>;
    case "longText":
      return (
        <span className="block truncate text-sm text-muted-foreground" title={value as string}>
          {value as string}
        </span>
      );
    default:
      // oxlint-disable-next-line typescript/no-base-to-string
      return <span className="truncate text-sm text-foreground">{String(value)}</span>;
  }
}

/** Raw value per built-in attribute. Sorting reads the same function. */
export function getAttributeValue(company: ICompany, id: string): unknown {
  switch (id) {
    case "company-name":
      return company.name;
    case "company-domain":
      return company.domain;
    case "company-description":
      return company.description;
    case "company-categories":
      // The raw array, not a joined string: this is also what the multiselect
      // filter matches against, and the column does not sort on it.
      return company.categories;
    case "people-owner":
      return getPerson(company.ownerId)?.name;
    case "people-manager":
      return getPerson(company.managerId)?.name;
    case "people-contact":
      return getPerson(company.contactId)?.name;
    case "deal-stage":
      return company.stage;
    case "deal-arr":
      return company.arr;
    case "deal-close":
      return company.closeDate;
    case "deal-probability":
      return company.probability;
    case "firmographics-industry":
      return company.industry;
    case "firmographics-employees":
      return company.employees;
    case "firmographics-location":
      return company.location;
    case "firmographics-phone":
      return company.phone;
    case "engagement-lastActivity":
      return company.lastActivityDays;
    case "engagement-renewal":
      return company.renewalDate;
    case "engagement-health":
      return company.health;
    case "engagement-rating":
      return company.rating;
    case "lifecycle-status":
      return company.status;
    case "lifecycle-priority":
      return company.priority;
    case "lifecycle-tier":
      return company.tier;
    case "lifecycle-contract":
      return company.underContract;
    case "billing-plan":
      return company.plan;
    case "billing-seats":
      return company.seats;
    case "notes":
      return company.notes;
    default:
      // A created attribute has no backing field yet.
      return undefined;
  }
}

/** Rich renderings that beat the generic typed cell for a known attribute. */
function renderAttributeCell(
  attribute: CompanyAttribute,
  company: ICompany,
  onOpen: () => void,
): ReactNode {
  switch (attribute.id) {
    case "company-name":
      return <CompanyCell company={company} onOpen={onOpen} />;
    case "company-categories":
      return <CategoriesCell values={company.categories} />;
    case "people-owner":
      return <PersonCell person={getPerson(company.ownerId)} />;
    case "people-manager":
      return <PersonCell person={getPerson(company.managerId)} />;
    case "people-contact":
      return <RecordCell person={getPerson(company.contactId)} />;
    case "deal-stage":
      return <Badge variant={stageBadgeVariant[company.stage]}>{company.stage}</Badge>;
    case "firmographics-industry":
      return <Badge variant={industryBadgeVariant[company.industry]}>{company.industry}</Badge>;
    case "engagement-health":
      return <HealthCell value={company.health} />;
    case "lifecycle-status":
      return <StatusCell value={company.status} />;
    case "lifecycle-priority":
      return <PriorityCell value={company.priority} />;
    case "lifecycle-tier":
      return <Badge variant={tierBadgeVariant[company.tier]}>{company.tier}</Badge>;
    case "billing-plan":
      return <Badge variant={planBadgeVariant[company.plan]}>{company.plan}</Badge>;
    default:
      return renderTypedValue(attribute.type, getAttributeValue(company, attribute.id));
  }
}

// ── Actions cell ──

function ActionsCell({
  company,
  onAction,
}: {
  company: ICompany;
  onAction: (action: CompanyRowAction, company: ICompany) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            size="icon"
            variant="ghost"
            className="size-7"
            aria-label={`Actions for ${company.name}`}
          />
        }
      >
        <MoreHorizontalIcon aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end" className="w-44">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => onAction("view", company)}>
            <EyeIcon className="size-4" aria-hidden="true" />
            View details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAction("duplicate", company)}>
            <CopyIcon className="size-4" aria-hidden="true" />
            Duplicate
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive" onClick={() => onAction("delete", company)}>
            <Trash2Icon className="size-4" aria-hidden="true" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ── Column factory ──

/** Column ids the picker never removes and the order logic keeps at the edges. */
export const SELECT_COLUMN_ID = "select";
export const ACTIONS_COLUMN_ID = "actions";

export const TAIL_COLUMN_IDS = new Set([ACTIONS_COLUMN_ID]);

interface CreateColumnsOptions {
  /** Visible attributes, already ordered by the view. */
  attributes: CompanyAttribute[];
  /** Draws each header's type glyph. Off reads as a plain spreadsheet. */
  showTypeIcons: boolean;
  onAction: (action: CompanyRowAction, company: ICompany) => void;
}

export function createCompanyColumns({
  attributes,
  showTypeIcons,
  onAction,
}: CreateColumnsOptions): ColumnDef<DataGridFeatures, ICompany>[] {
  const attributeColumns = attributes.map<ColumnDef<DataGridFeatures, ICompany>>((attribute) => ({
    id: attribute.id,
    accessorFn: (row) => getAttributeValue(row, attribute.id),
    header: ({ column }) => (
      <DataGridColumnHeader
        title={attribute.label}
        icon={showTypeIcons ? ATTRIBUTE_TYPE_ICONS[attribute.type] : undefined}
        column={column}
      />
    ),
    cell: ({ row }) =>
      renderAttributeCell(attribute, row.original, () => onAction("view", row.original)),
    size: attribute.size,
    minSize: attribute.id === IDENTITY_ATTRIBUTE_ID ? 200 : 90,
    enableSorting: attribute.sortable,
    // The cascader is the only column manager, so nothing hides a column.
    enableHiding: false,
    enableResizing: true,
    enablePinning: true,
    meta: {
      headerTitle: attribute.label,
      // The identity column soaks up leftover width, so the trailing utility
      // column stays pinned at 56px instead of stretching across the surplus.
      autoSize: attribute.id === IDENTITY_ATTRIBUTE_ID,
      skeleton: <Skeleton className="h-4 w-24" />,
    },
  }));

  return [
    {
      id: SELECT_COLUMN_ID,
      header: () => <DataGridTableRowSelectAll />,
      cell: ({ row }) => <DataGridTableRowSelect row={row} />,
      size: 40,
      enableSorting: false,
      enableResizing: false,
      enableHiding: false,
      // Pinned by the view as an ORDERING lock only, so Move-left can never
      // walk a data column into the checkbox gutter.
      enablePinning: true,
      meta: {
        headerClassName: "ps-4!",
        cellClassName: "ps-4!",
      },
    },
    ...attributeColumns,
    {
      id: ACTIONS_COLUMN_ID,
      // Control column, like select: the row menu is the whole cell, so the
      // header carries no title of its own.
      header: "",
      cell: ({ row }) => <ActionsCell company={row.original} onAction={onAction} />,
      size: 56,
      enableSorting: false,
      enableResizing: false,
      enableHiding: false,
      // Pinned by the view as an ORDERING lock only, so Move-right can never
      // walk a data column past the row menu. See the pinning note there.
      enablePinning: true,
      meta: {
        headerClassName: "justify-center",
        cellClassName: "justify-center",
        skeleton: <Skeleton className="mx-auto size-7" />,
      },
    },
  ];
}
