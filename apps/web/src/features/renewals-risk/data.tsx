import { AnthropicBlack } from "@workspace/ui/components/reui/svgs/anthropicBlack";
import { AnthropicWhite } from "@workspace/ui/components/reui/svgs/anthropicWhite";
import { Convex } from "@workspace/ui/components/reui/svgs/convex";
import { Mintlify } from "@workspace/ui/components/reui/svgs/mintlify";
import { N8n } from "@workspace/ui/components/reui/svgs/n8n";
import { Neon } from "@workspace/ui/components/reui/svgs/neon";
import { Openai } from "@workspace/ui/components/reui/svgs/openai";
import { OpenaiDark } from "@workspace/ui/components/reui/svgs/openaiDark";
import { Paper } from "@workspace/ui/components/reui/svgs/paper";
import { Prisma } from "@workspace/ui/components/reui/svgs/prisma";
import { PrismaDark } from "@workspace/ui/components/reui/svgs/prismaDark";
import { RemixDark } from "@workspace/ui/components/reui/svgs/remixDark";
import { RemixLight } from "@workspace/ui/components/reui/svgs/remixLight";
import { Slack } from "@workspace/ui/components/reui/svgs/slack";
import { Stripe } from "@workspace/ui/components/reui/svgs/stripe";
import { Supabase } from "@workspace/ui/components/reui/svgs/supabase";
import { type ReactNode } from "react";

export type RenewalStage =
  | "Save Plan"
  | "Executive Review"
  | "Commercial Review"
  | "Security Review"
  | "Legal Review"
  | "Procurement"
  | "Verbal Commit";

export type AlertState = "Critical" | "Warning" | "Clear";

export type RiskTag =
  | "Champion Change"
  | "Usage Dip"
  | "Security Review"
  | "Procurement"
  | "Pricing Pushback"
  | "Legal Redlines"
  | "Expansion Delay"
  | "Executive Sponsor Gap"
  | "Adoption Plateau"
  | "Multi-Year Ask";

export interface RenewalOwner {
  id: string;
  name: string;
  title: string;
  avatar: string;
  initials: string;
}

export interface RenewalChampion {
  name: string;
  title: string;
  email: string;
}

export interface IRenewalRiskRecord {
  id: string;
  account: string;
  productLine: string;
  companyLogo: ReactNode;
  seats: number;
  owner: RenewalOwner;
  champion: RenewalChampion;
  stage: RenewalStage;
  stageValue: number;
  signals: RiskTag[];
  health: number;
  arr: number;
  renewalDate: string;
  daysToRenewal: number;
  alertState: AlertState;
  alertValue: number;
  alertCount: number;
  alertSummary: string;
}

export const RENEWAL_STAGES: RenewalStage[] = [
  "Save Plan",
  "Executive Review",
  "Commercial Review",
  "Security Review",
  "Legal Review",
  "Procurement",
  "Verbal Commit",
];

export const ALERT_STATES: AlertState[] = ["Critical", "Warning", "Clear"];

export const RISK_TAGS: RiskTag[] = [
  "Champion Change",
  "Usage Dip",
  "Security Review",
  "Procurement",
  "Pricing Pushback",
  "Legal Redlines",
  "Expansion Delay",
  "Executive Sponsor Gap",
  "Adoption Plateau",
  "Multi-Year Ask",
];

export const RENEWAL_OWNERS: RenewalOwner[] = [
  {
    id: "owner-1",
    name: "Sarah Chen",
    title: "Strategic CSM",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&dpr=2&q=80",
    initials: "SC",
  },
  {
    id: "owner-2",
    name: "Michael Rodriguez",
    title: "Enterprise AM",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&dpr=2&q=80",
    initials: "MR",
  },
  {
    id: "owner-3",
    name: "Emma Wilson",
    title: "Renewals Lead",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&dpr=2&q=80",
    initials: "EW",
  },
  {
    id: "owner-4",
    name: "Daniel Kim",
    title: "Global CSM",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=96&h=96&dpr=2&q=80",
    initials: "DK",
  },
  {
    id: "owner-5",
    name: "Priya Patel",
    title: "Commercial CSM",
    avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=96&h=96&dpr=2&q=80",
    initials: "PP",
  },
  {
    id: "owner-6",
    name: "Alex Johnson",
    title: "Renewals Manager",
    avatar: "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=96&h=96&dpr=2&q=80",
    initials: "AJ",
  },
];

const ownerById = Object.fromEntries(RENEWAL_OWNERS.map((owner) => [owner.id, owner])) as Record<
  string,
  RenewalOwner
>;

function ThemeBrand({ logo, logoDark }: { logo: ReactNode; logoDark?: ReactNode }) {
  if (!logoDark) {
    return logo;
  }

  return (
    <>
      <span aria-hidden className="dark:hidden">
        {logo}
      </span>
      <span aria-hidden className="hidden dark:block">
        {logoDark}
      </span>
    </>
  );
}

const OPENAI_LOGO = (
  <ThemeBrand logo={<Openai className="size-5" />} logoDark={<OpenaiDark className="size-5" />} />
);

const ANTHROPIC_LOGO = (
  <ThemeBrand
    logo={<AnthropicBlack className="size-5" />}
    logoDark={<AnthropicWhite className="size-5" />}
  />
);

const PRISMA_LOGO = (
  <ThemeBrand logo={<Prisma className="size-5" />} logoDark={<PrismaDark className="size-5" />} />
);

const REMIX_LOGO = (
  <ThemeBrand
    logo={<RemixLight className="size-5" />}
    logoDark={<RemixDark className="size-5" />}
  />
);

export const RENEWAL_RISKS: IRenewalRiskRecord[] = [
  {
    id: "renewal-101",
    account: "OpenAI",
    productLine: "Identity Cloud",
    companyLogo: OPENAI_LOGO,
    seats: 4200,
    owner: ownerById["owner-1"],
    champion: {
      name: "Elena Park",
      title: "VP Security Operations",
      email: "elena.park@openai.com",
    },
    stage: "Executive Review",
    stageValue: 2,
    signals: ["Champion Change", "Security Review", "Pricing Pushback"],
    health: 34,
    arr: 420000,
    renewalDate: "2026-04-26",
    daysToRenewal: 12,
    alertState: "Critical",
    alertValue: 3,
    alertCount: 3,
    alertSummary: "Security addendum is blocked on buyer counsel.",
  },
  {
    id: "renewal-102",
    account: "Anthropic",
    productLine: "Network Observability",
    companyLogo: ANTHROPIC_LOGO,
    seats: 2800,
    owner: ownerById["owner-2"],
    champion: {
      name: "David Lin",
      title: "Senior Director, Platform",
      email: "david.lin@anthropic.com",
    },
    stage: "Save Plan",
    stageValue: 1,
    signals: ["Usage Dip", "Procurement", "Executive Sponsor Gap"],
    health: 39,
    arr: 315000,
    renewalDate: "2026-05-02",
    daysToRenewal: 18,
    alertState: "Critical",
    alertValue: 3,
    alertCount: 4,
    alertSummary: "Expansion was pulled out of the renewal package.",
  },
  {
    id: "renewal-103",
    account: "Stripe",
    productLine: "Secure Workflows",
    companyLogo: <Stripe className="size-5" aria-hidden="true" />,
    seats: 1900,
    owner: ownerById["owner-3"],
    champion: {
      name: "Maya Thompson",
      title: "Head of IT Applications",
      email: "maya.thompson@stripe.com",
    },
    stage: "Legal Review",
    stageValue: 5,
    signals: ["Legal Redlines", "Security Review"],
    health: 44,
    arr: 280000,
    renewalDate: "2026-05-08",
    daysToRenewal: 24,
    alertState: "Warning",
    alertValue: 2,
    alertCount: 2,
    alertSummary: "DPA redlines are still open with procurement.",
  },
  {
    id: "renewal-104",
    account: "Supabase",
    productLine: "Risk Intelligence",
    companyLogo: <Supabase className="size-5" aria-hidden="true" />,
    seats: 5400,
    owner: ownerById["owner-4"],
    champion: {
      name: "Arjun Mehta",
      title: "Director of Infrastructure",
      email: "arjun.mehta@supabase.com",
    },
    stage: "Procurement",
    stageValue: 6,
    signals: ["Pricing Pushback", "Multi-Year Ask"],
    health: 52,
    arr: 610000,
    renewalDate: "2026-05-13",
    daysToRenewal: 29,
    alertState: "Warning",
    alertValue: 2,
    alertCount: 2,
    alertSummary: "Buyer is asking for extra discount on a multi-year term.",
  },
  {
    id: "renewal-105",
    account: "Prisma",
    productLine: "Store Reliability Suite",
    companyLogo: PRISMA_LOGO,
    seats: 1650,
    owner: ownerById["owner-5"],
    champion: {
      name: "Sofia Lee",
      title: "VP Digital Experience",
      email: "sofia.lee@prisma.io",
    },
    stage: "Commercial Review",
    stageValue: 3,
    signals: ["Adoption Plateau", "Pricing Pushback"],
    health: 58,
    arr: 205000,
    renewalDate: "2026-05-21",
    daysToRenewal: 37,
    alertState: "Warning",
    alertValue: 2,
    alertCount: 2,
    alertSummary: "Low feature adoption is driving a down-sell motion.",
  },
  {
    id: "renewal-106",
    account: "Convex",
    productLine: "Asset Monitoring",
    companyLogo: <Convex className="size-5" aria-hidden="true" />,
    seats: 3100,
    owner: ownerById["owner-6"],
    champion: {
      name: "Nadia Hassan",
      title: "Head of Grid Analytics",
      email: "nadia.hassan@convex.dev",
    },
    stage: "Verbal Commit",
    stageValue: 7,
    signals: ["Procurement"],
    health: 79,
    arr: 355000,
    renewalDate: "2026-05-24",
    daysToRenewal: 40,
    alertState: "Clear",
    alertValue: 1,
    alertCount: 1,
    alertSummary: "Verbal approval is in, awaiting PO release.",
  },
  {
    id: "renewal-107",
    account: "Mintlify",
    productLine: "Fleet Visibility",
    companyLogo: <Mintlify className="size-5" aria-hidden="true" />,
    seats: 2280,
    owner: ownerById["owner-2"],
    champion: {
      name: "Rachel Green",
      title: "Sr. Manager, Operations Tech",
      email: "rachel.green@mintlify.com",
    },
    stage: "Security Review",
    stageValue: 4,
    signals: ["Security Review", "Usage Dip"],
    health: 63,
    arr: 265000,
    renewalDate: "2026-05-29",
    daysToRenewal: 45,
    alertState: "Warning",
    alertValue: 2,
    alertCount: 2,
    alertSummary: "Security questionnaire reopened after new SSO scope.",
  },
  {
    id: "renewal-108",
    account: "Paper",
    productLine: "Checkout Intelligence",
    companyLogo: <Paper className="size-5" aria-hidden="true" />,
    seats: 1360,
    owner: ownerById["owner-1"],
    champion: {
      name: "Jonah Rivera",
      title: "Director, Ecommerce Platform",
      email: "jonah.rivera@paper.design",
    },
    stage: "Commercial Review",
    stageValue: 3,
    signals: ["Expansion Delay"],
    health: 72,
    arr: 182000,
    renewalDate: "2026-06-04",
    daysToRenewal: 51,
    alertState: "Clear",
    alertValue: 1,
    alertCount: 1,
    alertSummary: "Renewal is clean, but attached expansion was deferred.",
  },
  {
    id: "renewal-109",
    account: "Slack",
    productLine: "Case Management Cloud",
    companyLogo: <Slack className="size-5" aria-hidden="true" />,
    seats: 6200,
    owner: ownerById["owner-3"],
    champion: {
      name: "Grace Nguyen",
      title: "Program Director, Digital Services",
      email: "grace.nguyen@slack.com",
    },
    stage: "Procurement",
    stageValue: 6,
    signals: ["Procurement", "Executive Sponsor Gap"],
    health: 54,
    arr: 780000,
    renewalDate: "2026-06-10",
    daysToRenewal: 57,
    alertState: "Warning",
    alertValue: 2,
    alertCount: 2,
    alertSummary: "Budget owner changed after the new fiscal review cycle.",
  },
  {
    id: "renewal-110",
    account: "Remix",
    productLine: "Device Control Plane",
    companyLogo: REMIX_LOGO,
    seats: 940,
    owner: ownerById["owner-4"],
    champion: {
      name: "Leo Martins",
      title: "VP Engineering",
      email: "leo.martins@remix.run",
    },
    stage: "Save Plan",
    stageValue: 1,
    signals: ["Usage Dip", "Champion Change"],
    health: 47,
    arr: 148000,
    renewalDate: "2026-06-14",
    daysToRenewal: 61,
    alertState: "Warning",
    alertValue: 2,
    alertCount: 2,
    alertSummary: "New champion has not joined the weekly value review yet.",
  },
  {
    id: "renewal-111",
    account: "Neon",
    productLine: "Incident Automation",
    companyLogo: <Neon className="size-5" aria-hidden="true" />,
    seats: 2150,
    owner: ownerById["owner-5"],
    champion: {
      name: "Harper Mills",
      title: "Director of SRE",
      email: "harper.mills@neon.tech",
    },
    stage: "Verbal Commit",
    stageValue: 7,
    signals: ["Multi-Year Ask"],
    health: 84,
    arr: 238000,
    renewalDate: "2026-06-18",
    daysToRenewal: 65,
    alertState: "Clear",
    alertValue: 1,
    alertCount: 1,
    alertSummary: "Awaiting final paper for an expanded multi-year commit.",
  },
  {
    id: "renewal-112",
    account: "N8n",
    productLine: "Property Intelligence",
    companyLogo: <N8n className="size-5" aria-hidden="true" />,
    seats: 1740,
    owner: ownerById["owner-6"],
    champion: {
      name: "Camila Torres",
      title: "Sr. Director, Guest Systems",
      email: "camila.torres@n8n.io",
    },
    stage: "Legal Review",
    stageValue: 5,
    signals: ["Legal Redlines", "Procurement"],
    health: 61,
    arr: 194000,
    renewalDate: "2026-06-24",
    daysToRenewal: 71,
    alertState: "Clear",
    alertValue: 1,
    alertCount: 1,
    alertSummary: "Legal is the only remaining blocker in the current cycle.",
  },
];

export const DEFAULT_PINNED_RENEWAL_IDS = ["renewal-101", "renewal-102"];

export function getRenewalSearchBlob(record: IRenewalRiskRecord) {
  return [
    record.account,
    record.productLine,
    record.owner.name,
    record.champion.name,
    record.champion.title,
    record.champion.email,
    record.stage,
    record.signals.join(" "),
    record.alertSummary,
  ]
    .join(" ")
    .toLowerCase();
}
