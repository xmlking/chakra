import { Badge } from "@workspace/ui/components/reui/badge";
import {
  Frame,
  FrameDescription,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@workspace/ui/components/reui/frame";
import { IconTile } from "@workspace/ui/components/reui/icon-tile";
import { Button } from "@workspace/ui/components/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/shadcn/dropdown-menu";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@workspace/ui/components/shadcn/empty";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@workspace/ui/components/shadcn/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/shadcn/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/shadcn/tabs";
import { cn } from "cn";
import { useEffect, useRef, useState, type FormEvent, type ReactNode, type RefObject } from "react";

import { downloadHistory, serviceRecords, type EventKind, type PlanEvent } from "./activity";
import {
  isoOf,
  kitchenDraftOf,
  MANAGER_BY_ID,
  NEW_KITCHEN_DRAFT,
  SERVICES,
  TODAY,
  visitDraftOf,
  VOLUME_LABEL,
  type Kitchen,
  type KitchenDraft,
  type ServiceId,
  type Visit,
  type VisitDraft,
  type VisitWindow,
} from "./data";
import { UI_ICONS } from "./icons";
import {
  KITCHEN_ERROR_INPUT,
  KITCHEN_ERROR_ORDER,
  KitchenFormFields,
  validateKitchen,
  type KitchenErrors,
} from "./kitchen-form-fields";
import { type BookPrefill, type KitchenView } from "./plan-context";
import { formatDay, statusOf, type ServiceState } from "./plan-math";
import { CoverageBar, DotSeparator, PersonAvatar, StatusBadge } from "./value-faces";
import {
  validateVisit,
  VISIT_ERROR_INPUT,
  VISIT_ERROR_ORDER,
  VisitFormFields,
  type VisitErrors,
} from "./visit-form-fields";

export type SheetTab = "plan" | "history";

export type SheetState =
  | { mode: "view"; kitchenId: string; tab?: SheetTab }
  | { mode: "edit"; kitchenId: string }
  | { mode: "create" }
  /** from: the kitchen whose view opened the form, so Back returns there. */
  | { mode: "book"; prefill: BookPrefill | null; from?: string }
  | { mode: "visit"; visitId: string; from?: string };

/** The floating inset shell: a full-height card held off every edge. */
const SHEET_SHELL =
  "inset-y-4 right-4 left-auto flex h-[calc(100svh-2rem)] w-[min(36rem,calc(100vw-2rem))] max-w-none flex-col gap-0 overflow-hidden rounded-xl p-0 outline-none";

/** Pinned under the scrolling body; px-5 keeps it on the band's spine. */
const SHEET_FOOTER = "bg-muted flex shrink-0 items-center gap-2 border-t px-5 py-3";

/** Only the body scrolls; header band, tabs and footer stay put. */
const SHEET_BODY = "scroll-fade-y no-scrollbar min-h-0 flex-1 scroll-py-10 overflow-y-auto";

const KITCHEN_FORM_ID = "data-grid-advanced-9-kitchen-form";
const VISIT_FORM_ID = "data-grid-advanced-9-visit-form";
const KITCHEN_PREFIX = "dga9-kitchen";
const VISIT_PREFIX = "dga9-visit";
/** Either form opens on its first open field. */
const FIRST_FIELD = `#${KITCHEN_PREFIX}-name, #${VISIT_PREFIX}-kitchen:not([disabled]), #${VISIT_PREFIX}-date`;

const TABS: { value: SheetTab; label: string }[] = [
  { value: "plan", label: "Plan" },
  { value: "history", label: "History" },
];

/** The glyph each change wears in the history list. */
const EVENT_ICON: Record<EventKind, ReactNode> = {
  booked: UI_ICONS.book,
  confirmed: UI_ICONS.confirm,
  moved: UI_ICONS.reschedule,
  done: UI_ICONS.done,
  cancelled: UI_ICONS.cancel,
  edited: UI_ICONS.edit,
};

export interface SheetActions {
  onTabChange: (tab: SheetTab) => void;
  onEditKitchen: (kitchen: Kitchen) => void;
  onBackToView: (kitchenId: string) => void;
  onCreateKitchen: (draft: KitchenDraft) => void;
  onSaveKitchen: (kitchen: Kitchen, draft: KitchenDraft) => void;
  onRemoveKitchen: (kitchen: Kitchen) => void;
  onBook: (prefill: BookPrefill, from: string) => void;
  onSubmitVisit: (draft: VisitDraft, visit: Visit | null) => void;
  stateOf: (kitchenId: string, service: ServiceId) => ServiceState | null;
  suggest: (service: ServiceId, iso: string, window: VisitWindow) => string;
  /** Where the draft's technician already is in its slot, if anywhere. */
  crewClash: (draft: VisitDraft, exceptId: string | null) => string | null;
  /** Days the kitchen already has a visit on, one visit left out. */
  takenDays: (kitchenId: string, exceptId: string | null) => Set<string>;
  /** The service's open visit at the kitchen, one visit left out. */
  openVisitOf: (kitchenId: string, service: ServiceId, exceptId: string | null) => Visit | null;
}

// ── Shared pieces ──

function CloseButton() {
  return (
    <SheetClose render={<Button type="button" variant="ghost" size="icon-sm" aria-label="Close" />}>
      {UI_ICONS.close}
    </SheetClose>
  );
}

/** A secondary frame: dense like the grid's own, one spacing step tighter. */
function FramedSection({
  title,
  hint,
  action,
  flush = false,
  children,
}: {
  title: string;
  hint: string;
  action?: ReactNode;
  /** A table runs edge to edge; everything else keeps the panel inset. */
  flush?: boolean;
  children: ReactNode;
}) {
  return (
    <Frame dense spacing="sm" className="min-w-0">
      <FrameHeader className="flex-row flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-px">
          <FrameTitle>{title}</FrameTitle>
          <FrameDescription className="text-xs">{hint}</FrameDescription>
        </div>
        {action}
      </FrameHeader>
      <FramePanel className={flush ? "p-0" : undefined}>{children}</FramePanel>
    </Frame>
  );
}

/** Badge and day side by side, stacked on a phone so the column fits. */
const NEXT_FACE = "flex items-center gap-2 max-sm:flex-col max-sm:items-start max-sm:gap-1";

/** The next step a cycle needs, in the Plan table's last column. */
function NextCell({ state, onBook }: { state: ServiceState; onBook: () => void }) {
  if (state.booked) {
    return (
      <span className={NEXT_FACE}>
        <StatusBadge kind={statusOf(state.booked)} />
        <span className="tabular-nums">{formatDay(state.booked.date)}</span>
      </span>
    );
  }
  if (state.missed) {
    return (
      <span className={NEXT_FACE}>
        <StatusBadge kind="missed" />
        <span className="tabular-nums">{formatDay(state.missed.date)}</span>
      </span>
    );
  }
  if (state.state === "gap") {
    return (
      <Button type="button" variant="outline" size="sm" onClick={onBook}>
        {UI_ICONS.book}
        Book
      </Button>
    );
  }
  return <span className="text-muted-foreground">Not due yet</span>;
}

const DUE_TONE = (state: ServiceState) =>
  state.state === "missed" || (state.state === "gap" && state.lapsed)
    ? "text-destructive"
    : state.state === "gap" || state.state === "late"
      ? "text-warning"
      : undefined;

function PlanTab({
  plan,
  onBook,
}: {
  plan: KitchenView;
  onBook: (service: ServiceId, iso: string) => void;
}) {
  // A gap books on its matrix marker's day, which skips weekends and busy days.
  const markerDay = new Map(
    [...plan.cells]
      .filter(([, cell]) => cell.kind === "due")
      .map(([day, cell]) => [cell.service, isoOf(day)] as const),
  );
  return (
    <FramedSection
      title="Service Cycles"
      hint={plan.coverage.note}
      action={
        <span className="w-28">
          <CoverageBar coverage={plan.coverage} />
        </span>
      }
      flush
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="ps-(--frame-panel-px)">Service</TableHead>
            {/* A phone keeps Due and Next whole; History holds the done days. */}
            <TableHead className="max-sm:hidden">Last Done</TableHead>
            <TableHead>Due</TableHead>
            <TableHead className="pe-(--frame-panel-px)">Next</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plan.states.map((state) => (
            <TableRow key={state.service}>
              <TableCell className="ps-(--frame-panel-px)">
                <span className="flex flex-col gap-0.5">
                  <span className="font-medium">{SERVICES[state.service].label}</span>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    Every {state.cycle} days
                  </span>
                </span>
              </TableCell>
              <TableCell className="tabular-nums max-sm:hidden">
                {state.lastDone ? (
                  formatDay(state.lastDone)
                ) : (
                  <span className="text-muted-foreground">None</span>
                )}
              </TableCell>
              <TableCell className={cn("tabular-nums", DUE_TONE(state))}>
                {formatDay(state.due)}
              </TableCell>
              <TableCell className="pe-(--frame-panel-px)">
                <NextCell
                  state={state}
                  onBook={() =>
                    onBook(
                      state.service,
                      markerDay.get(state.service) ?? (state.due < TODAY ? TODAY : state.due),
                    )
                  }
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </FramedSection>
  );
}

function HistoryTab({
  events,
  canExport,
  onExport,
}: {
  events: PlanEvent[];
  canExport: boolean;
  /** Saves the signed-off visits as a CSV for an inspector. */
  onExport: () => void;
}) {
  return (
    <FramedSection
      title="History"
      hint="Signed-off visits and today's changes"
      action={
        <Button type="button" variant="outline" size="sm" disabled={!canExport} onClick={onExport}>
          {UI_ICONS.download}
          Export CSV
        </Button>
      }
    >
      {events.length === 0 ? (
        <Empty className="p-0">
          <EmptyHeader>
            <EmptyTitle>Nothing Signed Off Yet</EmptyTitle>
            <EmptyDescription>Visits show here once a crew marks them done.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <ol className="flex flex-col gap-4">
          {events.map((event) => (
            <li key={event.id} className="flex min-w-0 gap-3">
              {event.avatar ? (
                <PersonAvatar
                  person={{
                    id: event.id,
                    name: event.actor,
                    role: "",
                    avatar: event.avatar,
                  }}
                />
              ) : (
                <IconTile size="xs" variant="outline" aria-hidden="true">
                  {EVENT_ICON[event.kind]}
                </IconTile>
              )}
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex items-baseline justify-between gap-3">
                  {/* Trimmed to the cap line, so the title's top meets the
                      avatar's; clipped sideways only, ascenders stay whole. */}
                  <span className="overflow-x-clip text-sm font-medium text-ellipsis whitespace-nowrap [text-box:trim-start_cap_alphabetic]">
                    {event.title}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground tabular-nums [text-box:trim-start_cap_alphabetic]">
                    {event.when}
                  </span>
                </div>
                {event.detail ? (
                  <span className="text-xs text-muted-foreground">{event.detail}</span>
                ) : null}
                <span className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span>{event.actor}</span>
                  {event.report ? (
                    <>
                      <DotSeparator />
                      <span className="tabular-nums">Report {event.report}</span>
                    </>
                  ) : null}
                </span>
              </div>
            </li>
          ))}
        </ol>
      )}
    </FramedSection>
  );
}

// ── View ──

function KitchenViewPanel({
  kitchen,
  plan,
  tab,
  events,
  actions,
}: {
  kitchen: Kitchen;
  plan: KitchenView;
  tab: SheetTab;
  events: PlanEvent[];
  actions: SheetActions;
}) {
  const manager = MANAGER_BY_ID.get(kitchen.managerId);
  const history = [...events, ...serviceRecords(kitchen, plan.visits)];

  return (
    <>
      {/* Header band: the name with its menu and close, then who and how hard. */}
      <div className="flex shrink-0 flex-col gap-0.5 px-5 py-3">
        <div className="flex items-center justify-between gap-2">
          <SheetTitle className="min-w-0 truncate text-lg">{kitchen.name}</SheetTitle>
          <div className="flex shrink-0 items-center">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button type="button" variant="ghost" size="icon-sm" aria-label="More actions" />
                }
              >
                {UI_ICONS.more}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-auto">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Kitchen</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => actions.onEditKitchen(kitchen)}>
                    {UI_ICONS.edit}
                    Edit Kitchen
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => actions.onBook({ kitchenId: kitchen.id }, kitchen.id)}
                  >
                    {UI_ICONS.book}
                    Book Visit
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => actions.onRemoveKitchen(kitchen)}
                  >
                    {UI_ICONS.trash}
                    Remove Kitchen
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <CloseButton />
          </div>
        </div>
        <SheetDescription className="flex flex-col gap-1">
          <span className="truncate">{kitchen.address}</span>
          <span className="flex flex-wrap items-center gap-2">
            <span>{manager?.name ?? "No manager"}</span>
            <DotSeparator />
            <span>{VOLUME_LABEL[kitchen.volume]}</span>
          </span>
        </SheetDescription>
      </div>

      <Tabs
        value={tab}
        onValueChange={(value) => {
          const next = TABS.find((item) => item.value === value);
          if (next) actions.onTabChange(next.value);
        }}
        className="flex min-h-0 flex-1 flex-col gap-0"
      >
        <div className="shrink-0 border-b px-5">
          <TabsList variant="line" className="-mb-px h-10! max-w-full gap-5 bg-transparent p-0">
            {TABS.map((item) => (
              <TabsTrigger
                key={item.value}
                value={item.value}
                className="h-full! flex-none gap-1.5 px-0 text-sm font-medium after:-bottom-px!"
              >
                {item.label}
                <Badge variant="outline" radius="full" className="tabular-nums">
                  {item.value === "plan" ? plan.states.length : history.length}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className={SHEET_BODY}>
          <div className="flex flex-col gap-4 px-5 py-4">
            <TabsContent value="plan" className="flex flex-col gap-4">
              <PlanTab
                plan={plan}
                onBook={(service, iso) =>
                  actions.onBook({ kitchenId: kitchen.id, service, date: iso }, kitchen.id)
                }
              />
            </TabsContent>
            <TabsContent value="history" className="flex flex-col gap-4">
              <HistoryTab
                events={history}
                canExport={plan.visits.some((visit) => visit.status === "done")}
                onExport={() => downloadHistory(kitchen, plan.visits)}
              />
            </TabsContent>
          </div>
        </div>

        <div className={SHEET_FOOTER}>
          <Button
            type="button"
            variant="outline"
            className="me-auto"
            onClick={() => actions.onEditKitchen(kitchen)}
          >
            {UI_ICONS.edit}
            Edit
          </Button>
          <Button
            type="button"
            onClick={() => actions.onBook({ kitchenId: kitchen.id }, kitchen.id)}
          >
            {UI_ICONS.book}
            Book Visit
          </Button>
        </div>
      </Tabs>
    </>
  );
}

// ── Forms ──

function FormShell({
  title,
  description,
  formId,
  bodyRef,
  onSubmit,
  back,
  submitLabel,
  creating,
  children,
}: {
  title: string;
  description: string;
  formId: string;
  bodyRef: RefObject<HTMLDivElement | null>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  /** Present when a view opened the form: returns to it. */
  back?: () => void;
  submitLabel: string;
  creating: boolean;
  children: ReactNode;
}) {
  return (
    <>
      <div className="flex shrink-0 flex-col gap-0.5 border-b px-5 py-3">
        <div className="flex items-center justify-between gap-2">
          <SheetTitle className="min-w-0 text-lg">{title}</SheetTitle>
          <CloseButton />
        </div>
        <SheetDescription>{description}</SheetDescription>
      </div>

      <form id={formId} noValidate onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
        <div ref={bodyRef} className={SHEET_BODY}>
          <div className="flex flex-col gap-5 px-5 py-5">{children}</div>
        </div>
        <div className={SHEET_FOOTER}>
          {back ? (
            <Button type="button" variant="ghost" className="me-auto" onClick={back}>
              Back
            </Button>
          ) : null}
          <SheetClose
            render={
              <Button type="button" variant="outline" className={back ? undefined : "ms-auto"} />
            }
          >
            Cancel
          </SheetClose>
          <Button type="submit">
            {creating ? UI_ICONS.plus : null}
            {submitLabel}
          </Button>
        </div>
      </form>
    </>
  );
}

function KitchenForm({
  kitchen,
  kitchens,
  actions,
}: {
  /** null is Add Kitchen. */
  kitchen: Kitchen | null;
  kitchens: Kitchen[];
  actions: SheetActions;
}) {
  const [values, setValues] = useState<KitchenDraft>(
    kitchen ? kitchenDraftOf(kitchen) : NEW_KITCHEN_DRAFT,
  );
  // Errors stay hidden until a save is refused; editing never nags before.
  const [attempted, setAttempted] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const errors: KitchenErrors = attempted
    ? validateKitchen(values, kitchens, kitchen?.id ?? null)
    : {};

  // Opened from the view inside an open sheet, initialFocus never runs again.
  useEffect(() => {
    bodyRef.current
      ?.querySelector<HTMLElement>(`#${KITCHEN_PREFIX}-name`)
      ?.focus({ preventScroll: true });
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validateKitchen(values, kitchens, kitchen?.id ?? null);
    const first = KITCHEN_ERROR_ORDER.find((key) => found[key]);
    if (first) {
      setAttempted(true);
      bodyRef.current
        ?.querySelector<HTMLElement>(`#${KITCHEN_PREFIX}-${KITCHEN_ERROR_INPUT[first]}`)
        ?.focus();
      return;
    }
    if (kitchen) actions.onSaveKitchen(kitchen, values);
    else actions.onCreateKitchen(values);
  }

  return (
    <FormShell
      title={kitchen ? "Edit Kitchen" : "Add Kitchen"}
      description={kitchen ? kitchen.name : "Joins the plan on the last-done dates you set."}
      formId={KITCHEN_FORM_ID}
      bodyRef={bodyRef}
      onSubmit={handleSubmit}
      back={kitchen ? () => actions.onBackToView(kitchen.id) : undefined}
      submitLabel={kitchen ? "Save Changes" : "Add Kitchen"}
      creating={!kitchen}
    >
      <KitchenFormFields
        idPrefix={KITCHEN_PREFIX}
        values={values}
        errors={errors}
        editing={kitchen !== null}
        onChange={(patch) => setValues((current) => ({ ...current, ...patch }))}
      />
    </FormShell>
  );
}

function VisitForm({
  visit,
  prefill,
  from,
  kitchens,
  actions,
}: {
  /** null books a new visit. */
  visit: Visit | null;
  prefill: BookPrefill | null;
  from?: string;
  kitchens: Kitchen[];
  actions: SheetActions;
}) {
  const [values, setValues] = useState<VisitDraft>(() => {
    if (visit) return visitDraftOf(visit);
    const service = prefill?.service ?? "";
    const date = prefill?.date ?? "";
    const window = service ? SERVICES[service].window : "opening";
    return {
      kitchenId: prefill?.kitchenId ?? "",
      service,
      date,
      window,
      technicianId: service ? actions.suggest(service, date || TODAY, window) : "",
      status: "proposed",
      notes: "",
    };
  });
  const [attempted, setAttempted] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const kitchen = kitchens.find((item) => item.id === values.kitchenId);
  const taken = kitchen ? actions.takenDays(kitchen.id, visit?.id ?? null) : new Set<string>();
  const open =
    kitchen && values.service
      ? actions.openVisitOf(kitchen.id, values.service, visit?.id ?? null)
      : null;
  const crewAt = values.technicianId ? actions.crewClash(values, visit?.id ?? null) : null;
  const errors: VisitErrors = attempted ? validateVisit(values, kitchen, taken, open, crewAt) : {};

  // The first empty field takes focus, so a prefilled form starts lower;
  // read once, so later edits never move it.
  const [openingField] = useState(() =>
    !values.kitchenId ? "kitchen" : !values.service ? "service" : "date",
  );
  useEffect(() => {
    bodyRef.current
      ?.querySelector<HTMLElement>(`#${VISIT_PREFIX}-${openingField}`)
      ?.focus({ preventScroll: true });
  }, [openingField]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validateVisit(values, kitchen, taken, open, crewAt);
    const first = VISIT_ERROR_ORDER.find((key) => found[key]);
    if (first) {
      setAttempted(true);
      bodyRef.current
        ?.querySelector<HTMLElement>(`#${VISIT_PREFIX}-${VISIT_ERROR_INPUT[first]}`)
        ?.focus();
      return;
    }
    actions.onSubmitVisit(values, visit);
  }

  const subject = kitchen
    ? values.service
      ? `${SERVICES[values.service].label} at ${kitchen.name}`
      : kitchen.name
    : "One visit a day per kitchen.";

  return (
    <FormShell
      title={visit ? "Edit Visit" : "Book Visit"}
      description={subject}
      formId={VISIT_FORM_ID}
      bodyRef={bodyRef}
      onSubmit={handleSubmit}
      back={from ? () => actions.onBackToView(from) : undefined}
      submitLabel={visit ? "Save Changes" : "Book Visit"}
      creating={!visit}
    >
      <VisitFormFields
        idPrefix={VISIT_PREFIX}
        values={values}
        errors={errors}
        editing={visit !== null}
        kitchens={kitchens}
        taken={taken}
        stateOf={actions.stateOf}
        suggest={actions.suggest}
        onChange={(patch) => setValues((current) => ({ ...current, ...patch }))}
      />
    </FormShell>
  );
}

// ── Shell ──

export function KitchenSheet({
  state,
  open,
  onOpenChange,
  finalFocus,
  kitchens,
  kitchenById,
  plans,
  visitById,
  events,
  actions,
}: {
  /** The retained state: still set while the sheet animates out. */
  state: SheetState | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  finalFocus: () => HTMLElement | boolean;
  kitchens: Kitchen[];
  kitchenById: Map<string, Kitchen>;
  plans: Map<string, KitchenView>;
  visitById: Map<string, Visit>;
  /** This session's changes, newest first. */
  events: PlanEvent[];
  actions: SheetActions;
}) {
  const popupRef = useRef<HTMLDivElement>(null);
  const viewing = state?.mode === "view";

  let body: ReactNode = <SheetTitle className="sr-only">Kitchen</SheetTitle>;
  if (state?.mode === "create") {
    body = <KitchenForm key="create" kitchen={null} kitchens={kitchens} actions={actions} />;
  } else if (state?.mode === "edit") {
    const kitchen = kitchenById.get(state.kitchenId);
    if (kitchen)
      body = (
        <KitchenForm
          key={`edit-${kitchen.id}`}
          kitchen={kitchen}
          kitchens={kitchens}
          actions={actions}
        />
      );
  } else if (state?.mode === "book") {
    body = (
      <VisitForm
        key={`book-${state.prefill?.kitchenId ?? ""}-${state.prefill?.service ?? ""}-${state.prefill?.date ?? ""}`}
        visit={null}
        prefill={state.prefill}
        from={state.from}
        kitchens={kitchens}
        actions={actions}
      />
    );
  } else if (state?.mode === "visit") {
    const visit = visitById.get(state.visitId);
    if (visit)
      body = (
        <VisitForm
          key={`visit-${visit.id}`}
          visit={visit}
          prefill={null}
          from={state.from}
          kitchens={kitchens}
          actions={actions}
        />
      );
  } else if (state?.mode === "view") {
    const kitchen = kitchenById.get(state.kitchenId);
    const plan = kitchen ? plans.get(kitchen.id) : undefined;
    if (kitchen && plan)
      body = (
        <KitchenViewPanel
          key={kitchen.id}
          kitchen={kitchen}
          plan={plan}
          tab={state.tab ?? "plan"}
          events={events.filter((event) => event.kitchenId === kitchen.id)}
          actions={actions}
        />
      );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        ref={popupRef}
        side="right"
        showCloseButton={false}
        // The view focuses the panel itself; a form opens on its first field.
        initialFocus={() =>
          viewing
            ? (popupRef.current ?? true)
            : (popupRef.current?.querySelector<HTMLElement>(FIRST_FIELD) ?? true)
        }
        finalFocus={finalFocus}
        className={SHEET_SHELL}
      >
        {body}
      </SheetContent>
    </Sheet>
  );
}
