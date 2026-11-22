import { db } from "@workspace/db";
import {
  EventBus,
  type EventBusMetrics,
  type EventHandler,
  type SqlExecutor,
  type SubscribeOptions,
} from "@workspace/db/event-bus";

import { ENV } from "#env";

/**
 * Prefix for every Postgres channel. The DB triggers in the
 * `packages/db/drizzle/*_extra` migration `pg_notify` the prefixed names
 * literally, and LISTEN is case-sensitive, so changing this requires a
 * migration. Deliberately not derived from `APP_NAME` (a display name).
 */
const CHANNEL_PREFIX = "chakra_";

/**
 * Channel -> payload contract for this app. Add an entry here before publishing or subscribing;
 * both sides are then typed end-to-end.
 */
export type AppEvents = {
  /** Invalidate cached data tagged with any of `tags` inside `organizationId`. */
  "cache:invalidate": { organizationId: string; tags: string[] };
};

/**
 * Postgres LISTEN/NOTIFY event bus, as a long-running singleton service.
 *
 * Lifecycle is owned by `#server/plugins/event-bus` (`start()` on boot,
 * `shutdown()` on Nitro `close`). `EventBus.close()` is terminal, so
 * `shutdown()` drops the closed bus and the next `start()` / `on()` /
 * `publishEvent()` builds a fresh one.
 */
export class EventBusService {
  private bus: EventBus<AppEvents> | null = null;

  constructor() {}

  /** Idempotent startup: opens the LISTEN connection. Safe to call more than once. */
  async start(): Promise<void> {
    await this.connect().start();
  }

  /** Graceful shutdown: stops listening, drains queued events, closes the connection. */
  async shutdown(): Promise<void> {
    const closingBus = this.bus;
    this.bus = null;
    await closingBus?.close();
  }

  /**
   * Publish `data` on `channel`. Goes through the Drizzle pool, so it works
   * before `start()`; pass `tx` to deliver only if that transaction commits.
   */
  async publishEvent<TChannel extends keyof AppEvents>(
    channel: TChannel,
    data: AppEvents[TChannel],
    tx?: SqlExecutor,
  ): Promise<string> {
    return this.connect().publish(channel, data, tx);
  }

  /** Subscribe to `channel`. Returns an unsubscribe function. */
  on<TChannel extends keyof AppEvents>(
    channel: TChannel,
    handler: EventHandler<AppEvents[TChannel]>,
    options?: SubscribeOptions,
  ): () => void {
    return this.connect().on(channel, handler, options);
  }

  getMetrics(): EventBusMetrics {
    return this.connect().getMetrics();
  }

  private connect(): EventBus<AppEvents> {
    this.bus ??= new EventBus<AppEvents>({
      connectionString: ENV.DATABASE_URL,
      ssl: ENV.DB_POOL_SSL,
      publisher: db,
      channelPrefix: CHANNEL_PREFIX,
    });
    return this.bus;
  }
}

// HMR-safe singleton registry on globalThis
const globalForEventBus = globalThis as unknown as {
  __eventBusService?: EventBusService;
};

export const eventBusService =
  globalForEventBus.__eventBusService ??
  (globalForEventBus.__eventBusService = new EventBusService());
