export type BacklogStatus = "In Progress" | "In Review" | "Ready" | "Blocked" | "Planned";

export type BacklogType = "Feature" | "Improvement" | "Research" | "Security";

export type BacklogOwner = {
  name: string;
  avatar?: string;
};

export type BacklogItem = {
  id: string;
  ref: string;
  title: string;
  type: BacklogType;
  status: BacklogStatus;
  team: string;
  cycle: string;
  dueDate: string;
  effort: number;
  owner: BacklogOwner;
  displayOrder: number;
};

// Owners reuse the shared BLOCK_AVATARS roster (sex-matched portraits); one
// person is intentionally initials-only to exercise the AvatarFallback state.
export const BACKLOG_ITEMS: BacklogItem[] = [
  {
    id: "PLT-2041",
    ref: "PLT-2041",
    title: "Realtime presence",
    type: "Feature",
    status: "In Progress",
    team: "Collaboration",
    cycle: "Sprint 18",
    dueDate: "Jul 08",
    effort: 8,
    owner: {
      name: "Leo Grant",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&dpr=2&q=80",
    },
    displayOrder: 1,
  },
  {
    id: "PLT-2042",
    ref: "PLT-2042",
    title: "SSO enforcement",
    type: "Security",
    status: "In Review",
    team: "Identity",
    cycle: "Sprint 18",
    dueDate: "Jul 10",
    effort: 5,
    owner: {
      name: "Sana Qureshi",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&dpr=2&q=80",
    },
    displayOrder: 2,
  },
  {
    id: "PLT-2043",
    ref: "PLT-2043",
    title: "Webhook retries",
    type: "Improvement",
    status: "Ready",
    team: "Platform",
    cycle: "Sprint 18",
    dueDate: "Jul 09",
    effort: 2,
    owner: {
      name: "Alex Johnson",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80",
    },
    displayOrder: 3,
  },
  {
    id: "PLT-2044",
    ref: "PLT-2044",
    title: "Audit log export",
    type: "Improvement",
    status: "Blocked",
    team: "Compliance",
    cycle: "Sprint 19",
    dueDate: "Jul 12",
    effort: 3,
    owner: {
      name: "David Kim",
      avatar: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=96&h=96&dpr=2&q=80",
    },
    displayOrder: 4,
  },
  {
    id: "PLT-2045",
    ref: "PLT-2045",
    title: "Billing usage meters",
    type: "Feature",
    status: "Planned",
    team: "Revenue",
    cycle: "Sprint 19",
    dueDate: "Jul 16",
    effort: 13,
    owner: {
      name: "Mira Stone",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&dpr=2&q=80",
    },
    displayOrder: 5,
  },
  {
    id: "PLT-2046",
    ref: "PLT-2046",
    title: "Search relevance",
    type: "Research",
    status: "Planned",
    team: "Search",
    cycle: "Discovery",
    dueDate: "Jul 18",
    effort: 8,
    owner: {
      name: "Nora Vale",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&dpr=2&q=80",
    },
    displayOrder: 6,
  },
  {
    id: "PLT-2047",
    ref: "PLT-2047",
    title: "Mobile offline mode",
    type: "Feature",
    status: "Planned",
    team: "Mobile",
    cycle: "Sprint 20",
    dueDate: "Jul 22",
    effort: 13,
    owner: {
      name: "Theo Park",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&dpr=2&q=80",
    },
    displayOrder: 7,
  },
  {
    id: "PLT-2048",
    ref: "PLT-2048",
    title: "Token rotation",
    type: "Security",
    status: "Planned",
    team: "Security",
    cycle: "Sprint 20",
    dueDate: "Jul 24",
    effort: 5,
    owner: {
      name: "Ravi Menon",
    },
    displayOrder: 8,
  },
];
