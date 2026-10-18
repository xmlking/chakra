import type { SQL } from "drizzle-orm";

/**
 * Hard limit imposed by Postgres on a NOTIFY payload (8000 bytes).
 * Payloads at or over this are rejected before reaching the database.
 */
export const PG_NOTIFY_MAX_PAYLOAD_BYTES = 8000;

/** Reserved channel used for the heartbeat round-trip. Not exposed to subscribers. */
export const HEARTBEAT_CHANNEL = "__event_bus_heartbeat";

/**
 * Wire format of every event that travels through Postgres NOTIFY.
 * `id` is a UUIDv7 so consumers can dedupe and reorder; `ts` is the publish time
 * in epoch milliseconds, used to compute end-to-end processing latency.
 */
export interface EventEnvelope<TData = unknown> {
  id: string;
  ts: number;
  channel: string;
  data: TData;
}

/**
 * Map of channel name -> payload type. Apps augment this via a generic on `EventBus`
 * so `on()` / `publish()` are typed end-to-end.
 *
 * @example
 * type Events = { "orders:created": { orderId: string } };
 * const bus = new EventBus<Events>({ ... });
 */
export type EventMap = Record<string, unknown>;

export type EventHandler<TData> = (event: EventEnvelope<TData>) => void | Promise<void>;

export interface SubscribeOptions {
  /** Retry a throwing handler this many times before counting it as failed. Default 0. */
  retries?: number;
  /** Base delay in ms between handler retries; doubles each attempt. Default 100. */
  retryDelayMs?: number;
}

/**
 * Anything that can run a SQL statement. Both the Drizzle `db` instance and a
 * Drizzle `tx` satisfy this, which is what lets `publish()` participate in a transaction:
 * the NOTIFY runs on the same connection as the surrounding INSERT/UPDATE/DELETE.
 */
export interface SqlExecutor {
  execute(query: SQL): Promise<unknown>;
}

export type ConnectionState =
  | "disconnected"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "closed";

export interface EventBusOptions {
  /** Dedicated connection string for the LISTEN client. Must not be the shared query pool. */
  connectionString: string;
  /** Executor used by `publish()` when no transaction is passed. Typically the Drizzle `db`. */
  publisher: SqlExecutor;
  /** Prefix applied to every channel so multiple apps can share one database. Default "". */
  channelPrefix?: string;
  /** Interval between heartbeat pings in ms. Default 30_000. */
  heartbeatIntervalMs?: number;
  /** How long to wait for a heartbeat pong before declaring the connection dead. Default 10_000. */
  heartbeatTimeoutMs?: number;
  /** Initial reconnect delay in ms. Doubles each attempt. Default 500. */
  reconnectBaseDelayMs?: number;
  /** Upper bound on reconnect delay in ms. Default 30_000. */
  reconnectMaxDelayMs?: number;
  /** How many recent event ids to remember for duplicate suppression. Default 1000, 0 disables. */
  dedupeWindowSize?: number;
  /** Max time in ms to drain the in-memory queue during `close()`. Default 10_000. */
  shutdownDrainTimeoutMs?: number;
  /** SSL setting forwarded to the pg Client. */
  ssl?: boolean | Record<string, unknown>;
}

export interface EventBusMetrics {
  status: "healthy" | "degraded" | "unhealthy";
  connection: {
    state: ConnectionState;
    uptime_seconds: number;
    reconnect_count: number;
    last_heartbeat_at: string | null;
  };
  metrics: {
    total_events_received: number;
    total_events_published: number;
    events_per_channel: Record<string, number>;
    duplicates_dropped: number;
    queue_depth: number;
    avg_processing_latency_ms: number | null;
    errors: {
      payload_parse_failures: number;
      payload_too_large: number;
      handler_execution_failures: number;
      connection_drops: number;
      heartbeat_timeouts: number;
    };
  };
}
