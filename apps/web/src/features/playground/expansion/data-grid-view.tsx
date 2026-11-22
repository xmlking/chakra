"use no memo";

/* eslint-disable react-doctor/set-state-in-effect -- this demo intentionally synchronizes table state in effects */

import {
  useTable,
  type ColumnVisibilityState,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";
import { DataGrid, dataGridFeatures } from "@workspace/ui/components/reui/data-grid/data-grid";
import { DataGridPagination } from "@workspace/ui/components/reui/data-grid/data-grid-pagination";
import { DataGridScrollArea } from "@workspace/ui/components/reui/data-grid/data-grid-scroll-area";
import { DataGridTable } from "@workspace/ui/components/reui/data-grid/data-grid-table";
import { Filters } from "@workspace/ui/components/reui/filters/filters";
import {
  createFilterQuery,
  createFilterRule,
  flattenFilterConditions,
} from "@workspace/ui/components/reui/filters/filters-query";
import type { FilterCondition } from "@workspace/ui/components/reui/filters/filters-query";
import type { FilterField, FilterQuery } from "@workspace/ui/components/reui/filters/filters-types";
import {
  Frame,
  FrameDescription,
  FrameFooter,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@workspace/ui/components/reui/frame";
import { Button } from "@workspace/ui/components/shadcn/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@workspace/ui/components/shadcn/field";
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/shadcn/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/shadcn/select";
import { Separator } from "@workspace/ui/components/shadcn/separator";
import { Switch } from "@workspace/ui/components/shadcn/switch";
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/shadcn/tabs";
import { ToggleGroup, ToggleGroupItem } from "@workspace/ui/components/shadcn/toggle-group";
import { cn } from "@workspace/ui/lib/utils";
import {
  PlusIcon,
  FilterIcon,
  FunnelXIcon,
  SaveIcon,
  Settings2Icon,
  CheckIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  createTaskColumns,
  PriorityBadge,
  ProjectBadge,
  StatusBadge,
  type TaskAction,
} from "./columns";
import {
  ASSIGNEES,
  DISPLAY_PROPERTIES,
  ORDERING_OPTIONS,
  TASK_PRIORITY_ORDER,
  TASK_STATUS_ORDER,
  TASK_TABS,
  TASKS,
  type ISubIssue,
  type ISubIssueRow,
  type ITask,
  type ITaskRow,
  type TaskOrdering,
  type TaskPriority,
  type TaskProperty,
  type TaskStatus,
  type TaskTab,
  type TaskTableRow,
} from "./data";

const ACTIVE_STATUSES: TaskStatus[] = ["Todo", "In Progress", "Review"];
const COMPLETED_STATUSES: TaskStatus[] = ["Done", "Cancelled"];
const DEMO_UPDATED_AT = "2026-04-15T09:30:00.000Z";
type TableDensity = "compact" | "comfortable";
type OrderDirection = "asc" | "desc";
type ExpandedTaskIds = Record<string, boolean>;

type ToastTone = "success" | "neutral";

const toneStyles: Record<ToastTone, { dot: string }> = {
  success: { dot: "bg-emerald-500" },
  neutral: { dot: "bg-sky-500" },
};

const TABLE_DENSITY_OPTIONS: { value: TableDensity; label: string }[] = [
  { value: "compact", label: "Compact" },
  { value: "comfortable", label: "Comfortable" },
];

const ORDER_DIRECTION_OPTIONS: { value: OrderDirection; label: string }[] = [
  { value: "asc", label: "Asc" },
  { value: "desc", label: "Desc" },
];

function showTaskToast({
  tone,
  title,
  description,
  primaryLabel,
}: {
  tone: ToastTone;
  title: string;
  description: string;
  primaryLabel: string;
}) {
  toast.custom((id) => (
    <div className="flex w-[356px] flex-col gap-3 rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-lg">
      <div className="flex items-start gap-2">
        <span
          className={cn("mt-1 flex size-2 shrink-0 rounded-full", toneStyles[tone].dot)}
          aria-hidden="true"
        />
        <div className="flex flex-1 flex-col gap-1">
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-sm leading-relaxed text-pretty text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button size="xs" variant="outline" className="flex-1" onClick={() => toast.dismiss(id)}>
          {primaryLabel}
        </Button>
        <Button size="xs" className="flex-1" onClick={() => toast.dismiss(id)}>
          Dismiss
        </Button>
      </div>
    </div>
  ));
}

function getActiveFilters(filters: FilterCondition[]) {
  return filters.filter((filter) => {
    const { operator, values } = filter;
    if (operator === "empty" || operator === "not_empty") return true;
    if (!values || values.length === 0) return false;
    if (values.every((value) => typeof value === "string" && value.trim() === "")) {
      return false;
    }
    if (values.every((value) => value == null)) return false;
    if (values.every((value) => Array.isArray(value) && value.length === 0)) {
      return false;
    }
    return true;
  });
}

function isDefaultTaskFilter(filter: FilterCondition) {
  if (filter.field !== "title" || filter.operator !== "contains") return false;
  if (!filter.values || filter.values.length !== 1) return false;

  return typeof filter.values[0] === "string" && filter.values[0].trim() === "";
}

function hasVisibleFilterControls(filters: FilterCondition[]) {
  return filters.some((filter) => !isDefaultTaskFilter(filter));
}

function filterFieldValue(item: ITask, field: string): unknown {
  switch (field) {
    case "title":
      return [
        item.title,
        item.project,
        ...(item.subIssues ?? []).map((subIssue) => subIssue.title),
      ].join(" ");
    case "assignee":
      return item.assignee?.name ?? "Unassigned";
    default:
      return item[field as keyof ITask];
  }
}

/** `null` for an operator this demo does not implement, which keeps the row. */
function matchesCondition(
  fieldValue: unknown,
  operator: string,
  values: unknown[],
): boolean | null {
  switch (operator) {
    case "is":
      return values.includes(fieldValue);
    case "is_not":
      return !values.includes(fieldValue);
    case "is_any_of":
      return values.some((value) => fieldValue === value);
    case "is_none_of":
      return !values.some((value) => fieldValue === value);
    case "contains": {
      const tokens = values.map((value) => String(value).trim()).filter(Boolean);

      if (tokens.length === 0) return true;

      return tokens.some((token) => String(fieldValue).toLowerCase().includes(token.toLowerCase()));
    }
    case "not_contains":
      return !values.some((value) =>
        String(fieldValue).toLowerCase().includes(String(value).toLowerCase()),
      );
    case "starts_with":
      return values.some((value) =>
        String(fieldValue).toLowerCase().startsWith(String(value).toLowerCase()),
      );
    case "ends_with":
      return values.some((value) =>
        String(fieldValue).toLowerCase().endsWith(String(value).toLowerCase()),
      );
    case "eq":
      return fieldValue === values[0];
    case "neq":
      return fieldValue !== values[0];
    case "gt":
      return Number(fieldValue) > Number(values[0]);
    case "lt":
      return Number(fieldValue) < Number(values[0]);
    case "gte":
      return Number(fieldValue) >= Number(values[0]);
    case "lte":
      return Number(fieldValue) <= Number(values[0]);
    case "between":
      if (values.length >= 2) {
        const min = Number(values[0]);
        const max = Number(values[1]);
        return Number(fieldValue) >= min && Number(fieldValue) <= max;
      }
      return true;
    case "not_between":
      if (values.length >= 2) {
        const min = Number(values[0]);
        const max = Number(values[1]);
        return Number(fieldValue) < min || Number(fieldValue) > max;
      }
      return true;
    case "empty":
      return fieldValue === "" || fieldValue == null;
    case "not_empty":
      return fieldValue !== "" && fieldValue != null;
    default:
      return null;
  }
}

function applyFiltersToData(data: ITask[], filters: FilterCondition[]) {
  const active = getActiveFilters(filters);
  let result = [...data];

  active.forEach((filter) => {
    const { field, operator, values, negated } = filter;

    result = result.filter((item) => {
      const raw = filterFieldValue(item, field);
      const fieldValue = raw != null ? raw : "";
      const matches = matchesCondition(fieldValue, operator, values);

      // "Starts with" and "ends with" declare no opposite operator, so Negate
      // keeps the operator and flips this flag instead. Ignoring it would keep
      // exactly the rows the chip says it excludes.
      if (matches === null) return true;
      return negated ? !matches : matches;
    });
  });

  return result;
}

function createDefaultTaskFilters(): FilterQuery {
  return createFilterQuery([
    createFilterRule({
      id: "title-1",
      path: ["title"],
      operator: "contains",
      value: "",
    }),
  ]);
}

function renderSelectedCount(values: unknown[]) {
  if (values.length === 0) return "Select...";
  if (values.length > 1) return `${values.length} selected`;
  return null;
}

function getTaskTabCount(tasks: ITask[], tab: TaskTab, showCompleted: boolean) {
  const filteredTasks = showCompleted
    ? tasks
    : tasks.filter((task) => !COMPLETED_STATUSES.includes(task.status));

  if (tab === "active") {
    return filteredTasks.filter((task) => ACTIVE_STATUSES.includes(task.status)).length;
  }

  if (tab === "backlog") {
    return filteredTasks.filter((task) => task.status === "Backlog").length;
  }

  return filteredTasks.length;
}

function compareTasksBySorting(
  taskA: ITask,
  taskB: ITask,
  sorting: SortingState,
  orderCompletedByRecency: boolean,
) {
  const primarySort = sorting[0];
  if (!primarySort) return 0;

  const isDescending = primarySort?.desc ?? false;
  const direction = isDescending ? -1 : 1;

  const aCompleted = COMPLETED_STATUSES.includes(taskA.status);
  const bCompleted = COMPLETED_STATUSES.includes(taskB.status);

  let baseValue = 0;

  if (orderCompletedByRecency && aCompleted && bCompleted) {
    baseValue =
      taskA.updatedAt.localeCompare(taskB.updatedAt) || taskA.taskKey.localeCompare(taskB.taskKey);
  } else {
    switch (primarySort?.id) {
      case "status":
        baseValue =
          taskA.statusOrder - taskB.statusOrder || taskA.taskKey.localeCompare(taskB.taskKey);
        break;
      case "dueDate":
        baseValue =
          taskA.dueAt.localeCompare(taskB.dueAt) || taskA.taskKey.localeCompare(taskB.taskKey);
        break;
      case "updated":
        baseValue =
          taskA.updatedAt.localeCompare(taskB.updatedAt) ||
          taskA.taskKey.localeCompare(taskB.taskKey);
        break;
      case "priority":
      default:
        baseValue =
          taskA.priorityValue - taskB.priorityValue || taskA.taskKey.localeCompare(taskB.taskKey);
        break;
    }
  }

  return baseValue * direction;
}

function buildSubIssueRows(task: ITask): ISubIssueRow[] {
  return (task.subIssues ?? []).map((subIssue) => ({
    kind: "subIssue",
    id: subIssue.id,
    task,
    subIssue,
  }));
}

function buildTaskRows(
  tasks: ITask[],
  includeSubTasks: boolean,
  expandedTaskIds: ExpandedTaskIds = {},
): TaskTableRow[] {
  return tasks.flatMap((task) => {
    const subRows = includeSubTasks ? buildSubIssueRows(task) : undefined;
    const taskRow: ITaskRow = {
      kind: "task",
      id: task.id,
      task,
      subRows,
    };

    if (!includeSubTasks || !expandedTaskIds[task.id] || !subRows?.length) {
      return [taskRow];
    }

    return [taskRow, ...subRows];
  });
}

function getDefaultExpandedTaskIds(taskRows: TaskTableRow[]): ExpandedTaskIds {
  const firstExpandableRow = taskRows.find((row) => row.kind === "task" && row.subRows?.length);

  if (!firstExpandableRow) {
    return {};
  }

  return { [firstExpandableRow.id]: true };
}

export function DataGridView() {
  const [tasks, setTasks] = useState<ITask[]>(TASKS);
  const [activeTab, setActiveTab] = useState<TaskTab>("all");
  const [ordering, setOrdering] = useState<TaskOrdering>("priority");
  const [orderDirection, setOrderDirection] = useState<OrderDirection>("desc");
  const [orderCompletedByRecency, setOrderCompletedByRecency] = useState(true);
  const [showCompleted, setShowCompleted] = useState(true);
  const [showSubIssues, setShowSubIssues] = useState(true);
  const [tableDensity, setTableDensity] = useState<TableDensity>("compact");
  const [columnsResizable, setColumnsResizable] = useState(true);
  const [columnsMovable, setColumnsMovable] = useState(true);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [sorting, setSorting] = useState<SortingState>([{ id: "priority", desc: true }]);
  const [filterQuery, setFilterQuery] = useState<FilterQuery>(createDefaultTaskFilters);
  const filters = useMemo(() => flattenFilterConditions(filterQuery), [filterQuery]);
  const [expandedTaskIds, setExpandedTaskIds] = useState<ExpandedTaskIds>(() =>
    getDefaultExpandedTaskIds(buildTaskRows(TASKS, true)),
  );
  const [visibleProperties, setVisibleProperties] = useState<Record<TaskProperty, boolean>>({
    status: true,
    assignee: true,
    priority: true,
    project: true,
    dueDate: false,
    estimate: false,
    updated: false,
  });

  useEffect(() => {
    const columnId =
      ordering === "status"
        ? "status"
        : ordering === "due-date"
          ? "dueDate"
          : ordering === "updated"
            ? "updated"
            : "priority";

    setSorting([{ id: columnId, desc: orderDirection === "desc" }]);
  }, [orderDirection, ordering]);

  useEffect(() => {
    if (showSubIssues) return;
    setExpandedTaskIds({});
  }, [showSubIssues]);

  useEffect(() => {
    setPagination((current) => (current.pageIndex === 0 ? current : { ...current, pageIndex: 0 }));
  }, [activeTab, filters, showCompleted, tasks]);

  const handleTaskCompletionChange = useCallback((taskId: string, completed: boolean) => {
    setTasks((current) =>
      current.map((task) => {
        if (task.id !== taskId || task.status === "Cancelled") {
          return task;
        }

        if (completed) {
          return {
            ...task,
            status: "Done",
            statusOrder: TASK_STATUS_ORDER.indexOf("Done"),
            updatedAt: DEMO_UPDATED_AT,
            updatedLabel: "Just now",
          };
        }

        return {
          ...task,
          status: "Todo",
          statusOrder: TASK_STATUS_ORDER.indexOf("Todo"),
          updatedAt: DEMO_UPDATED_AT,
          updatedLabel: "Just now",
        };
      }),
    );
  }, []);

  const handleTaskAction = useCallback((action: TaskAction, task: ITask) => {
    if (action === "open") {
      showTaskToast({
        tone: "neutral",
        title: "Open task",
        description: "Connect this action to your task route or detail drawer.",
        primaryLabel: "Dismiss",
      });
      return;
    }

    if (action === "side-panel") {
      showTaskToast({
        tone: "neutral",
        title: "Open side panel",
        description: "Wire this action to your inline review panel or drawer.",
        primaryLabel: "Dismiss",
      });
      return;
    }

    if (action === "review") {
      showTaskToast({
        tone: "success",
        title: "Move to review",
        description: `${task.title} is ready for the next review step.`,
        primaryLabel: "Looks good",
      });
      return;
    }

    showTaskToast({
      tone: "neutral",
      title: "Archive task",
      description: "Use an alert dialog before wiring destructive archive behavior.",
      primaryLabel: "Dismiss",
    });
  }, []);

  const handleSubIssueCompletionChange = useCallback(
    (taskId: string, subIssueId: string, completed: boolean) => {
      setTasks((current) =>
        current.map((task) => {
          if (task.id !== taskId || !task.subIssues?.length) return task;

          const nextSubIssues: ISubIssue[] = task.subIssues.map((subIssue) => {
            if (subIssue.id !== subIssueId || subIssue.status === "Cancelled") {
              return subIssue;
            }

            return {
              ...subIssue,
              status: completed ? "Done" : "Todo",
            };
          });

          const nextCompletedCount = nextSubIssues.filter(
            (subIssue) => subIssue.status === "Done",
          ).length;

          return {
            ...task,
            subIssues: nextSubIssues,
            subtasksCompleted: nextCompletedCount,
            updatedAt: DEMO_UPDATED_AT,
            updatedLabel: "Just now",
          };
        }),
      );
    },
    [],
  );

  const handleSubIssueAction = useCallback(
    (action: TaskAction, task: ITask, subIssue: ISubIssue) => {
      if (action === "open") {
        showTaskToast({
          tone: "neutral",
          title: "Open sub-task",
          description: `Wire ${subIssue.title} to its nested detail route or drawer.`,
          primaryLabel: "Dismiss",
        });
        return;
      }

      if (action === "side-panel") {
        showTaskToast({
          tone: "neutral",
          title: "Open side panel",
          description: `Connect ${subIssue.title} to your inline review drawer inside ${task.title}.`,
          primaryLabel: "Dismiss",
        });
        return;
      }

      if (action === "review") {
        showTaskToast({
          tone: "success",
          title: "Move sub-task to review",
          description: `${subIssue.title} is ready for the next review step.`,
          primaryLabel: "Done",
        });
        return;
      }

      showTaskToast({
        tone: "neutral",
        title: "Archive sub-task",
        description:
          "Use an alert dialog before wiring destructive archive behavior for nested work items.",
        primaryLabel: "Dismiss",
      });
    },
    [],
  );

  const handleToggleTaskExpanded = useCallback((taskId: string) => {
    setExpandedTaskIds((current) => {
      if (!current[taskId]) {
        return { ...current, [taskId]: true };
      }

      const nextExpandedTaskIds = { ...current };
      delete nextExpandedTaskIds[taskId];

      return nextExpandedTaskIds;
    });
  }, []);

  const columnVisibility = useMemo<ColumnVisibilityState>(
    () => ({
      status: visibleProperties.status,
      assignee: visibleProperties.assignee,
      priority: visibleProperties.priority,
      project: visibleProperties.project,
      dueDate: visibleProperties.dueDate,
      estimate: visibleProperties.estimate,
      updated: visibleProperties.updated,
    }),
    [visibleProperties],
  );

  const assigneeOptions = useMemo(
    () => [
      ...ASSIGNEES.map((person) => ({
        value: person.name,
        label: person.name,
      })),
      {
        value: "Unassigned",
        label: "Unassigned",
      },
    ],
    [],
  );

  const projectOptions = useMemo(() => {
    return [...new Set(tasks.map((task) => task.project))]
      .sort()
      .map((project) => ({ value: project, label: project }));
  }, [tasks]);

  const filterFields = useMemo<FilterField[]>(
    () => [
      {
        id: "title",
        label: "Task",
        type: "text",
        placeholder: "Search tasks...",
      },
      {
        id: "assignee",
        label: "Assignee",
        type: "select",
        searchable: true,
        options: assigneeOptions,
        renderValue: ({ values, options }) => {
          const state = renderSelectedCount(values);
          if (state) return state;

          const option = options.find((item) => item.value === values[0]);
          if (!option) return String(values[0]);

          return option.label;
        },
      },
      {
        id: "project",
        label: "Project",
        type: "select",
        searchable: true,
        options: projectOptions,
        renderValue: ({ values }) => {
          const state = renderSelectedCount(values);
          if (state) return state;

          return <ProjectBadge project={String(values[0])} />;
        },
      },
      {
        id: "status",
        label: "Status",
        type: "select",
        searchable: false,
        options: TASK_STATUS_ORDER.map((status) => ({
          value: status,
          label: status,
        })),
        renderValue: ({ values }) => {
          const state = renderSelectedCount(values);
          if (state) return state;

          return <StatusBadge status={values[0] as TaskStatus} />;
        },
      },
      {
        id: "priority",
        label: "Priority",
        type: "select",
        searchable: false,
        options: TASK_PRIORITY_ORDER.map((priority) => ({
          value: priority,
          label: priority,
        })),
        renderValue: ({ values }) => {
          const state = renderSelectedCount(values);
          if (state) return state;

          return <PriorityBadge priority={values[0] as TaskPriority} />;
        },
      },
    ],
    [assigneeOptions, projectOptions],
  );

  const activeFilters = useMemo(() => getActiveFilters(filters), [filters]);
  const hasVisibleFilters = useMemo(() => hasVisibleFilterControls(filters), [filters]);

  const filteredTasks = useMemo(() => applyFiltersToData(tasks, filters), [tasks, filters]);

  const visibleTasks = useMemo(() => {
    return filteredTasks.filter((task) => {
      const matchesTab =
        activeTab === "all"
          ? true
          : activeTab === "active"
            ? ACTIVE_STATUSES.includes(task.status)
            : task.status === "Backlog";

      if (!matchesTab) return false;

      if (!showCompleted && COMPLETED_STATUSES.includes(task.status)) {
        return false;
      }

      return true;
    });
  }, [activeTab, filteredTasks, showCompleted]);

  const completedTaskCount = useMemo(
    () => filteredTasks.filter((task) => COMPLETED_STATUSES.includes(task.status)).length,
    [filteredTasks],
  );

  const hiddenCompletedCount = !showCompleted && activeTab === "all" ? completedTaskCount : 0;

  const emptyMessage = useMemo(() => {
    if (visibleTasks.length > 0) return undefined;

    if (hiddenCompletedCount > 0) {
      return `All remaining tasks are completed. Turn on Include completed tasks to show ${hiddenCompletedCount} hidden ${hiddenCompletedCount === 1 ? "task" : "tasks"}.`;
    }

    return "No tasks match this workspace view. Clear filters or switch tabs.";
  }, [hiddenCompletedCount, visibleTasks.length]);

  const settingsProperties = useMemo(() => DISPLAY_PROPERTIES, []);

  const columns = useMemo(
    () =>
      createTaskColumns({
        onCompletionChange: handleTaskCompletionChange,
        onAction: handleTaskAction,
        onSubIssueCompletionChange: handleSubIssueCompletionChange,
        onSubIssueAction: handleSubIssueAction,
        showSubIssues,
        expandedTaskIds,
        onToggleTaskExpanded: handleToggleTaskExpanded,
      }),
    [
      expandedTaskIds,
      handleSubIssueAction,
      handleSubIssueCompletionChange,
      handleTaskAction,
      handleTaskCompletionChange,
      handleToggleTaskExpanded,
      showSubIssues,
    ],
  );

  const handleSortingChange = useCallback((nextSorting: SortingState) => {
    setSorting(nextSorting);

    const primarySort = nextSorting[0];
    if (!primarySort) return;

    if (primarySort.id === "priority") {
      setOrdering("priority");
      setOrderDirection(primarySort.desc ? "desc" : "asc");
      return;
    }

    if (primarySort.id === "status") {
      setOrdering("status");
      setOrderDirection(primarySort.desc ? "desc" : "asc");
      return;
    }

    if (primarySort.id === "dueDate") {
      setOrdering("due-date");
      setOrderDirection(primarySort.desc ? "desc" : "asc");
      return;
    }

    if (primarySort.id === "updated") {
      setOrdering("updated");
      setOrderDirection(primarySort.desc ? "desc" : "asc");
      return;
    }

    setOrdering("priority");
    setOrderDirection("desc");
  }, []);

  const sortedTasks = useMemo(
    () =>
      [...visibleTasks].sort((taskA, taskB) =>
        compareTasksBySorting(taskA, taskB, sorting, orderCompletedByRecency),
      ),
    [orderCompletedByRecency, sorting, visibleTasks],
  );

  const pagedTasks = useMemo(() => {
    const startIndex = pagination.pageIndex * pagination.pageSize;
    return sortedTasks.slice(startIndex, startIndex + pagination.pageSize);
  }, [pagination.pageIndex, pagination.pageSize, sortedTasks]);

  const pagedParentTaskRows = useMemo(
    () => buildTaskRows(pagedTasks, showSubIssues),
    [pagedTasks, showSubIssues],
  );

  const pagedTaskRows = useMemo(
    () => buildTaskRows(pagedTasks, showSubIssues, expandedTaskIds),
    [expandedTaskIds, pagedTasks, showSubIssues],
  );

  useEffect(() => {
    if (!showSubIssues) {
      setExpandedTaskIds({});
      return;
    }

    setExpandedTaskIds((current) =>
      Object.keys(current).length > 0 ? current : getDefaultExpandedTaskIds(pagedParentTaskRows),
    );
  }, [pagedParentTaskRows, showSubIssues]);

  const table = useTable({
    features: dataGridFeatures,
    columns,
    data: pagedTaskRows,
    pageCount: Math.ceil(sortedTasks.length / pagination.pageSize),
    getRowId: (row) => row.id,
    state: {
      pagination,
      sorting,
      columnVisibility,
    },
    onPaginationChange: setPagination,
    onSortingChange: (updater) => {
      const nextSorting = typeof updater === "function" ? updater(sorting) : updater;
      handleSortingChange(nextSorting);
    },
    manualSorting: true,
    manualPagination: true,
  });

  function toggleProperty(property: TaskProperty) {
    setVisibleProperties((current) => ({
      ...current,
      [property]: !current[property],
    }));
  }

  function handleSaveView() {
    const filtersLabel =
      activeFilters.length > 0
        ? `Saved ${activeFilters.length} active ${
            activeFilters.length === 1 ? "filter" : "filters"
          }, visible columns, ${ordering} ${orderDirection} sorting, ${tableDensity} density, completed work ${showCompleted ? "included" : "hidden"}, and sub-tasks ${showSubIssues ? "enabled" : "collapsed"} in this task queue.`
        : `Saved the default task queue with the current visible columns, ${ordering} ${orderDirection} sorting, ${tableDensity} density, completed work ${showCompleted ? "included" : "hidden"}, and sub-tasks ${showSubIssues ? "enabled" : "collapsed"}.`;

    showTaskToast({
      tone: "success",
      title: "Task view saved",
      description: filtersLabel,
      primaryLabel: "Done",
    });
  }

  return (
    <DataGrid
      table={table}
      recordCount={visibleTasks.length}
      emptyMessage={emptyMessage}
      tableLayout={{
        columnsResizable,
        columnsMovable,
        headerSticky: true,
        dense: tableDensity === "compact",
      }}
    >
      <Frame dense variant="default" spacing="sm" className="w-full">
        <FrameHeader className="flex-row items-center justify-between gap-3">
          <div className="flex flex-col gap-px">
            <FrameTitle className="text-balance">Task Delivery</FrameTitle>
            <FrameDescription className="text-xs text-pretty">
              {visibleTasks.length} task
              {visibleTasks.length === 1 ? "" : "s"}
              {hiddenCompletedCount > 0 ? ` / ${hiddenCompletedCount} hidden` : ""}
              {showSubIssues ? " / Sub-tasks on" : ""}
            </FrameDescription>
          </div>
          <Button
            type="button"
            onClick={() =>
              showTaskToast({
                tone: "neutral",
                title: "New task",
                description:
                  "Connect this button to your task creation flow, template picker, or issue composer.",
                primaryLabel: "Dismiss",
              })
            }
          >
            <PlusIcon className="size-4" aria-hidden="true" />
            New task
          </Button>
        </FrameHeader>

        <FramePanel className="p-0 shadow-none!">
          {/* Tabs */}
          <div className="px-(--frame-panel-header-px) pt-(--frame-panel-header-py)">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TaskTab)}>
              <TabsList variant="line" className="gap-5">
                {TASK_TABS.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="gap-2 px-0 pt-0 pb-(--frame-panel-header-py) text-sm"
                  >
                    <span>{tab.label}</span>
                    <span className="inline-flex min-w-5 items-center justify-center rounded-md bg-muted px-1.5 py-0.5 text-xs text-muted-foreground tabular-nums">
                      {getTaskTabCount(filteredTasks, tab.value, showCompleted)}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <Separator />

          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-(--frame-panel-header-px) py-2.5">
            <Filters
              query={filterQuery}
              fields={filterFields}
              onQueryChange={setFilterQuery}
              trigger={
                <Button type="button" variant="outline" aria-label="Filters">
                  <FilterIcon className="size-4" aria-hidden />
                  Filters
                </Button>
              }
            />

            <div className="flex items-center justify-end gap-2">
              {hasVisibleFilters ? (
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setFilterQuery(createDefaultTaskFilters())}
                  >
                    <FunnelXIcon className="size-4" aria-hidden="true" />
                    Clear
                  </Button>
                  {activeFilters.length > 0 ? (
                    <Button type="button" variant="outline" onClick={handleSaveView}>
                      <SaveIcon className="size-4" aria-hidden="true" />
                      Save view
                    </Button>
                  ) : null}
                </>
              ) : null}
              <Popover>
                <PopoverTrigger
                  render={
                    <Button type="button" variant="outline">
                      <Settings2Icon className="size-4" aria-hidden="true" />
                      Settings
                    </Button>
                  }
                />
                <PopoverContent align="end" className="w-[320px] p-0">
                  <FieldGroup className="gap-3 px-3.5 py-3">
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground">Queue</div>
                      <div className="space-y-0">
                        <Field
                          orientation="horizontal"
                          className="min-h-9 items-center justify-between gap-3"
                        >
                          <FieldLabel className="text-sm font-normal">Ordering</FieldLabel>
                          <Select
                            value={ordering}
                            onValueChange={(value) => setOrdering(value as TaskOrdering)}
                            items={ORDERING_OPTIONS}
                          >
                            <SelectTrigger size="sm" className="w-[132px] shrink-0">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent align="end">
                              <SelectGroup>
                                {ORDERING_OPTIONS.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </Field>

                        <Field
                          orientation="horizontal"
                          className="min-h-9 items-center justify-between gap-3"
                        >
                          <FieldLabel className="text-sm font-normal">Direction</FieldLabel>
                          <ToggleGroup
                            multiple={false}
                            value={[orderDirection]}
                            onValueChange={(value) => {
                              const nextValue = value[0];

                              if (nextValue) {
                                setOrderDirection(nextValue as OrderDirection);
                              }
                            }}
                            variant="outline"
                            size="sm"
                            className="ml-auto w-[132px] shrink-0 justify-end"
                          >
                            {ORDER_DIRECTION_OPTIONS.map((option) => (
                              <ToggleGroupItem key={option.value} value={option.value}>
                                {option.label}
                              </ToggleGroupItem>
                            ))}
                          </ToggleGroup>
                        </Field>

                        <Field
                          orientation="horizontal"
                          className="min-h-9 items-center justify-between gap-3"
                        >
                          <FieldLabel className="text-sm font-normal">Include completed</FieldLabel>
                          <Switch
                            size="sm"
                            checked={showCompleted}
                            onCheckedChange={setShowCompleted}
                          />
                        </Field>

                        <Field
                          orientation="horizontal"
                          className="min-h-9 items-center justify-between gap-3"
                          data-disabled={!showCompleted || undefined}
                        >
                          <FieldLabel className="text-sm font-normal">Done by recency</FieldLabel>
                          <Switch
                            size="sm"
                            checked={orderCompletedByRecency}
                            disabled={!showCompleted}
                            onCheckedChange={setOrderCompletedByRecency}
                          />
                        </Field>

                        <Field
                          orientation="horizontal"
                          className="min-h-9 items-center justify-between gap-3"
                        >
                          <FieldLabel className="text-sm font-normal">Show sub-tasks</FieldLabel>
                          <Switch
                            size="sm"
                            checked={showSubIssues}
                            onCheckedChange={setShowSubIssues}
                          />
                        </Field>
                      </div>
                    </div>

                    <FieldSeparator className="-mx-3.5" />

                    <div className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground">Table</div>
                      <div className="space-y-0">
                        <Field
                          orientation="horizontal"
                          className="min-h-9 items-center justify-between gap-3"
                        >
                          <FieldLabel className="text-sm font-normal">Density</FieldLabel>
                          <Select
                            value={tableDensity}
                            onValueChange={(value) => setTableDensity(value as TableDensity)}
                            items={TABLE_DENSITY_OPTIONS}
                          >
                            <SelectTrigger size="sm" className="w-[132px] shrink-0">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent align="end">
                              <SelectGroup>
                                {TABLE_DENSITY_OPTIONS.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </Field>

                        <Field
                          orientation="horizontal"
                          className="min-h-9 items-center justify-between gap-3"
                        >
                          <FieldLabel className="text-sm font-normal">Resizable columns</FieldLabel>
                          <Switch
                            size="sm"
                            checked={columnsResizable}
                            onCheckedChange={setColumnsResizable}
                          />
                        </Field>

                        <Field
                          orientation="horizontal"
                          className="min-h-9 items-center justify-between gap-3"
                        >
                          <FieldLabel className="text-sm font-normal">Movable columns</FieldLabel>
                          <Switch
                            size="sm"
                            checked={columnsMovable}
                            onCheckedChange={setColumnsMovable}
                          />
                        </Field>
                      </div>
                    </div>

                    <FieldSeparator className="-mx-3.5" />

                    <div className="space-y-2.5">
                      <div className="text-xs font-medium text-muted-foreground">
                        Display properties
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {settingsProperties.map((property) => {
                          const active = visibleProperties[property.key];

                          return (
                            <Button
                              key={property.key}
                              type="button"
                              size="xs"
                              variant={active ? "secondary" : "outline"}
                              className={cn("rounded-full", active && "border-foreground/10")}
                              onClick={() => toggleProperty(property.key)}
                            >
                              {active ? <CheckIcon aria-hidden="true" /> : null}
                              {property.label}
                            </Button>
                          );
                        })}
                      </div>

                      {!showCompleted && hiddenCompletedCount > 0 ? (
                        <p className="pt-0.5 text-xs text-muted-foreground">
                          {hiddenCompletedCount} completed{" "}
                          {hiddenCompletedCount === 1 ? "task is" : "tasks are"} currently hidden
                          from All tasks.
                        </p>
                      ) : null}
                    </div>
                  </FieldGroup>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Separator />

          <DataGridScrollArea>
            <DataGridTable />
          </DataGridScrollArea>

          <Separator />

          <FrameFooter>
            <DataGridPagination />
          </FrameFooter>
        </FramePanel>
      </Frame>
    </DataGrid>
  );
}
