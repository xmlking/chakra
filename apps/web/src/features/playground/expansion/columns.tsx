import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@workspace/ui/components/reui/badge";
import { type DataGridFeatures } from "@workspace/ui/components/reui/data-grid/data-grid";
import { DataGridColumnHeader } from "@workspace/ui/components/reui/data-grid/data-grid-column-header";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/shadcn/avatar";
import { Button } from "@workspace/ui/components/shadcn/button";
import { Checkbox } from "@workspace/ui/components/shadcn/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/shadcn/dropdown-menu";
import { Field } from "@workspace/ui/components/shadcn/field";
import { cn } from "@workspace/ui/lib/utils";
import {
  MoreHorizontalIcon,
  EyeIcon,
  Columns2Icon,
  FlagIcon,
  ArchiveIcon,
  ChevronRightIcon,
  ArrowRightIcon,
  CalendarDaysIcon,
} from "lucide-react";
import { memo, type ComponentProps } from "react";

import {
  type IAssignee,
  type ISubIssue,
  type ISubIssueRow,
  type ITask,
  type TaskPriority,
  type TaskStatus,
  type TaskTableRow,
} from "./data";

export const statusToneClass: Record<TaskStatus, string> = {
  Backlog: "bg-zinc-400",
  Todo: "bg-sky-500",
  "In Progress": "bg-amber-500",
  Review: "bg-violet-500",
  Done: "bg-emerald-500",
  Cancelled: "bg-rose-500",
};

const priorityBadgeVariant: Record<TaskPriority, ComponentProps<typeof Badge>["variant"]> = {
  Urgent: "destructive-light",
  High: "warning-light",
  Medium: "info-light",
  Low: "success-light",
};

export type TaskAction = "open" | "side-panel" | "review" | "archive";

function isSubIssueRow(row: TaskTableRow): row is ISubIssueRow {
  return row.kind === "subIssue";
}

export const StatusBadge = memo(function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <Badge variant="outline" className="gap-1.5">
      <span
        className={cn("size-1.5 shrink-0 rounded-full", statusToneClass[status])}
        aria-hidden="true"
      />
      {status}
    </Badge>
  );
});

export const PriorityBadge = memo(function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return <Badge variant={priorityBadgeVariant[priority]}>{priority}</Badge>;
});

export const ProjectBadge = memo(function ProjectBadge({ project }: { project: string }) {
  return <Badge variant="outline">{project}</Badge>;
});

export const AssigneeAvatar = memo(function AssigneeAvatar({
  assignee,
  size = "sm",
  className,
}: {
  assignee: IAssignee | null;
  size?: "sm" | "default";
  className?: string;
}) {
  if (!assignee) {
    return (
      <Avatar size={size} className={cn("size-5", className)}>
        <AvatarFallback className="bg-muted text-muted-foreground">--</AvatarFallback>
      </Avatar>
    );
  }

  return (
    <Avatar size={size} className={cn("size-5", className)}>
      {assignee.avatar ? <AvatarImage src={assignee.avatar} alt={assignee.name} /> : null}
      <AvatarFallback className={assignee.tone}>{assignee.initials}</AvatarFallback>
    </Avatar>
  );
});

function SubIssueActionsCell({
  task,
  subIssue,
  onAction,
}: {
  task: ITask;
  subIssue: ISubIssue;
  onAction: (action: TaskAction, task: ITask, subIssue: ISubIssue) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button size="icon-sm" variant="ghost" aria-label={`Actions for ${subIssue.title}`} />
        }
      >
        <MoreHorizontalIcon aria-hidden="true" />
      </DropdownMenuTrigger>
      {/* Content */}
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => onAction("open", task, subIssue)}>
            <EyeIcon className="size-4" aria-hidden="true" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAction("side-panel", task, subIssue)}>
            <Columns2Icon className="size-4" aria-hidden="true" />
            Panel
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAction("review", task, subIssue)}>
            <FlagIcon className="size-4" aria-hidden="true" />
            Review
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onAction("archive", task, subIssue)}>
            <ArchiveIcon className="size-4" aria-hidden="true" />
            Archive
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function TaskSubIssueSlot({
  task,
  showSubIssues,
  canExpand,
  isExpanded,
  onToggleExpand,
}: {
  task: ITask;
  showSubIssues: boolean;
  canExpand: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
}) {
  if (!showSubIssues) return null;

  if (canExpand) {
    return (
      <Button
        type="button"
        size="icon-sm"
        variant="ghost"
        aria-label={`${isExpanded ? "Hide" : "Show"} ${task.subtasksTotal} sub-tasks for ${task.title}`}
        className="size-6 shrink-0 rounded-md p-0 text-muted-foreground shadow-none hover:text-foreground"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onToggleExpand();
        }}
      >
        <ChevronRightIcon
          className={cn(
            "size-3.5 shrink-0 transition-transform duration-150",
            isExpanded && "rotate-90",
          )}
          aria-hidden="true"
        />
      </Button>
    );
  }

  return <div className="size-6 shrink-0" aria-hidden="true" />;
}

function TaskTitleAffordance({
  title,
  completed,
  muted,
  dataSlot,
}: {
  title: string;
  completed: boolean;
  muted: boolean;
  dataSlot: string;
}) {
  return (
    <div className="flex min-w-0 items-center text-sm leading-5 font-medium text-foreground transition-colors">
      <span className="group/task-title inline-flex min-w-0 items-center gap-1 truncate">
        <span
          data-slot={dataSlot}
          className={cn(
            "max-w-full cursor-pointer truncate py-0.25 text-foreground transition-colors hover:text-primary",
            (completed || muted) && "text-muted-foreground",
            completed && "line-through decoration-current/55 decoration-1",
          )}
        >
          {title}
        </span>
        <ArrowRightIcon
          className="size-3 shrink-0 -translate-x-1 opacity-0 transition-all group-hover/task-title:translate-x-0 group-hover/task-title:opacity-100"
          aria-hidden="true"
        />
      </span>
    </div>
  );
}

function ParentTaskTitleCell({
  task,
  showSubIssues,
  canExpand,
  isExpanded,
  onToggleExpand,
  onCompletionChange,
}: {
  task: ITask;
  showSubIssues: boolean;
  canExpand: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onCompletionChange: (taskId: string, checked: boolean) => void;
}) {
  const completionId = `task-complete-${task.id}`;
  const isCompleted = task.status === "Done";

  return (
    <div className="flex min-w-0 items-start gap-2">
      <TaskSubIssueSlot
        task={task}
        showSubIssues={showSubIssues}
        canExpand={canExpand}
        isExpanded={isExpanded}
        onToggleExpand={onToggleExpand}
      />
      <Field orientation="horizontal" className="relative min-w-0 flex-1 items-start gap-2">
        <Checkbox
          id={completionId}
          className="mt-0.5 rounded-full"
          checked={isCompleted}
          disabled={task.status === "Cancelled"}
          onCheckedChange={(checked) => onCompletionChange(task.id, checked === true)}
          aria-label={
            isCompleted ? `Mark ${task.title} as incomplete` : `Mark ${task.title} complete`
          }
        />
        <div className="min-w-0 flex-1">
          <TaskTitleAffordance
            title={task.title}
            completed={isCompleted}
            muted={task.status === "Cancelled"}
            dataSlot="task-title"
          />
        </div>
      </Field>
    </div>
  );
}

function SubTaskTitleCell({
  task,
  subIssue,
  onSubIssueCompletionChange,
}: {
  task: ITask;
  subIssue: ISubIssue;
  onSubIssueCompletionChange: (taskId: string, subIssueId: string, completed: boolean) => void;
}) {
  const completionId = `sub-task-complete-${task.id}-${subIssue.id}`;
  const isCompleted = subIssue.status === "Done";

  return (
    <div className="flex min-w-0 items-start gap-2 pl-12">
      <Field orientation="horizontal" className="relative min-w-0 flex-1 items-start gap-2">
        <Checkbox
          id={completionId}
          className="mt-0.5 rounded-full"
          checked={isCompleted}
          disabled={subIssue.status === "Cancelled"}
          onCheckedChange={(checked) =>
            onSubIssueCompletionChange(task.id, subIssue.id, checked === true)
          }
          aria-label={
            isCompleted ? `Mark ${subIssue.title} as incomplete` : `Mark ${subIssue.title} complete`
          }
        />
        <div className="min-w-0 flex-1">
          <TaskTitleAffordance
            title={subIssue.title}
            completed={isCompleted}
            muted={subIssue.status === "Cancelled"}
            dataSlot="sub-task-title"
          />
        </div>
      </Field>
    </div>
  );
}

function TaskTitleCell({
  row,
  showSubIssues,
  canExpand,
  isExpanded,
  onToggleExpand,
  onCompletionChange,
  onSubIssueCompletionChange,
}: {
  row: TaskTableRow;
  showSubIssues: boolean;
  canExpand: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onCompletionChange: (taskId: string, checked: boolean) => void;
  onSubIssueCompletionChange: (taskId: string, subIssueId: string, completed: boolean) => void;
}) {
  if (isSubIssueRow(row)) {
    return (
      <SubTaskTitleCell
        task={row.task}
        subIssue={row.subIssue}
        onSubIssueCompletionChange={onSubIssueCompletionChange}
      />
    );
  }

  return (
    <ParentTaskTitleCell
      task={row.task}
      showSubIssues={showSubIssues}
      canExpand={canExpand}
      isExpanded={isExpanded}
      onToggleExpand={onToggleExpand}
      onCompletionChange={onCompletionChange}
    />
  );
}

function DueDateCell({ label, muted = false }: { label: string; muted?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-sm text-foreground",
        muted && "text-muted-foreground",
      )}
    >
      <CalendarDaysIcon className="size-4 text-muted-foreground" aria-hidden="true" />
      {label}
    </div>
  );
}

const ReadonlyAssigneeCell = memo(function ReadonlyAssigneeCell({
  assignee,
}: {
  assignee: IAssignee | null;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <AssigneeAvatar assignee={assignee} className="size-5" />
      <div className="truncate text-sm text-foreground">{assignee?.name ?? "Unassigned"}</div>
    </div>
  );
});

function TaskActionsCell({
  task,
  onAction,
}: {
  task: ITask;
  onAction: (action: TaskAction, task: ITask) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button size="icon-sm" variant="ghost" aria-label="Task actions" />}
      >
        <MoreHorizontalIcon aria-hidden="true" />
      </DropdownMenuTrigger>
      {/* Content */}
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => onAction("open", task)}>
            <EyeIcon className="size-4" aria-hidden="true" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAction("side-panel", task)}>
            <Columns2Icon className="size-4" aria-hidden="true" />
            Panel
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAction("review", task)}>
            <FlagIcon className="size-4" aria-hidden="true" />
            Review
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onAction("archive", task)}>
            <ArchiveIcon className="size-4" aria-hidden="true" />
            Archive
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function createTaskColumns({
  onCompletionChange,
  onAction,
  onSubIssueCompletionChange,
  onSubIssueAction,
  showSubIssues,
  expandedTaskIds,
  onToggleTaskExpanded,
}: {
  onCompletionChange: (taskId: string, checked: boolean) => void;
  onAction: (action: TaskAction, task: ITask) => void;
  onSubIssueCompletionChange: (taskId: string, subIssueId: string, completed: boolean) => void;
  onSubIssueAction: (action: TaskAction, task: ITask, subIssue: ISubIssue) => void;
  showSubIssues: boolean;
  expandedTaskIds: Record<string, boolean>;
  onToggleTaskExpanded: (taskId: string) => void;
}): ColumnDef<DataGridFeatures, TaskTableRow>[] {
  return [
    {
      accessorFn: (row) => (isSubIssueRow(row) ? row.subIssue.title : row.task.title),
      id: "title",
      header: ({ column }) => <DataGridColumnHeader title="Task" column={column} />,
      cell: ({ row }) => {
        const taskRow = isSubIssueRow(row.original) ? null : row.original;
        const canExpand = Boolean(taskRow?.subRows?.length);

        return (
          <TaskTitleCell
            row={row.original}
            showSubIssues={showSubIssues}
            canExpand={canExpand}
            isExpanded={Boolean(taskRow ? expandedTaskIds[taskRow.id] : false)}
            onToggleExpand={() => {
              if (taskRow) {
                onToggleTaskExpanded(taskRow.id);
              }
            }}
            onCompletionChange={onCompletionChange}
            onSubIssueCompletionChange={onSubIssueCompletionChange}
          />
        );
      },
      enableHiding: false,
      enableSorting: false,
      minSize: 300,
      meta: {
        autoSize: true,
      },
    },
    {
      accessorFn: (row) => (isSubIssueRow(row) ? row.subIssue.status : row.task.statusOrder),
      id: "status",
      header: ({ column }) => <DataGridColumnHeader title="Status" column={column} />,
      cell: ({ row }) => (
        <StatusBadge
          status={
            isSubIssueRow(row.original) ? row.original.subIssue.status : row.original.task.status
          }
        />
      ),
      size: 138,
      enableSorting: true,
    },
    {
      accessorFn: (row) =>
        isSubIssueRow(row)
          ? (row.subIssue.assignee?.name ?? "Unassigned")
          : (row.task.assignee?.name ?? "Unassigned"),
      id: "assignee",
      header: ({ column }) => <DataGridColumnHeader title="Assignee" column={column} />,
      cell: ({ row }) =>
        isSubIssueRow(row.original) ? (
          <ReadonlyAssigneeCell assignee={row.original.subIssue.assignee} />
        ) : (
          <ReadonlyAssigneeCell assignee={row.original.task.assignee} />
        ),
      size: 160,
      enableSorting: false,
    },
    {
      accessorFn: (row) => (isSubIssueRow(row) ? row.subIssue.priority : row.task.priorityValue),
      id: "priority",
      header: ({ column }) => <DataGridColumnHeader title="Priority" column={column} />,
      cell: ({ row }) => (
        <PriorityBadge
          priority={
            isSubIssueRow(row.original)
              ? row.original.subIssue.priority
              : row.original.task.priority
          }
        />
      ),
      size: 122,
    },
    {
      accessorFn: (row) => row.task.project,
      id: "project",
      header: ({ column }) => <DataGridColumnHeader title="Project" column={column} />,
      cell: ({ row }) => <ProjectBadge project={row.original.task.project} />,
      size: 160,
      enableSorting: false,
    },
    {
      accessorFn: (row) => (isSubIssueRow(row) ? row.subIssue.dueAt : row.task.dueAt),
      id: "dueDate",
      header: ({ column }) => <DataGridColumnHeader title="Due date" column={column} />,
      cell: ({ row }) => (
        <DueDateCell
          label={
            isSubIssueRow(row.original)
              ? row.original.subIssue.dueDateLabel
              : row.original.task.dueDateLabel
          }
          muted={isSubIssueRow(row.original)}
        />
      ),
      size: 128,
    },
    {
      accessorFn: (row) => (isSubIssueRow(row) ? undefined : row.task.estimate),
      id: "estimate",
      header: ({ column }) => <DataGridColumnHeader title="Estimate" column={column} />,
      cell: ({ row }) =>
        isSubIssueRow(row.original) ? (
          <span className="text-sm text-muted-foreground">--</span>
        ) : (
          <span className="text-sm font-medium text-foreground tabular-nums">
            {row.original.task.estimate}
          </span>
        ),
      size: 102,
      enableSorting: false,
    },
    {
      accessorFn: (row) => (isSubIssueRow(row) ? undefined : row.task.updatedAt),
      id: "updated",
      header: ({ column }) => <DataGridColumnHeader title="Updated" column={column} />,
      cell: ({ row }) =>
        isSubIssueRow(row.original) ? (
          <span className="text-sm text-muted-foreground">--</span>
        ) : (
          <span className="text-sm text-muted-foreground">{row.original.task.updatedLabel}</span>
        ),
      size: 116,
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) =>
        isSubIssueRow(row.original) ? (
          <SubIssueActionsCell
            task={row.original.task}
            subIssue={row.original.subIssue}
            onAction={onSubIssueAction}
          />
        ) : (
          <TaskActionsCell task={row.original.task} onAction={onAction} />
        ),
      size: 56,
    },
  ];
}
