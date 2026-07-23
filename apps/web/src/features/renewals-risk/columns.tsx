"use no memo";

import type { Row, ColumnDef } from "@tanstack/react-table";
import { Badge } from "@workspace/ui/components/reui/badge";
import { DataGridColumnHeader } from "@workspace/ui/components/reui/data-grid/data-grid-column-header";
import { DataGridTableRowPin } from "@workspace/ui/components/reui/data-grid/data-grid-table";
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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@workspace/ui/components/shadcn/hover-card";
import { Item, ItemMedia } from "@workspace/ui/components/shadcn/item";
import { Progress, ProgressLabel, ProgressValue } from "@workspace/ui/components/shadcn/progress";
import { Skeleton } from "@workspace/ui/components/shadcn/skeleton";
import { cn } from "@workspace/ui/lib/utils";
import { MoreHorizontalIcon, EyeIcon, FlagIcon, CalendarDaysIcon, CopyIcon } from "lucide-react";
import { memo, type ComponentProps } from "react";
import { toast } from "sonner";

import { useCopyToClipboard } from "#hooks/use-copy-to-clipboard";

import { type AlertState, type IRenewalRiskRecord, type RenewalStage, type RiskTag } from "./data";

export type RenewalAction = "open" | "save_plan" | "exec_review";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

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

const stageDotClass: Record<RenewalStage, string> = {
  "Save Plan": "bg-rose-500",
  "Executive Review": "bg-amber-500",
  "Commercial Review": "bg-sky-500",
  "Security Review": "bg-violet-500",
  "Legal Review": "bg-orange-500",
  Procurement: "bg-cyan-500",
  "Verbal Commit": "bg-emerald-500",
};

const alertConfig: Record<
  AlertState,
  {
    variant: ComponentProps<typeof Badge>["variant"];
    dotClassName: string;
  }
> = {
  Critical: {
    variant: "destructive-outline",
    dotClassName: "bg-rose-500 dark:bg-rose-400",
  },
  Warning: {
    variant: "warning-outline",
    dotClassName: "bg-amber-500 dark:bg-amber-400",
  },
  Clear: {
    variant: "success-outline",
    dotClassName: "bg-emerald-500 dark:bg-emerald-400",
  },
};

const healthIndicatorClass = (health: number) => {
  if (health >= 75) {
    return "**:data-[slot=progress-indicator]:bg-emerald-500";
  }

  if (health >= 55) {
    return "**:data-[slot=progress-indicator]:bg-amber-500";
  }

  return "**:data-[slot=progress-indicator]:bg-rose-500";
};

const windowToneClass = (daysToRenewal: number) => {
  if (daysToRenewal <= 21) return "text-rose-500";
  if (daysToRenewal <= 45) return "text-amber-500";
  return "text-muted-foreground";
};

const SignalsCell = memo(function SignalsCell({
  signals,
}: {
  signals: IRenewalRiskRecord["signals"];
}) {
  const visibleSignals = signals.slice(0, 2);
  const hiddenCount = signals.length - visibleSignals.length;

  return (
    <div className="flex flex-wrap items-center gap-1">
      {visibleSignals.map((signal) => (
        <Badge
          key={signal}
          variant="secondary"
          className={cn("border-0", signalBadgeClass[signal])}
        >
          {signal}
        </Badge>
      ))}
      {hiddenCount > 0 ? (
        <HoverCard>
          <HoverCardTrigger
            render={
              <Badge
                variant="outline"
                size="sm"
                tabIndex={0}
                aria-label={`${hiddenCount} more signals`}
                className="cursor-help"
              >
                +{hiddenCount}
              </Badge>
            }
          />
          <HoverCardContent align="start">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-muted-foreground">Signals</span>
              <div className="flex flex-wrap gap-1">
                {signals.map((signal) => (
                  <Badge
                    key={signal}
                    variant="secondary"
                    className={cn("border-0", signalBadgeClass[signal])}
                  >
                    {signal}
                  </Badge>
                ))}
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      ) : null}
    </div>
  );
});

const AccountCell = memo(function AccountCell({ row }: { row: Row<IRenewalRiskRecord> }) {
  const renewal = row.original;

  return (
    <div className="flex min-w-0 items-center gap-3">
      <Item
        className="flex size-9 shrink-0 items-center justify-center border border-border/60 bg-background p-0 shadow-xs"
        aria-hidden="true"
      >
        <ItemMedia variant="icon" className="size-auto">
          {renewal.companyLogo}
        </ItemMedia>
      </Item>

      <div className="min-w-0">
        <div className="truncate text-sm font-medium text-foreground">{renewal.account}</div>
        <div className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
          <span className="truncate">{renewal.champion.name}</span>
          <span className="size-1 shrink-0 rounded-full bg-input" aria-hidden />
          <span className="truncate">{renewal.champion.title}</span>
        </div>
        <div className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
          <span className="truncate">{renewal.productLine}</span>
          <span className="size-1 shrink-0 rounded-full bg-input" aria-hidden />
          <span className="shrink-0 tabular-nums">
            {renewal.seats.toLocaleString("en-US")} seats
          </span>
        </div>
      </div>
    </div>
  );
});

const StageCell = memo(function StageCell({ stage }: { stage: IRenewalRiskRecord["stage"] }) {
  return (
    <Badge variant="outline">
      <span
        className={cn("size-1.5 shrink-0 rounded-full!", stageDotClass[stage])}
        aria-hidden="true"
      />
      {stage}
    </Badge>
  );
});

const OwnerCell = memo(function OwnerCell({ row }: { row: Row<IRenewalRiskRecord> }) {
  const owner = row.original.owner;

  return (
    <div className="flex min-w-0 items-center gap-2">
      <Avatar className="size-7">
        <AvatarImage src={owner.avatar} alt={owner.name} />
        <AvatarFallback>{owner.initials}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <div className="truncate text-sm text-foreground">{owner.name}</div>
        <div className="truncate text-xs text-muted-foreground">{owner.title}</div>
      </div>
    </div>
  );
});

const HealthCell = memo(function HealthCell({ health }: { health: number }) {
  return (
    <Progress
      value={health}
      className={cn(
        "min-w-0 flex-1 flex-row flex-nowrap items-center gap-2 **:data-[slot=progress-track]:order-1 **:data-[slot=progress-track]:min-w-12 **:data-[slot=progress-track]:flex-1 **:data-[slot=progress-value]:order-2",
        healthIndicatorClass(health),
      )}
    >
      <ProgressLabel className="sr-only">Renewal health</ProgressLabel>
      <ProgressValue className="shrink-0 text-[10px] leading-none text-muted-foreground tabular-nums">
        {(_, value) => `${value ?? health}%`}
      </ProgressValue>
    </Progress>
  );
});

const RenewalWindowCell = memo(function RenewalWindowCell({
  row,
}: {
  row: Row<IRenewalRiskRecord>;
}) {
  const renewal = row.original;
  const dateLabel = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${renewal.renewalDate}T00:00:00Z`));

  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <span className="text-sm text-foreground tabular-nums">{dateLabel}</span>
      <span className={cn("text-xs tabular-nums", windowToneClass(renewal.daysToRenewal))}>
        {renewal.daysToRenewal} days left
      </span>
    </div>
  );
});

const AlertsCell = memo(function AlertsCell({ row }: { row: Row<IRenewalRiskRecord> }) {
  const renewal = row.original;

  return (
    <div className="min-w-0">
      <Badge variant={alertConfig[renewal.alertState].variant}>
        <span
          className={cn(
            "size-1.5 shrink-0 rounded-full!",
            alertConfig[renewal.alertState].dotClassName,
          )}
          aria-hidden="true"
        />
        {renewal.alertCount} issue{renewal.alertCount === 1 ? "" : "s"}
      </Badge>
      <div className="mt-1 truncate text-sm text-muted-foreground">{renewal.alertSummary}</div>
    </div>
  );
});

function ActionsCell({
  row,
  onAction,
}: {
  row: Row<IRenewalRiskRecord>;
  onAction: (action: RenewalAction, renewal: IRenewalRiskRecord) => void;
}) {
  const { copyToClipboard } = useCopyToClipboard({
    onCopy: () => {
      toast.success("Renewal brief copied", {
        description: `${row.original.account} renewal summary copied to the clipboard.`,
      });
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            aria-label={`Open actions for ${row.original.account}`}
          >
            <MoreHorizontalIcon aria-hidden="true" />
          </Button>
        }
      />
      {/* Content */}
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => onAction("open", row.original)}>
            <EyeIcon className="size-4" aria-hidden="true" />
            Open
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAction("save_plan", row.original)}>
            <FlagIcon className="size-4" aria-hidden="true" />
            Save plan
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAction("exec_review", row.original)}>
            <CalendarDaysIcon className="size-4" aria-hidden="true" />
            Exec review
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() =>
              copyToClipboard(
                [
                  row.original.account,
                  row.original.productLine,
                  row.original.champion.name,
                  formatCurrency(row.original.arr),
                  `${row.original.daysToRenewal} days left`,
                ].join(" ·"),
              )
            }
          >
            <CopyIcon className="size-4" aria-hidden="true" />
            Copy brief
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function createRenewalRiskColumns({
  onAction,
}: {
  onAction: (action: RenewalAction, renewal: IRenewalRiskRecord) => void;
}) {
  return [
    {
      id: "pin",
      header: "",
      cell: ({ row }) => <DataGridTableRowPin row={row} />,
      enableSorting: false,
      enableResizing: false,
      enableHiding: false,
      size: 36,
      meta: {
        skeleton: <Skeleton className="mx-auto size-7" />,
        headerClassName: "ps-5!",
        cellClassName: "ps-5!",
      },
    },
    {
      accessorKey: "account",
      id: "account",
      header: ({ column }) => <DataGridColumnHeader title="Account" column={column} />,
      cell: ({ row }) => <AccountCell row={row} />,
      enableSorting: true,
      enableHiding: false,
      enableResizing: true,
      minSize: 200,
      size: 320,
      meta: {
        autoSize: true,
        skeleton: (
          <div className="flex min-w-0 items-center gap-3">
            <Skeleton className="size-9 shrink-0 rounded-lg" />
            <div className="flex min-w-0 flex-col gap-1">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-44" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ),
      },
    },
    {
      accessorKey: "stageValue",
      id: "stage",
      header: ({ column }) => <DataGridColumnHeader title="Stage" column={column} />,
      cell: ({ row }) => <StageCell stage={row.original.stage} />,
      size: 156,
      enableSorting: true,
      enableHiding: true,
      enableResizing: true,
      meta: {
        skeleton: <Skeleton className="h-6 w-28 rounded-full" />,
      },
    },
    {
      accessorFn: (row) => row.owner.name,
      id: "owner",
      header: ({ column }) => <DataGridColumnHeader title="Owner" column={column} />,
      cell: ({ row }) => <OwnerCell row={row} />,
      size: 184,
      enableSorting: true,
      enableHiding: true,
      enableResizing: true,
      meta: {
        skeleton: (
          <div className="flex items-center gap-2">
            <Skeleton className="size-7 rounded-full" />
            <div className="flex flex-col gap-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ),
      },
    },
    {
      accessorFn: (row) => row.signals.join(""),
      id: "signals",
      header: ({ column }) => <DataGridColumnHeader title="Signals" column={column} />,
      cell: ({ row }) => <SignalsCell signals={row.original.signals} />,
      size: 220,
      enableSorting: false,
      enableHiding: true,
      enableResizing: true,
      meta: {
        skeleton: (
          <div className="flex flex-wrap items-center gap-1">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        ),
      },
    },
    {
      accessorKey: "health",
      id: "health",
      header: ({ column }) => <DataGridColumnHeader title="Health" column={column} />,
      cell: ({ row }) => <HealthCell health={row.original.health} />,
      size: 152,
      enableSorting: true,
      enableHiding: true,
      enableResizing: true,
      meta: {
        skeleton: (
          <div className="flex min-w-0 items-center gap-2">
            <Skeleton className="h-2 min-w-12 flex-1 rounded-full" />
            <Skeleton className="h-3 w-10 shrink-0" />
          </div>
        ),
      },
    },
    {
      accessorKey: "arr",
      id: "arr",
      header: ({ column }) => <DataGridColumnHeader title="ARR" column={column} />,
      cell: ({ row }) => (
        <span className="text-sm font-medium text-foreground tabular-nums">
          {formatCurrency(row.original.arr)}
        </span>
      ),
      size: 124,
      enableSorting: true,
      enableHiding: true,
      enableResizing: true,
      meta: {
        skeleton: <Skeleton className="h-4 w-20" />,
      },
    },
    {
      accessorKey: "daysToRenewal",
      id: "renewalWindow",
      header: ({ column }) => <DataGridColumnHeader title="Renewal" column={column} />,
      cell: ({ row }) => <RenewalWindowCell row={row} />,
      size: 136,
      enableSorting: true,
      enableHiding: true,
      enableResizing: true,
      meta: {
        skeleton: (
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        ),
      },
    },
    {
      accessorKey: "alertValue",
      id: "alerts",
      header: ({ column }) => <DataGridColumnHeader title="Alerts" column={column} />,
      cell: ({ row }) => <AlertsCell row={row} />,
      size: 212,
      enableSorting: true,
      enableHiding: true,
      enableResizing: true,
      meta: {
        skeleton: (
          <div className="flex flex-col gap-1">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-3 w-32" />
          </div>
        ),
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => <ActionsCell row={row} onAction={onAction} />,
      enableSorting: false,
      enableResizing: false,
      enableHiding: false,
      size: 56,
      meta: {
        skeleton: <Skeleton className="mx-auto size-7" />,
        headerClassName: "pe-5!",
        cellClassName: "pe-5!",
      },
    },
  ] satisfies ColumnDef<IRenewalRiskRecord>[];
}
