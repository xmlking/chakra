import { useRef, useState, type MouseEvent, type ReactNode } from "react"
import { cn } from "cn"

import { Button } from "@workspace/ui/components/shadcn/button"
import { Calendar } from "@workspace/ui/components/shadcn/calendar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/shadcn/dropdown-menu"
import { Field, FieldLabel } from "@workspace/ui/components/shadcn/field"
import { Input } from "@workspace/ui/components/shadcn/input"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@workspace/ui/components/shadcn/popover"

import {
  isoOf,
  SERVICES,
  TECHNICIAN_BY_ID,
  TODAY,
  TODAY_DAY,
  VENDOR_BY_ID,
  WINDOW_LABEL,
  type Kitchen,
  type ServiceId,
  type Visit,
} from "./data"
import { UI_ICONS } from "./icons"
import { usePlanActions, usePlanView } from "./plan-context"
import {
  cycleNote,
  formatDay,
  formatLongDay,
  fromIsoDay,
  toIsoDay,
  type DayCell as DayCellData,
} from "./plan-math"
import {
  PersonFace,
  STATUS_FACE,
  StatusBadge,
  StatusCellFace,
  VendorContact,
} from "./value-faces"

/** The element the grid keeps DOM focus on while a cell is focused. */
const GRID_FOCUS_TARGET = 'table[data-slot="data-grid-table"]'

/** The due day in the move calendar: underlined, so a later pick is seen
 *  to book the visit late. */
const DUE_DAY =
  "[&>button]:underline [&>button]:decoration-warning [&>button]:decoration-2 [&>button]:underline-offset-4"

/** Fills the td, so the whole day is the target and its wash. */
const CELL_BUTTON =
  "group/day absolute inset-0 flex cursor-pointer items-center justify-center outline-none"

/** The popup is portaled but bubbles through React to the td; a press inside
 *  it must not start a range drag in the grid. */
function stopGridPress(event: MouseEvent) {
  event.stopPropagation()
}

/** Label and value on one spine, sized for a popover. */
function Facts({ rows }: { rows: { label: string; value: ReactNode }[] }) {
  return (
    <dl className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-3 gap-y-2">
      {rows.map((row) => (
        <div key={row.label} className="contents">
          <dt className="text-muted-foreground flex min-h-5 items-center">
            {row.label}
          </dt>
          <dd className="flex min-h-5 min-w-0 items-center">{row.value}</dd>
        </div>
      ))}
    </dl>
  )
}

/** Opens a popover from the cell and hands focus back to the grid on close,
 *  so the arrow keys keep moving from the same day. */
function useCellPopover() {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const gridRef = useRef<HTMLElement | null>(null)
  // Set when an action opens a sheet or a dialog, which then owns focus.
  const handedOff = useRef(false)
  return {
    open,
    setOpen,
    triggerRef,
    onOpenChange: (next: boolean) => {
      if (next) {
        handedOff.current = false
        gridRef.current =
          triggerRef.current?.closest<HTMLElement>(GRID_FOCUS_TARGET) ?? null
      }
      setOpen(next)
    },
    /** Closes for a sheet or a dialog; returns where their focus comes back. */
    handOff: () => {
      handedOff.current = true
      setOpen(false)
      return gridRef.current ?? triggerRef.current
    },
    finalFocus: () => {
      if (handedOff.current) return false
      return gridRef.current?.isConnected ? gridRef.current : true
    },
  }
}

// ── A booked or past visit ──

function VisitCell({
  kitchen,
  cell,
  visit,
  dimmed,
}: {
  kitchen: Kitchen
  cell: DayCellData
  visit: Visit
  dimmed: boolean
}) {
  const actions = usePlanActions()
  const { plans } = usePlanView()
  const popover = useCellPopover()
  const [moving, setMoving] = useState(false)
  const [signing, setSigning] = useState(false)
  // Signed off on the day the crew came: the booked day, or today at most.
  const [signDate, setSignDate] = useState(visit.date)
  const [report, setReport] = useState("")
  const kind = cell.kind
  const service = SERVICES[visit.service]
  const tech = TECHNICIAN_BY_ID.get(visit.technicianId)
  const vendor = tech ? VENDOR_BY_ID.get(tech.vendorId) : undefined

  // One visit a day per kitchen: the calendar closes the other booked days.
  const taken = new Set(
    (plans.get(kitchen.id)?.visits ?? [])
      .filter((item) => item.id !== visit.id)
      .map((item) => item.date)
  )

  const close = () => popover.setOpen(false)
  const note = cycleNote(visit, cell.state)
  const canMarkDone =
    kind === "missed" || (kind === "confirmed" && visit.date <= TODAY)

  return (
    <Popover
      open={popover.open}
      onOpenChange={(next) => {
        if (next) {
          setMoving(false)
          setSigning(false)
        }
        popover.onOpenChange(next)
      }}
    >
      <PopoverTrigger
        render={
          <button
            ref={popover.triggerRef}
            type="button"
            aria-label={`${service.label}, ${STATUS_FACE[kind].label}, ${formatLongDay(visit.date)}`}
            className={CELL_BUTTON}
          />
        }
      >
        <StatusCellFace kind={kind} dimmed={dimmed} />
      </PopoverTrigger>
      <PopoverContent
        align="center"
        className={moving || signing ? "w-auto" : "w-80"}
        finalFocus={popover.finalFocus}
        onMouseDown={stopGridPress}
      >
        {moving ? (
          <>
            <PopoverHeader>
              <PopoverTitle>Move Visit</PopoverTitle>
              <PopoverDescription>
                {service.label} is due {formatDay(cell.state.due)}, the
                underlined day
              </PopoverDescription>
            </PopoverHeader>
            <Calendar
              mode="single"
              required
              modifiers={{ due: fromIsoDay(cell.state.due) }}
              modifiersClassNames={{ due: DUE_DAY }}
              selected={fromIsoDay(visit.date)}
              defaultMonth={fromIsoDay(visit.date < TODAY ? TODAY : visit.date)}
              disabled={(date) => {
                const iso = toIsoDay(date)
                return iso < TODAY || taken.has(iso)
              }}
              onSelect={(date) => {
                const iso = toIsoDay(date)
                close()
                if (iso !== visit.date) actions.moveVisit(visit, iso)
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => setMoving(false)}
            >
              Back
            </Button>
          </>
        ) : signing ? (
          <>
            <PopoverHeader>
              <PopoverTitle>Sign Off Visit</PopoverTitle>
              <PopoverDescription>
                {service.label}, on the day the crew came
              </PopoverDescription>
            </PopoverHeader>
            <Calendar
              mode="single"
              required
              selected={fromIsoDay(signDate)}
              defaultMonth={fromIsoDay(signDate)}
              disabled={(date) => {
                const iso = toIsoDay(date)
                return iso > TODAY || (iso !== visit.date && taken.has(iso))
              }}
              onSelect={(date) => setSignDate(toIsoDay(date))}
            />
            <Field>
              <FieldLabel htmlFor={`${visit.id}-report`}>Report No.</FieldLabel>
              <Input
                id={`${visit.id}-report`}
                value={report}
                maxLength={24}
                placeholder="Job sheet or certificate"
                autoComplete="off"
                onChange={(event) => setReport(event.target.value)}
              />
            </Field>
            <div className="flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSigning(false)}
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={() => {
                  close()
                  actions.markDone(visit, { date: signDate, report })
                }}
              >
                {UI_ICONS.done}
                Sign Off
              </Button>
            </div>
          </>
        ) : (
          <>
            <PopoverHeader>
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 flex-col gap-0.5">
                  <PopoverTitle>{service.label}</PopoverTitle>
                  <PopoverDescription className="truncate">
                    {kitchen.name}
                  </PopoverDescription>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <StatusBadge kind={kind} />
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          aria-label="More visit actions"
                        />
                      }
                    >
                      {UI_ICONS.more}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-auto">
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>Visit</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() =>
                            actions.openKitchen(kitchen.id, popover.handOff())
                          }
                        >
                          {UI_ICONS.view}
                          View Kitchen
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          disabled={kind === "done"}
                          onClick={() =>
                            actions.editVisit(visit.id, popover.handOff())
                          }
                        >
                          {UI_ICONS.edit}
                          Edit Visit
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() =>
                            actions.requestCancelVisit(visit, popover.handOff())
                          }
                        >
                          {UI_ICONS.cancel}
                          {kind === "done" ? "Delete Record" : "Cancel Visit"}
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </PopoverHeader>
            <Facts
              rows={[
                {
                  label: "Date",
                  value: (
                    <span className="truncate tabular-nums">
                      {formatLongDay(visit.date)}
                    </span>
                  ),
                },
                {
                  label: "Time",
                  value: (
                    <span className="truncate">
                      {WINDOW_LABEL[visit.window]}
                    </span>
                  ),
                },
                {
                  label: "Crew",
                  value: tech ? (
                    <PersonFace person={tech} meta={vendor?.name} />
                  ) : (
                    <span className="text-muted-foreground">Unassigned</span>
                  ),
                },
                ...(vendor
                  ? [
                      {
                        label: "Contact",
                        value: (
                          <VendorContact
                            vendor={vendor}
                            subject={`${service.label} at ${kitchen.name}, ${formatLongDay(visit.date)}`}
                          />
                        ),
                      },
                    ]
                  : []),
                ...(visit.report
                  ? [
                      {
                        label: "Report",
                        value: (
                          <span className="truncate tabular-nums">
                            {visit.report}
                          </span>
                        ),
                      },
                    ]
                  : []),
                {
                  label: "Cycle",
                  value: (
                    <span
                      className={cn(
                        "truncate tabular-nums",
                        note.tone === "destructive" && "text-destructive",
                        note.tone === "warning" && "text-warning"
                      )}
                    >
                      {note.text}
                    </span>
                  ),
                },
                ...(visit.notes
                  ? [
                      {
                        label: "Notes",
                        value: (
                          <span className="line-clamp-2">{visit.notes}</span>
                        ),
                      },
                    ]
                  : []),
              ]}
            />
            {kind === "done" ? null : (
              <div className="flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setMoving(true)}
                >
                  {UI_ICONS.reschedule}
                  Reschedule
                </Button>
                {kind === "proposed" ? (
                  <Button
                    type="button"
                    onClick={() => {
                      close()
                      actions.confirmVisits([visit])
                    }}
                  >
                    {UI_ICONS.confirm}
                    Confirm
                  </Button>
                ) : canMarkDone ? (
                  <Button
                    type="button"
                    onClick={() => {
                      setSignDate(visit.date < TODAY ? visit.date : TODAY)
                      setReport("")
                      setSigning(true)
                    }}
                  >
                    {UI_ICONS.done}
                    Mark Done
                  </Button>
                ) : null}
              </div>
            )}
          </>
        )}
      </PopoverContent>
    </Popover>
  )
}

// ── A free day ──

/** A due day with nothing booked opens the form on that service. */
function FreeDay({
  kitchen,
  day,
  service,
}: {
  kitchen: Kitchen
  day: number
  service?: ServiceId
}) {
  const actions = usePlanActions()
  const iso = isoOf(day)
  return (
    <button
      type="button"
      aria-label={`Book ${service ? SERVICES[service].label : "a visit"} at ${kitchen.name} on ${formatLongDay(iso)}`}
      className={CELL_BUTTON}
      // Focus comes back to the grid: this button gives way to the new visit.
      onClick={(event) =>
        actions.openBooking(
          { kitchenId: kitchen.id, date: iso, service },
          event.currentTarget.closest<HTMLElement>(GRID_FOCUS_TARGET)
        )
      }
    >
      {/* Hover only: a focused cell keeps focus after its form closes, and a
          lingering plus read as content. */}
      <span className="text-muted-foreground flex opacity-0 transition-opacity group-hover/day:opacity-100 [&_svg]:size-4">
        {UI_ICONS.plus}
      </span>
    </button>
  )
}

/** Picks the face for one kitchen's day in the current window. */
export function DayCell({
  kitchen,
  offset,
}: {
  kitchen: Kitchen
  offset: number
}) {
  const { windowStart, plans, focus } = usePlanView()
  const day = windowStart + offset
  const cell = plans.get(kitchen.id)?.cells.get(day)
  const dimmed = focus.size > 0 && cell != null && !focus.has(cell.kind)

  if (cell?.visit)
    return (
      <VisitCell
        kitchen={kitchen}
        cell={cell}
        visit={cell.visit}
        dimmed={dimmed}
      />
    )
  // An unbooked due day draws no marker: it books like any free day.
  if (cell)
    return <FreeDay kitchen={kitchen} day={day} service={cell.service} />
  // Nothing can be booked into the past.
  if (day >= TODAY_DAY) return <FreeDay kitchen={kitchen} day={day} />
  return null
}