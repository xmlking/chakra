export const TODAY = "2026-10-16"

/** The visit log starts here; the window can walk back to Sep 14. */
export const LOG_START = "2026-08-31"

/** A due date this close with nothing booked is a gap to book now. */
export const BOOKING_HORIZON_DAYS = 28

/** Vendors book the next visit this far ahead; later cycles wait. */
const BOOK_AHEAD_DAYS = 35

/** Bookings inside this many days are confirmed; later ones still await it. */
const CONFIRMED_AHEAD_DAYS = 14

export type ServiceId = "clean" | "pest" | "grease" | "hood" | "fridge" | "fire"
export type Volume = "high" | "moderate"
export type VisitWindow = "opening" | "afternoon" | "close"
/** What a visit stores; Missed is derived from the date. */
export type StoredStatus = "proposed" | "confirmed" | "done"

export interface Service {
  id: ServiceId
  label: string
  /** The one word the Coverage column has room for. */
  short: string
  /** Days between visits, by cooking volume. */
  cycle: Record<Volume, number>
  /** When this crew usually comes. */
  window: VisitWindow
}

/** Shortest cycle first, the order every list and form reads in. */
export const SERVICE_IDS: readonly ServiceId[] = [
  "clean",
  "pest",
  "grease",
  "hood",
  "fridge",
  "fire",
]

export const SERVICES: Record<ServiceId, Service> = {
  clean: {
    id: "clean",
    label: "Deep Clean",
    short: "Clean",
    cycle: { high: 14, moderate: 14 },
    window: "close",
  },
  pest: {
    id: "pest",
    label: "Pest Control",
    short: "Pest",
    cycle: { high: 30, moderate: 30 },
    window: "opening",
  },
  grease: {
    id: "grease",
    label: "Grease Trap",
    short: "Grease",
    cycle: { high: 60, moderate: 60 },
    window: "opening",
  },
  hood: {
    id: "hood",
    label: "Hood Cleaning",
    short: "Hood",
    // Fryers, grills and woks load the ducts twice as fast.
    cycle: { high: 90, moderate: 180 },
    window: "close",
  },
  fire: {
    id: "fire",
    label: "Fire Suppression",
    short: "Fire",
    cycle: { high: 180, moderate: 180 },
    window: "afternoon",
  },
  fridge: {
    id: "fridge",
    label: "Refrigeration",
    short: "Cooling",
    cycle: { high: 90, moderate: 90 },
    window: "afternoon",
  },
}

export const VOLUMES: readonly Volume[] = ["high", "moderate"]

export const VOLUME_LABEL: Record<Volume, string> = {
  high: "High volume",
  moderate: "Moderate volume",
}

export const WINDOWS: readonly VisitWindow[] = ["opening", "afternoon", "close"]

export const WINDOW_LABEL: Record<VisitWindow, string> = {
  opening: "Before opening",
  afternoon: "Afternoon lull",
  close: "After close",
}

export interface Person {
  id: string
  name: string
  role: string
  avatar: string
}

export interface Vendor {
  id: string
  name: string
  service: ServiceId
  /** Dispatch line and inbox, where a booking gets its yes. */
  phone: string
  email: string
}

export interface Technician extends Person {
  vendorId: string
  /** The one service this technician is certified for. */
  service: ServiceId
}

export interface Kitchen {
  id: string
  name: string
  /** Where the crews drive to. */
  address: string
  managerId: string
  volume: Volume
  services: ServiceId[]
  /** The last visit per service before the log starts; absent on a new kitchen. */
  priorDone: Partial<Record<ServiceId, string>>
}

export interface Visit {
  id: string
  kitchenId: string
  service: ServiceId
  /** ISO day. */
  date: string
  window: VisitWindow
  technicianId: string
  status: StoredStatus
  notes: string
  /** The crew's job sheet or certificate number, kept once signed off. */
  report?: string
}

const portrait = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=96&h=96&dpr=2&q=80`

export const MANAGERS: Person[] = [
  {
    id: "mgr_dw",
    name: "Dana Whitfield",
    role: "Area manager, West Loop",
    avatar: portrait("1573496359142-b8d87734a5a2"),
  },
  {
    id: "mgr_mb",
    name: "Marcus Bell",
    role: "Area manager, North Side",
    avatar: portrait("1560250097-0b93528c311a"),
  },
  {
    id: "mgr_er",
    name: "Elena Ruiz",
    role: "Area manager, South Side",
    avatar: portrait("1580489944761-15a19d654956"),
  },
  {
    id: "mgr_al",
    name: "Andre Lewis",
    role: "Area manager, Northwest",
    avatar: portrait("1527980965255-d3b416303d12"),
  },
  {
    id: "mgr_go",
    name: "Grace Okoye",
    role: "Area manager, Downtown",
    avatar: portrait("1531123897727-8f129e1688ce"),
  },
  {
    id: "mgr_vh",
    name: "Victor Hale",
    role: "Area manager, Far North",
    avatar: portrait("1607990281513-2c110a25bd8c"),
  },
]

export const MANAGER_BY_ID = new Map(
  MANAGERS.map((person) => [person.id, person])
)

export const VENDORS: Vendor[] = [
  {
    id: "ven_nightshift",
    name: "Nightshift Cleaning",
    service: "clean",
    phone: "(312) 555-0110",
    email: "nightshift.dispatch@example.com",
  },
  {
    id: "ven_brightline",
    name: "Brightline Pest",
    service: "pest",
    phone: "(312) 555-0124",
    email: "brightline.dispatch@example.com",
  },
  {
    id: "ven_lakeshore",
    name: "Lakeshore Grease",
    service: "grease",
    phone: "(312) 555-0137",
    email: "lakeshore.dispatch@example.com",
  },
  {
    id: "ven_clearflue",
    name: "Clearflue Hoods",
    service: "hood",
    phone: "(312) 555-0141",
    email: "clearflue.dispatch@example.com",
  },
  {
    id: "ven_redwater",
    name: "Redwater Fire",
    service: "fire",
    phone: "(312) 555-0158",
    email: "redwater.dispatch@example.com",
  },
  {
    id: "ven_coldcourt",
    name: "Coldcourt Mechanical",
    service: "fridge",
    phone: "(312) 555-0163",
    email: "coldcourt.dispatch@example.com",
  },
]

export const VENDOR_BY_ID = new Map(
  VENDORS.map((vendor) => [vendor.id, vendor])
)

export const TECHNICIANS: Technician[] = [
  {
    id: "tec_tg",
    name: "Tessa Grant",
    role: "Night crew lead",
    vendorId: "ven_nightshift",
    service: "clean",
    avatar: portrait("1517841905240-472988babdf9"),
  },
  {
    id: "tec_is",
    name: "Imran Shah",
    role: "Night crew lead",
    vendorId: "ven_nightshift",
    service: "clean",
    avatar: portrait("1507591064344-4c6ce005b128"),
  },
  {
    id: "tec_rc",
    name: "Ray Coleman",
    role: "Pest technician",
    vendorId: "ven_brightline",
    service: "pest",
    avatar: portrait("1507003211169-0a1dd7228f2d"),
  },
  {
    id: "tec_jf",
    name: "Jada Fox",
    role: "Pest technician",
    vendorId: "ven_brightline",
    service: "pest",
    avatar: portrait("1508214751196-bcfd4ca60f91"),
  },
  {
    id: "tec_hd",
    name: "Hector Diaz",
    role: "Grease trap driver",
    vendorId: "ven_lakeshore",
    service: "grease",
    avatar: portrait("1584308972272-9e4e7685e80f"),
  },
  {
    id: "tec_ba",
    name: "Ben Archer",
    role: "Grease trap driver",
    vendorId: "ven_lakeshore",
    service: "grease",
    avatar: portrait("1506794778202-cad84cf45f1d"),
  },
  {
    id: "tec_lm",
    name: "Luis Moreno",
    role: "Hood crew lead",
    vendorId: "ven_clearflue",
    service: "hood",
    avatar: portrait("1500648767791-00dcc994a43e"),
  },
  {
    id: "tec_kl",
    name: "Kara Lind",
    role: "Hood crew lead",
    vendorId: "ven_clearflue",
    service: "hood",
    avatar: portrait("1519699047748-de8e457a634e"),
  },
  {
    id: "tec_op",
    name: "Owen Price",
    role: "Fire systems inspector",
    vendorId: "ven_redwater",
    service: "fire",
    avatar: portrait("1472099645785-5658abf4ff4e"),
  },
  {
    id: "tec_nb",
    name: "Nadia Brooks",
    role: "Fire systems inspector",
    vendorId: "ven_redwater",
    service: "fire",
    avatar: portrait("1544005313-94ddf0286df2"),
  },
  {
    id: "tec_so",
    name: "Sam Ortiz",
    role: "Refrigeration technician",
    vendorId: "ven_coldcourt",
    service: "fridge",
    avatar: portrait("1535713875002-d1d0cf377fde"),
  },
  {
    id: "tec_ml",
    name: "Mei Lin",
    role: "Refrigeration technician",
    vendorId: "ven_coldcourt",
    service: "fridge",
    avatar: portrait("1485893086445-ed75865251e0"),
  },
]

export const TECHNICIAN_BY_ID = new Map(
  TECHNICIANS.map((tech) => [tech.id, tech])
)

export const techniciansFor = (service: ServiceId) =>
  TECHNICIANS.filter((tech) => tech.service === service)

// ── Day math on ISO strings, in whole UTC days ──

const DAY_MS = 86_400_000

export function dayNumber(iso: string) {
  const [year, month, day] = iso.split("-").map(Number)
  return Date.UTC(year, month - 1, day) / DAY_MS
}

export function isoOf(day: number) {
  return new Date(day * DAY_MS).toISOString().slice(0, 10)
}

/** 0 is Sunday. */
export const weekdayOf = (day: number) => (day + 4) % 7

export const TODAY_DAY = dayNumber(TODAY)

/** Saturday and Sunday are peak service, so crews come on weekdays. */
export const isWeekend = (day: number) => {
  const weekday = weekdayOf(day)
  return weekday === 0 || weekday === 6
}

/** A weekend day moves back to Friday. */
const weekdayOnOrBefore = (day: number) => {
  const weekday = weekdayOf(day)
  return weekday === 6 ? day - 1 : weekday === 0 ? day - 2 : day
}

// ── Kitchens ──

const ALL: ServiceId[] = [...SERVICE_IDS]
/** No fryer or grill, so no hood and no suppression system to inspect. */
const CAFE: ServiceId[] = ["clean", "pest", "grease", "fridge"]

type KitchenSeed = Omit<Kitchen, "priorDone">

const KITCHEN_SEEDS: KitchenSeed[] = [
  {
    id: "kit_fulton",
    name: "Fulton Market Grill",
    address: "1140 W Fulton Market, Chicago",
    managerId: "mgr_dw",
    volume: "high",
    services: ALL,
  },
  {
    id: "kit_kinzie",
    name: "Kinzie Commissary",
    address: "410 W Kinzie St, Chicago",
    managerId: "mgr_dw",
    volume: "high",
    services: ALL,
  },
  {
    id: "kit_greektown",
    name: "Greektown Taqueria",
    address: "325 S Halsted St, Chicago",
    managerId: "mgr_dw",
    volume: "high",
    services: ALL,
  },
  {
    id: "kit_lincoln",
    name: "Lincoln Park Pizzeria",
    address: "2215 N Lincoln Ave, Chicago",
    managerId: "mgr_mb",
    volume: "moderate",
    services: ALL,
  },
  {
    id: "kit_oldtown",
    name: "Old Town Café",
    address: "1520 N Wells St, Chicago",
    managerId: "mgr_mb",
    volume: "moderate",
    services: CAFE,
  },
  {
    id: "kit_lakeview",
    name: "Lakeview Grill",
    address: "3330 N Broadway, Chicago",
    managerId: "mgr_mb",
    volume: "high",
    services: ALL,
  },
  {
    id: "kit_pilsen",
    name: "Pilsen Taqueria",
    address: "1726 W 18th St, Chicago",
    managerId: "mgr_er",
    volume: "high",
    services: ALL,
  },
  {
    id: "kit_bridgeport",
    name: "Bridgeport Pizzeria",
    address: "3155 S Halsted St, Chicago",
    managerId: "mgr_er",
    volume: "moderate",
    services: ALL,
  },
  {
    id: "kit_hydepark",
    name: "Hyde Park Café",
    address: "1450 E 53rd St, Chicago",
    managerId: "mgr_er",
    volume: "moderate",
    services: CAFE,
  },
  {
    id: "kit_humboldt",
    name: "Humboldt Taqueria",
    address: "2830 W Division St, Chicago",
    managerId: "mgr_al",
    volume: "high",
    services: ALL,
  },
  {
    id: "kit_wicker",
    name: "Wicker Park Grill",
    address: "1550 N Milwaukee Ave, Chicago",
    managerId: "mgr_al",
    volume: "high",
    services: ALL,
  },
  {
    id: "kit_avondale",
    name: "Avondale Pizzeria",
    address: "3210 W Belmont Ave, Chicago",
    managerId: "mgr_al",
    volume: "moderate",
    services: ALL,
  },
  {
    id: "kit_rivernorth",
    name: "River North Grill",
    address: "520 N Clark St, Chicago",
    managerId: "mgr_go",
    volume: "high",
    services: ALL,
  },
  {
    id: "kit_loop",
    name: "Loop Café",
    address: "120 W Madison St, Chicago",
    managerId: "mgr_go",
    volume: "moderate",
    services: CAFE,
  },
  {
    id: "kit_streeterville",
    name: "Streeterville Pizzeria",
    address: "455 E Illinois St, Chicago",
    managerId: "mgr_go",
    volume: "moderate",
    services: ALL,
  },
  {
    id: "kit_andersonville",
    name: "Andersonville Café",
    address: "5320 N Clark St, Chicago",
    managerId: "mgr_vh",
    volume: "moderate",
    services: CAFE,
  },
  {
    id: "kit_edgewater",
    name: "Edgewater Taqueria",
    address: "6015 N Broadway, Chicago",
    managerId: "mgr_vh",
    volume: "high",
    services: ALL,
  },
  {
    id: "kit_evanston",
    name: "Evanston Grill",
    address: "820 Church St, Evanston",
    managerId: "mgr_vh",
    volume: "high",
    services: ALL,
  },
]

// ── The story: what a coordinator finds on Friday morning ──

type Override =
  /** Booked and confirmed, the day passed, nobody came. */
  | { kind: "missed"; daysAgo: number }
  /** The next visit is proposed and still needs a yes. */
  | { kind: "awaiting"; inDays: number }
  /** Due on that day and nothing booked; negative is already lapsed. */
  | { kind: "unbooked"; dueIn: number }
  /** Booked, but `lateBy` days after the cycle runs out. */
  | { kind: "late"; dueIn: number; lateBy: number }

// Every day below keeps its cycle's previous visit on a weekday, so weekend
// moves never shift it.
const OVERRIDES: Record<string, Override> = {
  "kit_lakeview:grease": { kind: "missed", daysAgo: 3 },
  "kit_pilsen:pest": { kind: "missed", daysAgo: 2 },
  "kit_loop:fridge": { kind: "missed", daysAgo: 1 },
  "kit_kinzie:fridge": { kind: "awaiting", inDays: 4 },
  "kit_fulton:pest": { kind: "awaiting", inDays: 5 },
  "kit_hydepark:pest": { kind: "awaiting", inDays: 7 },
  "kit_lincoln:grease": { kind: "awaiting", inDays: 7 },
  "kit_andersonville:grease": { kind: "awaiting", inDays: 10 },
  "kit_streeterville:fire": { kind: "awaiting", inDays: 11 },
  "kit_edgewater:grease": { kind: "unbooked", dueIn: -7 },
  "kit_edgewater:fridge": { kind: "missed", daysAgo: 4 },
  "kit_rivernorth:pest": { kind: "unbooked", dueIn: 5 },
  "kit_rivernorth:clean": { kind: "late", dueIn: 6, lateBy: 4 },
  "kit_hydepark:grease": { kind: "unbooked", dueIn: 10 },
  "kit_lakeview:hood": { kind: "unbooked", dueIn: 11 },
  "kit_avondale:pest": { kind: "unbooked", dueIn: 5 },
  "kit_fulton:hood": { kind: "unbooked", dueIn: 6 },
  "kit_rivernorth:fire": { kind: "unbooked", dueIn: 12 },
  "kit_wicker:fridge": { kind: "late", dueIn: 6, lateBy: 4 },
}

/** What the crew wrote on the job sheet, rotated through the log. */
const JOB_NOTES: Record<ServiceId, string[]> = {
  clean: [
    "Floors, walls and line equipment degreased",
    "Floor drains scrubbed and sanitized",
    "Walk-in floor and shelving cleaned",
  ],
  pest: [
    "Bait stations checked, no activity",
    "Two glue boards replaced by the dish pit",
    "Door sweep gap flagged at the rear dock",
  ],
  grease: [
    "Trap pumped at 40% full",
    "Trap pumped, baffle intact",
    "Outlet line jetted after a slow drain",
  ],
  hood: [
    "Hood, ducts and fan cleaned to bare metal",
    "Filters swapped, fan belt showing wear",
  ],
  fire: [
    "Nozzles and links checked, tag renewed",
    "Fusible links replaced on the fryer line",
  ],
  fridge: [
    "Coils cleaned, gaskets fine",
    "Walk-in door gasket replaced",
    "Condenser fan motor running loud",
  ],
}

/** What the coordinator told the crew before a booked visit. */
const BOOKING_NOTES: Record<string, string> = {
  "kit_fulton:pest": "Rear dock door, ask for the opening sous chef",
  "kit_wicker:fridge": "Earliest slot Coldcourt had after the walk-in repair",
  "kit_streeterville:fire": "Suppression test needs the line cold by 2 PM",
}

/** The last done day for a cycle, spread so kitchens never come due together.
 *  It stays recent enough that weekend moves leave the next visit after today. */
function anchorOf(kitchenIndex: number, serviceIndex: number, cycle: number) {
  const spread = (kitchenIndex * 7 + serviceIndex * 11 + 3) % (cycle - 5)
  return TODAY_DAY - 1 - spread
}

/** Job sheet numbers carry the service's letters, as the crews print them. */
const REPORT_PREFIX: Record<ServiceId, string> = {
  clean: "DC",
  pest: "PC",
  grease: "GT",
  hood: "HC",
  fridge: "RF",
  fire: "FS",
}

function buildPlan() {
  const kitchens: Kitchen[] = []
  const visits: Visit[] = []
  const logStart = dayNumber(LOG_START)
  // A crew is at one kitchen per window of a day: the rotation's pick gives
  // way to its partner, then to the next window, when its slot is taken.
  const crewSlots = new Set<string>()
  const crewFor = (service: ServiceId, day: number, turn: number) => {
    const techs = techniciansFor(service)
    const own = SERVICES[service].window
    for (const window of [own, ...WINDOWS.filter((item) => item !== own)])
      for (let step = 0; step < techs.length; step++) {
        const tech = techs[(turn + step) % techs.length]
        const slot = `${tech.id}|${day}|${window}`
        if (crewSlots.has(slot)) continue
        crewSlots.add(slot)
        return { window, technicianId: tech.id }
      }
    return { window: own, technicianId: techs[turn % techs.length].id }
  }

  KITCHEN_SEEDS.forEach((seed, kitchenIndex) => {
    const priorDone: Kitchen["priorDone"] = {}
    const taken = new Set<number>()
    // Keeps one visit a day per kitchen: a clash moves back a weekday, but
    // never into the past for a booking that has not happened yet.
    const place = (day: number, future: boolean) => {
      let next = weekdayOnOrBefore(day)
      while (taken.has(next)) {
        const earlier = weekdayOnOrBefore(next - 1)
        next =
          future && earlier < TODAY_DAY ? weekdayOnOrBefore(next + 3) : earlier
      }
      taken.add(next)
      return next
    }

    seed.services.forEach((service, serviceIndex) => {
      const key = `${seed.id}:${service}`
      const override = OVERRIDES[key]
      const cycle = SERVICES[service].cycle[seed.volume]
      let anchor = anchorOf(kitchenIndex, serviceIndex, cycle)
      if (override?.kind === "missed")
        anchor = TODAY_DAY - override.daysAgo - cycle
      if (override?.kind === "awaiting")
        anchor = TODAY_DAY + override.inDays - cycle
      if (override?.kind === "unbooked" || override?.kind === "late")
        anchor = TODAY_DAY + override.dueIn - cycle

      // Done visits back through the log, oldest first.
      const chain: number[] = []
      for (let day = anchor; day >= logStart; day -= cycle) chain.unshift(day)
      const before = chain.length > 0 ? chain[0] - cycle : anchor
      priorDone[service] = isoOf(weekdayOnOrBefore(before))
      // The cycle restarts from the day the crew actually came.
      let lastDone = weekdayOnOrBefore(before)

      chain.forEach((nominal, index) => {
        const day = place(nominal, false)
        lastDone = day
        visits.push({
          id: `vis_${seed.id.slice(4)}_${service}_${index + 1}`,
          kitchenId: seed.id,
          service,
          date: isoOf(day),
          ...crewFor(service, day, kitchenIndex + index),
          status: "done",
          report: `${REPORT_PREFIX[service]}-${2400 + kitchenIndex * 30 + serviceIndex * 5 + index}`,
          notes:
            JOB_NOTES[service][
              (kitchenIndex + index) % JOB_NOTES[service].length
            ],
        })
      })

      if (override?.kind === "unbooked") return
      const due = lastDone + cycle
      const nominal = override?.kind === "late" ? due + override.lateBy : due
      // Missed days stay where they were booked, in the past.
      const day =
        override?.kind === "missed"
          ? place(nominal, false)
          : place(nominal, true)
      if (day > TODAY_DAY + BOOK_AHEAD_DAYS) return
      visits.push({
        id: `vis_${seed.id.slice(4)}_${service}_${chain.length + 1}`,
        kitchenId: seed.id,
        service,
        date: isoOf(day),
        ...crewFor(service, day, kitchenIndex + chain.length),
        status:
          override?.kind === "awaiting" ||
          day > TODAY_DAY + CONFIRMED_AHEAD_DAYS
            ? "proposed"
            : "confirmed",
        notes: BOOKING_NOTES[key] ?? "",
      })
    })

    kitchens.push({ ...seed, priorDone })
  })

  return { kitchens, visits }
}

const PLAN = buildPlan()

export const KITCHENS: Kitchen[] = PLAN.kitchens
export const VISITS: Visit[] = PLAN.visits

// ── Drafts for the forms ──

export interface VisitDraft {
  kitchenId: string
  service: ServiceId | ""
  date: string
  window: VisitWindow
  technicianId: string
  status: Exclude<StoredStatus, "done">
  notes: string
}

export interface KitchenDraft {
  name: string
  address: string
  managerId: string
  volume: Volume
  services: ServiceId[]
  /** When each service was last done before the kitchen joined. */
  priorDone: Partial<Record<ServiceId, string>>
}

export const NEW_KITCHEN_DRAFT: KitchenDraft = {
  name: "",
  address: "",
  managerId: "",
  volume: "high",
  services: [...ALL],
  priorDone: {},
}

export const kitchenDraftOf = (kitchen: Kitchen): KitchenDraft => ({
  name: kitchen.name,
  address: kitchen.address,
  managerId: kitchen.managerId,
  volume: kitchen.volume,
  services: [...kitchen.services],
  priorDone: { ...kitchen.priorDone },
})

export const visitDraftOf = (visit: Visit): VisitDraft => ({
  kitchenId: visit.kitchenId,
  service: visit.service,
  date: visit.date,
  window: visit.window,
  technicianId: visit.technicianId,
  status: visit.status === "done" ? "confirmed" : visit.status,
  notes: visit.notes,
})