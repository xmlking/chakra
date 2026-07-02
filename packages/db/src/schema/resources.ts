// TODO https://github.com/CarlosZiegler/fullstack-start-template/blob/main/src/lib/db/schema/resources.ts
import { sql } from "drizzle-orm";
import { snakeCase } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-orm/zod";
import type { z } from "zod";

export const resources = snakeCase.table("resources", (t) => ({
  id: t
    .uuid("id")
    .default(sql`uuidv7()`)
    .primaryKey(),
  content: t.text("content").notNull(),
  createdAt: t
    .timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: t
    .timestamp("updated_at")
    .notNull()
    .default(sql`now()`),
}));

// Schema for resources - used to validate API requests
export const insertResourceSchema = createSelectSchema(resources).extend({}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Type for resources - used to type API request params and within Components
export type NewResourceParams = z.infer<typeof insertResourceSchema>;
