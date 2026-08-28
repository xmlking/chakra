// oxlint-disable react/only-export-components react-doctor/only-export-components
import Anthropic from "@thesvg/react/anthropic";
import Convex from "@thesvg/react/convex";
import Cursor from "@thesvg/react/cursor";
import Hono from "@thesvg/react/hono";
import Mintlify from "@thesvg/react/mintlify";
import N8n from "@thesvg/react/n8n";
import Neon from "@thesvg/react/neon";
import Openai from "@thesvg/react/openai";
import Planetscale from "@thesvg/react/planetscale";
import Prisma from "@thesvg/react/prisma";
import Resend from "@thesvg/react/resend";
import Slack from "@thesvg/react/slack";
import Stripe from "@thesvg/react/stripe";
import Supabase from "@thesvg/react/supabase";
import type { CascaderNode } from "@workspace/ui/components/reui/cascader/cascader-types";
import type { FilterValueType } from "@workspace/ui/components/reui/filters/filters-types";
import {
  FileTextIcon,
  ListIcon,
  HashIcon,
  CircleDollarSignIcon,
  TargetIcon,
  CalendarIcon,
  ClockIcon,
  SquareCheckIcon,
  StarIcon,
  ChevronsUpDownIcon,
  ListChecksIcon,
  RadioIcon,
  UserIcon,
  DatabaseIcon,
  MapPinIcon,
  SmartphoneIcon,
  LinkIcon,
  UsersIcon,
  Building2Icon,
  BriefcaseBusinessIcon,
  GlobeIcon,
  ActivityIcon,
  LayersIcon,
  CreditCardIcon,
  SquarePenIcon,
  SparklesIcon,
} from "lucide-react";
import { type ReactNode } from "react";

// ── Reference date ──

/** Every relative label and date in this block is measured from here. */
export const REFERENCE_DATE = "2026-08-19";

// ── Types ──

export type CompanyStage = "Discovery" | "Evaluation" | "Proposal" | "Committed" | "Renewal";

export type CompanyStatus = "Active" | "Onboarding" | "At risk" | "Paused" | "Churned";

export type CompanyPriority = "Critical" | "High" | "Medium" | "Low";
export type CompanyTier = "Strategic" | "Growth" | "Core";
export type CompanyPlan = "Enterprise" | "Business" | "Team";

/** Closed vocabulary for the multi-select Categories column. */
export const CATEGORY_LABELS = [
  "Enterprise",
  "Self-serve",
  "Design partner",
  "Expansion",
  "Regulated",
  "Open source",
] as const;

export type CategoryLabel = (typeof CATEGORY_LABELS)[number];

export type CompanyIndustry =
  | "AI research"
  | "Developer tools"
  | "Data platform"
  | "Payments"
  | "Collaboration";

export interface IPerson {
  id: string;
  name: string;
  initials: string;
  role: string;
  /** Omitted for the two people who demo the AvatarFallback state. */
  avatar?: string;
}

export interface ICompany {
  id: string;
  name: string;
  domain: string;
  logo: ReactNode;
  description: string;
  categories: CategoryLabel[];
  ownerId: string;
  managerId: string;
  contactId: string;
  stage: CompanyStage;
  arr: number;
  closeDate: string;
  probability: number;
  industry: CompanyIndustry;
  employees: number;
  location: string;
  countryCode: string;
  phone: string;
  /** Days before REFERENCE_DATE, so relative labels need no clock. */
  lastActivityDays: number;
  renewalDate: string;
  health: number;
  rating: number;
  status: CompanyStatus;
  priority: CompanyPriority;
  tier: CompanyTier;
  underContract: boolean;
  plan: CompanyPlan;
  seats: number;
  notes: string;
}

export type CompanyRowAction = "view" | "duplicate" | "delete";

// ── People ──

export const PEOPLE: IPerson[] = [
  {
    id: "p-1",
    name: "Mira Stone",
    initials: "MS",
    role: "Enterprise AE",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&dpr=2&q=80",
  },
  {
    id: "p-2",
    name: "Leo Grant",
    initials: "LG",
    role: "Account manager",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&dpr=2&q=80",
  },
  {
    id: "p-3",
    name: "Nora Vale",
    initials: "NV",
    role: "Enterprise AE",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&dpr=2&q=80",
  },
  {
    id: "p-4",
    name: "Theo Park",
    initials: "TP",
    role: "Solutions lead",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&dpr=2&q=80",
  },
  {
    id: "p-5",
    name: "Sana Qureshi",
    initials: "SQ",
    role: "Account manager",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&dpr=2&q=80",
  },
  {
    id: "p-6",
    name: "Alex Johnson",
    initials: "AJ",
    role: "Mid-market AE",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80",
  },
  {
    id: "p-7",
    name: "Sarah Chen",
    initials: "SC",
    role: "Customer lead",
    avatar: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=96&h=96&dpr=2&q=80",
  },
  {
    id: "p-8",
    name: "Omar Haddad",
    initials: "OH",
    role: "Platform buyer",
    avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=96&h=96&dpr=2&q=80",
  },
  {
    id: "p-9",
    name: "Priya Patel",
    initials: "PP",
    role: "VP Engineering",
    avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=96&h=96&dpr=2&q=80",
  },
  { id: "p-10", name: "Kenji Tan", initials: "KT", role: "Head of Data" },
  { id: "p-11", name: "Ivy Larsen", initials: "IL", role: "Security lead" },
];

const PEOPLE_BY_ID = new Map(PEOPLE.map((person) => [person.id, person]));

export function getPerson(id: string): IPerson | undefined {
  return PEOPLE_BY_ID.get(id);
}

// ── Logos ──

const OPENAI_LOGO = <Openai aria-hidden className="size-5" />;

const ANTHROPIC_LOGO = <Anthropic aria-hidden className="size-5" />;

const RESEND_LOGO = <Resend aria-hidden className="size-5" />;

const PRISMA_LOGO = <Prisma aria-hidden className="size-5" />;

const PLANETSCALE_LOGO = <Planetscale aria-hidden className="size-5 text-foreground" />;

const CURSOR_LOGO = <Cursor aria-hidden className="size-5 text-foreground" />;

const SUPABASE_LOGO = <Supabase className="size-5" />;
const NEON_LOGO = <Neon className="size-5" />;
const CONVEX_LOGO = <Convex className="size-5" />;
const STRIPE_LOGO = <Stripe className="size-5" />;
const SLACK_LOGO = <Slack className="size-5" />;
const HONO_LOGO = <Hono className="size-5" />;
const N8N_LOGO = <N8n className="size-5" />;
const MINTLIFY_LOGO = <Mintlify className="size-5 text-foreground" />;

// ── Companies ──

export const COMPANIES: ICompany[] = [
  {
    id: "cmp-4192",
    name: "OpenAI",
    domain: "openai.com",
    logo: OPENAI_LOGO,
    description: "Frontier model provider evaluating a shared eval workspace.",
    categories: ["Enterprise", "Design partner"],
    ownerId: "p-1",
    managerId: "p-5",
    contactId: "p-9",
    stage: "Committed",
    arr: 1_480_000,
    closeDate: "2026-09-30",
    probability: 90,
    industry: "AI research",
    employees: 3200,
    location: "San Francisco, US",
    countryCode: "US",
    phone: "+1 415 555 0142",
    lastActivityDays: 0,
    renewalDate: "2027-03-31",
    health: 92,
    rating: 5,
    status: "Active",
    priority: "Critical",
    tier: "Strategic",
    underContract: true,
    plan: "Enterprise",
    seats: 640,
    notes: "Security review cleared. Procurement wants a three-year term.",
  },
  {
    id: "cmp-4188",
    name: "Anthropic",
    domain: "anthropic.com",
    logo: ANTHROPIC_LOGO,
    description: "Safety-first lab piloting the audit log export.",
    categories: ["Enterprise", "Regulated"],
    ownerId: "p-3",
    managerId: "p-2",
    contactId: "p-11",
    stage: "Proposal",
    arr: 960_000,
    closeDate: "2026-10-15",
    probability: 70,
    industry: "AI research",
    employees: 1400,
    location: "San Francisco, US",
    countryCode: "US",
    phone: "+1 415 555 0177",
    lastActivityDays: 1,
    renewalDate: "2027-01-31",
    health: 84,
    rating: 5,
    status: "Active",
    priority: "Critical",
    tier: "Strategic",
    underContract: true,
    plan: "Enterprise",
    seats: 410,
    notes: "Wants regional data residency before signature.",
  },
  {
    id: "cmp-4176",
    name: "Stripe",
    domain: "stripe.com",
    logo: STRIPE_LOGO,
    description: "Payments platform consolidating four internal dashboards.",
    categories: ["Enterprise", "Expansion"],
    ownerId: "p-1",
    managerId: "p-7",
    contactId: "p-8",
    stage: "Renewal",
    arr: 720_000,
    closeDate: "2026-11-30",
    probability: 80,
    industry: "Payments",
    employees: 8100,
    location: "Dublin, IE",
    countryCode: "IE",
    phone: "+353 1 555 0104",
    lastActivityDays: 3,
    renewalDate: "2026-11-30",
    health: 76,
    rating: 4,
    status: "Active",
    priority: "High",
    tier: "Strategic",
    underContract: true,
    plan: "Enterprise",
    seats: 1250,
    notes: "Expansion blocked on SSO group mapping.",
  },
  {
    id: "cmp-4165",
    name: "Supabase",
    domain: "supabase.com",
    logo: SUPABASE_LOGO,
    description: "Open-source backend scaling seats across three regions.",
    categories: ["Open source", "Expansion"],
    ownerId: "p-6",
    managerId: "p-2",
    contactId: "p-10",
    stage: "Evaluation",
    arr: 288_000,
    closeDate: "2026-09-15",
    probability: 55,
    industry: "Developer tools",
    employees: 420,
    location: "Singapore, SG",
    countryCode: "SG",
    phone: "+65 6555 0119",
    lastActivityDays: 2,
    renewalDate: "2027-02-28",
    health: 81,
    rating: 4,
    status: "Active",
    priority: "High",
    tier: "Growth",
    underContract: true,
    plan: "Business",
    seats: 180,
    notes: "Champion moved teams. Rebuilding the relationship.",
  },
  {
    id: "cmp-4151",
    name: "Cursor",
    domain: "cursor.com",
    logo: CURSOR_LOGO,
    description: "Editor company trialling usage-based billing.",
    categories: ["Design partner", "Expansion"],
    ownerId: "p-3",
    managerId: "p-5",
    contactId: "p-9",
    stage: "Proposal",
    arr: 415_000,
    closeDate: "2026-10-01",
    probability: 65,
    industry: "Developer tools",
    employees: 260,
    location: "New York, US",
    countryCode: "US",
    phone: "+1 212 555 0188",
    lastActivityDays: 5,
    renewalDate: "2027-04-30",
    health: 88,
    rating: 5,
    status: "Active",
    priority: "High",
    tier: "Growth",
    underContract: true,
    plan: "Business",
    seats: 210,
    notes: "Asked for a joint launch post at renewal.",
  },
  {
    id: "cmp-4144",
    name: "PlanetScale",
    domain: "planetscale.com",
    logo: PLANETSCALE_LOGO,
    description: "Database vendor migrating from a legacy analytics stack.",
    categories: ["Enterprise"],
    ownerId: "p-4",
    managerId: "p-7",
    contactId: "p-10",
    stage: "Evaluation",
    arr: 196_000,
    closeDate: "2026-12-15",
    probability: 45,
    industry: "Data platform",
    employees: 190,
    location: "Austin, US",
    countryCode: "US",
    phone: "+1 512 555 0133",
    lastActivityDays: 9,
    renewalDate: "2027-01-15",
    health: 61,
    rating: 3,
    status: "Onboarding",
    priority: "Medium",
    tier: "Growth",
    underContract: true,
    plan: "Business",
    seats: 95,
    notes: "Onboarding paused until their migration window closes.",
  },
  {
    id: "cmp-4130",
    name: "Neon",
    domain: "neon.tech",
    logo: NEON_LOGO,
    description: "Serverless Postgres team comparing us against two vendors.",
    categories: ["Self-serve", "Open source"],
    ownerId: "p-6",
    managerId: "p-2",
    contactId: "p-11",
    stage: "Discovery",
    arr: 84_000,
    closeDate: "2027-01-30",
    probability: 25,
    industry: "Data platform",
    employees: 150,
    location: "Berlin, DE",
    countryCode: "DE",
    phone: "+49 30 555 0126",
    lastActivityDays: 14,
    renewalDate: "2027-05-31",
    health: 54,
    rating: 3,
    status: "Onboarding",
    priority: "Medium",
    tier: "Core",
    underContract: false,
    plan: "Team",
    seats: 40,
    notes: "",
  },
  {
    id: "cmp-4122",
    name: "Prisma",
    domain: "prisma.io",
    logo: PRISMA_LOGO,
    description: "ORM company whose usage dropped after a platform rewrite.",
    categories: ["Open source"],
    ownerId: "p-4",
    managerId: "p-5",
    contactId: "p-10",
    stage: "Renewal",
    arr: 132_000,
    closeDate: "2026-09-30",
    probability: 35,
    industry: "Developer tools",
    employees: 110,
    location: "Berlin, DE",
    countryCode: "DE",
    phone: "+49 30 555 0171",
    lastActivityDays: 21,
    renewalDate: "2026-09-30",
    health: 38,
    rating: 2,
    status: "At risk",
    priority: "Critical",
    tier: "Growth",
    underContract: true,
    plan: "Business",
    seats: 75,
    notes: "Two escalations open. Exec sponsor call booked for next week.",
  },
  {
    id: "cmp-4118",
    name: "Convex",
    domain: "convex.dev",
    logo: CONVEX_LOGO,
    description: "Reactive backend startup on a self-serve plan.",
    categories: ["Self-serve"],
    ownerId: "p-6",
    managerId: "p-7",
    contactId: "p-9",
    stage: "Discovery",
    arr: 36_000,
    closeDate: "2027-02-28",
    probability: 20,
    industry: "Developer tools",
    employees: 60,
    location: "Seattle, US",
    countryCode: "US",
    phone: "+1 206 555 0160",
    lastActivityDays: 7,
    renewalDate: "2027-06-30",
    health: 67,
    rating: 4,
    status: "Active",
    priority: "Low",
    tier: "Core",
    underContract: false,
    plan: "Team",
    seats: 22,
    notes: "",
  },
  {
    id: "cmp-4103",
    name: "Resend",
    domain: "resend.com",
    logo: RESEND_LOGO,
    description: "Email API team expanding from one squad to the org.",
    categories: ["Expansion", "Self-serve"],
    ownerId: "p-1",
    managerId: "p-2",
    contactId: "p-8",
    stage: "Evaluation",
    arr: 61_000,
    closeDate: "2026-11-15",
    probability: 50,
    industry: "Developer tools",
    employees: 45,
    location: "Lisbon, PT",
    countryCode: "PT",
    phone: "+351 21 555 0117",
    lastActivityDays: 4,
    renewalDate: "2027-03-15",
    health: 79,
    rating: 4,
    status: "Active",
    priority: "Medium",
    tier: "Core",
    underContract: true,
    plan: "Team",
    seats: 30,
    notes: "",
  },
  {
    id: "cmp-4097",
    name: "Slack",
    domain: "slack.com",
    logo: SLACK_LOGO,
    description: "Collaboration suite running a locked-down security pilot.",
    categories: ["Enterprise", "Regulated"],
    ownerId: "p-3",
    managerId: "p-5",
    contactId: "p-11",
    stage: "Committed",
    arr: 540_000,
    closeDate: "2026-10-31",
    probability: 85,
    industry: "Collaboration",
    employees: 2600,
    location: "Toronto, CA",
    countryCode: "CA",
    phone: "+1 416 555 0148",
    lastActivityDays: 6,
    renewalDate: "2027-04-30",
    health: 73,
    rating: 4,
    status: "Active",
    priority: "High",
    tier: "Strategic",
    underContract: true,
    plan: "Enterprise",
    seats: 900,
    notes: "Legal redlines returned. Awaiting counter-signature.",
  },
  {
    id: "cmp-4081",
    name: "Mintlify",
    domain: "mintlify.com",
    logo: MINTLIFY_LOGO,
    description: "Docs platform that paused spend during a funding round.",
    categories: ["Self-serve"],
    ownerId: "p-4",
    managerId: "p-7",
    contactId: "p-10",
    stage: "Discovery",
    arr: 18_000,
    closeDate: "2027-03-31",
    probability: 15,
    industry: "Developer tools",
    employees: 38,
    location: "San Francisco, US",
    countryCode: "US",
    phone: "+1 415 555 0193",
    lastActivityDays: 33,
    renewalDate: "2027-07-31",
    health: 44,
    rating: 3,
    status: "Paused",
    priority: "Low",
    tier: "Core",
    underContract: false,
    plan: "Team",
    seats: 14,
    notes: "Asked us to re-engage after their Series B closes.",
  },
  {
    id: "cmp-4074",
    name: "Hono",
    domain: "hono.dev",
    logo: HONO_LOGO,
    description: "Edge framework community with no commercial owner yet.",
    categories: ["Open source"],
    ownerId: "p-6",
    managerId: "p-2",
    contactId: "p-9",
    stage: "Discovery",
    arr: 0,
    closeDate: "2027-04-30",
    probability: 10,
    industry: "Developer tools",
    employees: 12,
    location: "Tokyo, JP",
    countryCode: "JP",
    phone: "+81 3 5555 0102",
    lastActivityDays: 48,
    renewalDate: "2027-08-31",
    health: 29,
    rating: 2,
    status: "Churned",
    priority: "Low",
    tier: "Core",
    underContract: false,
    plan: "Team",
    seats: 0,
    notes: "",
  },
  {
    id: "cmp-4062",
    name: "n8n",
    domain: "n8n.io",
    logo: N8N_LOGO,
    description: "Automation vendor rebuilding on a competitor this quarter.",
    categories: ["Open source", "Self-serve"],
    ownerId: "p-4",
    managerId: "p-7",
    contactId: "p-8",
    stage: "Renewal",
    arr: 24_000,
    closeDate: "2026-09-15",
    probability: 5,
    industry: "Developer tools",
    employees: 130,
    location: "Berlin, DE",
    countryCode: "DE",
    phone: "+49 30 555 0155",
    lastActivityDays: 62,
    renewalDate: "2026-09-15",
    health: 21,
    rating: 1,
    status: "Churned",
    priority: "Medium",
    tier: "Core",
    underContract: false,
    plan: "Team",
    seats: 8,
    notes: "Cancellation confirmed. Keep for win-back in two quarters.",
  },
];

// ── Option sets ──

export const STAGE_OPTIONS: { value: CompanyStage; label: string }[] = [
  { value: "Discovery", label: "Discovery" },
  { value: "Evaluation", label: "Evaluation" },
  { value: "Proposal", label: "Proposal" },
  { value: "Committed", label: "Committed" },
  { value: "Renewal", label: "Renewal" },
];

export const STATUS_OPTIONS: { value: CompanyStatus; label: string }[] = [
  { value: "Active", label: "Active" },
  { value: "Onboarding", label: "Onboarding" },
  { value: "At risk", label: "At risk" },
  { value: "Paused", label: "Paused" },
  { value: "Churned", label: "Churned" },
];

export const PRIORITY_OPTIONS: { value: CompanyPriority; label: string }[] = [
  { value: "Critical", label: "Critical" },
  { value: "High", label: "High" },
  { value: "Medium", label: "Medium" },
  { value: "Low", label: "Low" },
];

export const INDUSTRY_OPTIONS: { value: CompanyIndustry; label: string }[] = [
  { value: "AI research", label: "AI research" },
  { value: "Developer tools", label: "Developer tools" },
  { value: "Data platform", label: "Data platform" },
  { value: "Payments", label: "Payments" },
  { value: "Collaboration", label: "Collaboration" },
];

export const TIER_OPTIONS: { value: CompanyTier; label: string }[] = [
  { value: "Strategic", label: "Strategic" },
  { value: "Growth", label: "Growth" },
  { value: "Core", label: "Core" },
];

export const PLAN_OPTIONS: { value: CompanyPlan; label: string }[] = [
  { value: "Enterprise", label: "Enterprise" },
  { value: "Business", label: "Business" },
  { value: "Team", label: "Team" },
];

// ── Attribute types ──

/**
 * The value shape behind a column. Drives the generic cell renderer, so a
 * newly created attribute gets a real typed cell instead of a dead label.
 */
export type AttributeType =
  | "text"
  | "longText"
  | "number"
  | "currency"
  | "percent"
  | "date"
  | "timestamp"
  | "checkbox"
  | "rating"
  | "select"
  | "multiSelect"
  | "status"
  | "user"
  | "record"
  | "location"
  | "phone"
  | "link";

export const ATTRIBUTE_TYPE_LABELS: Record<AttributeType, string> = {
  text: "Text",
  longText: "Long text",
  number: "Number",
  currency: "Currency",
  percent: "Percent",
  date: "Date",
  timestamp: "Timestamp",
  checkbox: "Checkbox",
  rating: "Rating",
  select: "Select",
  multiSelect: "Multi-select",
  status: "Status",
  user: "User",
  record: "Relationship",
  location: "Location",
  phone: "Phone",
  link: "Link",
};

// ── Attribute icons ──

const iconClass = "size-4";

const textIcon = <FileTextIcon className={iconClass} aria-hidden="true" />;

const longTextIcon = <ListIcon className={iconClass} aria-hidden="true" />;

const numberIcon = <HashIcon className={iconClass} aria-hidden="true" />;

const currencyIcon = <CircleDollarSignIcon className={iconClass} aria-hidden="true" />;

const percentIcon = <TargetIcon className={iconClass} aria-hidden="true" />;

const dateIcon = <CalendarIcon className={iconClass} aria-hidden="true" />;

const timestampIcon = <ClockIcon className={iconClass} aria-hidden="true" />;

const checkboxIcon = <SquareCheckIcon className={iconClass} aria-hidden="true" />;

const ratingIcon = <StarIcon className={iconClass} aria-hidden="true" />;

const selectIcon = <ChevronsUpDownIcon className={iconClass} aria-hidden="true" />;

const multiSelectIcon = <ListChecksIcon className={iconClass} aria-hidden="true" />;

const statusIcon = <RadioIcon className={iconClass} aria-hidden="true" />;

const personIcon = <UserIcon className={iconClass} aria-hidden="true" />;

const recordIcon = <DatabaseIcon className={iconClass} aria-hidden="true" />;

const locationIcon = <MapPinIcon className={iconClass} aria-hidden="true" />;

const phoneIcon = <SmartphoneIcon className={iconClass} aria-hidden="true" />;

const linkIcon = <LinkIcon className={iconClass} aria-hidden="true" />;

const seatsIcon = <UsersIcon className={iconClass} aria-hidden="true" />;

const companyIcon = <Building2Icon className={iconClass} aria-hidden="true" />;

const dealIcon = <BriefcaseBusinessIcon className={iconClass} aria-hidden="true" />;

const firmographicsIcon = <GlobeIcon className={iconClass} aria-hidden="true" />;

const engagementIcon = <ActivityIcon className={iconClass} aria-hidden="true" />;

const lifecycleIcon = <LayersIcon className={iconClass} aria-hidden="true" />;

const billingIcon = <CreditCardIcon className={iconClass} aria-hidden="true" />;

const noteIcon = <SquarePenIcon className={iconClass} aria-hidden="true" />;

/** Leading icon for the Custom group the picker grows as attributes are made. */
export const customGroupIcon = <SparklesIcon className={iconClass} aria-hidden="true" />;

export const ATTRIBUTE_TYPE_ICONS: Record<AttributeType, ReactNode> = {
  text: textIcon,
  longText: longTextIcon,
  number: numberIcon,
  currency: currencyIcon,
  percent: percentIcon,
  date: dateIcon,
  timestamp: timestampIcon,
  checkbox: checkboxIcon,
  rating: ratingIcon,
  select: selectIcon,
  multiSelect: multiSelectIcon,
  status: statusIcon,
  user: personIcon,
  record: recordIcon,
  location: locationIcon,
  phone: phoneIcon,
  link: linkIcon,
};

/**
 * How each attribute type is filtered. A type absent here is not offered as a
 * filter: date and timestamp have no value type in the Filters catalog.
 */
export const ATTRIBUTE_FILTER_TYPE: Partial<Record<AttributeType, FilterValueType>> = {
  text: "text",
  longText: "text",
  link: "text",
  location: "text",
  phone: "text",
  number: "number",
  currency: "number",
  percent: "number",
  rating: "number",
  select: "select",
  status: "select",
  user: "select",
  record: "select",
  multiSelect: "multiselect",
  checkbox: "boolean",
};

// ── Attribute registry ──

export interface CompanyAttribute {
  /** Also the TanStack column id. */
  id: string;
  label: string;
  type: AttributeType;
  /** Column width in px. */
  size: number;
  sortable: boolean;
}

/**
 * Every attribute a column can be built from. LOCKED_ATTRIBUTE_IDS below stay
 * in the grid permanently; everything else is added and removed by the picker.
 */
export const COMPANY_ATTRIBUTES: CompanyAttribute[] = [
  {
    id: "company-name",
    label: "Company",
    type: "text",
    size: 240,
    sortable: true,
  },
  {
    id: "company-domain",
    label: "Domain",
    type: "link",
    size: 170,
    sortable: true,
  },
  {
    id: "company-description",
    label: "Description",
    type: "longText",
    size: 260,
    sortable: false,
  },
  {
    id: "company-categories",
    label: "Categories",
    type: "multiSelect",
    size: 220,
    sortable: false,
  },
  {
    id: "people-owner",
    label: "Owner",
    type: "user",
    size: 170,
    sortable: true,
  },
  {
    id: "people-manager",
    label: "Account manager",
    type: "user",
    size: 180,
    sortable: true,
  },
  {
    id: "people-contact",
    label: "Primary contact",
    type: "record",
    size: 190,
    sortable: false,
  },
  {
    id: "deal-stage",
    label: "Stage",
    type: "select",
    size: 130,
    sortable: true,
  },
  { id: "deal-arr", label: "ARR", type: "currency", size: 120, sortable: true },
  {
    id: "deal-close",
    label: "Close date",
    type: "date",
    size: 140,
    sortable: true,
  },
  {
    id: "deal-probability",
    label: "Probability",
    type: "percent",
    size: 150,
    sortable: true,
  },
  {
    id: "firmographics-industry",
    label: "Industry",
    type: "select",
    size: 160,
    sortable: true,
  },
  {
    id: "firmographics-employees",
    label: "Employees",
    type: "number",
    size: 120,
    sortable: true,
  },
  {
    id: "firmographics-location",
    label: "Location",
    type: "location",
    size: 170,
    sortable: true,
  },
  {
    id: "firmographics-phone",
    label: "Phone",
    type: "phone",
    size: 160,
    sortable: false,
  },
  {
    id: "engagement-lastActivity",
    label: "Last activity",
    type: "timestamp",
    size: 140,
    sortable: true,
  },
  {
    id: "engagement-renewal",
    label: "Next renewal",
    type: "date",
    size: 140,
    sortable: true,
  },
  {
    id: "engagement-health",
    label: "Health",
    type: "number",
    size: 150,
    sortable: true,
  },
  {
    id: "engagement-rating",
    label: "Rating",
    type: "rating",
    size: 130,
    sortable: true,
  },
  {
    id: "lifecycle-status",
    label: "Status",
    type: "status",
    size: 140,
    sortable: true,
  },
  {
    id: "lifecycle-priority",
    label: "Priority",
    type: "select",
    size: 130,
    sortable: true,
  },
  {
    id: "lifecycle-tier",
    label: "Tier",
    type: "select",
    size: 130,
    sortable: true,
  },
  {
    id: "lifecycle-contract",
    label: "Under contract",
    type: "checkbox",
    size: 150,
    sortable: true,
  },
  {
    id: "billing-plan",
    label: "Plan",
    type: "select",
    size: 130,
    sortable: true,
  },
  {
    id: "billing-seats",
    label: "Seats",
    type: "number",
    size: 100,
    sortable: true,
  },
  { id: "notes", label: "Notes", type: "longText", size: 240, sortable: false },
];

export const ATTRIBUTE_BY_ID = new Map(
  COMPANY_ATTRIBUTES.map((attribute) => [attribute.id, attribute]),
);

/** The record's identity column. Never hidden, never removed. */
export const IDENTITY_ATTRIBUTE_ID = "company-name";

/** Always in the grid: the picker shows them checked and disabled. */
export const LOCKED_ATTRIBUTE_IDS = ["company-name", "people-owner", "deal-stage"];

/** Columns the grid opens with, in this order. Removable from the picker. */
export const DEFAULT_ATTRIBUTE_IDS = ["deal-arr", "company-categories", "engagement-health"];

// ── Cascader tree ──

/**
 * The drillable attribute tree. Leaves carry the SHAPE of the value in the icon
 * column, because a property picker is read by type before it is read by name.
 */
/** Group -> member attribute ids. Labels and leaf icons come from the registry. */
const ATTRIBUTE_GROUPS: {
  value: string;
  label: string;
  icon: ReactNode;
  children: string[];
}[] = [
  {
    value: "company",
    label: "Company",
    icon: companyIcon,
    children: ["company-name", "company-domain", "company-description", "company-categories"],
  },
  {
    value: "people",
    label: "People",
    icon: seatsIcon,
    children: ["people-owner", "people-manager", "people-contact"],
  },
  {
    value: "deal",
    label: "Deal",
    icon: dealIcon,
    children: ["deal-stage", "deal-arr", "deal-close", "deal-probability"],
  },
  {
    value: "firmographics",
    label: "Firmographics",
    icon: firmographicsIcon,
    children: [
      "firmographics-industry",
      "firmographics-employees",
      "firmographics-location",
      "firmographics-phone",
    ],
  },
  {
    value: "engagement",
    label: "Engagement",
    icon: engagementIcon,
    children: [
      "engagement-lastActivity",
      "engagement-renewal",
      "engagement-health",
      "engagement-rating",
    ],
  },
  {
    value: "lifecycle",
    label: "Lifecycle",
    icon: lifecycleIcon,
    children: ["lifecycle-status", "lifecycle-priority", "lifecycle-tier", "lifecycle-contract"],
  },
  {
    value: "billing",
    label: "Billing",
    icon: billingIcon,
    children: ["billing-plan", "billing-seats"],
  },
];

/**
 * Built from the registry so a leaf shows the SAME type icon and label its
 * column header does: a hand-written tree drifts from the columns it names.
 */
export const COMPANY_ATTRIBUTE_TREE: CascaderNode[] = [
  ...ATTRIBUTE_GROUPS.map((group) => ({
    value: group.value,
    label: group.label,
    icon: group.icon,
    children: group.children.map((id) => {
      const attribute = ATTRIBUTE_BY_ID.get(id);
      return {
        value: id,
        label: attribute?.label ?? id,
        icon: attribute ? ATTRIBUTE_TYPE_ICONS[attribute.type] : undefined,
      };
    }),
  })),
  { value: "notes", label: "Notes", icon: noteIcon },
];

/** The types the footer's Create-new-attribute flyout offers, in two runs. */
// Kept to seven: a footer holds COMMANDS, and a longer list stops reading as
// one. The other renderers still back the built-in attributes.
export const NEW_ATTRIBUTE_GROUPS: {
  label: string;
  types: AttributeType[];
}[] = [
  { label: "Basic", types: ["text", "number", "currency", "date"] },
  { label: "CRM", types: ["select", "status", "user"] },
];

// ── Formatting ──

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Parses the fixed `YYYY-MM-DD` demo strings without touching the clock. */
export function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) return iso;
  return `${MONTHS[Number(month) - 1]} ${Number(day)}, ${year}`;
}

export function formatCurrency(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 2)}M`;
  }
  if (value >= 1_000) return `$${Math.round(value / 1_000)}K`;
  return `$${value}`;
}

export function formatExactCurrency(value: number): string {
  return `$${value.toLocaleString("en-US")}`;
}

export function formatCompactNumber(value: number): string {
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(value % 1_000 === 0 ? 0 : 1)}k`;
  }
  return String(value);
}

export function formatRelativeDays(days: number): string {
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 14) return "Last week";
  if (days < 31) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) {
    const months = Math.floor(days / 30);
    return months === 1 ? "Last month" : `${months} months ago`;
  }
  return "Over a year";
}

export function getCompanySearchBlob(company: ICompany): string {
  const owner = getPerson(company.ownerId)?.name ?? "";
  return [
    company.name,
    company.domain,
    company.description,
    company.industry,
    company.location,
    company.stage,
    company.status,
    owner,
    company.categories.join(" "),
  ]
    .join(" ")
    .toLowerCase();
}
