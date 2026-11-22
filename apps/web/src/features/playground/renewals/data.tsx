export type RenewalStage = "Preparing" | "Commercial review" | "Legal review" | "Committed";

export type RenewalRisk = "Low" | "Medium" | "High" | "Critical";

export type RenewalSegment = "Enterprise" | "Scale" | "Mid-market";

export type RenewalInvoiceStatus = "Ready" | "Finance review" | "Blocked";

export type RenewalSponsorStatus = "Confirmed" | "At risk" | "Missing";

export interface RenewalOwnerOption {
  value: string;
  label: string;
  avatar: string;
  teamLabel: string;
}

export interface IRenewalRecord {
  id: string;
  accountName: string;
  ownerName: string;
  ownerAvatar: string;
  segment: RenewalSegment;
  region: string;
  renewalDate: string;
  daysToRenewal: number;
  arr: number;
  expansionPotential: number;
  healthScore: number;
  usageTrend: number[];
  stage: RenewalStage;
  risk: RenewalRisk;
  invoiceStatus: RenewalInvoiceStatus;
  sponsorStatus: RenewalSponsorStatus;
  tags: string[];
}

export const RENEWAL_STAGE_ORDER: RenewalStage[] = [
  "Preparing",
  "Commercial review",
  "Legal review",
  "Committed",
];

export const RENEWAL_RISK_ORDER: RenewalRisk[] = ["Low", "Medium", "High", "Critical"];

export const RENEWAL_SEGMENT_ORDER: RenewalSegment[] = ["Enterprise", "Scale", "Mid-market"];

export const RENEWAL_WINDOW_OPTIONS = [
  { value: "next-30", label: "Next 30 days" },
  { value: "31-60", label: "31-60 days" },
  { value: "61-90", label: "61-90 days" },
  { value: "90-plus", label: "90+ days" },
] as const;

export function getRenewalWindowValue(daysToRenewal: number) {
  if (daysToRenewal <= 30) return "next-30";
  if (daysToRenewal <= 60) return "31-60";
  if (daysToRenewal <= 90) return "61-90";
  return "90-plus";
}

export function getRenewalWindowLabel(daysToRenewal: number) {
  const match = RENEWAL_WINDOW_OPTIONS.find(
    (option) => option.value === getRenewalWindowValue(daysToRenewal),
  );

  return match?.label ?? "90+ days";
}

export const RENEWAL_OWNERS: RenewalOwnerOption[] = [
  {
    value: "maya-patel",
    label: "Maya Patel",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&dpr=2&q=80",
    teamLabel: "Enterprise coverage",
  },
  {
    value: "jonah-lee",
    label: "Jonah Lee",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&dpr=2&q=80",
    teamLabel: "Strategic expansion",
  },
  {
    value: "nina-santos",
    label: "Nina Santos",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=96&h=96&dpr=2&q=80",
    teamLabel: "Commercial renewals",
  },
  {
    value: "omar-haddad",
    label: "Omar Haddad",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=96&h=96&dpr=2&q=80",
    teamLabel: "Expansion programs",
  },
  {
    value: "priya-menon",
    label: "Priya Menon",
    avatar: "https://images.unsplash.com/photo-1557296387-5358ad7997bb?w=96&h=96&dpr=2&q=80",
    teamLabel: "Finance alignment",
  },
];

const RENEWAL_RECORD_SEEDS: IRenewalRecord[] = [
  {
    id: "REN-1842",
    accountName: "Stripe",
    ownerName: "Maya Patel",
    ownerAvatar: RENEWAL_OWNERS[0].avatar,
    segment: "Enterprise",
    region: "North America",
    renewalDate: "2026-05-12",
    daysToRenewal: 7,
    arr: 420000,
    expansionPotential: 95000,
    healthScore: 46,
    usageTrend: [86, 84, 82, 79, 74, 68, 63, 57],
    stage: "Legal review",
    risk: "Critical",
    invoiceStatus: "Blocked",
    sponsorStatus: "Missing",
    tags: ["Usage drop", "Legal redlines"],
  },
  {
    id: "REN-1837",
    accountName: "Supabase",
    ownerName: "Nina Santos",
    ownerAvatar: RENEWAL_OWNERS[2].avatar,
    segment: "Enterprise",
    region: "North America",
    renewalDate: "2026-05-17",
    daysToRenewal: 12,
    arr: 365000,
    expansionPotential: 120000,
    healthScore: 58,
    usageTrend: [72, 73, 71, 69, 66, 63, 61, 60],
    stage: "Commercial review",
    risk: "High",
    invoiceStatus: "Finance review",
    sponsorStatus: "At risk",
    tags: ["Procurement", "Price sensitivity"],
  },
  {
    id: "REN-1831",
    accountName: "OpenAI",
    ownerName: "Jonah Lee",
    ownerAvatar: RENEWAL_OWNERS[1].avatar,
    segment: "Scale",
    region: "EMEA",
    renewalDate: "2026-05-29",
    daysToRenewal: 24,
    arr: 182000,
    expansionPotential: 42000,
    healthScore: 63,
    usageTrend: [68, 69, 70, 71, 70, 68, 66, 64],
    stage: "Preparing",
    risk: "High",
    invoiceStatus: "Ready",
    sponsorStatus: "Confirmed",
    tags: ["Champion change", "Board visibility"],
  },
  {
    id: "REN-1828",
    accountName: "Mintlify",
    ownerName: "Omar Haddad",
    ownerAvatar: RENEWAL_OWNERS[3].avatar,
    segment: "Scale",
    region: "North America",
    renewalDate: "2026-06-04",
    daysToRenewal: 30,
    arr: 148000,
    expansionPotential: 86000,
    healthScore: 74,
    usageTrend: [64, 66, 68, 70, 73, 76, 79, 82],
    stage: "Preparing",
    risk: "Medium",
    invoiceStatus: "Ready",
    sponsorStatus: "Confirmed",
    tags: ["Expansion ready", "Multi-team rollout"],
  },
  {
    id: "REN-1822",
    accountName: "Anthropic",
    ownerName: "Priya Menon",
    ownerAvatar: RENEWAL_OWNERS[4].avatar,
    segment: "Enterprise",
    region: "North America",
    renewalDate: "2026-06-11",
    daysToRenewal: 37,
    arr: 515000,
    expansionPotential: 0,
    healthScore: 54,
    usageTrend: [78, 76, 74, 71, 69, 66, 64, 61],
    stage: "Commercial review",
    risk: "High",
    invoiceStatus: "Blocked",
    sponsorStatus: "At risk",
    tags: ["Budget freeze", "CFO review"],
  },
  {
    id: "REN-1819",
    accountName: "Convex",
    ownerName: "Maya Patel",
    ownerAvatar: RENEWAL_OWNERS[0].avatar,
    segment: "Mid-market",
    region: "APAC",
    renewalDate: "2026-06-18",
    daysToRenewal: 44,
    arr: 92000,
    expansionPotential: 18000,
    healthScore: 71,
    usageTrend: [62, 63, 64, 64, 65, 67, 68, 69],
    stage: "Preparing",
    risk: "Medium",
    invoiceStatus: "Ready",
    sponsorStatus: "Confirmed",
    tags: ["Stable adoption", "Good champion"],
  },
  {
    id: "REN-1814",
    accountName: "Neon",
    ownerName: "Jonah Lee",
    ownerAvatar: RENEWAL_OWNERS[1].avatar,
    segment: "Scale",
    region: "North America",
    renewalDate: "2026-06-26",
    daysToRenewal: 52,
    arr: 206000,
    expansionPotential: 112000,
    healthScore: 67,
    usageTrend: [59, 60, 61, 60, 62, 64, 67, 70],
    stage: "Commercial review",
    risk: "Medium",
    invoiceStatus: "Finance review",
    sponsorStatus: "Confirmed",
    tags: ["Cross-sell", "Security add-on"],
  },
  {
    id: "REN-1810",
    accountName: "PlanetScale",
    ownerName: "Nina Santos",
    ownerAvatar: RENEWAL_OWNERS[2].avatar,
    segment: "Enterprise",
    region: "EMEA",
    renewalDate: "2026-07-02",
    daysToRenewal: 58,
    arr: 438000,
    expansionPotential: 64000,
    healthScore: 81,
    usageTrend: [74, 75, 77, 79, 81, 83, 84, 86],
    stage: "Preparing",
    risk: "Low",
    invoiceStatus: "Ready",
    sponsorStatus: "Confirmed",
    tags: ["Healthy usage", "Multi-year ask"],
  },
  {
    id: "REN-1806",
    accountName: "Prisma",
    ownerName: "Omar Haddad",
    ownerAvatar: RENEWAL_OWNERS[3].avatar,
    segment: "Mid-market",
    region: "North America",
    renewalDate: "2026-07-08",
    daysToRenewal: 64,
    arr: 124000,
    expansionPotential: 52000,
    healthScore: 77,
    usageTrend: [61, 63, 65, 68, 70, 73, 76, 78],
    stage: "Preparing",
    risk: "Low",
    invoiceStatus: "Ready",
    sponsorStatus: "Confirmed",
    tags: ["Expansion champion", "Product depth"],
  },
  {
    id: "REN-1801",
    accountName: "Resend",
    ownerName: "Priya Menon",
    ownerAvatar: RENEWAL_OWNERS[4].avatar,
    segment: "Scale",
    region: "North America",
    renewalDate: "2026-07-13",
    daysToRenewal: 69,
    arr: 164000,
    expansionPotential: 0,
    healthScore: 52,
    usageTrend: [67, 66, 64, 62, 59, 57, 54, 52],
    stage: "Commercial review",
    risk: "High",
    invoiceStatus: "Finance review",
    sponsorStatus: "At risk",
    tags: ["Seat contraction", "Procurement loop"],
  },
  {
    id: "REN-1798",
    accountName: "Slack",
    ownerName: "Maya Patel",
    ownerAvatar: RENEWAL_OWNERS[0].avatar,
    segment: "Mid-market",
    region: "EMEA",
    renewalDate: "2026-07-18",
    daysToRenewal: 74,
    arr: 88000,
    expansionPotential: 24000,
    healthScore: 69,
    usageTrend: [54, 55, 56, 58, 60, 61, 63, 64],
    stage: "Preparing",
    risk: "Medium",
    invoiceStatus: "Ready",
    sponsorStatus: "Confirmed",
    tags: ["Team growth", "Regional rollout"],
  },
  {
    id: "REN-1794",
    accountName: "Zoom",
    ownerName: "Jonah Lee",
    ownerAvatar: RENEWAL_OWNERS[1].avatar,
    segment: "Scale",
    region: "North America",
    renewalDate: "2026-07-24",
    daysToRenewal: 80,
    arr: 212000,
    expansionPotential: 135000,
    healthScore: 83,
    usageTrend: [70, 72, 74, 77, 80, 83, 86, 88],
    stage: "Preparing",
    risk: "Low",
    invoiceStatus: "Ready",
    sponsorStatus: "Confirmed",
    tags: ["Expansion approved", "Executive sponsor"],
  },
  {
    id: "REN-1791",
    accountName: "Hono",
    ownerName: "Nina Santos",
    ownerAvatar: RENEWAL_OWNERS[2].avatar,
    segment: "Enterprise",
    region: "North America",
    renewalDate: "2026-07-31",
    daysToRenewal: 87,
    arr: 610000,
    expansionPotential: 180000,
    healthScore: 79,
    usageTrend: [73, 75, 77, 78, 80, 82, 83, 85],
    stage: "Commercial review",
    risk: "Medium",
    invoiceStatus: "Finance review",
    sponsorStatus: "Confirmed",
    tags: ["Security pack", "Platform standard"],
  },
  {
    id: "REN-1787",
    accountName: "Remix",
    ownerName: "Omar Haddad",
    ownerAvatar: RENEWAL_OWNERS[3].avatar,
    segment: "Mid-market",
    region: "APAC",
    renewalDate: "2026-08-05",
    daysToRenewal: 92,
    arr: 76000,
    expansionPotential: 21000,
    healthScore: 72,
    usageTrend: [58, 59, 60, 62, 64, 65, 67, 68],
    stage: "Preparing",
    risk: "Low",
    invoiceStatus: "Ready",
    sponsorStatus: "Confirmed",
    tags: ["Partner motion", "Upsell path"],
  },
  {
    id: "REN-1783",
    accountName: "Paper",
    ownerName: "Priya Menon",
    ownerAvatar: RENEWAL_OWNERS[4].avatar,
    segment: "Scale",
    region: "EMEA",
    renewalDate: "2026-08-11",
    daysToRenewal: 98,
    arr: 154000,
    expansionPotential: 0,
    healthScore: 57,
    usageTrend: [63, 62, 60, 58, 57, 55, 54, 53],
    stage: "Preparing",
    risk: "Medium",
    invoiceStatus: "Finance review",
    sponsorStatus: "At risk",
    tags: ["Utilization drift", "Renewal watch"],
  },
  {
    id: "REN-1778",
    accountName: "n8n",
    ownerName: "Maya Patel",
    ownerAvatar: RENEWAL_OWNERS[0].avatar,
    segment: "Enterprise",
    region: "North America",
    renewalDate: "2026-08-20",
    daysToRenewal: 107,
    arr: 448000,
    expansionPotential: 132000,
    healthScore: 85,
    usageTrend: [79, 80, 82, 84, 86, 87, 89, 90],
    stage: "Preparing",
    risk: "Low",
    invoiceStatus: "Ready",
    sponsorStatus: "Confirmed",
    tags: ["Expansion mapped", "Board champion"],
  },
  {
    id: "REN-1772",
    accountName: "Vercel",
    ownerName: "Jonah Lee",
    ownerAvatar: RENEWAL_OWNERS[1].avatar,
    segment: "Scale",
    region: "LATAM",
    renewalDate: "2026-08-29",
    daysToRenewal: 116,
    arr: 132000,
    expansionPotential: 34000,
    healthScore: 68,
    usageTrend: [60, 61, 62, 63, 65, 66, 66, 67],
    stage: "Preparing",
    risk: "Medium",
    invoiceStatus: "Ready",
    sponsorStatus: "Confirmed",
    tags: ["Regional growth", "Elastic usage"],
  },
  {
    id: "REN-1768",
    accountName: "Google Cloud",
    ownerName: "Nina Santos",
    ownerAvatar: RENEWAL_OWNERS[2].avatar,
    segment: "Enterprise",
    region: "North America",
    renewalDate: "2026-09-09",
    daysToRenewal: 127,
    arr: 388000,
    expansionPotential: 74000,
    healthScore: 64,
    usageTrend: [66, 67, 68, 68, 67, 66, 65, 64],
    stage: "Preparing",
    risk: "Medium",
    invoiceStatus: "Finance review",
    sponsorStatus: "Confirmed",
    tags: ["Compliance review", "Migration timing"],
  },
];

const REGIONS = ["North America", "EMEA", "APAC", "LATAM"] as const;

const TAG_VARIANTS = [
  "Budget review",
  "Champion shift",
  "Upsell path",
  "Contract cleanup",
  "Security review",
  "Procurement lane",
  "Usage rebound",
  "Expansion plan",
] as const;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function roundCurrency(value: number) {
  return Math.round(value / 1000) * 1000;
}

function addDays(isoDate: string, days: number) {
  const nextDate = new Date(`${isoDate}T00:00:00`);
  nextDate.setDate(nextDate.getDate() + days);

  return nextDate.toISOString().slice(0, 10);
}

function shiftUsageTrend(values: number[], cycle: number, risk: RenewalRisk) {
  const directionalOffset = risk === "Low" ? 1 : risk === "Critical" ? -2 : 0;
  const cycleOffset = ((cycle % 4) - 1.5) * 1.5;

  return values.map((value, index) =>
    clamp(Math.round(value + directionalOffset * index + cycleOffset), 34, 96),
  );
}

function resolveOwner(seed: IRenewalRecord, cycle: number, index: number) {
  const baseOwnerIndex = RENEWAL_OWNERS.findIndex((owner) => owner.label === seed.ownerName);

  return RENEWAL_OWNERS[(Math.max(baseOwnerIndex, 0) + cycle + index) % RENEWAL_OWNERS.length];
}

function resolveRisk(score: number, daysToRenewal: number): RenewalRisk {
  if (score < 50 || daysToRenewal <= 14) return "Critical";
  if (score < 62 || daysToRenewal <= 35) return "High";
  if (score < 78) return "Medium";
  return "Low";
}

function resolveStage(
  baseStage: RenewalStage,
  risk: RenewalRisk,
  daysToRenewal: number,
): RenewalStage {
  if (risk === "Critical" || daysToRenewal <= 14) return "Legal review";
  if (risk === "High") return "Commercial review";
  if (baseStage === "Committed" && risk === "Low") return "Committed";
  return "Preparing";
}

function resolveInvoiceStatus(
  baseStatus: RenewalInvoiceStatus,
  risk: RenewalRisk,
): RenewalInvoiceStatus {
  if (risk === "Critical") return "Blocked";
  if (risk === "High") return "Finance review";
  return baseStatus === "Blocked" ? "Finance review" : "Ready";
}

function resolveSponsorStatus(risk: RenewalRisk): RenewalSponsorStatus {
  if (risk === "Critical") return "Missing";
  if (risk === "High") return "At risk";
  return "Confirmed";
}

function buildRenewalRecord(seed: IRenewalRecord, cycle: number, index: number) {
  if (cycle === 0) {
    return seed;
  }

  const owner = resolveOwner(seed, cycle, index);
  const daysOffset = cycle * 14 + (index % 3) * 3;
  const daysToRenewal = seed.daysToRenewal + daysOffset;
  const healthScore = clamp(seed.healthScore + (((cycle + index) % 5) - 2) * 4, 42, 92);
  const risk = resolveRisk(healthScore, daysToRenewal);
  const stage = resolveStage(seed.stage, risk, daysToRenewal);
  const invoiceStatus = resolveInvoiceStatus(seed.invoiceStatus, risk);
  const sponsorStatus = resolveSponsorStatus(risk);
  const arrFactor = 1 + cycle * 0.045 + ((index % 4) - 1.5) * 0.03;
  const expansionFactor =
    seed.expansionPotential === 0
      ? risk === "Low"
        ? 0.12
        : 0
      : 1 + ((cycle % 3) - 1) * 0.12 + (risk === "Low" ? 0.14 : 0);

  return {
    ...seed,
    id: `REN-${2000 + cycle * 100 + index * 3}`,
    accountName: seed.accountName,
    ownerName: owner.label,
    ownerAvatar: owner.avatar,
    segment: RENEWAL_SEGMENT_ORDER[(cycle + index) % RENEWAL_SEGMENT_ORDER.length],
    region: REGIONS[(cycle + index) % REGIONS.length],
    renewalDate: addDays(seed.renewalDate, daysOffset),
    daysToRenewal,
    arr: roundCurrency(seed.arr * Math.max(0.68, arrFactor)),
    expansionPotential: roundCurrency(Math.max(0, seed.expansionPotential * expansionFactor)),
    healthScore,
    usageTrend: shiftUsageTrend(seed.usageTrend, cycle + index, risk),
    stage,
    risk,
    invoiceStatus,
    sponsorStatus,
    tags: [seed.tags[0], TAG_VARIANTS[(cycle + index) % TAG_VARIANTS.length]],
  };
}

export const RENEWAL_RECORDS: IRenewalRecord[] = Array.from({ length: 2 }, (_, cycle) =>
  RENEWAL_RECORD_SEEDS.map((seed, index) => buildRenewalRecord(seed, cycle, index)),
)
  .flat()
  .sort((left, right) => {
    if (left.daysToRenewal !== right.daysToRenewal) {
      return left.daysToRenewal - right.daysToRenewal;
    }

    return right.arr - left.arr;
  });
