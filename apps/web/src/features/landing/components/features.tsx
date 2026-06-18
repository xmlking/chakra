import { Card, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/shadcn/card";
import {
  GaugeIcon,
  GitBranchIcon,
  LayersIcon,
  LockIcon,
  SparklesIcon,
  UsersIcon,
} from "lucide-react";

const features = [
  {
    icon: LayersIcon,
    title: "Unified workspace",
    description: "Roadmaps, docs, and tasks live side by side so nothing falls through the cracks.",
  },
  {
    icon: SparklesIcon,
    title: "AI that does the busywork",
    description: "Auto-summarize threads, draft specs, and triage issues with built-in AI.",
  },
  {
    icon: GitBranchIcon,
    title: "Built for engineers",
    description: "Native Git, PR, and deploy integrations keep work in sync automatically.",
  },
  {
    icon: UsersIcon,
    title: "Realtime collaboration",
    description: "See changes the moment they happen with multiplayer cursors and presence.",
  },
  {
    icon: GaugeIcon,
    title: "Insightful analytics",
    description: "Track velocity, cycle time, and shipping health from a single dashboard.",
  },
  {
    icon: LockIcon,
    title: "Enterprise-grade security",
    description: "SOC 2 Type II, SSO, and granular permissions baked in from day one.",
  },
];

export function Features() {
  return (
    <section id="features" className="border-b border-border/60">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Everything your team needs to ship
          </h2>
          <p className="mt-4 leading-relaxed text-pretty text-muted-foreground">
            Replace a dozen disconnected tools with one fast, focused workspace designed for modern
            product teams.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <span className="flex size-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                  <feature.icon className="size-5" />
                </span>
                <CardTitle className="mt-3">{feature.title}</CardTitle>
                <CardDescription className="leading-relaxed">{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
