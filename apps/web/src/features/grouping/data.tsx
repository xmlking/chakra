export type DeskStage = "Drafting" | "In Edit" | "Fact Check" | "Ready";
export type Desk = "Features" | "Business" | "Culture" | "Science";
export type Placement = "Lead" | "Feature" | "Brief";
export type GroupBy = "stage" | "desk" | "issue";

export interface Byline {
  id: string;
  name: string;
  initials: string;
  role: string;
  avatarSrc: string;
}

export interface Story {
  id: string;
  slug: string;
  title: string;
  /** One-line angle, the desk's shorthand for what the piece argues. */
  angle: string;
  stage: DeskStage;
  desk: Desk;
  issue: string;
  placement: Placement;
  /** Byline ids: writers first, the responsible editor last. */
  bylineIds: string[];
  filedAt: string;
  filedLabel: string;
  publishAt: string;
  publishLabel: string;
  assets: number;
  notes: number;
}

export const PUBLICATION = "Northline Review";
export const PRODUCTION_AS_OF = "24 Jul 2026";

/** Pipeline order, also the order the sections render in. */
export const STAGE_ORDER: DeskStage[] = ["Drafting", "In Edit", "Fact Check", "Ready"];

export const DESK_ORDER: Desk[] = ["Features", "Business", "Culture", "Science"];

export const PLACEMENT_ORDER: Placement[] = ["Lead", "Feature", "Brief"];

export const GROUP_BY_OPTIONS: { value: GroupBy; label: string }[] = [
  { value: "stage", label: "Stage" },
  { value: "desk", label: "Desk" },
  { value: "issue", label: "Issue" },
];

// One tone per section, for every grouping dimension. Stage runs a progress
// ladder; desk and issue are identity colours, so they only need to be distinct
// from each other. Every value is a real Tailwind pair, never a computed name.
export interface SectionTone {
  band: string;
  dot: string;
}

export const STAGE_TONE: Record<DeskStage, SectionTone> = {
  Drafting: { band: "bg-sky-50 dark:bg-sky-950/40", dot: "bg-sky-500" },
  "In Edit": { band: "bg-amber-50 dark:bg-amber-950/40", dot: "bg-amber-500" },
  "Fact Check": { band: "bg-rose-50 dark:bg-rose-950/40", dot: "bg-rose-500" },
  Ready: {
    band: "bg-emerald-50 dark:bg-emerald-950/40",
    dot: "bg-emerald-500",
  },
};

export const DESK_TONE: Record<Desk, SectionTone> = {
  Features: {
    band: "bg-violet-50 dark:bg-violet-950/40",
    dot: "bg-violet-500",
  },
  Business: { band: "bg-cyan-50 dark:bg-cyan-950/40", dot: "bg-cyan-500" },
  Culture: {
    band: "bg-fuchsia-50 dark:bg-fuchsia-950/40",
    dot: "bg-fuchsia-500",
  },
  Science: { band: "bg-teal-50 dark:bg-teal-950/40", dot: "bg-teal-500" },
};

// Issues are sequential, so they alternate rather than each claiming a hue.
export const ISSUE_TONES: SectionTone[] = [
  { band: "bg-indigo-50 dark:bg-indigo-950/40", dot: "bg-indigo-500" },
  { band: "bg-orange-50 dark:bg-orange-950/40", dot: "bg-orange-500" },
];

export const BYLINES: Byline[] = [
  {
    id: "per-01",
    name: "Mira Stone",
    avatarSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&dpr=2&q=80",
    initials: "MS",
    role: "Editor in Chief",
  },
  {
    id: "per-02",
    name: "Leo Grant",
    avatarSrc: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&dpr=2&q=80",
    initials: "LG",
    role: "Features Editor",
  },
  {
    id: "per-03",
    name: "Nora Vale",
    avatarSrc: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&dpr=2&q=80",
    initials: "NV",
    role: "Staff Writer",
  },
  {
    id: "per-04",
    name: "Theo Park",
    avatarSrc: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&dpr=2&q=80",
    initials: "TP",
    role: "Science Writer",
  },
  {
    id: "per-05",
    name: "Sana Qureshi",
    avatarSrc: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&dpr=2&q=80",
    initials: "SQ",
    role: "Copy Chief",
  },
  {
    id: "per-06",
    name: "Alex Johnson",
    avatarSrc: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80",
    initials: "AJ",
    role: "Business Writer",
  },
  {
    id: "per-07",
    name: "Sarah Chen",
    avatarSrc: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=96&h=96&dpr=2&q=80",
    initials: "SC",
    role: "Culture Editor",
  },
  {
    id: "per-08",
    name: "Michael Rodriguez",
    avatarSrc: "https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=96&h=96&dpr=2&q=80",
    initials: "MR",
    role: "Fact Checker",
  },
  {
    id: "per-09",
    name: "Emma Wilson",
    avatarSrc: "https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=96&h=96&dpr=2&q=80",
    initials: "EW",
    role: "Staff Writer",
  },
  {
    id: "per-10",
    name: "David Kim",
    avatarSrc: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=96&h=96&dpr=2&q=80",
    initials: "DK",
    role: "Photo Editor",
  },
];

// customize: swap these records for your own commissioned pieces. The
// grouping dimensions read straight off stage, desk and issue, so adding a
// value to any of those unions gives you a new section with no other change.
export const STORIES: Story[] = [
  {
    id: "st-101",
    slug: "NR-1201",
    title: "The Last Dry Winter",
    angle: "Reservoir towns rewrite what a drought season means",
    stage: "Drafting",
    desk: "Features",
    issue: "Issue 42",
    placement: "Lead",
    bylineIds: ["per-03", "per-02"],
    filedAt: "2026-07-06",
    filedLabel: "06 Jul",
    publishAt: "2026-08-14",
    publishLabel: "14 Aug",
    assets: 7,
    notes: 12,
  },
  {
    id: "st-102",
    slug: "NR-1202",
    title: "Cheap Money Ends",
    angle: "Why regional lenders stopped underwriting the middle",
    stage: "Drafting",
    desk: "Business",
    issue: "Issue 42",
    placement: "Feature",
    bylineIds: ["per-06"],
    filedAt: "2026-07-09",
    filedLabel: "09 Jul",
    publishAt: "2026-08-07",
    publishLabel: "07 Aug",
    assets: 3,
    notes: 5,
  },
  {
    id: "st-103",
    slug: "NR-1203",
    title: "Night Shift Choirs",
    angle: "Hospital cleaners built a choir that outlasted the ward",
    stage: "Drafting",
    desk: "Culture",
    issue: "Issue 43",
    placement: "Brief",
    bylineIds: ["per-09", "per-07"],
    filedAt: "2026-07-11",
    filedLabel: "11 Jul",
    publishAt: "2026-09-11",
    publishLabel: "11 Sep",
    assets: 2,
    notes: 3,
  },
  {
    id: "st-104",
    slug: "NR-1204",
    title: "The Grid Goes Quiet",
    angle: "A utility learns to sell less power and stay solvent",
    stage: "In Edit",
    desk: "Business",
    issue: "Issue 42",
    placement: "Feature",
    bylineIds: ["per-04", "per-02"],
    filedAt: "2026-06-24",
    filedLabel: "24 Jun",
    publishAt: "2026-08-14",
    publishLabel: "14 Aug",
    assets: 11,
    notes: 18,
  },
  {
    id: "st-105",
    slug: "NR-1205",
    title: "The Repair Clause",
    angle: "A right-to-repair bill nobody lobbied against, and why",
    stage: "In Edit",
    desk: "Business",
    issue: "Issue 42",
    placement: "Lead",
    bylineIds: ["per-06", "per-03", "per-02"],
    filedAt: "2026-06-19",
    filedLabel: "19 Jun",
    publishAt: "2026-08-21",
    publishLabel: "21 Aug",
    assets: 6,
    notes: 21,
  },
  {
    id: "st-106",
    slug: "NR-1206",
    title: "Museum of Ordinary Things",
    angle: "A curator collects receipts, tickets, and other proof of living",
    stage: "In Edit",
    desk: "Culture",
    issue: "Issue 42",
    placement: "Brief",
    bylineIds: ["per-07"],
    filedAt: "2026-07-02",
    filedLabel: "02 Jul",
    publishAt: "2026-08-07",
    publishLabel: "07 Aug",
    assets: 4,
    notes: 7,
  },
  {
    id: "st-107",
    slug: "NR-1207",
    title: "Counting the Kelp",
    angle: "Divers and satellites disagree about the forest offshore",
    stage: "Fact Check",
    desk: "Science",
    issue: "Issue 42",
    placement: "Feature",
    bylineIds: ["per-04", "per-08"],
    filedAt: "2026-06-12",
    filedLabel: "12 Jun",
    publishAt: "2026-08-28",
    publishLabel: "28 Aug",
    assets: 9,
    notes: 26,
  },
  {
    id: "st-108",
    slug: "NR-1208",
    title: "Who Owns the Aquifer?",
    angle: "Three counties, one permit, forty years of paperwork",
    stage: "Fact Check",
    desk: "Features",
    issue: "Issue 42",
    placement: "Lead",
    bylineIds: ["per-03", "per-08", "per-02"],
    filedAt: "2026-06-05",
    filedLabel: "05 Jun",
    publishAt: "2026-08-14",
    publishLabel: "14 Aug",
    assets: 14,
    notes: 33,
  },
  {
    id: "st-109",
    slug: "NR-1209",
    title: "The Understudy Economy",
    angle: "Touring shows now run on performers who never go on",
    stage: "Fact Check",
    desk: "Culture",
    issue: "Issue 43",
    placement: "Brief",
    bylineIds: ["per-09", "per-08"],
    filedAt: "2026-07-01",
    filedLabel: "01 Jul",
    publishAt: "2026-09-11",
    publishLabel: "11 Sep",
    assets: 3,
    notes: 9,
  },
  {
    id: "st-110",
    slug: "NR-1210",
    title: "Freight on the Old Line",
    angle: "A closed rail spur reopens, and the town argues about noise",
    stage: "Ready",
    desk: "Business",
    issue: "Issue 42",
    placement: "Feature",
    bylineIds: ["per-06", "per-05"],
    filedAt: "2026-05-28",
    filedLabel: "28 May",
    publishAt: "2026-08-21",
    publishLabel: "21 Aug",
    assets: 8,
    notes: 15,
  },
  {
    id: "st-111",
    slug: "NR-1211",
    title: "Field Notes: Ash",
    angle: "What a burn scar looks like eighteen months later",
    stage: "Ready",
    desk: "Science",
    issue: "Issue 42",
    placement: "Brief",
    bylineIds: ["per-04", "per-05"],
    filedAt: "2026-06-02",
    filedLabel: "02 Jun",
    publishAt: "2026-08-28",
    publishLabel: "28 Aug",
    assets: 12,
    notes: 6,
  },
  {
    id: "st-112",
    slug: "NR-1212",
    title: "The Quiet Ward",
    angle: "A hospice unit that stopped measuring outcomes in days",
    stage: "Ready",
    desk: "Features",
    issue: "Issue 42",
    placement: "Feature",
    bylineIds: ["per-09", "per-02", "per-05"],
    filedAt: "2026-05-21",
    filedLabel: "21 May",
    publishAt: "2026-08-14",
    publishLabel: "14 Aug",
    assets: 5,
    notes: 11,
  },
  {
    id: "st-113",
    slug: "NR-1213",
    title: "Second Press",
    angle: "A closed print shop reopens as a co-op, badly at first",
    stage: "Ready",
    desk: "Culture",
    issue: "Issue 43",
    placement: "Brief",
    bylineIds: ["per-07", "per-05"],
    filedAt: "2026-06-18",
    filedLabel: "18 Jun",
    publishAt: "2026-09-11",
    publishLabel: "11 Sep",
    assets: 4,
    notes: 8,
  },
];

/** Byline lookup. Throws on a bad id so a typo fails at build, not in the UI. */
export function byline(id: string): Byline {
  const found = BYLINES.find((person) => person.id === id);
  if (!found) throw new Error(`Unknown byline: ${id}`);
  return found;
}

export function storyBylines(story: Story): Byline[] {
  return story.bylineIds.map(byline);
}

/** Text a search query is matched against, lowercased once per story. */
export function storySearchBlob(story: Story) {
  return [
    story.title,
    story.angle,
    story.slug,
    story.desk,
    story.issue,
    story.stage,
    story.placement,
  ]
    .join(" ")
    .toLowerCase();
}

export function filterStories(
  stories: Story[],
  {
    query,
    desks,
    placements,
  }: {
    query: string;
    desks: Desk[];
    placements: Placement[];
  },
) {
  return stories.filter((story) => {
    if (desks.length > 0 && !desks.includes(story.desk)) return false;
    if (placements.length > 0 && !placements.includes(story.placement)) {
      return false;
    }
    if (query.length > 0 && !storySearchBlob(story).includes(query)) return false;
    return true;
  });
}

export interface StorySection {
  key: string;
  label: string;
  /** Resolved by the current dimension, so every band carries colour. */
  tone: SectionTone;
  stories: Story[];
}

/**
 * Splits the visible stories into the sections the current dimension implies.
 * Every section in the dimension's own order is returned, including empty ones,
 * so the pipeline keeps its shape while a filter is narrowing it.
 */
export function buildSections(stories: Story[], groupBy: GroupBy): StorySection[] {
  if (groupBy === "desk") {
    return DESK_ORDER.map((desk) => ({
      key: desk,
      label: desk,
      tone: DESK_TONE[desk],
      stories: stories.filter((story) => story.desk === desk),
    }));
  }

  if (groupBy === "issue") {
    const issues = [...new Set(STORIES.map((story) => story.issue))].sort();
    return issues.map((issue, index) => ({
      key: issue,
      label: issue,
      tone: ISSUE_TONES[index % ISSUE_TONES.length],
      stories: stories.filter((story) => story.issue === issue),
    }));
  }

  return STAGE_ORDER.map((stage) => ({
    key: stage,
    label: stage,
    tone: STAGE_TONE[stage],
    stories: stories.filter((story) => story.stage === stage),
  }));
}

export function countReady(stories: Story[]) {
  return stories.filter((story) => story.stage === "Ready").length;
}

/** Pieces still short of the fact-check desk, the number an editor chases. */
export function countUnchecked(stories: Story[]) {
  return stories.filter((story) => story.stage === "Drafting" || story.stage === "In Edit").length;
}

export function formatCount(value: number) {
  return value.toLocaleString("en-US");
}
