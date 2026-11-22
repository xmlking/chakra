export type TaskStatus = "Backlog" | "Todo" | "In Progress" | "Review" | "Done" | "Cancelled";

export type TaskPriority = "Urgent" | "High" | "Medium" | "Low";

export type TaskType = "Feature" | "Bug" | "Ops" | "Research";

export type TaskTab = "all" | "active" | "backlog";

export type TaskOrdering = "status" | "priority" | "due-date" | "updated";

export type TaskProperty =
  | "status"
  | "assignee"
  | "priority"
  | "project"
  | "dueDate"
  | "estimate"
  | "updated";

export interface IAssignee {
  id: string;
  name: string;
  initials: string;
  avatar?: string;
  role: string;
  tone: string;
}

export interface ISubIssue {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: IAssignee | null;
  dueAt: string;
  dueDateLabel: string;
}

export interface ITask {
  id: string;
  taskKey: string;
  title: string;
  project: string;
  type: TaskType;
  status: TaskStatus;
  statusOrder: number;
  priority: TaskPriority;
  priorityValue: number;
  assignee: IAssignee | null;
  dueAt: string;
  dueDateLabel: string;
  updatedAt: string;
  updatedLabel: string;
  estimate: string;
  subtasksCompleted: number;
  subtasksTotal: number;
  subIssues?: ISubIssue[];
}

export interface ITaskRow {
  kind: "task";
  id: string;
  task: ITask;
  subRows?: ISubIssueRow[];
}

export interface ISubIssueRow {
  kind: "subIssue";
  id: string;
  task: ITask;
  subIssue: ISubIssue;
}

export type TaskTableRow = ITaskRow | ISubIssueRow;

export const TASK_STATUS_ORDER: TaskStatus[] = [
  "Backlog",
  "Todo",
  "In Progress",
  "Review",
  "Done",
  "Cancelled",
];

export const TASK_PRIORITY_ORDER: TaskPriority[] = ["Urgent", "High", "Medium", "Low"];

export const TASK_TABS: { value: TaskTab; label: string }[] = [
  { value: "all", label: "All tasks" },
  { value: "active", label: "Active" },
  { value: "backlog", label: "Backlog" },
];

export const ORDERING_OPTIONS: { value: TaskOrdering; label: string }[] = [
  { value: "status", label: "Status" },
  { value: "priority", label: "Priority" },
  { value: "due-date", label: "Due date" },
  { value: "updated", label: "Updated" },
];

export const DISPLAY_PROPERTIES: { key: TaskProperty; label: string }[] = [
  { key: "status", label: "Status" },
  { key: "assignee", label: "Assignee" },
  { key: "priority", label: "Priority" },
  { key: "project", label: "Project" },
  { key: "dueDate", label: "Due date" },
  { key: "estimate", label: "Estimate" },
  { key: "updated", label: "Updated" },
];

export const ASSIGNEES: IAssignee[] = [
  {
    id: "maya",
    name: "Maya Perez",
    initials: "MP",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&dpr=2&q=80",
    role: "Platform lead",
    tone: "bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300",
  },
  {
    id: "noa",
    name: "Noa Kim",
    initials: "NK",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=96&h=96&dpr=2&q=80",
    role: "Product designer",
    tone: "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300",
  },
  {
    id: "emil",
    name: "Emil Novak",
    initials: "EN",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&dpr=2&q=80",
    role: "Frontend engineer",
    tone: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
  },
  {
    id: "lara",
    name: "Lara Chen",
    initials: "LC",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=96&h=96&dpr=2&q=80",
    role: "Launch ops",
    tone: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
  },
  {
    id: "pavel",
    name: "Pavel Singh",
    initials: "PS",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=96&h=96&dpr=2&q=80",
    role: "Growth engineer",
    tone: "bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300",
  },
  {
    id: "jonas",
    name: "Jonas Reed",
    initials: "JR",
    avatar: "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=96&h=96&dpr=2&q=80",
    role: "Security engineer",
    tone: "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  },
];

function assignee(id: IAssignee["id"]): IAssignee {
  const match = ASSIGNEES.find((item) => item.id === id);

  if (!match) {
    throw new Error(`Unknown assignee: ${id}`);
  }

  return match;
}

const MONTH_TO_NUMBER: Record<string, string> = {
  Jan: "01",
  Feb: "02",
  Mar: "03",
  Apr: "04",
  May: "05",
  Jun: "06",
  Jul: "07",
  Aug: "08",
  Sep: "09",
  Oct: "10",
  Nov: "11",
  Dec: "12",
};

function dueAtFromLabel(label: string) {
  const [month, day] = label.trim().split(/\s+/);
  const normalizedMonth = month ? MONTH_TO_NUMBER[month] : undefined;
  const normalizedDay = day ? Number.parseInt(day, 10) : Number.NaN;

  if (!normalizedMonth || Number.isNaN(normalizedDay)) {
    return "2026-12-31";
  }

  return `2026-${normalizedMonth}-${String(normalizedDay).padStart(2, "0")}`;
}

function subIssues(
  taskKey: string,
  items: Array<{
    title: string;
    dueDateLabel: string;
    assignee?: IAssignee["id"] | null;
    priority?: TaskPriority;
  }>,
  completedCount: number,
  openStatus: Exclude<TaskStatus, "Done" | "Cancelled"> = "Todo",
  defaultPriority: TaskPriority = "Medium",
): ISubIssue[] {
  return items.map((item, index) => ({
    id: `${taskKey}-sub-${index + 1}`,
    title: item.title,
    status: index < completedCount ? "Done" : openStatus,
    priority: item.priority ?? defaultPriority,
    assignee:
      item.assignee === undefined || item.assignee === null ? null : assignee(item.assignee),
    dueAt: dueAtFromLabel(item.dueDateLabel),
    dueDateLabel: item.dueDateLabel,
  }));
}

export const TASKS: ITask[] = [
  {
    id: "1",
    taskKey: "REUI-241",
    title: "Finalize licensed registry handshake for private installs",
    project: "Registry API",
    type: "Ops",
    status: "In Progress",
    statusOrder: 2,
    priority: "Urgent",
    priorityValue: 4,
    assignee: assignee("maya"),
    dueAt: "2026-04-02",
    dueDateLabel: "Apr 2",
    updatedAt: "2026-03-26T09:30:00Z",
    updatedLabel: "2h ago",
    estimate: "5 pts",
    subtasksCompleted: 2,
    subtasksTotal: 4,
    subIssues: subIssues(
      "REUI-241",
      [
        {
          title: "Lock the signed entitlement payload shape",
          dueDateLabel: "Mar 31",
          assignee: "maya",
          priority: "Urgent",
        },
        {
          title: "Validate private install signature rotation",
          dueDateLabel: "Apr 1",
          assignee: "jonas",
          priority: "High",
        },
        {
          title: "Add replay guard for expired install links",
          dueDateLabel: "Apr 2",
          assignee: "emil",
          priority: "Urgent",
        },
        {
          title: "Document the fallback flow for invalid claims",
          dueDateLabel: "Apr 2",
          assignee: "maya",
          priority: "Medium",
        },
      ],
      2,
      "In Progress",
      "Urgent",
    ),
  },
  {
    id: "2",
    taskKey: "REUI-238",
    title: "Design empty states for expiring team seat invitations",
    project: "Workspace Access",
    type: "Feature",
    status: "Todo",
    statusOrder: 1,
    priority: "High",
    priorityValue: 3,
    assignee: assignee("noa"),
    dueAt: "2026-04-04",
    dueDateLabel: "Apr 4",
    updatedAt: "2026-03-26T07:10:00Z",
    updatedLabel: "4h ago",
    estimate: "3 pts",
    subtasksCompleted: 0,
    subtasksTotal: 3,
    subIssues: subIssues(
      "REUI-238",
      [
        {
          title: "Draft the expired invite empty state copy",
          dueDateLabel: "Apr 3",
          assignee: "noa",
          priority: "High",
        },
        {
          title: "Add reroute guidance for workspace owners",
          dueDateLabel: "Apr 4",
          assignee: "pavel",
          priority: "Medium",
        },
        {
          title: "Review seat conflict messaging with support",
          dueDateLabel: "Apr 4",
          assignee: null,
          priority: "Low",
        },
      ],
      0,
      "Todo",
      "High",
    ),
  },
  {
    id: "3",
    taskKey: "REUI-236",
    title: "Add audit trail hooks to task status change events",
    project: "Task Delivery",
    type: "Feature",
    status: "Review",
    statusOrder: 3,
    priority: "High",
    priorityValue: 3,
    assignee: assignee("emil"),
    dueAt: "2026-04-01",
    dueDateLabel: "Apr 1",
    updatedAt: "2026-03-26T11:15:00Z",
    updatedLabel: "45m ago",
    estimate: "5 pts",
    subtasksCompleted: 4,
    subtasksTotal: 5,
    subIssues: subIssues(
      "REUI-236",
      [
        {
          title: "Capture actor metadata on every status transition",
          dueDateLabel: "Mar 30",
          assignee: "emil",
          priority: "High",
        },
        {
          title: "Persist previous status for timeline diffs",
          dueDateLabel: "Mar 31",
          assignee: "jonas",
          priority: "High",
        },
        {
          title: "Expose transition source in the task drawer",
          dueDateLabel: "Apr 1",
          assignee: "emil",
          priority: "Medium",
        },
        {
          title: "Add audit retention coverage for review steps",
          dueDateLabel: "Apr 1",
          assignee: "jonas",
          priority: "Medium",
        },
        {
          title: "Review final event naming with analytics",
          dueDateLabel: "Apr 1",
          assignee: null,
          priority: "Low",
        },
      ],
      4,
      "Review",
      "High",
    ),
  },
  {
    id: "4",
    taskKey: "REUI-233",
    title: "Map launch copy review ownership across pricing screens",
    project: "Launch Ops",
    type: "Ops",
    status: "Backlog",
    statusOrder: 0,
    priority: "Medium",
    priorityValue: 2,
    assignee: assignee("lara"),
    dueAt: "2026-04-10",
    dueDateLabel: "Apr 10",
    updatedAt: "2026-03-24T16:20:00Z",
    updatedLabel: "2d ago",
    estimate: "2 pts",
    subtasksCompleted: 0,
    subtasksTotal: 0,
  },
  {
    id: "5",
    taskKey: "REUI-229",
    title: "Backfill event taxonomy for saved block views",
    project: "Launch Analytics",
    type: "Research",
    status: "In Progress",
    statusOrder: 2,
    priority: "High",
    priorityValue: 3,
    assignee: assignee("pavel"),
    dueAt: "2026-04-03",
    dueDateLabel: "Apr 3",
    updatedAt: "2026-03-26T08:15:00Z",
    updatedLabel: "3h ago",
    estimate: "3 pts",
    subtasksCompleted: 1,
    subtasksTotal: 3,
    subIssues: subIssues(
      "REUI-229",
      [
        {
          title: "Track saved queue preset creation events",
          dueDateLabel: "Apr 2",
          assignee: "pavel",
          priority: "High",
        },
        {
          title: "Add saved-view source tags for launch funnels",
          dueDateLabel: "Apr 3",
          assignee: "maya",
          priority: "High",
        },
        {
          title: "Map saved filters to team and workspace context",
          dueDateLabel: "Apr 3",
          assignee: "lara",
          priority: "Medium",
        },
      ],
      1,
      "In Progress",
      "High",
    ),
  },
  {
    id: "6",
    taskKey: "REUI-227",
    title: "Audit session invalidation when workspace roles change",
    project: "Workspace Access",
    type: "Bug",
    status: "Todo",
    statusOrder: 1,
    priority: "Urgent",
    priorityValue: 4,
    assignee: assignee("jonas"),
    dueAt: "2026-03-31",
    dueDateLabel: "Mar 31",
    updatedAt: "2026-03-25T19:40:00Z",
    updatedLabel: "14h ago",
    estimate: "5 pts",
    subtasksCompleted: 1,
    subtasksTotal: 2,
  },
  {
    id: "7",
    taskKey: "REUI-224",
    title: "Prototype block submission review queue for human curation",
    project: "Review Ops",
    type: "Feature",
    status: "Backlog",
    statusOrder: 0,
    priority: "High",
    priorityValue: 3,
    assignee: assignee("maya"),
    dueAt: "2026-04-08",
    dueDateLabel: "Apr 8",
    updatedAt: "2026-03-24T09:10:00Z",
    updatedLabel: "2d ago",
    estimate: "8 pts",
    subtasksCompleted: 0,
    subtasksTotal: 4,
    subIssues: subIssues(
      "REUI-224",
      [
        {
          title: "Define triage fields for incoming block drafts",
          dueDateLabel: "Apr 5",
          assignee: "maya",
          priority: "High",
        },
        {
          title: "Add reviewer score inputs for release readiness",
          dueDateLabel: "Apr 6",
          assignee: "emil",
          priority: "High",
        },
        {
          title: "Capture revision requests before approval",
          dueDateLabel: "Apr 7",
          assignee: "jonas",
          priority: "Medium",
        },
        {
          title: "Write moderation notes for low-signal submissions",
          dueDateLabel: "Apr 8",
          assignee: null,
          priority: "Low",
        },
      ],
      0,
      "Backlog",
      "High",
    ),
  },
  {
    id: "8",
    taskKey: "REUI-220",
    title: "Refine task drawer focus order for keyboard-only review",
    project: "Task Delivery",
    type: "Bug",
    status: "Review",
    statusOrder: 3,
    priority: "Medium",
    priorityValue: 2,
    assignee: assignee("emil"),
    dueAt: "2026-04-05",
    dueDateLabel: "Apr 5",
    updatedAt: "2026-03-26T10:45:00Z",
    updatedLabel: "1h ago",
    estimate: "2 pts",
    subtasksCompleted: 3,
    subtasksTotal: 3,
  },
  {
    id: "9",
    taskKey: "REUI-216",
    title: "Prepare launch week issue template for support escalations",
    project: "Launch Ops",
    type: "Ops",
    status: "Todo",
    statusOrder: 1,
    priority: "Medium",
    priorityValue: 2,
    assignee: assignee("lara"),
    dueAt: "2026-04-06",
    dueDateLabel: "Apr 6",
    updatedAt: "2026-03-25T15:00:00Z",
    updatedLabel: "20h ago",
    estimate: "2 pts",
    subtasksCompleted: 1,
    subtasksTotal: 4,
  },
  {
    id: "10",
    taskKey: "REUI-214",
    title: "Document recovery path for failed Polar webhook syncs",
    project: "Billing Flow",
    type: "Ops",
    status: "In Progress",
    statusOrder: 2,
    priority: "High",
    priorityValue: 3,
    assignee: assignee("maya"),
    dueAt: "2026-04-07",
    dueDateLabel: "Apr 7",
    updatedAt: "2026-03-26T06:40:00Z",
    updatedLabel: "5h ago",
    estimate: "5 pts",
    subtasksCompleted: 2,
    subtasksTotal: 5,
    subIssues: subIssues(
      "REUI-214",
      [
        {
          title: "Log failed webhook replay attempts with reason codes",
          dueDateLabel: "Apr 4",
          assignee: "maya",
          priority: "Urgent",
        },
        {
          title: "Document replay permissions for billing admins",
          dueDateLabel: "Apr 5",
          assignee: "lara",
          priority: "Medium",
        },
        {
          title: "Add safe retry guidance for stale invoice states",
          dueDateLabel: "Apr 6",
          assignee: "jonas",
          priority: "High",
        },
        {
          title: "Wire success receipts into the ops drawer",
          dueDateLabel: "Apr 7",
          assignee: "maya",
          priority: "Medium",
        },
        {
          title: "Review incident copy for customer-visible failures",
          dueDateLabel: "Apr 7",
          assignee: null,
          priority: "Low",
        },
      ],
      2,
      "In Progress",
      "High",
    ),
  },
  {
    id: "11",
    taskKey: "REUI-212",
    title: "Create original seed data for the launch-core task workspace",
    project: "Content Pipeline",
    type: "Feature",
    status: "Done",
    statusOrder: 4,
    priority: "Low",
    priorityValue: 1,
    assignee: assignee("noa"),
    dueAt: "2026-03-28",
    dueDateLabel: "Mar 28",
    updatedAt: "2026-03-25T10:10:00Z",
    updatedLabel: "1d ago",
    estimate: "2 pts",
    subtasksCompleted: 3,
    subtasksTotal: 3,
  },
  {
    id: "12",
    taskKey: "REUI-209",
    title: "Test queue density with long project names on mobile",
    project: "Task Delivery",
    type: "Research",
    status: "Backlog",
    statusOrder: 0,
    priority: "Medium",
    priorityValue: 2,
    assignee: assignee("noa"),
    dueAt: "2026-04-12",
    dueDateLabel: "Apr 12",
    updatedAt: "2026-03-23T12:15:00Z",
    updatedLabel: "3d ago",
    estimate: "3 pts",
    subtasksCompleted: 0,
    subtasksTotal: 2,
  },
  {
    id: "13",
    taskKey: "REUI-205",
    title: "Investigate stale cache headers on signed registry downloads",
    project: "Registry API",
    type: "Bug",
    status: "Cancelled",
    statusOrder: 5,
    priority: "Low",
    priorityValue: 1,
    assignee: null,
    dueAt: "2026-04-09",
    dueDateLabel: "Apr 9",
    updatedAt: "2026-03-22T08:20:00Z",
    updatedLabel: "4d ago",
    estimate: "1 pt",
    subtasksCompleted: 0,
    subtasksTotal: 0,
  },
  {
    id: "14",
    taskKey: "REUI-202",
    title: "Wire project health badges into the launch command center",
    project: "Launch Analytics",
    type: "Feature",
    status: "In Progress",
    statusOrder: 2,
    priority: "Urgent",
    priorityValue: 4,
    assignee: assignee("pavel"),
    dueAt: "2026-04-01",
    dueDateLabel: "Apr 1",
    updatedAt: "2026-03-26T08:55:00Z",
    updatedLabel: "2h ago",
    estimate: "5 pts",
    subtasksCompleted: 2,
    subtasksTotal: 3,
    subIssues: subIssues(
      "REUI-202",
      [
        {
          title: "Surface queue blockers in the launch command rail",
          dueDateLabel: "Mar 31",
          assignee: "pavel",
          priority: "Urgent",
        },
        {
          title: "Map risk states to project health badges",
          dueDateLabel: "Apr 1",
          assignee: "maya",
          priority: "High",
        },
        {
          title: "Review escalation copy for unhealthy projects",
          dueDateLabel: "Apr 1",
          assignee: null,
          priority: "Medium",
        },
      ],
      2,
      "In Progress",
      "Urgent",
    ),
  },
  {
    id: "15",
    taskKey: "REUI-198",
    title: "Define moderation lane for user-submitted block references",
    project: "Review Ops",
    type: "Ops",
    status: "Todo",
    statusOrder: 1,
    priority: "High",
    priorityValue: 3,
    assignee: assignee("jonas"),
    dueAt: "2026-04-08",
    dueDateLabel: "Apr 8",
    updatedAt: "2026-03-25T12:10:00Z",
    updatedLabel: "23h ago",
    estimate: "3 pts",
    subtasksCompleted: 0,
    subtasksTotal: 2,
  },
  {
    id: "16",
    taskKey: "REUI-194",
    title: "Review localization hooks for task workspace empty states",
    project: "Content Pipeline",
    type: "Research",
    status: "Backlog",
    statusOrder: 0,
    priority: "Low",
    priorityValue: 1,
    assignee: assignee("lara"),
    dueAt: "2026-04-11",
    dueDateLabel: "Apr 11",
    updatedAt: "2026-03-21T14:35:00Z",
    updatedLabel: "5d ago",
    estimate: "2 pts",
    subtasksCompleted: 0,
    subtasksTotal: 1,
    subIssues: subIssues(
      "REUI-194",
      [
        {
          title: "Audit translated plural rules for empty queue states",
          dueDateLabel: "Apr 11",
          assignee: "lara",
          priority: "Low",
        },
      ],
      0,
      "Backlog",
      "Low",
    ),
  },
];
