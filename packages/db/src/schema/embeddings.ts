// TODO https://github.com/CarlosZiegler/fullstack-start-template/blob/main/src/lib/db/schema/resources.ts
import { sql } from "drizzle-orm";
import { index, snakeCase } from "drizzle-orm/pg-core";

import { resources } from "./resources";

export const embeddings = snakeCase.table(
  "embeddings",
  (t) => ({
    id: t
      .uuid("id")
      .default(sql`uuidv7()`)
      .primaryKey(),
    resourceId: t
      .uuid()
      .notNull()
      .references(() => resources.id, { onDelete: "cascade" }),

    content: t.text("content").notNull(),
    embedding: t.vector("embedding", { dimensions: 1536 }).notNull(),
    createdAt: t.timestamp("created_at").defaultNow().notNull(),
  }),
  (t) => [index("embeddingIndex").using("hnsw", t.embedding.op("vector_cosine_ops"))],
);
