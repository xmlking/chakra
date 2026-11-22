import {
  BOOKING_HORIZON_DAYS,
  dayNumber,
  isoOf,
  isWeekend,
  LOG_START,
  SERVICES,
  techniciansFor,
  TODAY_DAY,
  weekdayOf,
  WINDOWS,
  type Kitchen,
  type ServiceId,
  type Visit,
  type VisitWindow,
} from "./data"

// ── Window ──

/** Three weeks, Monday first. */
export const WINDOW_DAYS = 21
export const DAY_OFFSETS = Array.from({ length: WINDOW_DAYS }, (_, i) => i)

/** Monday of the week that holds `day`. */
export const weekStartOf = (day: number) => day - ((weekdayOf(day) + 6) % 7)

export const CURRENT_WINDOW_START = weekStartOf(TODAY_DAY)
/** Back to the log's first week, and a year of bookings ahead. */
export const MIN_WINDOW_START = weekStartOf(dayNumber(LOG_START))
export const MAX_WINDOW_START = CURRENT_WINDOW_START + 52 * 7

// ── Formatting ──

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const WEEKDAY_LETTERS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

const partsOf = (day: number) => {
  const [, month, date] = isoOf(day).split("-").map(Number)
  return { month: MONTHS[month - 1], date }
}

const MONTH_YEAR = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
})

/** "October 2026": what a day header's own two lines leave out. */
export const monthYearOf = (day: number) =>
  MONTH_YEAR.format(new Date(`${isoOf(day)}T00:00:00Z`))

/** "Oct 22" */
export function formatDay(iso: string) {
  const { month, date } = partsOf(dayNumber(iso))
  return `${month} ${date}`
}

/** "Thu, Oct 22" */
export function formatLongDay(iso: string) {
  const day = dayNumber(iso)
  return `${WEEKDAYS[weekdayOf(day)]}, ${formatDay(iso)}`
}

export const weekdayLetters = (day: number) => WEEKDAY_LETTERS[weekdayOf(day)]
export const dateOfMonth = (day: number) => partsOf(day).date

/** The window's days: "Oct 12 to Nov 1", or "Oct 5 to 25" in one month. */
export function windowRangeLabel(start: number) {
  const from = partsOf(start)
  const to = partsOf(start + WINDOW_DAYS - 1)
  return from.month === to.month
    ? `${from.month} ${from.date} to ${to.date}`
    : `${from.month} ${from.date} to ${to.month} ${to.date}`
}

/** "today", "tomorrow", "in 6 days", "3 days ago" */
export function relativeDay(iso: string) {
  const diff = dayNumber(iso) - TODAY_DAY
  if (diff === 0) return "today"
  if (diff === 1) return "tomorrow"
  if (diff === -1) return "yesterday"
  return diff > 0 ? `in ${diff} days` : `${-diff} days ago`
}

export const plural = (count: number, one: string, many = `${one}s`) =>
  `${count} ${count === 1 ? one : many}`

/** The Calendar works in local dates; the plan in ISO days. */
export function fromIsoDay(iso: string) {
  const [year, month, day] = iso.split("-").map(Number)
  return new Date(year, month - 1, day)
}

export function toIsoDay(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${date.getFullYear()}-${month}-${day}`
}

// ── Visit status ──

/** The four faces a visit can show; Due is the unbooked marker. */
export type VisitStatus = "missed" | "proposed" | "confirmed" | "done"
export type CellKind = VisitStatus | "due"

export const CELL_KINDS: readonly CellKind[] = [
  "missed",
  "proposed",
  "confirmed",
  "done",
  "due",
]

/** Booked and not done, once its day has passed, is Missed. */
export function statusOf(visit: Visit): VisitStatus {
  if (visit.status === "done") return "done"
  return dayNumber(visit.date) < TODAY_DAY ? "missed" : visit.status
}

export const isOpen = (visit: Visit) => visit.status !== "done"

// ── Service cycle state ──

export type CycleState =
  /** Booked on or before the due day. */
  | "ok"
  /** Booked, but after the due day. */
  | "late"
  /** A booked visit was missed and nothing replaces it. */
  | "missed"
  /** Due inside the booking horizon, or already past, with nothing booked. */
  | "gap"
  /** Not due for a while; nothing to book yet. */
  | "clear"

export interface ServiceState {
  service: ServiceId
  cycle: number
  /** ISO day of the last done visit; null on a kitchen with no history. */
  lastDone: string | null
  /** ISO day the cycle runs out. */
  due: string
  /** The next open visit from today on. */
  booked: Visit | null
  /** A missed visit not yet replaced. */
  missed: Visit | null
  state: CycleState
  /** The due day has passed. */
  lapsed: boolean
}

export const cycleOf = (kitchen: Kitchen, service: ServiceId) =>
  SERVICES[service].cycle[kitchen.volume]

export function serviceStateOf(
  kitchen: Kitchen,
  service: ServiceId,
  visits: Visit[]
): ServiceState {
  const cycle = cycleOf(kitchen, service)
  let lastDoneDay: number | null = null
  let booked: Visit | null = null
  let missed: Visit | null = null
  for (const visit of visits) {
    if (visit.service !== service) continue
    const day = dayNumber(visit.date)
    if (visit.status === "done") {
      if (lastDoneDay === null || day > lastDoneDay) lastDoneDay = day
    } else if (day >= TODAY_DAY) {
      if (!booked || day < dayNumber(booked.date)) booked = visit
    } else if (!missed || day > dayNumber(missed.date)) {
      missed = visit
    }
  }
  const prior = kitchen.priorDone[service]
  if (lastDoneDay === null && prior) lastDoneDay = dayNumber(prior)
  // A kitchen with no history is due the day it joins the plan.
  const dueDay = lastDoneDay === null ? TODAY_DAY : lastDoneDay + cycle
  // A done visit after the miss closes it.
  if (missed && lastDoneDay !== null && lastDoneDay > dayNumber(missed.date))
    missed = null

  let state: CycleState
  if (booked) state = dayNumber(booked.date) <= dueDay ? "ok" : "late"
  else if (missed) state = "missed"
  else if (dueDay <= TODAY_DAY + BOOKING_HORIZON_DAYS) state = "gap"
  else state = "clear"

  return {
    service,
    cycle,
    lastDone: lastDoneDay === null ? null : isoOf(lastDoneDay),
    due: isoOf(dueDay),
    booked,
    missed,
    state,
    lapsed: dueDay < TODAY_DAY,
  }
}

// ── Coverage ──

export type CoverageTone = "success" | "warning" | "destructive"

export interface Coverage {
  onTrack: number
  total: number
  tone: CoverageTone
  /** The most urgent service, in words; "On track" when there is none. */
  note: string
  /** Sorts the worst kitchens first. */
  rank: number
}

/** Most urgent first: a miss or a lapse beats a gap, a gap beats a late booking. */
function urgencyOf(state: ServiceState) {
  if (state.state === "missed") return 4
  if (state.state === "gap" && state.lapsed) return 3
  if (state.state === "gap") return 2
  if (state.state === "late") return 1
  return 0
}

export function coverageOf(states: ServiceState[]): Coverage {
  const onTrack = states.filter(
    (item) => item.state === "ok" || item.state === "clear"
  ).length
  const worst = [...states].sort(
    (a, b) => urgencyOf(b) - urgencyOf(a) || dayNumber(a.due) - dayNumber(b.due)
  )[0]
  const urgency = worst ? urgencyOf(worst) : 0
  const short = worst ? SERVICES[worst.service].short : ""

  // A miss and a lapse show their day in the matrix; a due day is still ahead.
  let note = "On track"
  if (worst && urgency === 4) note = `${short} missed`
  else if (worst && urgency === 3) note = `${short} lapsed`
  else if (worst && urgency === 2) note = `${short} due ${formatDay(worst.due)}`
  else if (worst && urgency === 1) note = `${short} booked late`

  return {
    onTrack,
    total: states.length,
    tone: urgency >= 3 ? "destructive" : urgency > 0 ? "warning" : "success",
    note,
    rank: states.length === 0 ? 1 : onTrack / states.length - urgency / 100,
  }
}

// ── Matrix cells ──

export interface DayCell {
  kind: CellKind
  service: ServiceId
  /** Absent on a Due marker. */
  visit?: Visit
  /** The cycle the visit or marker belongs to. */
  state: ServiceState
}

/** A marker sits on its due day (today once that has passed), or the nearest
 *  free weekday before it, then after it: one thing per kitchen per day. */
export function placeMarkers(
  states: ServiceState[],
  takenDays: Set<number>
): Map<number, ServiceState> {
  const markers = new Map<number, ServiceState>()
  const gaps = states
    .filter((item) => item.state === "gap")
    .sort((a, b) => dayNumber(a.due) - dayNumber(b.due))
  for (const gap of gaps) {
    const target = Math.max(dayNumber(gap.due), TODAY_DAY)
    const free = (day: number) =>
      !isWeekend(day) && !takenDays.has(day) && !markers.has(day)
    let day: number | null = null
    for (let probe = target; probe >= TODAY_DAY && day === null; probe--)
      if (free(probe)) day = probe
    for (let probe = target + 1; day === null; probe++)
      if (free(probe)) day = probe
    markers.set(day, gap)
  }
  return markers
}

export interface KitchenPlan {
  states: ServiceState[]
  cells: Map<number, DayCell>
}

/** One kitchen's cycle states and its day cells, through an optional lens. */
export function planOf(
  kitchen: Kitchen,
  visits: Visit[],
  lens: ServiceId | null
): KitchenPlan {
  const allStates = kitchen.services.map((service) =>
    serviceStateOf(kitchen, service, visits)
  )
  const stateBy = new Map(allStates.map((state) => [state.service, state]))
  const cells = new Map<number, DayCell>()
  const taken = new Set<number>()
  for (const visit of visits) {
    const day = dayNumber(visit.date)
    taken.add(day)
    const state = stateBy.get(visit.service)
    // A visit for a service the kitchen dropped has no cycle to show.
    if (!state || (lens && visit.service !== lens)) continue
    cells.set(day, {
      kind: statusOf(visit),
      service: visit.service,
      visit,
      state,
    })
  }
  for (const [day, state] of placeMarkers(allStates, taken)) {
    if (lens && state.service !== lens) continue
    cells.set(day, { kind: "due", service: state.service, state })
  }
  return {
    states: lens
      ? allStates.filter((state) => state.service === lens)
      : allStates,
    cells,
  }
}

// ── Booking help ──

/** The visit a technician already has in that slot, one visit left out:
 *  a crew is at one kitchen per window of a day. */
export function crewClashOf(
  slot: { technicianId: string; date: string; window: VisitWindow },
  visits: Visit[],
  exceptId: string | null
) {
  return (
    visits.find(
      (visit) =>
        visit.id !== exceptId &&
        visit.technicianId === slot.technicianId &&
        visit.date === slot.date &&
        visit.window === slot.window
    ) ?? null
  )
}

/** The certified technician with the fewest visits that week, free in the
 *  window when one is named. */
export function autoTechnician(
  service: ServiceId,
  iso: string,
  visits: Visit[],
  window?: VisitWindow
) {
  const start = weekStartOf(dayNumber(iso))
  const load = (id: string) =>
    visits.filter((visit) => {
      const day = dayNumber(visit.date)
      return visit.technicianId === id && day >= start && day < start + 7
    }).length
  const techs = techniciansFor(service)
  const free = window
    ? techs.filter(
        (tech) =>
          !crewClashOf(
            { technicianId: tech.id, date: iso, window },
            visits,
            null
          )
      )
    : techs
  return (free.length > 0 ? free : techs).reduce((best, tech) =>
    load(tech.id) < load(best.id) ? tech : best
  )
}

/** The service's own window with a free crew, else the next window that has
 *  one: an automatic booking never puts a technician in two kitchens. */
export function openSlotOf(service: ServiceId, iso: string, visits: Visit[]) {
  const own = SERVICES[service].window
  for (const window of [own, ...WINDOWS.filter((item) => item !== own)]) {
    const technician = autoTechnician(service, iso, visits, window)
    if (
      !crewClashOf(
        { technicianId: technician.id, date: iso, window },
        visits,
        null
      )
    )
      return { window, technician }
  }
  return { window: own, technician: autoTechnician(service, iso, visits, own) }
}

/** "Pest Control at Pilsen Taqueria on Wed, Oct 14" */
export function visitLabel(visit: Visit, kitchen: Kitchen | undefined) {
  return `${SERVICES[visit.service].label} at ${kitchen?.name ?? "a kitchen"} on ${formatLongDay(visit.date)}`
}

/** Where a visit sits against its cycle, in the words the popover shows. */
export function cycleNote(
  visit: Visit,
  state: ServiceState
): { text: string; tone: "destructive" | "warning" | null } {
  const status = statusOf(visit)
  if (status === "done")
    return { text: `Every ${state.cycle} days`, tone: null }
  if (status === "missed")
    return { text: `Was due ${formatDay(state.due)}`, tone: "destructive" }
  const late = dayNumber(visit.date) - dayNumber(state.due)
  if (late > 0)
    return {
      text: `${plural(late, "day")} after due ${formatDay(state.due)}`,
      tone: "warning",
    }
  return { text: `Covers due ${formatDay(state.due)}`, tone: null }
}