import { Link } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/shadcn/button";
import { ArrowRightIcon } from "lucide-react";

const stats = [
  { value: "12k+", label: "Teams shipping daily" },
  { value: "40%", label: "Faster cycle time" },
  { value: "99.99%", label: "Uptime SLA" },
  { value: "4.9/5", label: "Average rating" },
];

export function CtaSection() {
  return (
    <section className="border-b border-border/60">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid grid-cols-2 gap-6 border-b border-border/60 pb-16 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-semibold tracking-tight sm:text-4xl">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center gap-6 rounded-2xl bg-primary px-6 py-14 text-center text-primary-foreground">
          <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Ready to ship faster?
          </h2>
          <p className="max-w-md leading-relaxed text-pretty text-primary-foreground/80">
            Join thousands of teams already building their best work on Acme.
          </p>
          <Button size="lg" variant="secondary" render={<Link to="/dashboard" />}>
            Open the dashboard
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </div>
      </div>
    </section>
  );
}
