import { sql } from "drizzle-orm";
import { check, primaryKey, snakeCase } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-orm/zod";
import { z } from "zod";

import { organization } from "./auth";
import { auditAtFields, auditByFields } from "./column";
import { settingTypeEnum } from "./enum";

// ------------------ entities -----------------------
export const settings = snakeCase.table(
  "settings",
  (t) => ({
    key: t.text().notNull(),
    organizationId: t
      .uuid()
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    documentation: t.text(),
    ...auditAtFields,
    ...auditByFields,
    value: t.jsonb().notNull(),
    type: settingTypeEnum().default("org").notNull(),
    secret: t.boolean().default(false).notNull(),
  }),
  (t) => [
    primaryKey({ columns: [t.key, t.organizationId] }),
    check("settings_key_check", sql`${t.key} ~ '^[A-Z]+(_[A-Z]+)*$'`),
  ],
);

// ------------------ relations ------------------

// ------------------ views ----------------------
const KEY_REGEX = /^[A-Z]+(_[A-Z]+)*$/;
// Schema
export const settingsSelectSchema = createSelectSchema(settings);
export const settingsInsertSchema = createInsertSchema(settings, {
  key: (schema) =>
    schema
      .min(1, { message: "Key is required" })
      .max(64, { message: "Key must be less than 64 characters" })
      .trim()
      .regex(KEY_REGEX, { message: "Invalid key format" }),
}).omit({
  type: true,
  organizationId: true,
  createdAt: true,
  createdBy: true,
  updatedAt: true,
  updatedBy: true,
});
export const settingsBulkInsertSchema = z.object({
  settings: z.array(settingsInsertSchema).min(1, "At least one entity is required"),
});

export const settingsUpdateSchema = createUpdateSchema(settings).omit({
  key: true,
  type: true,
  organizationId: true,
  createdAt: true,
  createdBy: true,
  updatedAt: true,
  updatedBy: true,
});

// Types
export type SettingsInsert = z.infer<typeof settingsInsertSchema>;
export type SettingsBulkInsertSchema = z.infer<typeof settingsBulkInsertSchema>;
export type SettingsUpdate = z.infer<typeof settingsUpdateSchema>;
