import { sql } from "drizzle-orm";
import { jsonb, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { member, organization } from "./auth";

/**
 * Usage:
 * // policy.ts
 * export const policy = pgTable("policy", (t) => ({
 *   ...baseColumns,
 *   source: t.text(),
 * }));
 */

export const idColumn = {
  id: uuid()
    .primaryKey()
    .default(sql`uuidv7()`),
};
export const organizationColumn = {
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
};
export const metadataColumns = {
  displayName: varchar({ length: 255 }).notNull(),
  description: text(),
  /** Human-maintained labels for filtering/search. */
  tags: text()
    .array()
    .default(sql`ARRAY[]::text[]`)
    .notNull(),
  // tags: jsonb().$type<string[]>().default([]),
  metadata: jsonb().$type<Record<string, any>>().default({}),
};

export const auditAtColumns = {
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
};

/**
 * Audit columns for business entity tables.
 *
 * createdBy / updatedBy intentionally reference Better Auth members.id,
 * not users.id, because permissions and roles are organization-scoped.
 */
export const auditByColumns = {
  createdBy: uuid().references(() => member.id, {
    onDelete: "set null",
  }),
  updatedBy: uuid().references(() => member.id, {
    onDelete: "set null",
  }),
};

export const auditColumns = {
  ...auditAtColumns,
  ...auditByColumns,
};

export const baseColumns = {
  ...idColumn,
  ...organizationColumn,
  ...metadataColumns,
  ...auditColumns,
};
