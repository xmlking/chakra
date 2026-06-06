import { Badge } from "@workspace/ui/components/shadcn/badge";
import { Button } from "@workspace/ui/components/shadcn/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/shadcn/card";
// oxlint-disable react-doctor/jsx-pascal-case
import { Image } from "fumapress/image";
import { Database, Plug, Zap, Lock, Shuffle, Globe, Star } from "lucide-react";
import { Link } from "waku";

import BannerImage from "./image.png";

// oxlint-disable-next-line import/no-default-export
export default function Page() {
  return (
    <>
      <title>Chakra AI</title>
      <meta
        property="description"
        content="One API to read & write database, for your next library."
      />
      <Hero />
      <Features />
      <CTA />
    </>
  );
}

function Hero() {
  return (
    <section className="mx-auto my-12 flex max-w-7xl flex-col-reverse items-center overflow-hidden rounded-2xl border border-dashed border-primary bg-linear-to-br from-violet-300/10 to-background px-10 text-center shadow-lg lg:flex-row lg:items-start lg:text-start">
      <div className="w-full max-w-2xl pb-24 lg:py-24">
        <Badge
          variant="outline"
          className="mb-4 rounded-full border px-2 py-0.5 text-xs font-medium tracking-normal normal-case shadow-lg"
        >
          <Zap fill="currentColor" className="size-3.5 text-orange-500 dark:text-yellow-300" />
          Agent Harness Engineering Platform
        </Badge>
        <h1 className="text-2xl leading-tight font-semibold tracking-tight sm:text-3xl">
          The AI Agents Incubation Platform
          <br />
          For testing and conversation simulation.
        </h1>
        <p className="mt-4 text-foreground/70">
          Evaluate, score, and optimize your agents with expert guidance on the path to production.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3 max-lg:justify-center">
          <Button
            size="lg"
            className="rounded-full text-sm tracking-normal normal-case"
            nativeButton={false}
            render={<Link to="/docs">Read the Docs</Link>}
          />
          <Button
            size="lg"
            variant="outline"
            className="rounded-full bg-background text-sm tracking-normal normal-case"
            nativeButton={false}
            render={
              <a href="https://github.com/xmlking/astra" target="_blank" rel="noreferrer noopener">
                <Star className="mr-2 size-4 text-amber-300" />
                Star on GitHub
              </a>
            }
          />
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          <span>Simulate Conversations</span>
          <span className="mx-2">•</span>
          <span>Measure Performance</span>
          <span className="mx-2">•</span>
          <span>Track Improvements</span>
        </p>
      </div>

      <Image
        alt="banner"
        src={BannerImage}
        width={500}
        className="max-lg:-mt-36"
        fetchPriority="high"
      />
    </section>
  );
}

function FeatureIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex size-10 items-center justify-center rounded-lg border bg-linear-to-b from-violet-100 to-card dark:from-violet-300/10">
      {children}
    </div>
  );
}

function Features() {
  // oxlint-disable-next-line react-doctor/prefer-module-scope-static-value
  const cards = [
    {
      icon: <Globe className="size-5 text-sky-300" />,
      title: "ORM & Database Agnostic",
      desc: "Integrates with multiple ORMs and databases, without worrying about inconsistencies.",
    },
    {
      icon: <Zap className="size-5 text-yellow-300" />,
      title: "Unified Query API",
      desc: "One set of methods to query, mutate, transact regardless of the underlying database or storage.",
    },
    {
      icon: <Database className="size-5 text-cyan-300" />,
      title: "Unified Schema API",
      desc: "A simple API for version control & schema definition, backward compatible by default without ambiguity.",
    },
    {
      icon: <Plug className="size-5 text-fuchsia-300" />,
      title: "Pluggable Adapters",
      desc: "Bring your own adapters, or use our maintained adapters for Kysely, Drizzle ORM, Kysely ORM and more.",
    },
    {
      icon: <Shuffle className="size-5 text-violet-300" />,
      title: "Built-in Database Migrator",
      desc: "Your library queries in a controlled environment identical to schema, without chaos.",
    },
    {
      icon: <Lock className="size-5 text-emerald-300" />,
      title: "Safe by Default",
      desc: "Type-safe interfaces, schema-aware operations, and robust runtime checks to prevent foot-guns.",
    },
  ];
  return (
    <section
      id="features"
      className="relative flex w-full flex-col items-center overflow-hidden px-4 py-24"
    >
      <div className="w-full max-w-2xl text-center">
        <h2 className="text-2xl font-semibold sm:text-3xl">Build once. Query anywhere.</h2>
        <p className="mt-3 text-muted-foreground">
          FumaDB unifies access to different databases & ORMs with a single, elegant interface
          managed with a single schema.
        </p>
      </div>
      <div className="mt-12 grid w-full max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c, i) => (
          <Card
            // oxlint-disable-next-line react-doctor/no-array-index-key react-doctor/no-array-index-as-key
            key={i}
            size="sm"
            className="rounded-xl border bg-card/70 shadow-lg backdrop-saturate-200 dark:bg-card/50"
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <FeatureIcon>{c.icon}</FeatureIcon>
                <CardTitle className="font-sans text-base font-semibold tracking-normal normal-case">
                  {c.title}
                </CardTitle>
              </div>
              <CardDescription>{c.desc}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
      <div className="absolute inset-0 z-[-1] rounded-full bg-[radial-gradient(circle_at_center_bottom,rgba(120,119,198,0.35),rgba(120,119,198,0)_70%)] blur-3xl" />
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto mb-4 w-full max-w-6xl rounded-2xl border bg-card px-6 py-8 text-card-foreground shadow-lg">
      <h3 className="text-xl font-semibold">Ready to unify your data layer?</h3>
      <p className="mt-2 text-muted-foreground">
        Implement FumaDB in minutes. Migrate slowly, or switch drivers instantly.
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        <Button
          className="rounded-full text-sm font-semibold tracking-normal normal-case"
          nativeButton={false}
          render={<Link to="/docs/openapi">Get Started</Link>}
        />

        <Button
          variant="outline"
          className="rounded-full bg-background text-sm font-semibold tracking-normal normal-case"
          nativeButton={false}
          render={<Link to="/docs">Learn More</Link>}
        />
      </div>
    </section>
  );
}
