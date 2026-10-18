import { TaggedError } from "better-result";
import { sql } from "drizzle-orm";
import { log } from "evlog";
import { Client } from "pg";
import type { Notification } from "pg";
import { v7 as uuidv7 } from "uuid";

import {
  HEARTBEAT_CHANNEL,
  PG_NOTIFY_MAX_PAYLOAD_BYTES,
  type ConnectionState,
  type EventBusMetrics,
  type EventBusOptions,
  type EventEnvelope,
  type EventHandler,
  type EventMap,
  type SqlExecutor,
  type SubscribeOptions,
} from "./types";

export class EventPayloadTooLargeError extends TaggedError("EventPayloadTooLargeError")<{
  readonly channel: string;
  readonly bytes: number;
  readonly limit: number;
  message: string;
}> {
  constructor(args: { channel: string; bytes: number; limit: number }) {
    super({
      ...args,
      message: `NOTIFY payload for "${args.channel}" is ${args.bytes} bytes; limit is ${args.limit}`,
    });
  }
}

export class EventBusClosedError extends TaggedError("EventBusClosedError")<{
  readonly operation: string;
  message: string;
}> {
  constructor(args: { operation: string }) {
    super({ ...args, message: `EventBus is closed; cannot ${args.operation}` });
  }
}

export class InvalidChannelError extends TaggedError("InvalidChannelError")<{
  readonly channel: string;
  message: string;
}> {
  constructor(args: { channel: string }) {
    super({
      ...args,
      message: `Invalid channel "${args.channel}": use [A-Za-z0-9_:.-], max 63 bytes including prefix`,
    });
  }
}

// Postgres identifiers are limited to 63 bytes; we also restrict the alphabet so quoting is trivial.
const CHANNEL_PATTERN = /^[A-Za-z0-9_:.-]+$/;
const PG_IDENTIFIER_MAX_BYTES = 63;

interface Subscription<TData> {
  handler: EventHandler<TData>;
  retries: number;
  retryDelayMs: number;
}

interface ErrorCounters {
  payload_parse_failures: number;
  payload_too_large: number;
  handler_execution_failures: number;
  connection_drops: number;
  heartbeat_timeouts: number;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isEnvelope(value: unknown): value is EventEnvelope {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "string" &&
    typeof v.ts === "number" &&
    typeof v.channel === "string" &&
    "data" in v
  );
}

/**
 * Process-wide pub/sub backed by Postgres LISTEN/NOTIFY.
 *
 * - Owns exactly one dedicated `pg.Client` used only for LISTEN. The shared query pool is never
 *   used for LISTEN because a pooled connection can be handed to another caller at any time.
 * - `publish()` runs NOTIFY through the Drizzle `db` or, when a `tx` is passed, through that
 *   transaction so the event is only delivered if the transaction commits.
 * - Incoming notifications are parsed, de-duplicated by envelope id, and processed sequentially
 *   through an in-memory queue so handler side effects observe a stable order.
 * - A heartbeat round-trips through Postgres on a reserved channel; a missed pong forces a reconnect.
 * - Reconnects with exponential backoff and re-issues LISTEN for every subscribed channel.
 */
export class EventBus<TEvents extends EventMap = EventMap> {
  private readonly options: Required<Omit<EventBusOptions, "ssl">> & Pick<EventBusOptions, "ssl">;

  private client: Client | null = null;
  private state: ConnectionState = "disconnected";
  private startPromise: Promise<void> | null = null;
  private closed = false;

  private readonly subscriptions = new Map<string, Set<Subscription<never>>>();
  private readonly listening = new Set<string>();

  private readonly queue: EventEnvelope[] = [];
  private drainPromise: Promise<void> | null = null;

  private reconnectAttempt = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private heartbeatTimeout: ReturnType<typeof setTimeout> | null = null;
  private pendingHeartbeatId: string | null = null;
  private lastHeartbeatAt: Date | null = null;

  private readonly seenIds = new Set<string>();
  private readonly seenRing: string[] = [];
  private seenHead = 0;

  private connectedAt: number | null = null;
  private reconnectCount = 0;
  private totalReceived = 0;
  private totalPublished = 0;
  private duplicatesDropped = 0;
  private readonly perChannel = new Map<string, number>();
  private latencySumMs = 0;
  private latencyCount = 0;
  private readonly errors: ErrorCounters = {
    payload_parse_failures: 0,
    payload_too_large: 0,
    handler_execution_failures: 0,
    connection_drops: 0,
    heartbeat_timeouts: 0,
  };

  constructor(options: EventBusOptions) {
    this.options = {
      channelPrefix: "",
      heartbeatIntervalMs: 30_000,
      heartbeatTimeoutMs: 10_000,
      reconnectBaseDelayMs: 500,
      reconnectMaxDelayMs: 30_000,
      dedupeWindowSize: 1000,
      shutdownDrainTimeoutMs: 10_000,
      ...options,
    };
  }

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  /** Open the LISTEN connection. Safe to call more than once; concurrent calls share one attempt. */
  start(): Promise<void> {
    if (this.closed) return Promise.reject(new EventBusClosedError({ operation: "start" }));
    if (this.state === "connected") return Promise.resolve();
    if (!this.startPromise) {
      this.state = "connecting";
      this.startPromise = this.connect()
        .catch((error: unknown) => {
          // Surface the first failure to the caller but keep retrying in the background,
          // the same way a dropped connection would.
          if (!this.closed) this.scheduleReconnect();
          throw error;
        })
        .finally(() => {
          this.startPromise = null;
        });
    }
    return this.startPromise;
  }

  /**
   * Graceful shutdown: stop listening, let queued events finish (bounded by
   * `shutdownDrainTimeoutMs`), then close the dedicated connection. Idempotent.
   */
  async close(): Promise<void> {
    if (this.closed) return;
    this.closed = true;
    this.clearTimers();

    const client = this.client;
    if (client && this.state === "connected") {
      try {
        await client.query("UNLISTEN *");
      } catch (error) {
        log.warn({ action: "event-bus:unlisten", error });
      }
    }
    this.listening.clear();

    if (this.drainPromise) {
      await Promise.race([this.drainPromise, sleep(this.options.shutdownDrainTimeoutMs)]);
      if (this.queue.length > 0) {
        log.warn({
          action: "event-bus:close",
          dropped: this.queue.length,
          message: "drain timeout",
        });
        this.queue.length = 0;
      }
    }

    await this.destroyClient();
    this.state = "closed";
    log.info({ action: "event-bus:close", message: "EventBus closed" });
  }

  // ---------------------------------------------------------------------------
  // Subscribe
  // ---------------------------------------------------------------------------

  /** Subscribe to `channel`. Returns an unsubscribe function. */
  on<TChannel extends keyof TEvents & string>(
    channel: TChannel,
    handler: EventHandler<TEvents[TChannel]>,
    options: SubscribeOptions = {},
  ): () => void {
    this.assertValidChannel(channel);
    const subscription: Subscription<TEvents[TChannel]> = {
      handler,
      retries: options.retries ?? 0,
      retryDelayMs: options.retryDelayMs ?? 100,
    };
    let set = this.subscriptions.get(channel);
    if (!set) {
      set = new Set();
      this.subscriptions.set(channel, set);
    }
    set.add(subscription as Subscription<never>);

    if (this.state === "connected") {
      void this.reconcileListens();
    }
    return () => this.remove(channel, subscription as Subscription<never>);
  }

  /** Subscribe for a single delivery. */
  once<TChannel extends keyof TEvents & string>(
    channel: TChannel,
    handler: EventHandler<TEvents[TChannel]>,
    options?: SubscribeOptions,
  ): () => void {
    const off = this.on(
      channel,
      (event) => {
        off();
        return handler(event);
      },
      options,
    );
    return off;
  }

  /** Remove every subscription on `channel` and stop listening to it. */
  off<TChannel extends keyof TEvents & string>(channel: TChannel): void {
    this.subscriptions.delete(channel);
    void this.reconcileListens();
  }

  // ---------------------------------------------------------------------------
  // Publish
  // ---------------------------------------------------------------------------

  /**
   * Publish `data` on `channel`. Pass a Drizzle `tx` to make delivery transactional: Postgres
   * only sends the NOTIFY once the transaction commits. Returns the envelope id.
   * Throws `EventPayloadTooLargeError` when the JSON exceeds the 8000-byte NOTIFY limit.
   */
  async publish<TChannel extends keyof TEvents & string>(
    channel: TChannel,
    data: TEvents[TChannel],
    tx?: SqlExecutor,
  ): Promise<string> {
    if (this.closed) throw new EventBusClosedError({ operation: "publish" });
    this.assertValidChannel(channel);

    const envelope: EventEnvelope<TEvents[TChannel]> = {
      id: uuidv7(),
      ts: Date.now(),
      channel,
      data,
    };
    const payload = JSON.stringify(envelope);
    const bytes = Buffer.byteLength(payload, "utf8");
    if (bytes >= PG_NOTIFY_MAX_PAYLOAD_BYTES) {
      this.errors.payload_too_large += 1;
      const error = new EventPayloadTooLargeError({
        channel,
        bytes,
        limit: PG_NOTIFY_MAX_PAYLOAD_BYTES,
      });
      log.error({ action: "event-bus:publish", channel, bytes, error });
      throw error;
    }

    await (tx ?? this.options.publisher).execute(
      sql`select pg_notify(${this.pgChannel(channel)}, ${payload})`,
    );
    this.totalPublished += 1;
    return envelope.id;
  }

  // ---------------------------------------------------------------------------
  // Metrics
  // ---------------------------------------------------------------------------

  getMetrics(): EventBusMetrics {
    const status =
      this.state === "connected"
        ? "healthy"
        : this.state === "connecting" || this.state === "reconnecting"
          ? "degraded"
          : "unhealthy";
    return {
      status,
      connection: {
        state: this.state,
        uptime_seconds: this.connectedAt ? Math.floor((Date.now() - this.connectedAt) / 1000) : 0,
        reconnect_count: this.reconnectCount,
        last_heartbeat_at: this.lastHeartbeatAt?.toISOString() ?? null,
      },
      metrics: {
        total_events_received: this.totalReceived,
        total_events_published: this.totalPublished,
        events_per_channel: Object.fromEntries(this.perChannel),
        duplicates_dropped: this.duplicatesDropped,
        queue_depth: this.queue.length,
        avg_processing_latency_ms:
          this.latencyCount > 0
            ? Math.round((this.latencySumMs / this.latencyCount) * 10) / 10
            : null,
        errors: { ...this.errors },
      },
    };
  }

  get connectionState(): ConnectionState {
    return this.state;
  }

  // ---------------------------------------------------------------------------
  // Connection management
  // ---------------------------------------------------------------------------

  private async connect(): Promise<void> {
    const client = new Client({
      connectionString: this.options.connectionString,
      ssl: this.options.ssl,
      keepAlive: true,
    });

    client.on("notification", (msg) => this.onNotification(msg));
    client.on("error", (error) => {
      log.error({ action: "event-bus:connection", error });
      this.onConnectionLost(client);
    });
    client.on("end", () => this.onConnectionLost(client));

    try {
      await client.connect();
      this.client = client;
      await client.query(`LISTEN "${this.pgChannel(HEARTBEAT_CHANNEL)}"`);
      await this.reconcileListens();
    } catch (error) {
      await client.end().catch(() => {});
      if (this.client === client) this.client = null;
      throw error;
    }

    if (this.closed) {
      await this.destroyClient();
      return;
    }

    const wasReconnect = this.state === "reconnecting";
    this.state = "connected";
    this.connectedAt = Date.now();
    this.reconnectAttempt = 0;
    if (wasReconnect) this.reconnectCount += 1;
    this.startHeartbeat();
    log.info({
      action: "event-bus:connect",
      channels: [...this.listening],
      reconnect: wasReconnect,
    });
  }

  /** Make the set of LISTENed channels match the set of subscribed channels. */
  private async reconcileListens(): Promise<void> {
    const client = this.client;
    if (!client || this.closed) return;

    // Loop because `on()`/`off()` may be called while a LISTEN is in flight.
    for (;;) {
      const wanted = new Set(this.subscriptions.keys());
      const toAdd = [...wanted].filter((c) => !this.listening.has(c));
      const toRemove = [...this.listening].filter((c) => !wanted.has(c));
      if (toAdd.length === 0 && toRemove.length === 0) return;

      for (const channel of toAdd) {
        try {
          await client.query(`LISTEN "${this.pgChannel(channel)}"`);
          this.listening.add(channel);
        } catch (error) {
          log.error({ action: "event-bus:listen", channel, error });
          return;
        }
      }
      for (const channel of toRemove) {
        try {
          await client.query(`UNLISTEN "${this.pgChannel(channel)}"`);
        } catch (error) {
          log.warn({ action: "event-bus:unlisten", channel, error });
        }
        this.listening.delete(channel);
      }
    }
  }

  private onConnectionLost(client: Client): void {
    // Ignore events from a client we have already replaced or torn down.
    if (this.client !== client || this.closed) return;
    this.errors.connection_drops += 1;
    this.listening.clear();
    this.connectedAt = null;
    this.clearTimers();
    void this.destroyClient();
    this.scheduleReconnect();
  }

  private scheduleReconnect(): void {
    if (this.closed || this.reconnectTimer) return;
    this.state = "reconnecting";
    const base = Math.min(
      this.options.reconnectBaseDelayMs * 2 ** this.reconnectAttempt,
      this.options.reconnectMaxDelayMs,
    );
    // Jitter avoids a thundering herd when many instances lose the same database.
    const delay = Math.round(base * (0.8 + Math.random() * 0.4));
    this.reconnectAttempt += 1;
    log.warn({ action: "event-bus:reconnect", attempt: this.reconnectAttempt, delayMs: delay });

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect().catch((error) => {
        log.error({ action: "event-bus:reconnect", attempt: this.reconnectAttempt, error });
        this.scheduleReconnect();
      });
    }, delay);
  }

  private async destroyClient(): Promise<void> {
    const client = this.client;
    this.client = null;
    if (!client) return;
    client.removeAllListeners("error");
    client.removeAllListeners("end");
    client.removeAllListeners("notification");
    // Swallow: the socket may already be gone, which is exactly why we are here.
    client.on("error", () => {});
    await client.end().catch(() => {});
  }

  private clearTimers(): void {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    if (this.heartbeatTimeout) clearTimeout(this.heartbeatTimeout);
    this.reconnectTimer = null;
    this.heartbeatTimer = null;
    this.heartbeatTimeout = null;
    this.pendingHeartbeatId = null;
  }

  // ---------------------------------------------------------------------------
  // Heartbeat
  // ---------------------------------------------------------------------------

  /**
   * The ping is sent on the LISTEN connection itself and must come back as a notification on
   * that same connection, so a half-open socket fails in either direction.
   */
  private startHeartbeat(): void {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    this.heartbeatTimer = setInterval(
      () => void this.sendHeartbeat(),
      this.options.heartbeatIntervalMs,
    );
    this.heartbeatTimer.unref?.();
  }

  private async sendHeartbeat(): Promise<void> {
    const client = this.client;
    if (!client || this.state !== "connected" || this.pendingHeartbeatId) return;

    const id = uuidv7();
    this.pendingHeartbeatId = id;
    this.heartbeatTimeout = setTimeout(() => {
      if (this.pendingHeartbeatId !== id) return;
      this.errors.heartbeat_timeouts += 1;
      log.error({ action: "event-bus:heartbeat", message: "pong not received; reconnecting" });
      this.onConnectionLost(client);
    }, this.options.heartbeatTimeoutMs);
    this.heartbeatTimeout.unref?.();

    try {
      await client.query("select pg_notify($1, $2)", [this.pgChannel(HEARTBEAT_CHANNEL), id]);
    } catch (error) {
      log.error({ action: "event-bus:heartbeat", error });
      this.onConnectionLost(client);
    }
  }

  private onHeartbeatPong(id: string | undefined): void {
    if (!id || id !== this.pendingHeartbeatId) return;
    if (this.heartbeatTimeout) clearTimeout(this.heartbeatTimeout);
    this.heartbeatTimeout = null;
    this.pendingHeartbeatId = null;
    this.lastHeartbeatAt = new Date();
  }

  // ---------------------------------------------------------------------------
  // Receive + dispatch
  // ---------------------------------------------------------------------------

  private onNotification(msg: Notification): void {
    if (msg.channel === this.pgChannel(HEARTBEAT_CHANNEL)) {
      this.onHeartbeatPong(msg.payload);
      return;
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(msg.payload ?? "");
    } catch {
      this.errors.payload_parse_failures += 1;
      log.warn({ action: "event-bus:parse", channel: msg.channel, message: "payload is not JSON" });
      return;
    }
    if (!isEnvelope(parsed)) {
      this.errors.payload_parse_failures += 1;
      log.warn({
        action: "event-bus:parse",
        channel: msg.channel,
        message: "payload is not an envelope",
      });
      return;
    }
    if (this.isDuplicate(parsed.id)) {
      this.duplicatesDropped += 1;
      return;
    }

    this.totalReceived += 1;
    this.perChannel.set(parsed.channel, (this.perChannel.get(parsed.channel) ?? 0) + 1);
    this.queue.push(parsed);
    this.drainPromise ??= this.drain().finally(() => {
      this.drainPromise = null;
    });
  }

  /** Processes the queue one event at a time so handlers see events in arrival order. */
  private async drain(): Promise<void> {
    while (this.queue.length > 0) {
      const event = this.queue.shift()!;
      const subs = this.subscriptions.get(event.channel);
      if (!subs || subs.size === 0) continue;
      await Promise.all([...subs].map((sub) => this.invoke(sub, event)));
      this.latencySumMs += Date.now() - event.ts;
      this.latencyCount += 1;
    }
  }

  private async invoke(sub: Subscription<never>, event: EventEnvelope): Promise<void> {
    for (let attempt = 0; ; attempt += 1) {
      try {
        await sub.handler(event as never);
        return;
      } catch (error) {
        if (attempt < sub.retries) {
          await sleep(sub.retryDelayMs * 2 ** attempt);
          continue;
        }
        this.errors.handler_execution_failures += 1;
        log.error({
          action: "event-bus:handler",
          channel: event.channel,
          eventId: event.id,
          attempt,
          error,
        });
        return;
      }
    }
  }

  private isDuplicate(id: string): boolean {
    const size = this.options.dedupeWindowSize;
    if (size <= 0) return false;
    if (this.seenIds.has(id)) return true;
    this.seenIds.add(id);
    if (this.seenRing.length < size) {
      this.seenRing.push(id);
    } else {
      this.seenIds.delete(this.seenRing[this.seenHead]!);
      this.seenRing[this.seenHead] = id;
      this.seenHead = (this.seenHead + 1) % size;
    }
    return false;
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  private remove(channel: string, subscription: Subscription<never>): void {
    const set = this.subscriptions.get(channel);
    if (!set) return;
    set.delete(subscription);
    if (set.size === 0) {
      this.subscriptions.delete(channel);
      void this.reconcileListens();
    }
  }

  private pgChannel(channel: string): string {
    return `${this.options.channelPrefix}${channel}`;
  }

  private assertValidChannel(channel: string): void {
    const full = this.pgChannel(channel);
    if (
      !CHANNEL_PATTERN.test(channel) ||
      Buffer.byteLength(full, "utf8") > PG_IDENTIFIER_MAX_BYTES
    ) {
      throw new InvalidChannelError({ channel });
    }
  }
}
