import { sql } from "drizzle-orm";
import { jsonb, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

// import { member, organization } from "./auth";

/**
 * Usage:
 * // policy.ts
 * export const policy = pgTable("policy", (t) => ({
 *   ...baseFields,
 *   source: t.text(),
 * }));
 */

export const idFields = {
  id: uuid()
    .primaryKey()
    .default(sql`uuidv7()`),
  organizationId: uuid().notNull(),
  // .references(() => organization.id, { onDelete: "cascade" }),
};
export const metadataFields = {
  title: varchar({ length: 255 }).notNull(),
  documentation: text(),
  tags: text()
    .array()
    .default(sql`ARRAY[]::text[]`)
    .notNull(),
  // tags: jsonb().$type<string[]>().default([]),
  metadata: jsonb().$type<Record<string, any>>().default({}),
};

export const auditAtFields = {
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().$onUpdate(() => /* @__PURE__ */ new Date()),
};

export const auditByFields = {
  createdBy: uuid()
    // .references(() => member.id, {
    //   onDelete: "set null",
    // })
    .notNull(),
  updatedBy: uuid(),
  // .references(() => member.id, {
  //   onDelete: "set null",
  // }),
};

export const baseFields = {
  ...idFields,
  ...metadataFields,
  ...auditAtFields,
  ...auditByFields,
};
