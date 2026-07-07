import { Link } from "@tanstack/react-router";
import { Badge } from "@workspace/ui/components/shadcn/badge";
import { Button, buttonVariants } from "@workspace/ui/components/shadcn/button";
import { ArrowRightIcon, StarIcon } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-4 py-20 text-center sm:px-6 sm:py-28">
        <Badge variant="secondary" className="gap-1.5">
          <StarIcon className="size-3" />
          New: Realtime collaboration is here
        </Badge>

        <h1 className="max-w-3xl text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-6xl">
          Ship faster with one workspace for your whole team
        </h1>

        <p className="max-w-xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
          Acme brings planning, building, and shipping into a single source of truth — so your
          product team can move from idea to launch without the busywork.
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Link to="/dashboard" className={buttonVariants({ size: "lg" })}>
            Start for free
            <ArrowRightIcon data-icon="inline-end" />
          </Link>
          <Button variant="outline" size="lg">
            Book a demo
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">No credit card required · Free 14-day trial</p>
      </div>
    </section>
  );
}
