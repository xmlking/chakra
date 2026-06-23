import { Avatar, AvatarFallback } from "@workspace/ui/components/shadcn/avatar";
import { Badge } from "@workspace/ui/components/shadcn/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@workspace/ui/components/shadcn/card";
import {
  ArrowUpRightIcon,
  ArrowDownRightIcon,
  DollarSignIcon,
  UsersIcon,
  ActivityIcon,
  FolderKanbanIcon,
} from "lucide-react";

const stats = [
  {
    label: "Total revenue",
    value: "$48,250",
    change: "+12.5%",
    trend: "up" as const,
    icon: DollarSignIcon,
  },
  {
    label: "Active users",
    value: "2,340",
    change: "+8.2%",
    trend: "up" as const,
    icon: UsersIcon,
  },
  {
    label: "Active projects",
    value: "36",
    change: "+4",
    trend: "up" as const,
    icon: FolderKanbanIcon,
  },
  {
    label: "Churn rate",
    value: "1.8%",
    change: "-0.4%",
    trend: "down" as const,
    icon: ActivityIcon,
  },
];

const activity = [
  {
    name: "Maya Patel",
    initials: "MP",
    action: "merged pull request #482 in",
    target: "web-platform",
    time: "2m ago",
  },
  {
    name: "Leo Tanaka",
    initials: "LT",
    action: "created a new project",
    target: "Mobile redesign",
    time: "1h ago",
  },
  {
    name: "Ana Rossi",
    initials: "AR",
    action: "closed 3 issues in",
    target: "billing-service",
    time: "3h ago",
  },
  {
    name: "Sam Cohen",
    initials: "SC",
    action: "invited 2 members to",
    target: "Design team",
    time: "5h ago",
  },
];

export function DashboardContent() {
  return (
    <div className="container-wrapper">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back, Jordan. Here&apos;s what&apos;s happening across your workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader>
                <CardDescription className="flex items-center justify-between">
                  {stat.label}
                  <span className="flex size-8 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                    <stat.icon className="size-4" />
                  </span>
                </CardDescription>
                <CardTitle className="text-2xl">{stat.value}</CardTitle>
              </CardHeader>
              <CardFooter>
                <Badge variant="secondary" className="gap-1">
                  {stat.trend === "up" ? (
                    <ArrowUpRightIcon className="size-3" />
                  ) : (
                    <ArrowDownRightIcon className="size-3" />
                  )}
                  {stat.change}
                </Badge>
                <span className="ml-2 text-xs text-muted-foreground">vs last month</span>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent activity</CardTitle>
              <CardDescription>Latest updates from across your team.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              {activity.map((item, i) => (
                // oxlint-disable-next-line react-doctor/no-array-index-as-key
                <div key={i} className="flex items-center gap-3">
                  <Avatar className="size-9">
                    <AvatarFallback>{item.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-sm leading-relaxed">
                    <span className="font-medium">{item.name}</span>{" "}
                    <span className="text-muted-foreground">{item.action}</span>{" "}
                    <span className="font-medium">{item.target}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project health</CardTitle>
              <CardDescription>This quarter&apos;s progress.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              {[
                { label: "On track", value: 68, tone: "bg-primary" },
                { label: "At risk", value: 22, tone: "bg-muted-foreground" },
                { label: "Blocked", value: 10, tone: "bg-destructive" },
              ].map((row) => (
                <div key={row.label} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{row.label}</span>
                    <span className="text-muted-foreground">{row.value}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className={`h-full rounded-full ${row.tone}`}
                      style={{ width: `${row.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
