import { sql } from "drizzle-orm";
import { check, primaryKey, snakeCase } from "drizzle-orm/pg-core";

import { organization } from "./auth";
import { auditColumns } from "./column";
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
    description: t.text(),
    ...auditColumns,
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
