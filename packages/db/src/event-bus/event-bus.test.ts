import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { v7 as uuidv7 } from "uuid";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vite-plus/test";

import { EventBus, EventPayloadTooLargeError, InvalidChannelError } from "./event-bus";
import type { EventEnvelope } from "./types";

/**
 * Integration tests that need a real Postgres. Set EVENT_BUS_TEST_DATABASE_URL to run them;
 * they are skipped otherwise so `vp test` stays green without a database.
 *
 *   docker run -d --rm --name eventbus-pg -e POSTGRES_PASSWORD=test -e POSTGRES_DB=eventbus \
 *     -p 55432:5432 postgres:18-alpine
 *   EVENT_BUS_TEST_DATABASE_URL=postgresql://postgres:test@localhost:55432/eventbus vp test event-bus
 */
const DATABASE_URL = process.env.EVENT_BUS_TEST_DATABASE_URL;

type Events = {
  "orders:created": { orderId: string };
  "cache:invalidate": { tags: string[] };
};

function waitFor<T>(predicate: () => T | undefined, timeoutMs = 3000): Promise<T> {
  const started = Date.now();
  return new Promise((resolve, reject) => {
    const tick = () => {
      const value = predicate();
      if (value !== undefined) return resolve(value);
      if (Date.now() - started > timeoutMs) return reject(new Error("waitFor timed out"));
      setTimeout(tick, 10);
    };
    tick();
  });
}

describe("uuidv7", () => {
  it("produces RFC 9562 v7 ids", () => {
    expect(uuidv7()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
  });
});

describe("EventBus (no database)", () => {
  const publisher = { execute: async () => undefined };

  it("rejects payloads at or above the 8000-byte NOTIFY limit before touching the database", async () => {
    let executed = false;
    const bus = new EventBus<Events>({
      connectionString: "postgresql://localhost/unused",
      publisher: {
        execute: async () => {
          executed = true;
        },
      },
    });
    await expect(
      bus.publish("orders:created", { orderId: "x".repeat(8000) }),
    ).rejects.toBeInstanceOf(EventPayloadTooLargeError);
    expect(executed).toBe(false);
    expect(bus.getMetrics().metrics.errors.payload_too_large).toBe(1);
    await bus.close();
  });

  it("rejects channel names Postgres cannot use as identifiers", () => {
    const bus = new EventBus({ connectionString: "postgresql://localhost/unused", publisher });
    expect(() => bus.on('bad"name', () => {})).toThrow(InvalidChannelError);
    expect(() => bus.on("x".repeat(64), () => {})).toThrow(InvalidChannelError);
  });

  it("reports unhealthy before start and closed after close", async () => {
    const bus = new EventBus({ connectionString: "postgresql://localhost/unused", publisher });
    expect(bus.getMetrics().status).toBe("unhealthy");
    await bus.close();
    expect(bus.connectionState).toBe("closed");
    await expect(bus.start()).rejects.toThrow(/closed/);
  });

  it("start() fails and leaves the bus reconnect-free when the database is unreachable", async () => {
    const bus = new EventBus({
      connectionString: "postgresql://postgres:x@127.0.0.1:1/unused",
      publisher,
      reconnectBaseDelayMs: 10,
    });
    await expect(bus.start()).rejects.toThrow(/ECONNREFUSED/);
    // A failed first connect enters the same backoff loop as a dropped connection.
    expect(bus.getMetrics().connection.state).toBe("reconnecting");
    expect(bus.getMetrics().status).toBe("degraded");
    await bus.close();
  });
});

describe.skipIf(!DATABASE_URL)("EventBus (postgres)", () => {
  const pool = new Pool({ connectionString: DATABASE_URL, max: 3 });
  const db = drizzle({ client: pool });
  const buses: EventBus<Events>[] = [];

  function makeBus(overrides: Partial<ConstructorParameters<typeof EventBus>[0]> = {}) {
    const bus = new EventBus<Events>({
      connectionString: DATABASE_URL!,
      publisher: db,
      channelPrefix: `t${uuidv7().slice(0, 8)}_`,
      heartbeatIntervalMs: 100,
      heartbeatTimeoutMs: 1000,
      reconnectBaseDelayMs: 20,
      reconnectMaxDelayMs: 100,
      ...overrides,
    });
    buses.push(bus);
    return bus;
  }

  afterEach(async () => {
    await Promise.all(buses.splice(0).map((b) => b.close()));
  });

  afterAll(async () => {
    await pool.end();
  });

  beforeAll(async () => {
    await pool.query("select 1");
  });

  it("delivers a published event to a subscriber with an envelope", async () => {
    const bus = makeBus();
    const received: EventEnvelope<{ orderId: string }>[] = [];
    bus.on("orders:created", (e) => {
      received.push(e);
    });
    await bus.start();

    const id = await bus.publish("orders:created", { orderId: "o1" });
    await waitFor(() => received[0]);

    expect(received[0]!.id).toBe(id);
    expect(received[0]!.channel).toBe("orders:created");
    expect(received[0]!.data).toEqual({ orderId: "o1" });
    expect(typeof received[0]!.ts).toBe("number");

    const m = bus.getMetrics();
    expect(m.status).toBe("healthy");
    expect(m.metrics.total_events_received).toBe(1);
    expect(m.metrics.total_events_published).toBe(1);
    expect(m.metrics.events_per_channel["orders:created"]).toBe(1);
    expect(m.metrics.avg_processing_latency_ms).not.toBeNull();
  });

  it("subscribing after start issues LISTEN; unsubscribing issues UNLISTEN", async () => {
    const bus = makeBus();
    await bus.start();
    const seen: string[] = [];
    const off = bus.on("cache:invalidate", (e) => {
      seen.push(e.id);
    });

    const first = await bus.publish("cache:invalidate", { tags: ["a"] });
    await waitFor(() => seen.find((s) => s === first));

    off();
    await new Promise((r) => setTimeout(r, 50));
    await bus.publish("cache:invalidate", { tags: ["b"] });
    await new Promise((r) => setTimeout(r, 200));
    expect(seen).toEqual([first]);
  });

  it("fans events out across separate bus instances (separate processes)", async () => {
    const prefix = `fan${uuidv7().slice(0, 8)}_`;
    const a = makeBus({ channelPrefix: prefix });
    const b = makeBus({ channelPrefix: prefix });
    const gotA: string[] = [];
    const gotB: string[] = [];
    a.on("orders:created", (e) => void gotA.push(e.data.orderId));
    b.on("orders:created", (e) => void gotB.push(e.data.orderId));
    await Promise.all([a.start(), b.start()]);

    await a.publish("orders:created", { orderId: "shared" });
    await waitFor(() => (gotA.length && gotB.length ? true : undefined));
    expect(gotA).toEqual(["shared"]);
    expect(gotB).toEqual(["shared"]);
  });

  it("publish inside a rolled-back transaction is never delivered; committed one is", async () => {
    const bus = makeBus();
    const got: string[] = [];
    bus.on("orders:created", (e) => void got.push(e.data.orderId));
    await bus.start();

    await db
      .transaction(async (tx) => {
        await bus.publish("orders:created", { orderId: "rolled-back" }, tx);
        throw new Error("abort");
      })
      .catch(() => {});

    await db.transaction(async (tx) => {
      await bus.publish("orders:created", { orderId: "committed" }, tx);
    });

    await waitFor(() => got[0]);
    await new Promise((r) => setTimeout(r, 150));
    expect(got).toEqual(["committed"]);
  });

  it("processes events sequentially in arrival order even with async handlers", async () => {
    const bus = makeBus();
    const order: string[] = [];
    bus.on("orders:created", async (e) => {
      await new Promise((r) => setTimeout(r, e.data.orderId === "1" ? 40 : 1));
      order.push(e.data.orderId);
    });
    await bus.start();
    await db.transaction(async (tx) => {
      // Same transaction so Postgres delivers them in order.
      await bus.publish("orders:created", { orderId: "1" }, tx);
      await bus.publish("orders:created", { orderId: "2" }, tx);
      await bus.publish("orders:created", { orderId: "3" }, tx);
    });
    await waitFor(() => (order.length === 3 ? true : undefined));
    expect(order).toEqual(["1", "2", "3"]);
  });

  it("drops duplicate envelope ids inside the dedupe window", async () => {
    const bus = makeBus();
    let calls = 0;
    bus.on("orders:created", () => void calls++);
    await bus.start();

    const envelope = JSON.stringify({
      id: uuidv7(),
      ts: Date.now(),
      channel: "orders:created",
      data: {},
    });
    const channel = `${bus["options"].channelPrefix}orders:created`;
    await pool.query("select pg_notify($1, $2)", [channel, envelope]);
    await pool.query("select pg_notify($1, $2)", [channel, envelope]);
    await waitFor(() => (calls >= 1 ? true : undefined));
    await new Promise((r) => setTimeout(r, 150));

    expect(calls).toBe(1);
    expect(bus.getMetrics().metrics.duplicates_dropped).toBe(1);
  });

  it("counts malformed payloads instead of crashing", async () => {
    const bus = makeBus();
    bus.on("orders:created", () => {});
    await bus.start();
    const channel = `${bus["options"].channelPrefix}orders:created`;
    await pool.query("select pg_notify($1, $2)", [channel, "not json"]);
    await pool.query("select pg_notify($1, $2)", [channel, JSON.stringify({ nope: true })]);
    await waitFor(() =>
      bus.getMetrics().metrics.errors.payload_parse_failures === 2 ? true : undefined,
    );
    expect(bus.getMetrics().status).toBe("healthy");
  });

  it("retries a throwing handler and counts the final failure", async () => {
    const bus = makeBus();
    let attempts = 0;
    bus.on(
      "orders:created",
      () => {
        attempts++;
        throw new Error("boom");
      },
      { retries: 2, retryDelayMs: 1 },
    );
    await bus.start();
    await bus.publish("orders:created", { orderId: "x" });
    await waitFor(() => (attempts === 3 ? true : undefined));
    await new Promise((r) => setTimeout(r, 20));
    expect(bus.getMetrics().metrics.errors.handler_execution_failures).toBe(1);
  });

  it("heartbeat round-trips through Postgres", async () => {
    const bus = makeBus({ heartbeatIntervalMs: 30 });
    await bus.start();
    await waitFor(() => bus.getMetrics().connection.last_heartbeat_at ?? undefined);
    expect(bus.getMetrics().metrics.errors.heartbeat_timeouts).toBe(0);
  });

  it("reconnects with LISTENs restored after the backend kills the connection", async () => {
    const bus = makeBus();
    const got: string[] = [];
    bus.on("orders:created", (e) => void got.push(e.data.orderId));
    await bus.start();

    const { rows } = await bus["client"]!.query("select pg_backend_pid() as pid");
    await pool.query("select pg_terminate_backend($1)", [rows[0].pid]);

    await waitFor(
      () => (bus.getMetrics().connection.reconnect_count === 1 ? true : undefined),
      5000,
    );
    expect(bus.getMetrics().metrics.errors.connection_drops).toBe(1);
    expect(bus.getMetrics().status).toBe("healthy");

    await bus.publish("orders:created", { orderId: "after-reconnect" });
    await waitFor(() => got[0]);
    expect(got).toEqual(["after-reconnect"]);
  });

  it("close() finishes in-flight handlers before closing the connection", async () => {
    const bus = makeBus();
    let finished = false;
    bus.on("orders:created", async () => {
      await new Promise((r) => setTimeout(r, 100));
      finished = true;
    });
    await bus.start();
    await bus.publish("orders:created", { orderId: "slow" });
    await waitFor(() => (bus.getMetrics().metrics.total_events_received === 1 ? true : undefined));

    await bus.close();
    expect(finished).toBe(true);
    expect(bus.connectionState).toBe("closed");
    await expect(bus.publish("orders:created", { orderId: "late" })).rejects.toThrow(/closed/);
  });
});
