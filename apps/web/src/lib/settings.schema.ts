import { z } from "zod";

/**
 * Hand-authored mirror of the `settings` Drizzle table shape (see
 * `packages/db/src/schema/settings.ts`). Kept isomorphic and free of
 * `drizzle-orm`/`drizzle-orm/zod` so client bundles never pull in the
 * server-side table definitions. Field constraints must be kept in sync
 * with the table by hand, including the `type` literal union, which must
 * match `settingTypeEnum` in `packages/db/src/schema/enum.ts`.
 */
const KEY_REGEX = /^[A-Z]+(_[A-Z]+)*$/;

export const settingsSelectSchema = z.object({
  key: z.string(),
  organizationId: z.uuid(),
  description: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
  createdBy: z.uuid().nullable(),
  updatedBy: z.uuid().nullable(),
  value: z.unknown(),
  type: z.enum(["user", "org", "system"]),
  secret: z.boolean(),
});

export const settingsInsertSchema = z.object({
  key: z
    .string()
    .min(1, { message: "Key is required" })
    .max(64, { message: "Key must be less than 64 characters" })
    .trim()
    .regex(KEY_REGEX, { message: "Invalid key format" }),
  description: z.string().nullable().optional(),
  value: z.unknown(),
  secret: z.boolean().optional(),
});

export const settingsBulkInsertSchema = z.object({
  settings: z.array(settingsInsertSchema).min(1, "At least one entity is required"),
});

export const settingsUpdateSchema = z.object({
  description: z.string().nullable().optional(),
  value: z.unknown().optional(),
  secret: z.boolean().optional(),
});

export type SettingsInsert = z.infer<typeof settingsInsertSchema>;
export type SettingsBulkInsertSchema = z.infer<typeof settingsBulkInsertSchema>;
export type SettingsUpdate = z.infer<typeof settingsUpdateSchema>;
