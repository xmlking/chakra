"use client";

import { Badge, type BadgeProps } from "@workspace/ui/components/reui/badge";
import { Button } from "@workspace/ui/components/shadcn/button";
import { ButtonGroup } from "@workspace/ui/components/shadcn/button-group";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/shadcn/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/shadcn/dropdown-menu";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@workspace/ui/components/shadcn/resizable";
import { ScrollArea } from "@workspace/ui/components/shadcn/scroll-area";
import { CodexDark } from "@workspace/ui/components/shadcn/svgs/codexDark";
import { CodexLight } from "@workspace/ui/components/shadcn/svgs/codexLight";
import { CodexWordmarkDark } from "@workspace/ui/components/shadcn/svgs/codexWordmarkDark";
import { CodexWordmarkLight } from "@workspace/ui/components/shadcn/svgs/codexWordmarkLight";
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/shadcn/tabs";
import { cn } from "cn";
import {
  LayoutDashboardIcon,
  ActivityIcon,
  MailIcon,
  MessageSquareIcon,
  RefreshCwIcon,
  FileIcon,
  SquareCheckIcon,
  FolderIcon,
  ListIcon,
  SettingsIcon,
  WebhookIcon,
  FileTextIcon,
  HeartPulseIcon,
  ScanSearchIcon,
  ChevronDownIcon,
  MoreHorizontalIcon,
  DownloadIcon,
  CopyIcon,
  RotateCcwIcon,
  XIcon,
  Maximize2Icon,
  Minimize2Icon,
  SquarePenIcon,
  PanelLeftIcon,
  Columns2Icon,
  PanelRightIcon,
  PanelBottomIcon,
  Columns3Icon,
} from "lucide-react";
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import { AppHeader } from "./app-header";
import { SidebarShell, useSidebarShell } from "./sidebar-shell";

type BadgeVariant = NonNullable<BadgeProps["variant"]>;

type ShellTab = {
  value: string;
  label: string;
  count: number | null;
  countVariant?: BadgeVariant;
  icon: ReactNode;
};

const VIEW_TABS = [
  {
    value: "overview",
    label: "Overview",
    count: null,
    icon: <LayoutDashboardIcon aria-hidden="true" />,
  },
  {
    value: "activity",
    label: "Activity",
    count: null,
    icon: <ActivityIcon aria-hidden="true" />,
  },
  {
    value: "briefs",
    label: "Briefs",
    count: 6,
    countVariant: "outline",
    icon: <MailIcon aria-hidden="true" />,
  },
  {
    value: "calls",
    label: "Calls",
    count: 3,
    countVariant: "outline",
    icon: <MessageSquareIcon aria-hidden="true" />,
  },
  {
    value: "team",
    label: "Team",
    count: null,
    icon: <RefreshCwIcon aria-hidden="true" />,
  },
  {
    value: "notes",
    label: "Notes",
    count: null,
    icon: <FileIcon aria-hidden="true" />,
  },
  {
    value: "tasks",
    label: "Tasks",
    count: null,
    icon: <SquareCheckIcon aria-hidden="true" />,
  },
  {
    value: "files",
    label: "Files",
    count: null,
    icon: <FolderIcon aria-hidden="true" />,
  },
] satisfies ShellTab[];

const DETAIL_TABS = [
  {
    value: "details",
    label: "Details",
    count: null,
    icon: <ListIcon aria-hidden="true" />,
  },
  {
    value: "comments",
    label: "Comments",
    count: 4,
    countVariant: "outline",
    icon: <MessageSquareIcon aria-hidden="true" />,
  },
] satisfies ShellTab[];

const BOTTOM_SHEET_TABS = [
  {
    value: "settings",
    label: "Settings",
    count: null,
    icon: <SettingsIcon aria-hidden="true" />,
  },
  {
    value: "webhooks",
    label: "Webhooks",
    count: null,
    icon: <WebhookIcon aria-hidden="true" />,
  },
  {
    value: "events",
    label: "Events",
    count: 8,
    countVariant: "warning-light",
    icon: <ActivityIcon aria-hidden="true" />,
  },
  {
    value: "logs",
    label: "Logs",
    count: 3,
    countVariant: "info-light",
    icon: <FileTextIcon aria-hidden="true" />,
  },
  {
    value: "health",
    label: "Health",
    count: 12,
    countVariant: "destructive-light",
    icon: <HeartPulseIcon aria-hidden="true" />,
  },
  {
    value: "inspector",
    label: "Inspector",
    count: null,
    icon: <ScanSearchIcon aria-hidden="true" />,
  },
] satisfies ShellTab[];

const TAB_GAP_WIDTH = 4;
const OVERFLOW_GAP_WIDTH = 20;
const RESIZABLE_PANEL_OUTLINE_CLASS_NAME =
  "[&_[data-panel]]:outline-none [&_[data-panel]>div]:outline-none";
const RESIZABLE_HANDLE_CLASS_NAME =
  "transition-colors hover:bg-primary data-[separator=hover]:bg-primary data-[separator=active]:bg-primary [&>div]:transition-colors hover:[&>div]:bg-primary [&[data-separator=hover]>div]:bg-primary [&[data-separator=active]>div]:bg-primary";

function getEstimatedTabWidth(tab: ShellTab) {
  return Math.max(72, 38 + tab.label.length * 7.25 + (tab.count !== null ? 22 : 0));
}

function getOverflowTriggerWidth(count: number) {
  return 82 + Math.max(0, String(count).length - 1) * 8;
}

function TabCount({
  count,
  variant = "invert-light",
  className,
}: {
  count: number;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <Badge variant={variant} size="sm" radius="full" className={cn("tabular-nums", className)}>
      {count}
    </Badge>
  );
}

const ResponsiveTabs = memo(function ResponsiveTabs({
  tabs,
  defaultValue,
  ariaLabel,
  indicatorEdge = "bottom",
  value,
  onValueChange,
}: {
  tabs: ShellTab[];
  defaultValue: string;
  ariaLabel: string;
  indicatorEdge?: "bottom" | "top";
  value?: string;
  onValueChange?: (value: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [uncontrolledTab, setUncontrolledTab] = useState(defaultValue);
  const [availableWidth, setAvailableWidth] = useState(Number.POSITIVE_INFINITY);
  const isControlled = value !== undefined;
  const activeTab = value ?? uncontrolledTab;

  const handleValueChange = useCallback(
    (nextValue: string) => {
      if (!isControlled) {
        setUncontrolledTab(nextValue);
      }
      onValueChange?.(nextValue);
    },
    [isControlled, onValueChange],
  );

  const handleOverflowValueChange = useCallback(
    (nextValue: string) => {
      handleValueChange(nextValue);
    },
    [handleValueChange],
  );

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new ResizeObserver(([entry]) => {
      const nextWidth = Math.floor(entry.contentRect.width);
      setAvailableWidth((width) => (width === nextWidth ? width : nextWidth));
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const { visibleTabs, overflowTabs } = useMemo(() => {
    const widths = tabs.map(getEstimatedTabWidth);
    const totalWidth =
      widths.reduce((sum, width) => sum + width, 0) + Math.max(0, tabs.length - 1) * TAB_GAP_WIDTH;

    if (availableWidth >= totalWidth || tabs.length <= 1) {
      return { visibleTabs: tabs, overflowTabs: [] };
    }

    const visible: ShellTab[] = [];
    let usedWidth = 0;

    for (let index = 0; index < tabs.length; index += 1) {
      const width = widths[index];
      const remaining = tabs.length - index - 1;
      const reserve = remaining > 0 ? OVERFLOW_GAP_WIDTH + getOverflowTriggerWidth(remaining) : 0;
      const gap = visible.length > 0 ? TAB_GAP_WIDTH : 0;

      if (visible.length === 0 || usedWidth + gap + width + reserve <= availableWidth) {
        visible.push(tabs[index]);
        usedWidth += gap + width;
      } else {
        break;
      }
    }

    return {
      visibleTabs: visible,
      overflowTabs: tabs.slice(visible.length),
    };
  }, [availableWidth, tabs]);
  const activeOverflowTab = overflowTabs.find((tab) => tab.value === activeTab);
  const isOverflowActive = activeOverflowTab !== undefined;

  return (
    <div
      ref={containerRef}
      className="flex h-full w-full min-w-0 items-center gap-5 overflow-visible"
    >
      <Tabs value={activeTab} onValueChange={handleValueChange} className="h-full min-w-0 flex-1">
        <TabsList variant="line" className="h-full w-auto justify-start self-start p-0!">
          {visibleTabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={cn(
                "h-full! flex-none! after:z-10",
                indicatorEdge === "top"
                  ? "group-data-horizontal/tabs:after:-top-px! group-data-horizontal/tabs:after:bottom-auto!"
                  : "group-data-horizontal/tabs:after:-bottom-px!",
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count !== null && <TabCount count={tab.count} variant={tab.countVariant} />}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {overflowTabs.length > 0 && (
        <div
          className={cn(
            "relative ml-auto flex h-full shrink-0 items-center",
            "after:absolute after:inset-x-0 after:z-10 after:h-0.5 after:bg-foreground after:opacity-0 after:transition-opacity",
            indicatorEdge === "top" ? "after:-top-px after:bottom-auto" : "after:-bottom-px",
            isOverflowActive && "after:opacity-100",
          )}
        >
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  aria-label={
                    activeOverflowTab
                      ? `${activeOverflowTab.label} selected in ${ariaLabel}`
                      : `${overflowTabs.length} more ${ariaLabel}`
                  }
                  aria-current={isOverflowActive ? "page" : undefined}
                  className={cn(
                    "shrink-0 px-2 text-sm font-medium text-muted-foreground",
                    isOverflowActive && "text-foreground",
                  )}
                />
              }
            >
              {activeOverflowTab ? (
                <>
                  {activeOverflowTab.icon}
                  <span className="max-w-28 truncate sm:max-w-36">{activeOverflowTab.label}</span>
                  {activeOverflowTab.count !== null && (
                    <TabCount
                      count={activeOverflowTab.count}
                      variant={activeOverflowTab.countVariant}
                    />
                  )}
                </>
              ) : (
                <span>+{overflowTabs.length} more</span>
              )}
              <ChevronDownIcon aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuRadioGroup
                className="w-full"
                value={activeTab}
                onValueChange={handleOverflowValueChange}
              >
                {overflowTabs.map((tab) => (
                  <DropdownMenuRadioItem
                    key={tab.value}
                    value={tab.value}
                    closeOnClick
                    aria-current={tab.value === activeTab ? "page" : undefined}
                    className={cn(
                      "w-full min-w-0 gap-0 pr-2! *:data-[slot=dropdown-menu-radio-item-indicator]:hidden",
                      tab.value === activeTab && "bg-accent text-accent-foreground",
                    )}
                  >
                    <span className="flex w-full min-w-0 items-center gap-2">
                      {tab.icon}
                      <span className="min-w-0 flex-1 truncate">{tab.label}</span>
                      {tab.count !== null && (
                        <TabCount
                          count={tab.count}
                          variant={tab.countVariant}
                          className="ml-auto"
                        />
                      )}
                    </span>
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
});

function Placeholder({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <div
      aria-hidden="true"
      className={cn("shrink-0 rounded-md bg-muted/55", className)}
      style={style}
    />
  );
}

function Dot({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("shrink-0 rounded-full bg-muted/55", className)} />;
}

function PlaceholderPanel({
  className,
  style,
  children,
}: {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <div
      className={cn("rounded-lg border border-dashed border-border/60 bg-background/60", className)}
      style={style}
    >
      {children}
    </div>
  );
}

function PlaceholderRows({
  rows,
  withDots = true,
  withEnd = false,
}: {
  rows: number;
  withDots?: boolean;
  withEnd?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex items-center gap-3">
          {withDots ? <Dot className="size-2.5" /> : null}
          <div className="min-w-0 flex-1">
            <Placeholder className="h-3" style={{ width: `${56 + ((index * 11) % 24)}%` }} />
          </div>
          {withEnd ? <Placeholder className="h-3 w-9" /> : null}
        </div>
      ))}
    </div>
  );
}

function PlaceholderCardGrid({ count, className }: { count: number; className?: string }) {
  return (
    <div className={cn("grid gap-3 sm:grid-cols-2 xl:grid-cols-3", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <PlaceholderPanel key={index} className="flex min-h-24 flex-col p-4">
          <Placeholder className="h-3" style={{ width: `${42 + ((index * 9) % 18)}%` }} />
          <Placeholder className="mt-auto h-4 w-20" />
        </PlaceholderPanel>
      ))}
    </div>
  );
}

function MainContentPlaceholder({ value }: { value: string }) {
  if (value === "activity") {
    return (
      <div className="flex min-h-full flex-col gap-3 p-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <PlaceholderPanel key={index} className="p-4">
            <PlaceholderRows rows={index % 3 === 0 ? 3 : 2} withDots={false} />
          </PlaceholderPanel>
        ))}
      </div>
    );
  }

  if (value === "emails") {
    return (
      <div className="grid min-h-full gap-4 p-4 xl:grid-cols-[minmax(0,0.8fr)_minmax(280px,1fr)]">
        <PlaceholderPanel className="p-4">
          <PlaceholderRows rows={10} />
        </PlaceholderPanel>
        <PlaceholderPanel className="flex min-w-0 flex-col gap-5 p-4">
          <Placeholder className="h-5 w-52 max-w-full" />
          <PlaceholderRows rows={9} withDots={false} />
        </PlaceholderPanel>
      </div>
    );
  }

  if (value === "calls") {
    return (
      <div className="grid min-h-full gap-3 p-4 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <PlaceholderPanel key={index} className="flex min-h-36 flex-col p-4">
            <Placeholder className="h-16 w-16 rounded-full" />
            <Placeholder className="mt-auto h-3 w-24" />
          </PlaceholderPanel>
        ))}
      </div>
    );
  }

  if (value === "team") {
    return (
      <div className="grid min-h-full gap-4 p-4 lg:grid-cols-2">
        <PlaceholderPanel className="p-4">
          <PlaceholderRows rows={10} />
        </PlaceholderPanel>
        <PlaceholderPanel className="p-4">
          <PlaceholderRows rows={9} />
        </PlaceholderPanel>
      </div>
    );
  }

  if (value === "notes") {
    return <PlaceholderCardGrid count={12} className="min-h-full p-4 md:grid-cols-3" />;
  }

  if (value === "tasks") {
    return (
      <div className="flex min-h-full flex-col gap-4 p-4">
        <PlaceholderPanel className="grid gap-3 p-4 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Placeholder key={index} className="h-12" />
          ))}
        </PlaceholderPanel>
        <PlaceholderPanel className="p-4">
          <PlaceholderRows rows={12} withEnd />
        </PlaceholderPanel>
      </div>
    );
  }

  if (value === "files") {
    return (
      <div className="grid min-h-full gap-3 p-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 16 }).map((_, index) => (
          <PlaceholderPanel key={index} className="flex min-h-24 flex-col p-3">
            <Placeholder className="h-7 w-7" />
            <Placeholder className="mt-auto h-3 w-2/3" />
          </PlaceholderPanel>
        ))}
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col gap-4 p-4">
      <PlaceholderCardGrid count={6} />
      <PlaceholderPanel className="p-4">
        <PlaceholderRows rows={10} withEnd />
      </PlaceholderPanel>
    </div>
  );
}

function DetailSidebarPlaceholder({ value }: { value: string }) {
  if (value === "comments") {
    return (
      <div className="flex min-h-full flex-col gap-3 p-4">
        {Array.from({ length: 14 }).map((_, index) => (
          <div key={index} className={cn("flex gap-3", index % 2 === 1 && "flex-row-reverse")}>
            <PlaceholderPanel className="max-w-[82%] flex-1 p-3">
              <PlaceholderRows
                rows={index % 4 === 0 ? 3 : index % 2 === 0 ? 2 : 1}
                withDots={false}
              />
            </PlaceholderPanel>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col gap-5 p-4">
      {Array.from({ length: 5 }).map((_, sectionIndex) => (
        <div key={sectionIndex} className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Placeholder className="h-3 w-24" />
          </div>
          <div className="pl-4">
            <PlaceholderRows rows={4} withDots={false} />
          </div>
        </div>
      ))}
    </div>
  );
}

function WorkbenchHeaderPlaceholder() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="min-w-0 space-y-2">
        <Placeholder className="h-4 w-44 max-w-full" />
        <Placeholder className="h-3 w-64 max-w-full" />
      </div>
      <div className="flex shrink-0 gap-2">
        <Placeholder className="h-8 w-20" />
      </div>
    </div>
  );
}

function WorkbenchMetricCards({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <PlaceholderPanel key={index} className="flex min-h-20 flex-col p-4">
          <Placeholder className="h-3 w-20" />
          <Placeholder className="mt-auto h-4" style={{ width: `${44 + ((index * 7) % 22)}%` }} />
        </PlaceholderPanel>
      ))}
    </div>
  );
}

function WorkbenchTableRows({ rows = 7, compact = false }: { rows?: number; compact?: boolean }) {
  return (
    <PlaceholderPanel className="min-w-0 overflow-hidden">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "grid grid-cols-[minmax(0,1fr)_64px] items-center gap-4 border-b border-dashed border-border/70 px-4 last:border-b-0 sm:grid-cols-[96px_minmax(0,1fr)_64px]",
            compact ? "min-h-10" : "min-h-12",
          )}
        >
          <Placeholder className="hidden h-3 w-16 sm:block" />
          <Placeholder className="h-3" style={{ width: `${44 + ((index * 9) % 30)}%` }} />
          <Placeholder className="h-3 w-9 justify-self-end" />
        </div>
      ))}
    </PlaceholderPanel>
  );
}

function WorkbenchDetailPanel({ rows = 5 }: { rows?: number }) {
  return (
    <PlaceholderPanel className="flex min-w-0 flex-col gap-4 p-4">
      <Placeholder className="h-4 w-32" />
      <PlaceholderRows rows={rows} />
    </PlaceholderPanel>
  );
}

function WorkbenchSettingsPlaceholder() {
  return (
    <div className="grid min-h-full gap-4 p-4 lg:grid-cols-2">
      {Array.from({ length: 3 }).map((_, sectionIndex) => (
        <PlaceholderPanel key={sectionIndex} className="flex min-w-0 flex-col">
          <div className="flex min-h-12 items-center gap-3 border-b border-dashed border-border/70 px-4">
            <Placeholder className="h-4 w-36" />
          </div>
          <div className="flex flex-col">
            {Array.from({ length: 7 }).map((__, rowIndex) => (
              <div
                key={rowIndex}
                className="flex min-h-12 items-center gap-4 border-b border-dashed border-border/70 px-4 py-3 last:border-b-0"
              >
                <Placeholder className="h-3 flex-1" />
                <Placeholder className="h-5 w-10 rounded-full" />
              </div>
            ))}
          </div>
        </PlaceholderPanel>
      ))}
    </div>
  );
}

function WorkbenchWebhookPlaceholder() {
  return (
    <div className="grid min-h-full gap-4 p-4 lg:grid-cols-[320px_minmax(0,1fr)]">
      <WorkbenchDetailPanel rows={7} />
      <PlaceholderPanel className="flex min-w-0 flex-col gap-4 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-2">
            <Placeholder className="h-4 w-36" />
            <Placeholder className="h-3 w-56 max-w-full" />
          </div>
        </div>
        <PlaceholderRows rows={8} withEnd />
      </PlaceholderPanel>
    </div>
  );
}

function WorkbenchEventsPlaceholder() {
  return (
    <div className="flex min-h-full flex-col gap-4 p-4">
      <WorkbenchMetricCards count={3} />
      <WorkbenchTableRows rows={12} />
    </div>
  );
}

function WorkbenchHealthPlaceholder() {
  return (
    <div className="grid min-h-full gap-4 p-4 lg:grid-cols-[320px_minmax(0,1fr)]">
      <PlaceholderPanel className="flex min-w-0 flex-col gap-4 p-4">
        <Placeholder className="h-4 w-32" />
        <PlaceholderRows rows={8} withDots={false} />
      </PlaceholderPanel>
      <WorkbenchTableRows rows={11} />
    </div>
  );
}

function WorkbenchInspectorPlaceholder() {
  return (
    <div className="grid min-h-full gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <PlaceholderPanel className="grid min-h-72 gap-3 p-4 sm:grid-cols-2">
        <Placeholder className="h-28" />
        <Placeholder className="h-28" />
        <Placeholder className="h-36 sm:col-span-2" />
      </PlaceholderPanel>
      <WorkbenchDetailPanel rows={8} />
    </div>
  );
}

function WorkbenchLogPlaceholder() {
  return (
    <div className="grid min-h-full gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_280px]">
      <WorkbenchTableRows rows={14} compact />
      <PlaceholderPanel className="flex min-w-0 flex-col gap-4 p-4">
        <Placeholder className="h-4 w-24" />
        <PlaceholderRows rows={8} withDots={false} />
      </PlaceholderPanel>
    </div>
  );
}

function WorkbenchTablePlaceholder() {
  return (
    <div className="flex min-h-full flex-col gap-4 p-4">
      <WorkbenchHeaderPlaceholder />
      <WorkbenchTableRows rows={12} />
    </div>
  );
}

function WorkbenchTabContent({ value }: { value: string }) {
  if (value === "settings") {
    return <WorkbenchSettingsPlaceholder />;
  }

  if (value === "webhooks") {
    return <WorkbenchWebhookPlaceholder />;
  }

  if (value === "events") {
    return <WorkbenchEventsPlaceholder />;
  }

  if (value === "health") {
    return <WorkbenchHealthPlaceholder />;
  }

  if (value === "inspector") {
    return <WorkbenchInspectorPlaceholder />;
  }

  if (value === "logs") {
    return <WorkbenchLogPlaceholder />;
  }

  return <WorkbenchTablePlaceholder />;
}

const WorkbenchBody = memo(function WorkbenchBody({ activeTab }: { activeTab: string }) {
  return (
    <div className="min-h-0 flex-1 overflow-hidden">
      <ScrollArea className="mr-0.5 h-full">
        <WorkbenchTabContent value={activeTab} />
      </ScrollArea>
    </div>
  );
});

const WorkbenchTabs = memo(function WorkbenchTabs({
  activeTab,
  onActiveTabChange,
}: {
  activeTab: string;
  onActiveTabChange: (value: string) => void;
}) {
  return (
    <div className="flex h-(--app-bottom-bar-height) min-w-0 shrink-0 items-stretch border-t border-border bg-background px-3 sm:px-4">
      <ResponsiveTabs
        tabs={BOTTOM_SHEET_TABS}
        defaultValue="settings"
        value={activeTab}
        onValueChange={onActiveTabChange}
        ariaLabel="workbench tabs"
        indicatorEdge="top"
      />
    </div>
  );
});

const WorkbenchUtilityActions = memo(function WorkbenchUtilityActions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Workbench actions"
            className="text-muted-foreground"
          />
        }
      >
        <MoreHorizontalIcon aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem>
          <RefreshCwIcon aria-hidden="true" />
          Refresh view
        </DropdownMenuItem>
        <DropdownMenuItem>
          <DownloadIcon aria-hidden="true" />
          Export snapshot
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CopyIcon aria-hidden="true" />
          Copy link
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <RotateCcwIcon aria-hidden="true" />
          Reset layout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

const DetailSidebarActions = memo(function DetailSidebarActions({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <div className="ml-auto flex shrink-0 items-center gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Detail sidebar actions"
              className="text-muted-foreground"
            />
          }
        >
          <MoreHorizontalIcon aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem>
            <RefreshCwIcon aria-hidden="true" />
            Refresh details
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CopyIcon aria-hidden="true" />
            Copy record link
          </DropdownMenuItem>
          <DropdownMenuItem>
            <DownloadIcon aria-hidden="true" />
            Export details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <RotateCcwIcon aria-hidden="true" />
            Reset sidebar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={onClose}
        aria-label="Hide detail sidebar"
        className="text-muted-foreground"
      >
        <XIcon aria-hidden="true" />
      </Button>
    </div>
  );
});

const WorkbenchPanelHeader = memo(function WorkbenchPanelHeader({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <div className="flex h-10 shrink-0 items-center justify-between gap-3 border-b border-border px-3 sm:px-4">
      <span className="truncate text-sm font-semibold">Workbench</span>
      <div className="flex shrink-0 items-center gap-1">
        <WorkbenchUtilityActions />
        <DialogTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Expand workbench"
              className="text-muted-foreground"
            />
          }
        >
          <Maximize2Icon aria-hidden="true" />
        </DialogTrigger>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          aria-label="Hide workbench sheet"
          className="text-muted-foreground"
        >
          <XIcon aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
});

const WorkbenchDialogContent = memo(function WorkbenchDialogContent({
  activeTab,
  onActiveTabChange,
}: {
  activeTab: string;
  onActiveTabChange: (value: string) => void;
}) {
  return (
    <DialogContent
      showCloseButton={false}
      className="flex h-[var(--app-workbench-dialog-height,calc(100dvh-1rem))] max-h-[var(--app-workbench-dialog-height,calc(100dvh-1rem))] w-[calc(100vw-1rem)] max-w-[calc(100vw-1rem)] flex-col gap-0! overflow-hidden p-0! sm:h-[var(--app-workbench-dialog-height,calc(100dvh-3rem))] sm:max-h-[var(--app-workbench-dialog-height,calc(100dvh-3rem))] sm:w-[calc(100vw-3rem)] sm:max-w-[calc(100vw-3rem)]"
    >
      <DialogHeader className="flex h-12 shrink-0 flex-row items-center justify-between gap-3! border-b border-border bg-background px-4 py-0 sm:px-5">
        <div className="min-w-0">
          <DialogTitle className="truncate text-sm font-semibold">Workbench</DialogTitle>
          <DialogDescription className="sr-only">
            Expanded workbench with scrollable content and pinned bottom tabs.
          </DialogDescription>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <WorkbenchUtilityActions />
          <DialogClose
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Restore workbench panel"
                className="text-muted-foreground"
              />
            }
          >
            <Minimize2Icon aria-hidden="true" />
          </DialogClose>
          <DialogClose
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Close expanded workbench"
                className="text-muted-foreground"
              />
            }
          >
            <XIcon aria-hidden="true" />
          </DialogClose>
        </div>
      </DialogHeader>

      <WorkbenchBody activeTab={activeTab} />

      <DialogFooter className="mx-0! mb-0! h-[var(--app-workbench-dialog-bar-height,var(--app-bottom-bar-height,44px))] min-w-0 shrink-0 flex-row items-stretch justify-start gap-0 rounded-b-none! border-t! border-border bg-background! p-0! px-3! py-0! sm:justify-start sm:px-4!">
        <ResponsiveTabs
          tabs={BOTTOM_SHEET_TABS}
          defaultValue="settings"
          value={activeTab}
          onValueChange={onActiveTabChange}
          ariaLabel="expanded workbench tabs"
          indicatorEdge="top"
        />
      </DialogFooter>
    </DialogContent>
  );
});

const BottomWorkbenchSheet = memo(function BottomWorkbenchSheet({
  activeTab,
  onActiveTabChange,
  onClose,
}: {
  activeTab: string;
  onActiveTabChange: (value: string) => void;
  onClose: () => void;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <section
        aria-label="Workbench bottom sheet"
        className="flex size-full min-h-0 min-w-0 flex-col bg-background"
      >
        <WorkbenchPanelHeader onClose={onClose} />
        <WorkbenchBody activeTab={activeTab} />
        <WorkbenchTabs activeTab={activeTab} onActiveTabChange={onActiveTabChange} />
      </section>

      {dialogOpen ? (
        <WorkbenchDialogContent activeTab={activeTab} onActiveTabChange={onActiveTabChange} />
      ) : null}
    </Dialog>
  );
});

const MainPanel = memo(function MainPanel() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <section className="flex size-full min-h-0 min-w-0 flex-col overflow-hidden">
      <div className="flex h-11 min-w-0 shrink-0 items-stretch border-b border-border bg-background px-3">
        <ResponsiveTabs
          tabs={VIEW_TABS}
          defaultValue="overview"
          value={activeTab}
          onValueChange={setActiveTab}
          ariaLabel="record views"
        />
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        <ScrollArea className="mr-0.5 h-full">
          <MainContentPlaceholder value={activeTab} />
        </ScrollArea>
      </div>
    </section>
  );
});

const DetailPanel = memo(function DetailPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState("details");

  return (
    <aside aria-hidden={!open} className="flex size-full min-h-0 min-w-0 flex-col overflow-hidden">
      <div className="flex h-11 min-w-0 shrink-0 items-stretch gap-2 border-b border-border bg-background px-3">
        <div className="min-w-0 flex-1">
          <ResponsiveTabs
            tabs={DETAIL_TABS}
            defaultValue="details"
            value={activeTab}
            onValueChange={setActiveTab}
            ariaLabel="detail views"
          />
        </div>
        <DetailSidebarActions onClose={onClose} />
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        <ScrollArea className="mr-0.5 h-full">
          <DetailSidebarPlaceholder value={activeTab} />
        </ScrollArea>
      </div>
    </aside>
  );
});

export function AppShell() {
  return (
    <SidebarShell>
      <SidebarContentPlaceholder />
    </SidebarShell>
  );
}

function SidebarContentPlaceholder() {
  const {
    contentSidebarOpen,
    bottomSheetOpen,
    workspaceSidebarOpen,
    contextSidebarOpen,
    allSidebarsExpanded,
    toggleWorkspaceSidebar,
    toggleContentSidebar,
    toggleBottomSheet,
    toggleContextSidebar,
    toggleAllSidebars,
  } = useSidebarShell();
  const [activeBottomTab, setActiveBottomTab] = useState("settings");

  return (
    <>
      {/* Header */}
      <AppHeader />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {/* Content Topbar */}
        <div className="flex h-(--app-topbar-height) shrink-0 items-center gap-2.5 border-b border-border bg-background px-3 sm:px-4">
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <span className="flex min-w-0 shrink items-center gap-2" aria-label="Codex">
              <span className="flex size-6 shrink-0 items-center justify-center">
                <CodexLight className="size-5 dark:hidden" aria-hidden="true" />
                <CodexDark className="hidden size-5 dark:block" aria-hidden="true" />
              </span>
              <CodexWordmarkLight className="h-4 w-auto max-w-20 dark:hidden" aria-hidden="true" />
              <CodexWordmarkDark
                className="hidden h-4 w-auto max-w-20 dark:block"
                aria-hidden="true"
              />
            </span>
          </div>

          <div
            role="toolbar"
            aria-label="Record actions"
            className="flex min-w-0 shrink-0 items-center justify-end gap-1.5 sm:gap-2"
          >
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              aria-label="Add note"
              className="sm:hidden"
            >
              <SquarePenIcon aria-hidden="true" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="default"
              className="hidden sm:inline-flex"
            >
              <SquarePenIcon data-icon="inline-start" aria-hidden="true" />
              <span>Add note</span>
            </Button>

            <ButtonGroup>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={toggleWorkspaceSidebar}
                aria-label={
                  workspaceSidebarOpen ? "Collapse workspace sidebar" : "Expand workspace sidebar"
                }
                aria-pressed={workspaceSidebarOpen}
              >
                <PanelLeftIcon aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={toggleContentSidebar}
                aria-label={
                  contentSidebarOpen ? "Collapse details sidebar" : "Expand details sidebar"
                }
                aria-pressed={contentSidebarOpen}
              >
                <Columns2Icon aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={toggleContextSidebar}
                aria-label={
                  contextSidebarOpen ? "Collapse context sidebar" : "Expand context sidebar"
                }
                aria-pressed={contextSidebarOpen}
              >
                <PanelRightIcon aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={toggleBottomSheet}
                aria-label={
                  bottomSheetOpen ? "Hide workbench bottom sheet" : "Show workbench bottom sheet"
                }
                aria-pressed={bottomSheetOpen}
              >
                <PanelBottomIcon aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={toggleAllSidebars}
                aria-label={allSidebarsExpanded ? "Collapse all sidebars" : "Expand all sidebars"}
                aria-pressed={allSidebarsExpanded}
              >
                <Columns3Icon aria-hidden="true" />
              </Button>
            </ButtonGroup>
          </div>
        </div>

        {/* Content */}
        <div className="min-h-0 flex-1 overflow-hidden">
          <ResizablePanelGroup
            id="sidebar-11-shell-vertical-panel-group"
            orientation="vertical"
            className={cn("min-h-0", RESIZABLE_PANEL_OUTLINE_CLASS_NAME)}
          >
            <ResizablePanel
              id="sidebar-11-primary-workspace-panel"
              defaultSize="64%"
              minSize="34%"
              maxSize="100%"
              className="min-h-0 min-w-0"
            >
              <div className="hidden size-full min-h-0 min-w-0 overflow-hidden lg:block">
                <ResizablePanelGroup
                  id="sidebar-11-desktop-panel-group"
                  orientation="horizontal"
                  className={cn("min-h-0", RESIZABLE_PANEL_OUTLINE_CLASS_NAME)}
                >
                  <ResizablePanel
                    id="sidebar-11-desktop-main-panel"
                    defaultSize={contentSidebarOpen ? "62%" : "100%"}
                    minSize="45%"
                    className="min-w-0"
                  >
                    <MainPanel />
                  </ResizablePanel>

                  {contentSidebarOpen && (
                    <>
                      <ResizableHandle withHandle className={RESIZABLE_HANDLE_CLASS_NAME} />
                      <ResizablePanel
                        id="sidebar-11-desktop-detail-panel"
                        defaultSize="38%"
                        minSize="28%"
                        maxSize="50%"
                        className="min-w-0"
                      >
                        <DetailPanel open={contentSidebarOpen} onClose={toggleContentSidebar} />
                      </ResizablePanel>
                    </>
                  )}
                </ResizablePanelGroup>
              </div>

              <div className="size-full min-h-0 min-w-0 overflow-hidden lg:hidden">
                <ResizablePanelGroup
                  id="sidebar-11-mobile-panel-group"
                  orientation="vertical"
                  className={cn("min-h-0", RESIZABLE_PANEL_OUTLINE_CLASS_NAME)}
                >
                  <ResizablePanel
                    id="sidebar-11-mobile-main-panel"
                    defaultSize={contentSidebarOpen ? "58%" : "100%"}
                    minSize="32%"
                    className="min-h-0"
                  >
                    <MainPanel />
                  </ResizablePanel>

                  {contentSidebarOpen && (
                    <>
                      <ResizableHandle withHandle className={RESIZABLE_HANDLE_CLASS_NAME} />
                      <ResizablePanel
                        id="sidebar-11-mobile-detail-panel"
                        defaultSize="42%"
                        minSize="28%"
                        className="min-h-0"
                      >
                        <DetailPanel open={contentSidebarOpen} onClose={toggleContentSidebar} />
                      </ResizablePanel>
                    </>
                  )}
                </ResizablePanelGroup>
              </div>
            </ResizablePanel>

            {bottomSheetOpen && (
              <>
                <ResizableHandle withHandle className={RESIZABLE_HANDLE_CLASS_NAME} />
                <ResizablePanel
                  id="sidebar-11-workbench-panel"
                  defaultSize="36%"
                  minSize="24%"
                  maxSize="62%"
                  className="min-h-0 min-w-0"
                >
                  <BottomWorkbenchSheet
                    activeTab={activeBottomTab}
                    onActiveTabChange={setActiveBottomTab}
                    onClose={toggleBottomSheet}
                  />
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        </div>
      </div>
    </>
  );
}
