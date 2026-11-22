import {
  useTable,
  type ColumnPinningState,
  type OnChangeFn,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table";
import {
  dataGridFeatures,
  DataGrid as ReuiDataGrid,
} from "@workspace/ui/components/reui/data-grid/data-grid";
import { DataGridCellSelection } from "@workspace/ui/components/reui/data-grid/data-grid-cell-selection";
import { type DataGridI18nOverrides } from "@workspace/ui/components/reui/data-grid/data-grid-i18n";
import { DataGridPagination } from "@workspace/ui/components/reui/data-grid/data-grid-pagination";
import { DataGridScrollArea } from "@workspace/ui/components/reui/data-grid/data-grid-scroll-area";
import { DataGridTable } from "@workspace/ui/components/reui/data-grid/data-grid-table";
import {
  Frame,
  FrameDescription,
  FrameFooter,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@workspace/ui/components/reui/frame";
import { Button } from "@workspace/ui/components/shadcn/button";
import { ButtonGroup } from "@workspace/ui/components/shadcn/button-group";
import { Calendar } from "@workspace/ui/components/shadcn/calendar";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/shadcn/empty";
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/shadcn/popover";
import { Separator } from "@workspace/ui/components/shadcn/separator";
import { TooltipProvider } from "@workspace/ui/components/shadcn/tooltip";
import { cn } from "cn";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import { toast } from "sonner";

import { sessionTime, type EventKind, type PlanEvent } from "./activity";
import { columnsFor, dayAirOf, daySizeFor } from "./columns";
import {
  dayNumber,
  isoOf,
  MANAGER_BY_ID,
  SERVICES,
  TECHNICIAN_BY_ID,
  TODAY_DAY,
  VENDOR_BY_ID,
  type Kitchen,
  type ServiceId,
  type Visit,
  type VisitDraft,
} from "./data";
import {
  CancelVisitDialog,
  RemoveKitchensDialog,
  type PendingCancel,
  type PendingRemoval,
} from "./delete-dialog";
import { GridToolbar } from "./grid-toolbar";
import { ICON_ON_PHONE, TOAST_SUCCESS_ICON, UI_ICONS } from "./icons";
import { awaitingInWindow } from "./kitchen-cells";
import { KitchenSheet, type SheetActions, type SheetState } from "./kitchen-sheet";
import {
  PlanActionsProvider,
  PlanViewProvider,
  type BookPrefill,
  type KitchenView,
  type PlanActions,
  type PlanView,
} from "./plan-context";
import {
  autoTechnician,
  CELL_KINDS,
  coverageOf,
  crewClashOf,
  CURRENT_WINDOW_START,
  formatLongDay,
  fromIsoDay,
  MAX_WINDOW_START,
  MIN_WINDOW_START,
  openSlotOf,
  planOf,
  plural,
  serviceStateOf,
  toIsoDay,
  visitLabel,
  weekStartOf,
  WINDOW_DAYS,
  windowRangeLabel,
  type CellKind,
} from "./plan-math";
import { usePlanStore } from "./plan-store";
import { SelectionBar } from "./selection-bar";
import { DEFAULT_GRID_SETTINGS, type GridSettings } from "./settings-menu";
import { BookAllButton, StatusBand } from "./status-band";
import { DotSeparator } from "./value-faces";

const UNDO_TOAST_MS = 8000;
const PAGE_SIZES = [10, 25, 50];

/** Module scope: the grid keys its context on these labels' identity. */
const GRID_I18N = {
  labels: {
    paginationInfo: ({ from, to, count }) => `${from} - ${to} of ${plural(count, "kitchen")}`,
  },
} satisfies DataGridI18nOverrides;

/** Kitchen stays put while the days scroll sideways under it. */
const COLUMN_PINNING: ColumnPinningState = {
  start: ["select", "kitchen"],
  end: ["actions"],
};

/** Phones leave the row menu unpinned, so the days keep some room. */
const PHONE_PINNING: ColumnPinningState = {
  start: ["select", "kitchen"],
  end: [],
};

/** Room under the last row for the sideways bar (its 10px track and 1px
 *  edge gap), so it never covers a tile; only while the days overflow. */
const SCROLL_STRIP = "data-has-overflow-x:pb-[calc(var(--data-grid-scrollbar-size,0.625rem)+1px)]";

const PHONE_QUERY = "(max-width: 639px)";

function subscribePhone(onChange: () => void) {
  const query = window.matchMedia(PHONE_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function useIsPhone() {
  return useSyncExternalStore(
    subscribePhone,
    () => window.matchMedia(PHONE_QUERY).matches,
    () => false,
  );
}

/** Pinned cells paint the panel's card, under their own lines too: dark
 *  borders are translucent, and the scrolled days showed through them. */
const PINNED_SURFACE =
  "[--data-grid-surface:var(--frame-panel-bg)] [&_th[data-pinned]]:bg-(--data-grid-surface) [&_[data-pinned]]:bg-clip-border!";

/** A hovered day lights its column with the row hover's wash, so the
 *  pointer reads on both lines. One literal per day keeps the classes static. */
const COLUMN_HOVER = [
  "[&:has(td[data-col-id=d0]:hover)_td[data-col-id=d0]]:bg-muted/40",
  "[&:has(td[data-col-id=d1]:hover)_td[data-col-id=d1]]:bg-muted/40",
  "[&:has(td[data-col-id=d2]:hover)_td[data-col-id=d2]]:bg-muted/40",
  "[&:has(td[data-col-id=d3]:hover)_td[data-col-id=d3]]:bg-muted/40",
  "[&:has(td[data-col-id=d4]:hover)_td[data-col-id=d4]]:bg-muted/40",
  "[&:has(td[data-col-id=d5]:hover)_td[data-col-id=d5]]:bg-muted/40",
  "[&:has(td[data-col-id=d6]:hover)_td[data-col-id=d6]]:bg-muted/40",
  "[&:has(td[data-col-id=d7]:hover)_td[data-col-id=d7]]:bg-muted/40",
  "[&:has(td[data-col-id=d8]:hover)_td[data-col-id=d8]]:bg-muted/40",
  "[&:has(td[data-col-id=d9]:hover)_td[data-col-id=d9]]:bg-muted/40",
  "[&:has(td[data-col-id=d10]:hover)_td[data-col-id=d10]]:bg-muted/40",
  "[&:has(td[data-col-id=d11]:hover)_td[data-col-id=d11]]:bg-muted/40",
  "[&:has(td[data-col-id=d12]:hover)_td[data-col-id=d12]]:bg-muted/40",
  "[&:has(td[data-col-id=d13]:hover)_td[data-col-id=d13]]:bg-muted/40",
  "[&:has(td[data-col-id=d14]:hover)_td[data-col-id=d14]]:bg-muted/40",
  "[&:has(td[data-col-id=d15]:hover)_td[data-col-id=d15]]:bg-muted/40",
  "[&:has(td[data-col-id=d16]:hover)_td[data-col-id=d16]]:bg-muted/40",
  "[&:has(td[data-col-id=d17]:hover)_td[data-col-id=d17]]:bg-muted/40",
  "[&:has(td[data-col-id=d18]:hover)_td[data-col-id=d18]]:bg-muted/40",
  "[&:has(td[data-col-id=d19]:hover)_td[data-col-id=d19]]:bg-muted/40",
  "[&:has(td[data-col-id=d20]:hover)_td[data-col-id=d20]]:bg-muted/40",
].join(" ");

/** Stripes reach the pinned cells too: the stock stripe paints the row,
 *  which the opaque pinned cells cover, so they take it pre-mixed. */
const PINNED_STRIPES = [
  "[&_tbody>tr:nth-child(odd)>td[data-pinned]]:bg-[color-mix(in_oklab,var(--muted)_90%,var(--data-grid-surface))]",
  "[&_tbody>tr:nth-child(odd):hover>td[data-pinned]]:bg-muted",
  "[&_tbody>tr:nth-child(even):hover>td[data-pinned]]:bg-(--data-grid-surface)",
  // A picked row keeps the stock selected wash over its stripe.
  "[&_tbody>tr[data-state=selected]>td[data-pinned]]:bg-[color-mix(in_oklab,var(--muted)_50%,var(--data-grid-surface))]!",
].join(" ");

/** With column lines on, Kitchen's own line is the pinned seam; the stock
 *  inset edge beside it would double it to 2px. */
const SINGLE_START_SEAM =
  "[&_td[data-pinned=start]]:shadow-none! [&_th[data-pinned=start]]:shadow-none!";

/** Riskiest kitchens first: that is the order a coordinator works down. */
const DEFAULT_SORTING: SortingState = [{ id: "coverage", desc: false }];

/** One toast shape for every write: success icon, and Undo when it can. */
function notify(title: string, description: string, undo?: () => void) {
  toast.success(title, {
    icon: TOAST_SUCCESS_ICON,
    description,
    duration: undo ? UNDO_TOAST_MS : undefined,
    action: undo ? { label: "Undo", onClick: undo } : undefined,
  });
}

const clampWindow = (start: number) =>
  Math.min(MAX_WINDOW_START, Math.max(MIN_WINDOW_START, start));

/** An unbooked due day in the window, ready to book. */
interface Opening {
  kitchen: Kitchen;
  service: ServiceId;
  iso: string;
}

export function DataGridView() {
  const store = usePlanStore();
  const { writeVisits } = store;

  const [windowStart, setWindowStart] = useState(CURRENT_WINDOW_START);
  const [searchQuery, setSearchQuery] = useState("");
  const [lens, setLens] = useState<ServiceId | null>(null);
  const [focusKinds, setFocusKinds] = useState<CellKind[]>([]);
  const [sorting, setSorting] = useState<SortingState>(DEFAULT_SORTING);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZES[0],
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const isPhone = useIsPhone();
  const [settings, setSettings] = useState<GridSettings>(DEFAULT_GRID_SETTINGS);

  // The sheet mounts closed; its state is kept after close for the exit.
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetState, setSheetState] = useState<SheetState | null>(null);
  const [pendingRemoval, setPendingRemoval] = useState<PendingRemoval | null>(null);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [weekPickerOpen, setWeekPickerOpen] = useState(false);
  const [pendingCancel, setPendingCancel] = useState<PendingCancel | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  // A created kitchen: the grid pages to it on the next render.
  const [revealId, setRevealId] = useState<string | null>(null);
  // This session's changes, newest first; they leave again with their Undo.
  const [events, setEvents] = useState<PlanEvent[]>([]);
  const eventSeq = useRef(0);

  const searchRef = useRef<HTMLInputElement>(null);
  const originRef = useRef<HTMLElement | null>(null);
  // A remove that starts in the sheet closes it first; the dialog owns focus.
  const removingRef = useRef(false);
  // Set when a selection-bar action closes the bar, so focus lands on search.
  const restoreFocusRef = useRef(false);
  // Booking reads every visit for the technician load; a ref keeps the
  // actions stable while the visits change under them.
  const visitsRef = useRef(store.visits);
  useEffect(() => {
    visitsRef.current = store.visits;
  }, [store.visits]);

  // The focused cell draws its frame only while the keyboard drives the grid;
  // a click stays chrome-free, the popovers are the feedback.
  const gridRegionRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const setSource = (source: "keyboard" | "pointer") => () => {
      gridRegionRef.current?.setAttribute("data-focus-source", source);
    };
    const onKey = setSource("keyboard");
    const onPointer = setSource("pointer");
    document.addEventListener("keydown", onKey, true);
    document.addEventListener("pointerdown", onPointer, true);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.removeEventListener("pointerdown", onPointer, true);
    };
  }, []);

  // The days take the grid's free width, measured before the first paint.
  const [daySize, setDaySize] = useState(() => daySizeFor(0));
  useLayoutEffect(() => {
    const region = gridRegionRef.current;
    if (!region) return;
    const measure = () => setDaySize(daySizeFor(region.clientWidth));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(region);
    return () => observer.disconnect();
  }, []);
  const columns = useMemo(() => columnsFor(daySize), [daySize]);

  // "/" jumps to search, unless the reader is already typing somewhere.
  useEffect(() => {
    const onSlash = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable || target.closest("input, textarea, select, [role=dialog]"))
      )
        return;
      event.preventDefault();
      searchRef.current?.focus();
    };
    document.addEventListener("keydown", onSlash);
    return () => document.removeEventListener("keydown", onSlash);
  }, []);

  // ── Derived plan ──

  /** Every service per kitchen, for the sheet: the lens never hides a cycle there. */
  const allPlans = useMemo(() => {
    const map = new Map<string, KitchenView>();
    for (const kitchen of store.kitchens) {
      const visits = store.visitsByKitchen.get(kitchen.id) ?? [];
      const plan = planOf(kitchen, visits, null);
      map.set(kitchen.id, {
        ...plan,
        coverage: coverageOf(plan.states),
        visits,
      });
    }
    return map;
  }, [store.kitchens, store.visitsByKitchen]);

  /** The grid's plans, through the service lens when one is picked. */
  const plans = useMemo(() => {
    if (!lens) return allPlans;
    const map = new Map<string, KitchenView>();
    for (const kitchen of store.kitchens) {
      const visits = store.visitsByKitchen.get(kitchen.id) ?? [];
      const plan = planOf(kitchen, visits, lens);
      map.set(kitchen.id, {
        ...plan,
        coverage: coverageOf(plan.states),
        visits,
      });
    }
    return map;
  }, [allPlans, store.kitchens, store.visitsByKitchen, lens]);

  /** Every cell of a kitchen inside the window, in day order. */
  const windowCells = useCallback(
    (kitchenId: string) => {
      const plan = plans.get(kitchenId);
      if (!plan) return [];
      const cells = [];
      for (let day = windowStart; day < windowStart + WINDOW_DAYS; day++) {
        const cell = plan.cells.get(day);
        if (cell) cells.push({ day, cell });
      }
      return cells;
    },
    [plans, windowStart],
  );

  // Search and the service lens; the status band counts over these.
  const searched = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return store.kitchens.filter((kitchen) => {
      if (lens && !kitchen.services.includes(lens)) return false;
      if (!query) return true;
      const manager = MANAGER_BY_ID.get(kitchen.managerId)?.name ?? "";
      // A technician or vendor finds the kitchens it visits in view.
      const crews = windowCells(kitchen.id).flatMap(({ cell }) => {
        const tech = cell.visit ? TECHNICIAN_BY_ID.get(cell.visit.technicianId) : undefined;
        const vendor = tech ? VENDOR_BY_ID.get(tech.vendorId) : undefined;
        return [tech?.name ?? "", vendor?.name ?? ""];
      });
      return [kitchen.name, manager, ...crews].some((name) => name.toLowerCase().includes(query));
    });
  }, [store.kitchens, searchQuery, lens, windowCells]);

  const counts = useMemo(() => {
    const result = Object.fromEntries(CELL_KINDS.map((kind) => [kind, 0])) as Record<
      CellKind,
      number
    >;
    for (const kitchen of searched)
      for (const { cell } of windowCells(kitchen.id)) result[cell.kind] += 1;
    return result;
  }, [searched, windowCells]);

  const focus = useMemo(() => new Set(focusKinds), [focusKinds]);

  const sorted = useMemo(() => {
    const narrowed =
      focus.size === 0
        ? searched
        : searched.filter((kitchen) =>
            windowCells(kitchen.id).some(({ cell }) => focus.has(cell.kind)),
          );
    const rule = sorting[0] ?? DEFAULT_SORTING[0];
    const direction = rule.desc ? -1 : 1;
    return [...narrowed].sort((a, b) => {
      const byName = a.name.localeCompare(b.name);
      if (rule.id === "kitchen") return byName * direction;
      const rankA = plans.get(a.id)?.coverage.rank ?? 1;
      const rankB = plans.get(b.id)?.coverage.rank ?? 1;
      return (rankA - rankB) * direction || byName;
    });
  }, [searched, focus, windowCells, sorting, plans]);

  // A booking never moves a row under the pointer: the order holds until the
  // query itself changes (a sort, search, lens, status or window).
  const queryKey = JSON.stringify([searchQuery, lens, focusKinds, sorting, windowStart]);
  const [held, setHeld] = useState(() => ({
    key: queryKey,
    ids: sorted.map((kitchen) => kitchen.id),
  }));
  if (held.key !== queryKey) {
    setHeld({ key: queryKey, ids: sorted.map((kitchen) => kitchen.id) });
  }
  const data = useMemo(() => {
    if (held.key !== queryKey) return sorted;
    const kept = held.ids.flatMap((id) => {
      const kitchen = store.kitchenById.get(id);
      return kitchen ? [kitchen] : [];
    });
    const keptIds = new Set(held.ids);
    return [...kept, ...sorted.filter((kitchen) => !keptIds.has(kitchen.id))];
  }, [held, queryKey, sorted, store.kitchenById]);

  const pageCount = Math.max(1, Math.ceil(data.length / pagination.pageSize));
  // A remove or a narrower filter can strand the page index past the end.
  const safePagination =
    pagination.pageIndex < pageCount ? pagination : { ...pagination, pageIndex: pageCount - 1 };

  if (revealId) {
    const index = data.findIndex((kitchen) => kitchen.id === revealId);
    setRevealId(null);
    const pageIndex = index >= 0 ? Math.floor(index / pagination.pageSize) : -1;
    if (pageIndex >= 0 && pageIndex !== pagination.pageIndex)
      setPagination({ ...pagination, pageIndex });
  }

  const resetPage = useCallback(
    () =>
      setPagination((current) =>
        current.pageIndex === 0 ? current : { ...current, pageIndex: 0 },
      ),
    [],
  );

  // ── Logging and the writes ──

  /** Logs the change and returns an Undo that takes the log entry back too. */
  const log = useCallback(
    (
      entries: {
        kitchenId: string;
        kind: EventKind;
        title: string;
        detail?: string;
      }[],
      undo: () => void,
    ) => {
      const step = ++eventSeq.current;
      const made: PlanEvent[] = entries.map((entry, index) => ({
        ...entry,
        id: `evt_${step}_${index}`,
        actor: "You",
        when: sessionTime(step),
        sortKey: `${isoOf(TODAY_DAY)}~${String(step).padStart(4, "0")}`,
      }));
      setEvents((current) => [...[...made].reverse(), ...current]);
      const ids = new Set(made.map((event) => event.id));
      return () => {
        undo();
        setEvents((current) => current.filter((event) => !ids.has(event.id)));
      };
    },
    [],
  );

  /** A booking outside the window brings the window to it. */
  const showDay = useCallback((iso: string) => {
    const day = dayNumber(iso);
    setWindowStart((current) =>
      day >= current && day < current + WINDOW_DAYS ? current : clampWindow(weekStartOf(day)),
    );
  }, []);

  const confirmVisits = useCallback(
    (visits: Visit[]) => {
      if (visits.length === 0) return;
      const { undo } = writeVisits(
        visits.map((visit) => ({ ...visit, status: "confirmed" as const })),
      );
      const only = visits.length === 1 ? visits[0] : null;
      notify(
        only ? "Visit confirmed" : `${plural(visits.length, "visit")} confirmed`,
        only
          ? visitLabel(only, store.kitchenById.get(only.kitchenId))
          : "The vendors have the days locked in.",
        log(
          visits.map((visit) => ({
            kitchenId: visit.kitchenId,
            kind: "confirmed",
            title: `${SERVICES[visit.service].label} confirmed`,
            detail: formatLongDay(visit.date),
          })),
          undo,
        ),
      );
    },
    [writeVisits, store.kitchenById, log],
  );

  const markDone = useCallback(
    (visit: Visit, signOff: { date: string; report: string }) => {
      const kitchen = store.kitchenById.get(visit.kitchenId);
      const report = signOff.report.trim();
      // The visit moves to the day the crew came and keeps its job sheet.
      const { undo } = writeVisits([
        {
          ...visit,
          date: signOff.date,
          status: "done",
          report: report || undefined,
        },
      ]);
      const done = `${formatLongDay(signOff.date)}${report ? `, report ${report}` : ""}`;
      notify(
        `${SERVICES[visit.service].label} signed off`,
        `${kitchen?.name ?? "Kitchen"}, ${done}`,
        log(
          [
            {
              kitchenId: visit.kitchenId,
              kind: "done",
              title: `${SERVICES[visit.service].label} signed off`,
              detail: done,
            },
          ],
          undo,
        ),
      );
    },
    [writeVisits, store.kitchenById, log],
  );

  const moveVisit = useCallback(
    (visit: Visit, iso: string) => {
      const kitchen = store.kitchenById.get(visit.kitchenId);
      // A new day needs the vendor's yes again.
      const { undo } = writeVisits([{ ...visit, date: iso, status: "proposed" }]);
      showDay(iso);
      // Past the due day the cycle runs late; the toast says by how much.
      const due = allPlans
        .get(visit.kitchenId)
        ?.states.find((state) => state.service === visit.service)?.due;
      const late = due ? dayNumber(iso) - dayNumber(due) : 0;
      notify(
        `Moved to ${formatLongDay(iso)}`,
        `${SERVICES[visit.service].label} at ${kitchen?.name ?? "the kitchen"}, ${late > 0 ? `${plural(late, "day")} after due, ` : ""}awaiting the vendor`,
        log(
          [
            {
              kitchenId: visit.kitchenId,
              kind: "moved",
              title: `${SERVICES[visit.service].label} moved`,
              detail: `${formatLongDay(visit.date)} to ${formatLongDay(iso)}`,
            },
          ],
          undo,
        ),
      );
    },
    [writeVisits, store.kitchenById, log, showDay, allPlans],
  );

  /** Books each opening as proposed with the lightest certified crew. */
  const slotDraftOf = (service: ServiceId, iso: string, pool: Visit[]) => {
    const { window, technician } = openSlotOf(service, iso, pool);
    return { window, technicianId: technician.id };
  };

  const bookOpenings = useCallback(
    (openings: Opening[]) => {
      if (openings.length === 0) return;
      const pool = [...visitsRef.current];
      const made: Visit[] = openings.map((opening) => {
        const visit: Visit = {
          id: store.nextVisitId(),
          kitchenId: opening.kitchen.id,
          service: opening.service,
          date: opening.iso,
          ...slotDraftOf(opening.service, opening.iso, pool),
          status: "proposed",
          notes: "",
        };
        pool.push(visit);
        return visit;
      });
      const { undo } = writeVisits(made);
      const only = made.length === 1 ? made[0] : null;
      notify(
        only ? "Visit booked" : `${plural(made.length, "visit")} booked`,
        only
          ? visitLabel(only, store.kitchenById.get(only.kitchenId))
          : "Each one awaits its vendor's confirmation.",
        log(
          made.map((visit) => ({
            kitchenId: visit.kitchenId,
            kind: "booked",
            title: `${SERVICES[visit.service].label} booked`,
            detail: formatLongDay(visit.date),
          })),
          undo,
        ),
      );
    },
    [writeVisits, store.nextVisitId, store.kitchenById, log],
  );

  /** Unbooked due days in the window for these kitchens. */
  const openingsOf = useCallback(
    (kitchens: Kitchen[]) =>
      kitchens.flatMap((kitchen) =>
        windowCells(kitchen.id)
          .filter(({ cell }) => cell.kind === "due")
          .map(({ day, cell }) => ({
            kitchen,
            service: cell.service,
            iso: isoOf(day),
          })),
      ),
    [windowCells],
  );

  // ── Sheet and confirm flows ──

  const openSheet = useCallback((state: SheetState, origin: HTMLElement | null) => {
    originRef.current = origin;
    setSheetState(state);
    setSheetOpen(true);
  }, []);

  // Read through a ref so the row actions stay stable.
  const sheetOpenRef = useRef(sheetOpen);
  // A removal asked from the sheet closes it; Keep brings it back.
  const reopenSheetRef = useRef(false);
  useEffect(() => {
    sheetOpenRef.current = sheetOpen;
  }, [sheetOpen]);

  const requestRemoveKitchens = useCallback(
    (ids: string[], origin: HTMLElement | null) => {
      const kitchens = ids.flatMap((id) => {
        const kitchen = store.kitchenById.get(id);
        return kitchen ? [kitchen] : [];
      });
      if (kitchens.length === 0) return;
      setPendingRemoval({
        ids: kitchens.map((kitchen) => kitchen.id),
        name: kitchens.length === 1 ? kitchens[0].name : null,
        visitCount: kitchens.reduce(
          (sum, kitchen) => sum + (store.visitsByKitchen.get(kitchen.id)?.length ?? 0),
          0,
        ),
        origin,
      });
      if (sheetOpenRef.current) {
        removingRef.current = true;
        reopenSheetRef.current = true;
        setSheetOpen(false);
      }
      setRemoveOpen(true);
    },
    [store.kitchenById, store.visitsByKitchen],
  );

  const handleConfirmRemove = () => {
    if (!pendingRemoval) return;
    reopenSheetRef.current = false;
    const { removed, visitCount, undo } = store.removeKitchens(pendingRemoval.ids);
    const gone = new Set(pendingRemoval.ids);
    setRowSelection((current) =>
      Object.fromEntries(Object.entries(current).filter(([id]) => !gone.has(id))),
    );
    setRemoveOpen(false);
    notify(
      removed.length === 1 ? "Kitchen removed" : `${plural(removed.length, "kitchen")} removed`,
      `${removed.length === 1 ? removed[0].name : "They"} left the plan with ${plural(visitCount, "visit")}.`,
      undo,
    );
  };

  const requestCancelVisit = useCallback(
    (visit: Visit, origin: HTMLElement | null) => {
      setPendingCancel({
        visit,
        label: visitLabel(visit, store.kitchenById.get(visit.kitchenId)),
        origin,
      });
      setCancelOpen(true);
    },
    [store.kitchenById],
  );

  const handleConfirmCancel = () => {
    if (!pendingCancel) return;
    const { visit } = pendingCancel;
    const record = visit.status === "done";
    const { undo } = writeVisits([], [visit.id]);
    setCancelOpen(false);
    notify(
      record ? "Record deleted" : "Visit cancelled",
      pendingCancel.label,
      log(
        [
          {
            kitchenId: visit.kitchenId,
            kind: "cancelled",
            title: `${SERVICES[visit.service].label} ${record ? "record deleted" : "cancelled"}`,
            detail: formatLongDay(visit.date),
          },
        ],
        undo,
      ),
    );
  };

  const suggestTechnician = useCallback(
    (service: ServiceId, iso: string) => openSlotOf(service, iso, visitsRef.current).technician,
    [],
  );

  // Stable for the session, so the row context never re-renders a cell.
  const planActions = useMemo<PlanActions>(
    () => ({
      openKitchen: (kitchenId, origin) => openSheet({ mode: "view", kitchenId }, origin),
      editKitchen: (kitchenId, origin) => openSheet({ mode: "edit", kitchenId }, origin),
      requestRemoveKitchens,
      openBooking: (prefill, origin) => openSheet({ mode: "book", prefill }, origin),
      editVisit: (visitId, origin) => openSheet({ mode: "visit", visitId }, origin),
      confirmVisits,
      markDone,
      moveVisit,
      requestCancelVisit,
      suggestTechnician,
    }),
    [
      openSheet,
      requestRemoveKitchens,
      confirmVisits,
      markDone,
      moveVisit,
      requestCancelVisit,
      bookOpenings,
      suggestTechnician,
    ],
  );

  const planView = useMemo<PlanView>(
    () => ({ windowStart, plans, focus, kitchens: data }),
    [windowStart, plans, focus, data],
  );

  const visitById = useMemo(
    () => new Map(store.visits.map((visit) => [visit.id, visit])),
    [store.visits],
  );

  const sheetActions: SheetActions = {
    onTabChange: (tab) =>
      setSheetState((current) => (current?.mode === "view" ? { ...current, tab } : current)),
    onEditKitchen: (kitchen) => setSheetState({ mode: "edit", kitchenId: kitchen.id }),
    onBackToView: (kitchenId) => setSheetState({ mode: "view", kitchenId }),
    onCreateKitchen: (draft) => {
      const { kitchen, undo } = store.createKitchen(draft);
      setSheetState({ mode: "view", kitchenId: kitchen.id });
      setRevealId(kitchen.id);
      // Only the services with no recent visit are due on the day it joins.
      const dueNow = kitchen.services.filter(
        (service) => serviceStateOf(kitchen, service, []).due <= isoOf(TODAY_DAY),
      ).length;
      notify(
        "Kitchen added",
        `${kitchen.name}, ${dueNow > 0 ? `${plural(dueNow, "service")} due today` : "nothing due yet"}`,
        log([{ kitchenId: kitchen.id, kind: "edited", title: "Kitchen added" }], undo),
      );
    },
    onSaveKitchen: (kitchen, draft) => {
      const result = store.updateKitchen(kitchen.id, draft);
      if (!result) return;
      setSheetState({ mode: "view", kitchenId: kitchen.id });
      const cancelled = result.cancelled.length;
      notify(
        "Kitchen updated",
        cancelled > 0
          ? `${result.kitchen.name}, ${plural(cancelled, "open visit")} cancelled`
          : result.kitchen.name,
        log(
          [
            {
              kitchenId: kitchen.id,
              kind: "edited",
              title: "Kitchen details edited",
            },
          ],
          result.undo,
        ),
      );
    },
    onRemoveKitchen: (kitchen) => requestRemoveKitchens([kitchen.id], originRef.current),
    onBook: (prefill, from) => setSheetState({ mode: "book", prefill, from }),
    onSubmitVisit: (draft: VisitDraft, visit) => {
      if (!draft.service) return;
      const service = draft.service;
      const next: Visit = {
        id: visit?.id ?? store.nextVisitId(),
        kitchenId: draft.kitchenId,
        service,
        date: draft.date,
        window: draft.window,
        technicianId: draft.technicianId,
        status: draft.status,
        notes: draft.notes.trim(),
      };
      const { undo } = writeVisits([next]);
      const from =
        sheetState?.mode === "book" || sheetState?.mode === "visit" ? sheetState.from : undefined;
      if (from) setSheetState({ mode: "view", kitchenId: from });
      else setSheetOpen(false);
      showDay(next.date);
      notify(
        visit ? "Visit updated" : "Visit booked",
        visitLabel(next, store.kitchenById.get(next.kitchenId)),
        log(
          [
            {
              kitchenId: next.kitchenId,
              kind: visit ? "edited" : "booked",
              title: `${SERVICES[service].label} ${visit ? "edited" : "booked"}`,
              detail: formatLongDay(next.date),
            },
          ],
          undo,
        ),
      );
    },
    stateOf: (kitchenId, service) => {
      const kitchen = store.kitchenById.get(kitchenId);
      if (!kitchen || !kitchen.services.includes(service)) return null;
      return serviceStateOf(kitchen, service, store.visitsByKitchen.get(kitchenId) ?? []);
    },
    suggest: (service, iso, window) => autoTechnician(service, iso, store.visits, window).id,
    crewClash: (draft, exceptId) => {
      const clash = crewClashOf(draft, store.visits, exceptId);
      return clash ? (store.kitchenById.get(clash.kitchenId)?.name ?? null) : null;
    },
    takenDays: (kitchenId, exceptId) =>
      new Set(
        (store.visitsByKitchen.get(kitchenId) ?? [])
          .filter((visit) => visit.id !== exceptId)
          .map((visit) => visit.date),
      ),
    openVisitOf: (kitchenId, service, exceptId) =>
      (store.visitsByKitchen.get(kitchenId) ?? []).find(
        (visit) => visit.service === service && visit.status !== "done" && visit.id !== exceptId,
      ) ?? null,
  };

  // ── Toolbar and selection ──

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchQuery(value);
      setRowSelection({});
      resetPage();
    },
    [resetPage],
  );

  const handleLensChange = useCallback(
    (next: ServiceId | null) => {
      setLens(next);
      setRowSelection({});
      resetPage();
    },
    [resetPage],
  );

  const handleFocusChange = useCallback(
    (next: CellKind[]) => {
      setFocusKinds(next);
      setRowSelection({});
      resetPage();
    },
    [resetPage],
  );

  const handleClear = useCallback(() => {
    setSearchQuery("");
    setLens(null);
    setFocusKinds([]);
    setRowSelection({});
    resetPage();
  }, [resetPage]);

  const handleSortingChange = useCallback<OnChangeFn<SortingState>>(
    (updater) => {
      setSorting(updater);
      resetPage();
    },
    [resetPage],
  );

  const emptyState = useMemo(
    () => (
      <Empty className="py-8">
        <EmptyHeader>
          <EmptyMedia variant="icon">{UI_ICONS.searchEmpty}</EmptyMedia>
          {/* The grid's empty cell mutes its text; the title takes its weight back. */}
          <EmptyTitle className="text-foreground">No Kitchens Match</EmptyTitle>
          <EmptyDescription>
            Change the service, drop a status or clear the search.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button type="button" variant="outline" className="text-foreground" onClick={handleClear}>
            {UI_ICONS.clearFilter}
            Clear
          </Button>
        </EmptyContent>
      </Empty>
    ),
    [handleClear],
  );

  // ── Table ──

  const table = useTable({
    features: dataGridFeatures,
    // The view sorts the full set; TanStack only slices the page.
    manualSorting: true,
    autoResetPageIndex: false,
    autoResetCellSelection: false,
    pageCount,
    columns,
    data,
    getRowId: (row) => row.id,
    state: {
      sorting,
      pagination: safePagination,
      columnPinning: isPhone ? PHONE_PINNING : COLUMN_PINNING,
      rowSelection,
    },
    enableRowSelection: true,
    onSortingChange: handleSortingChange,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
  });

  // Selection spans pages, so the bar reads the selected model, not the page.
  const selected = table.getSelectedRowModel().rows.map((row) => row.original);
  const hasSelection = selected.length > 0;
  const selectedAwaiting = selected.flatMap((kitchen) =>
    awaitingInWindow(plans.get(kitchen.id), windowStart),
  );
  const selectedOpenings = openingsOf(selected);
  const bandOpenings = openingsOf(searched);

  useEffect(() => {
    if (hasSelection || !restoreFocusRef.current) return;
    restoreFocusRef.current = false;
    searchRef.current?.focus();
  }, [hasSelection]);

  const afterBulk = () => {
    restoreFocusRef.current = true;
    setRowSelection({});
  };

  const atCurrentWeek = windowStart === CURRENT_WINDOW_START;

  return (
    <TooltipProvider>
      <PlanActionsProvider value={planActions}>
        <PlanViewProvider value={planView}>
          <ReuiDataGrid
            table={table}
            recordCount={data.length}
            emptyMessage={emptyState}
            i18n={GRID_I18N}
            getRowStatus={(row) => store.marks[row.id]}
            tableLayout={{
              dense: settings.density === "compact",
              cellBorder: settings.columnLines,
              stripped: settings.rowStripes,
              // On so Kitchen, the one autoSize column, takes the free width.
              columnsResizable: true,
              columnsPinnable: true,
              // Off: the grid has no height of its own, so nothing to stick to.
              headerSticky: false,
              // The days are a keyboard grid: arrows move, Enter opens a day.
              cellSelection: true,
              cellSelectionMode: "single",
              cellEditMode: "click",
            }}
            tableClassNames={{
              // See gridRegionRef: no focus frame after a click, only on keys.
              base: cn(
                "not-in-data-[focus-source=keyboard]:[&_td[data-cell-focused]]:before:hidden",
                PINNED_SURFACE,
                COLUMN_HOVER,
                settings.columnLines && SINGLE_START_SEAM,
                settings.rowStripes && PINNED_STRIPES,
              ),
              // The end column is the row menu, which sets its own insets.
              edgeCell: "first:ps-(--frame-panel-header-px)",
            }}
          >
            <Frame dense variant="default" spacing="default" className="w-full">
              <FrameHeader className="flex-row flex-wrap items-center justify-between gap-3">
                <div className="flex min-w-0 flex-col gap-px">
                  <FrameTitle>Service Visits</FrameTitle>
                  {/* The window's dates live here, one header row below. */}
                  <FrameDescription className="flex flex-wrap items-center gap-2 text-xs">
                    <span aria-live="polite" className="tabular-nums">
                      {windowRangeLabel(windowStart)}
                    </span>
                    <DotSeparator />
                    <span>{plural(store.kitchens.length, "kitchen")}</span>
                  </FrameDescription>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <ButtonGroup aria-label="Week">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      aria-label="Previous week"
                      disabled={windowStart <= MIN_WINDOW_START}
                      onClick={() => setWindowStart((current) => clampWindow(current - 7))}
                    >
                      {UI_ICONS.chevronLeft}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={atCurrentWeek}
                      onClick={() => setWindowStart(CURRENT_WINDOW_START)}
                    >
                      Today
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      aria-label="Next week"
                      disabled={windowStart >= MAX_WINDOW_START}
                      onClick={() => setWindowStart((current) => clampWindow(current + 7))}
                    >
                      {UI_ICONS.chevronRight}
                    </Button>
                    {/* Any week from the log's start to a year ahead. */}
                    <Popover open={weekPickerOpen} onOpenChange={setWeekPickerOpen}>
                      <PopoverTrigger
                        render={
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            aria-label="Pick a week"
                          />
                        }
                      >
                        {UI_ICONS.calendar}
                      </PopoverTrigger>
                      <PopoverContent align="end" className="w-auto p-0">
                        <Calendar
                          mode="single"
                          required
                          selected={fromIsoDay(isoOf(windowStart))}
                          defaultMonth={fromIsoDay(isoOf(windowStart))}
                          disabled={(date) => {
                            const day = dayNumber(toIsoDay(date));
                            return day < MIN_WINDOW_START || day >= MAX_WINDOW_START + 7;
                          }}
                          onSelect={(date) => {
                            setWeekPickerOpen(false);
                            setWindowStart(clampWindow(weekStartOf(dayNumber(toIsoDay(date)))));
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </ButtonGroup>
                  <Button
                    type="button"
                    variant="outline"
                    className={ICON_ON_PHONE}
                    aria-label="Add Kitchen"
                    onClick={(event) => openSheet({ mode: "create" }, event.currentTarget)}
                  >
                    {UI_ICONS.kitchen}
                    <span className="max-sm:sr-only">Add Kitchen</span>
                  </Button>
                  <Button
                    type="button"
                    className={ICON_ON_PHONE}
                    aria-label="Book Visit"
                    onClick={(event) =>
                      openSheet({ mode: "book", prefill: null }, event.currentTarget)
                    }
                  >
                    {UI_ICONS.book}
                    <span className="max-sm:sr-only">Book Visit</span>
                  </Button>
                </div>
              </FrameHeader>

              <FramePanel className="p-0">
                {/* The bar takes the toolbar's slot at the same height, so the
                  rows never shift under the pointer while picking. */}
                {hasSelection ? (
                  <SelectionBar
                    count={selected.length}
                    awaiting={selectedAwaiting.length}
                    unbooked={selectedOpenings.length}
                    onConfirm={() => {
                      confirmVisits(selectedAwaiting);
                      afterBulk();
                    }}
                    onBook={() => {
                      bookOpenings(selectedOpenings);
                      afterBulk();
                    }}
                    onRemove={(origin) =>
                      requestRemoveKitchens(
                        selected.map((kitchen) => kitchen.id),
                        origin,
                      )
                    }
                    onClear={afterBulk}
                  />
                ) : (
                  <GridToolbar
                    searchRef={searchRef}
                    searchQuery={searchQuery}
                    onSearchChange={handleSearchChange}
                    lens={lens}
                    onLensChange={handleLensChange}
                    settings={settings}
                    onSettingsChange={(patch) =>
                      setSettings((current) => ({ ...current, ...patch }))
                    }
                    status={
                      <StatusBand counts={counts} focus={focus} onFocusChange={handleFocusChange} />
                    }
                    actions={
                      <BookAllButton
                        unbooked={counts.due}
                        onBookAll={() => bookOpenings(bandOpenings)}
                      />
                    }
                  />
                )}
                <Separator />
                {/* Height follows the page of rows; pagination caps it. Only
                  the days scroll, sideways, on a strip below the last row. */}
                <div
                  ref={gridRegionRef}
                  className="flex flex-col"
                  style={{ "--day-air": `${dayAirOf(daySize)}px` } as CSSProperties}
                >
                  <DataGridScrollArea orientation="horizontal" className={SCROLL_STRIP}>
                    <DataGridTable />
                  </DataGridScrollArea>
                </div>
                {/* Binds focus and the keyboard; without it the cellSelection
                  layout renders chrome only. */}
                <DataGridCellSelection />
                <Separator />
                <FrameFooter>
                  <DataGridPagination sizes={PAGE_SIZES} />
                </FrameFooter>
              </FramePanel>
            </Frame>
          </ReuiDataGrid>

          <KitchenSheet
            state={sheetState}
            open={sheetOpen}
            onOpenChange={setSheetOpen}
            finalFocus={() => {
              if (removingRef.current) {
                removingRef.current = false;
                return false;
              }
              const origin = originRef.current;
              return origin?.isConnected ? origin : true;
            }}
            kitchens={store.kitchens}
            kitchenById={store.kitchenById}
            plans={allPlans}
            visitById={visitById}
            events={events}
            actions={sheetActions}
          />

          <RemoveKitchensDialog
            open={removeOpen}
            onOpenChange={(open) => {
              setRemoveOpen(open);
              if (open || !reopenSheetRef.current) return;
              reopenSheetRef.current = false;
              setSheetOpen(true);
            }}
            pending={pendingRemoval}
            onConfirm={handleConfirmRemove}
          />

          <CancelVisitDialog
            open={cancelOpen}
            onOpenChange={setCancelOpen}
            pending={pendingCancel}
            onConfirm={handleConfirmCancel}
          />
        </PlanViewProvider>
      </PlanActionsProvider>
    </TooltipProvider>
  );
}
