// oxlint-disable react-doctor/jsx-pascal-case
import { ServerCodeBlock } from "fumadocs-ui/components/codeblock.rsc";
import { Image } from "fumapress/image";
import { Database, Plug, Zap, Lock, Shuffle, Globe, Rocket, Star } from "lucide-react";
import { Link } from "waku";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      <CodeSamples />
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
          className="mb-4 inline-flex items-center gap-2 rounded-full shadow-lg"
        >
          <Zap fill="currentColor" className="size-3.5 text-orange-500 dark:text-yellow-300" />
          Unified Database API for JS Libraries
        </Badge>
        <h1 className="text-2xl leading-tight font-semibold tracking-tight sm:text-3xl">
          One API to read & write database
          <br />
          For your next library.
        </h1>
        <p className="mt-4 text-foreground/70">
          FumaDB unifies database access for different runtimes, ORMS and databases. Write once,
          query anywhere, without managing adapters.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3 max-lg:justify-center">
          <Button size="lg" className="rounded-full" asChild>
            <Link to="/docs">Read the Docs</Link>
          </Button>
          <Button size="lg" variant="outline" className="rounded-full" asChild>
            <a href="https://github.com/fuma-nama/fumadb" target="_blank" rel="noreferrer noopener">
              <Star className="mr-2 size-4 text-amber-300" />
              Star on GitHub
            </a>
          </Button>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          <span>Major ORMs</span>
          <span className="mx-2">•</span>
          <span>Edge & Serverless</span>
          <span className="mx-2">•</span>
          <span>SQL & NoSQL databases</span>
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
            className="border bg-card/70 shadow-lg backdrop-saturate-200 dark:bg-card/50"
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <FeatureIcon>{c.icon}</FeatureIcon>
                <CardTitle>{c.title}</CardTitle>
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

function CodeSamples() {
  const defineSchema = `import { fumadb } from "fumadb";
import { column, idColumn, schema, table } from "fumadb/schema";

export const v1 = schema({
  version: "1.0.0",
  tables: {
    users: table("users", {
      id: idColumn("id", "varchar(255)").defaultTo$("auto"),
      name: column("name", "string"),
    })
  }
});

export const ChatDB = fumadb({
  namespace: "fuma-chat",
  schemas: [v1],
});`;

  const getClient = `import { ChatDB, myLibrary } from "your-library";
import { kyselyAdapter } from "fumadb/adapters/kysely";

export const client = ChatDB.client(
  kyselyAdapter({
    provider: "mysql",
    db: kysely,
  })
);

myLibrary(client);`;

  const writeQuery = `import { type InferFumaDB } from "fumadb";

export function myLibrary(client: InferFumaDB<typeof ChatDB>) {
  return {
    async getUser() {
      // get schema version
      const version = await client.version();
      const orm = client.orm(version);

      const result = await orm.findFirst("users", {
        select: ["name"],
        where: (b) => b("id", "=", "test"),
      });

      return result;
    },
  };
}`;

  return (
    <section id="examples" className="relative w-full py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
        <div>
          <h3 className="text-xl font-semibold sm:text-2xl">Designed for Everyone.</h3>
          <p className="mt-3 text-foreground/80">
            FumaDB gives your library a consistent way to interact with databases.
            <br />
            <br />
            It’s great for frameworks & SDKs that want integrating database functionality.
          </p>
          <ul className="mt-6 list-inside list-disc">
            <li className="list-item">Minimal surface area, maximum flexibility.</li>
            <li className="list-item">Type-safe and simple.</li>
          </ul>
          <Button className="mt-8" asChild>
            <Link to="/docs">
              <Rocket className="size-4" />
              Explore the API
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="define-schema">
          <TabsList className="overflow-x-auto">
            <TabsTrigger value="define-schema">Define Schema</TabsTrigger>
            <TabsTrigger value="get-client">Get Client</TabsTrigger>
            <TabsTrigger value="write-query">Write Queries</TabsTrigger>
          </TabsList>
          <TabsContent value="define-schema">
            <ServerCodeBlock code={defineSchema} lang="ts" />
          </TabsContent>
          <TabsContent value="get-client">
            <ServerCodeBlock code={getClient} lang="ts" codeblock={{ title: "Consumer's code" }} />
          </TabsContent>
          <TabsContent value="write-query">
            <ServerCodeBlock code={writeQuery} lang="ts" />
          </TabsContent>
        </Tabs>
      </div>
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
        <Button className="rounded-full" asChild>
          <Link to="/docs/author/setup">Get Started</Link>
        </Button>

        <Button variant="outline" className="rounded-full" asChild>
          <Link to="/docs">Learn More</Link>
        </Button>
      </div>
    </section>
  );
}
