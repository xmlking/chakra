import { pgEnum } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-orm/zod";
import type { z } from "zod";

// ------------------ language ----------------------
export const langEnum = pgEnum("lang", ["en", "es", "de"]);

// ------------------ visibility ---------------------
export const visibilityEnum = pgEnum("visibility", ["public", "private"]);

// ------------------ notification ---------------------
export const notificationEnum = pgEnum("notification_type", [
  "info",
  "error",
  "success",
  "warning",
]);

// ------------------ setting type ---------------------
export const settingTypeEnum = pgEnum("setting_type", ["user", "org", "system"]);

// ------------------ process status  ---------------------
export const processStatusEnum = pgEnum("processStatus", [
  "pending",
  "processing",
  "completed",
  "failed",
]);

// Schema
export const langSelectSchema = createSelectSchema(langEnum);
export const visibilitySelectSchema = createSelectSchema(visibilityEnum);
export const notificationSelectSchema = createSelectSchema(notificationEnum);
export const settingTypeSelectSchema = createSelectSchema(settingTypeEnum);
export const processStatusSelectSchema = createSelectSchema(processStatusEnum);

// Types
export type LangType = z.infer<typeof langSelectSchema>;
export type VisibilityType = z.infer<typeof visibilitySelectSchema>;
export type NotificationType = z.infer<typeof notificationSelectSchema>;
export type SettingType = z.infer<typeof settingTypeSelectSchema>;
export type ProcessStatusType = z.infer<typeof processStatusSelectSchema>;
