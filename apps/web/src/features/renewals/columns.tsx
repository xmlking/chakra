import type { Row, ColumnDef } from "@tanstack/react-table";
import { Badge } from "@workspace/ui/components/reui/badge";
import { DataGridColumnHeader } from "@workspace/ui/components/reui/data-grid/data-grid-column-header";
import {
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from "@workspace/ui/components/reui/data-grid/data-grid-table";
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
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/shadcn/avatar";
import { Button } from "@workspace/ui/components/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/shadcn/dropdown-menu";
import { Progress, ProgressLabel, ProgressValue } from "@workspace/ui/components/shadcn/progress";
import { Skeleton } from "@workspace/ui/components/shadcn/skeleton";
import { cn } from "@workspace/ui/lib/utils";
import { MoreHorizontalIcon, EyeIcon, FileTextIcon, TriangleAlertIcon } from "lucide-react";
import { memo, useMemo, useState, type ComponentProps } from "react";

import {
  type IRenewalRecord,
  type RenewalInvoiceStatus,
  type RenewalRisk,
  type RenewalSponsorStatus,
  type RenewalStage,
} from "./data";

// Intl formatters are costly to construct; build them once and reuse for every
// cell render.
const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const RENEWAL_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function formatCurrency(value: number) {
  return CURRENCY_FORMATTER.format(value);
}

function formatRenewalDate(iso: string) {
  return RENEWAL_DATE_FORMATTER.format(new Date(iso));
}

const stageVariant: Record<RenewalStage, ComponentProps<typeof Badge>["variant"]> = {
  Preparing: "outline",
  "Commercial review": "outline",
  "Legal review": "outline",
  Committed: "outline",
};

const stageDot = {
  Preparing: "bg-muted-foreground",
  "Commercial review": "bg-sky-500",
  "Legal review": "bg-amber-500",
  Committed: "bg-emerald-500",
} satisfies Record<RenewalStage, string>;

const riskVariant: Record<RenewalRisk, ComponentProps<typeof Badge>["variant"]> = {
  Low: "secondary",
  Medium: "info-light",
  High: "warning-light",
  Critical: "destructive-light",
};

const invoiceVariant: Record<RenewalInvoiceStatus, ComponentProps<typeof Badge>["variant"]> = {
  Ready: "success-light",
  "Finance review": "warning-light",
  Blocked: "destructive-light",
};

const sponsorVariant: Record<RenewalSponsorStatus, ComponentProps<typeof Badge>["variant"]> = {
  Confirmed: "success-outline",
  "At risk": "warning-outline",
  Missing: "destructive-outline",
};

export const StageBadge = memo(function StageBadge({ stage }: { stage: RenewalStage }) {
  return (
    <Badge variant={stageVariant[stage]}>
      <span className={cn("size-1.5 shrink-0 rounded-full", stageDot[stage])} aria-hidden="true" />
      {stage}
    </Badge>
  );
});

export const RiskBadge = memo(function RiskBadge({ risk }: { risk: RenewalRisk }) {
  return <Badge variant={riskVariant[risk]}>{risk}</Badge>;
});

export const InvoiceStatusBadge = memo(function InvoiceStatusBadge({
  status,
}: {
  status: RenewalInvoiceStatus;
}) {
  return <Badge variant={invoiceVariant[status]}>{status}</Badge>;
});

export const SponsorStatusBadge = memo(function SponsorStatusBadge({
  status,
}: {
  status: RenewalSponsorStatus;
}) {
  return <Badge variant={sponsorVariant[status]}>{status}</Badge>;
});

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}

const AccountCell = memo(function AccountCell({ row }: { row: Row<IRenewalRecord> }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <Avatar className="size-8">
        <AvatarImage src={row.original.ownerAvatar} alt="" />
        <AvatarFallback className="text-[9px] font-medium">
          {initials(row.original.ownerName)}
        </AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-col gap-0.5">
        <div className="truncate font-medium text-foreground">{row.original.accountName}</div>
        <div className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
          <span className="truncate">{row.original.ownerName}</span>
          <span className="size-1 shrink-0 rounded-full bg-input" aria-hidden="true" />
          <span className="truncate">{row.original.segment}</span>
        </div>
      </div>
    </div>
  );
});

const RenewalWindowCell = memo(function RenewalWindowCell({ row }: { row: Row<IRenewalRecord> }) {
  const dueSoon = row.original.daysToRenewal <= 30;
  const urgencyTone =
    row.original.daysToRenewal <= 14
      ? "text-destructive"
      : row.original.daysToRenewal <= 30
        ? "text-warning"
        : "text-foreground";

  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <span className={cn("font-medium tabular-nums", urgencyTone)}>
        {dueSoon ? `Due in ${row.original.daysToRenewal}d` : `${row.original.daysToRenewal}d out`}
      </span>
      <span className="text-xs text-muted-foreground">
        {formatRenewalDate(row.original.renewalDate)}
      </span>
    </div>
  );
});

const RevenueCell = memo(function RevenueCell({ row }: { row: Row<IRenewalRecord> }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <span className="font-medium text-foreground tabular-nums">
        {formatCurrency(row.original.arr)}
      </span>
      <span
        className={cn(
          "text-xs tabular-nums",
          row.original.expansionPotential > 0
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-muted-foreground",
        )}
      >
        {row.original.expansionPotential > 0 ? "+" : ""}
        {formatCurrency(row.original.expansionPotential)} upside
      </span>
    </div>
  );
});

const HealthCell = memo(function HealthCell({ row }: { row: Row<IRenewalRecord> }) {
  const score = row.original.healthScore;
  const label = score >= 75 ? "Healthy" : score >= 55 ? "Watchlist" : "At risk";
  const indicatorClass =
    score >= 75
      ? "**:data-[slot=progress-indicator]:bg-emerald-500"
      : score >= 55
        ? "**:data-[slot=progress-indicator]:bg-amber-500"
        : "**:data-[slot=progress-indicator]:bg-red-500";

  return (
    <div className="flex min-w-0 flex-col gap-1">
      <Progress
        value={score}
        className={cn(
          "min-w-0 flex-1 flex-row flex-nowrap items-center gap-2 **:data-[slot=progress-track]:order-1 **:data-[slot=progress-track]:min-w-14 **:data-[slot=progress-track]:flex-1 **:data-[slot=progress-value]:order-2",
          indicatorClass,
        )}
      >
        <ProgressLabel className="sr-only">Health score</ProgressLabel>
        <ProgressValue className="shrink-0 text-[10px] leading-none text-muted-foreground tabular-nums">
          {(_, value) => `${value ?? score}%`}
        </ProgressValue>
      </Progress>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
});

function buildSmoothLinePath(points: { x: number; y: number }[]) {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let index = 0; index < points.length - 1; index++) {
    const p0 = points[Math.max(0, index - 1)];
    const p1 = points[index];
    const p2 = points[index + 1];
    const p3 = points[Math.min(points.length - 1, index + 2)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  return path;
}

const UsageTrendCell = memo(function UsageTrendCell({ row }: { row: Row<IRenewalRecord> }) {
  const data = row.original.usageTrend;
  const width = 92;
  const height = 26;
  const padX = 2;
  const padY = 2;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;

  const { linePath, strokeClass, deltaLabel } = useMemo(() => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const step = innerW / Math.max(1, data.length - 1);

    const points = data.map((value, index) => ({
      x: padX + index * step,
      y: padY + ((max - value) / range) * innerH,
    }));

    const delta = data[data.length - 1] - data[0];

    return {
      linePath: buildSmoothLinePath(points),
      strokeClass:
        delta > 0
          ? "stroke-emerald-600 dark:stroke-emerald-400"
          : delta < 0
            ? "stroke-red-600 dark:stroke-red-400"
            : "stroke-muted-foreground",
      deltaLabel:
        delta > 0
          ? `Expanding ${delta} pts`
          : delta < 0
            ? `Contracting ${Math.abs(delta)} pts`
            : "Stable",
    };
  }, [data, innerH, innerW, padX, padY]);

  return (
    <div className="flex min-w-0 flex-col gap-1">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="shrink-0"
        aria-hidden="true"
      >
        <path
          d={linePath}
          fill="none"
          className={strokeClass}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-xs text-muted-foreground">{deltaLabel}</span>
    </div>
  );
});

function RenewalActionsCell({
  row,
  onOpenAccount,
  onCreateBrief,
  onEscalateReview,
}: {
  row: Row<IRenewalRecord>;
  onOpenAccount: (renewal: IRenewalRecord) => void;
  onCreateBrief: (renewal: IRenewalRecord) => void;
  onEscalateReview: (renewal: IRenewalRecord) => void;
}) {
  const [escalateOpen, setEscalateOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="size-7"
              aria-label="Renewal actions"
            />
          }
        >
          <MoreHorizontalIcon className="size-4" aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end" className="w-44">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => onOpenAccount(row.original)}>
              <EyeIcon className="size-4" aria-hidden="true" />
              Open account
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onCreateBrief(row.original)}>
              <FileTextIcon className="size-4" aria-hidden="true" />
              {row.original.stage === "Legal review"
                ? "Legal redlines"
                : row.original.invoiceStatus !== "Ready"
                  ? "Finance sign-off"
                  : "Renewal brief"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => setEscalateOpen(true)}>
              <TriangleAlertIcon className="size-4" aria-hidden="true" />
              Escalate
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={escalateOpen} onOpenChange={setEscalateOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Create an exec escalation?</AlertDialogTitle>
            <AlertDialogDescription>
              This will push{" "}
              <span className="font-medium text-foreground">{row.original.accountName}</span> into
              an urgent board-review path in a real revenue-ops workspace.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => onEscalateReview(row.original)}>
              Create escalation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function createRenewalColumns({
  onOpenAccount,
  onCreateBrief,
  onEscalateReview,
}: {
  onOpenAccount: (renewal: IRenewalRecord) => void;
  onCreateBrief: (renewal: IRenewalRecord) => void;
  onEscalateReview: (renewal: IRenewalRecord) => void;
}) {
  return [
    {
      accessorKey: "id",
      id: "select",
      header: () => <DataGridTableRowSelectAll />,
      cell: ({ row }) => <DataGridTableRowSelect row={row} />,
      enableSorting: false,
      enableResizing: false,
      enableHiding: false,
      size: 36,
      meta: {
        headerClassName: "ps-4!",
        cellClassName: "ps-4!",
      },
    },
    {
      accessorKey: "accountName",
      id: "account",
      header: ({ column }) => (
        <DataGridColumnHeader title="Account" visibility={true} column={column} />
      ),
      cell: ({ row }) => <AccountCell row={row} />,
      minSize: 280,
      size: 320,
      enableSorting: true,
      enableResizing: true,
      enableHiding: false,
      meta: {
        autoSize: true,
        skeleton: (
          <div className="flex min-w-0 items-start gap-2">
            <Skeleton className="mt-0.5 size-5 shrink-0 rounded" />
            <div className="flex min-w-0 flex-col gap-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
        ),
      },
    },
    {
      accessorFn: (row) => row.daysToRenewal,
      id: "renewalWindow",
      header: ({ column }) => (
        <DataGridColumnHeader title="Renewal" visibility={true} column={column} />
      ),
      cell: ({ row }) => <RenewalWindowCell row={row} />,
      size: 150,
      minSize: 140,
      enableSorting: true,
      enableResizing: true,
      enableHiding: true,
      meta: {
        skeleton: (
          <div className="flex flex-col gap-0.5">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-24" />
          </div>
        ),
      },
    },
    {
      accessorKey: "arr",
      id: "arr",
      header: ({ column }) => (
        <DataGridColumnHeader title="ARR" visibility={true} column={column} />
      ),
      cell: ({ row }) => <RevenueCell row={row} />,
      size: 150,
      minSize: 140,
      enableSorting: true,
      enableResizing: true,
      enableHiding: true,
      meta: {
        skeleton: (
          <div className="flex flex-col gap-0.5">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-24" />
          </div>
        ),
      },
    },
    {
      accessorKey: "healthScore",
      id: "health",
      header: ({ column }) => (
        <DataGridColumnHeader title="Health" visibility={true} column={column} />
      ),
      cell: ({ row }) => <HealthCell row={row} />,
      size: 140,
      minSize: 130,
      enableSorting: true,
      enableResizing: true,
      enableHiding: true,
    },
    {
      accessorKey: "usageTrend",
      id: "usage",
      header: ({ column }) => (
        <DataGridColumnHeader title="Usage" visibility={true} column={column} />
      ),
      cell: ({ row }) => <UsageTrendCell row={row} />,
      size: 120,
      minSize: 112,
      enableSorting: false,
      enableResizing: true,
      enableHiding: true,
    },
    {
      accessorKey: "stage",
      id: "stage",
      header: ({ column }) => (
        <DataGridColumnHeader title="Stage" visibility={true} column={column} />
      ),
      cell: ({ row }) => <StageBadge stage={row.original.stage} />,
      size: 168,
      minSize: 160,
      enableSorting: true,
      enableResizing: true,
      enableHiding: true,
    },
    {
      accessorKey: "risk",
      id: "risk",
      header: ({ column }) => (
        <DataGridColumnHeader title="Risk" visibility={true} column={column} />
      ),
      cell: ({ row }) => <RiskBadge risk={row.original.risk} />,
      size: 116,
      minSize: 108,
      enableSorting: true,
      enableResizing: true,
      enableHiding: true,
    },
    {
      accessorKey: "invoiceStatus",
      id: "invoiceStatus",
      header: ({ column }) => (
        <DataGridColumnHeader title="Invoice" visibility={true} column={column} />
      ),
      cell: ({ row }) => <InvoiceStatusBadge status={row.original.invoiceStatus} />,
      size: 148,
      minSize: 138,
      enableSorting: true,
      enableResizing: true,
      enableHiding: true,
    },
    {
      accessorKey: "sponsorStatus",
      id: "sponsorStatus",
      header: ({ column }) => (
        <DataGridColumnHeader title="Sponsor" visibility={true} column={column} />
      ),
      cell: ({ row }) => <SponsorStatusBadge status={row.original.sponsorStatus} />,
      size: 136,
      minSize: 128,
      enableSorting: true,
      enableResizing: true,
      enableHiding: true,
    },
    {
      accessorKey: "region",
      id: "region",
      header: ({ column }) => (
        <DataGridColumnHeader title="Region" visibility={true} column={column} />
      ),
      cell: ({ row }) => <span className="text-sm text-foreground">{row.original.region}</span>,
      size: 124,
      minSize: 116,
      enableSorting: true,
      enableResizing: true,
      enableHiding: true,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <RenewalActionsCell
          row={row}
          onOpenAccount={onOpenAccount}
          onCreateBrief={onCreateBrief}
          onEscalateReview={onEscalateReview}
        />
      ),
      enableSorting: false,
      enableResizing: false,
      enableHiding: false,
      size: 56,
      meta: {
        cellClassName: "pe-4!",
        headerClassName: "pe-4!",
      },
    },
  ] satisfies ColumnDef<IRenewalRecord>[];
}
