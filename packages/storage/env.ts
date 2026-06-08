import { defineEnv, type EnvPreset } from "@vite-env/core";
import { z } from "zod";

export const preset = {
  server: {
    S3_IMAGES_BUCKET: z.string().min(3).default("images"),
    S3_AGENTS_BUCKET: z.string().min(3).default("agents"),
    S3_REGION: z.string().optional().default("us-east-1"),
    S3_ENDPOINT: z.string().default("http://localhost:9000"), // https://s3.amazonaws.com / storage.googleapis.com / http://localhost:9000
    S3_ACCESS_KEY_ID: z.string().min(3),
    S3_SECRET_ACCESS_KEY: z.string().min(8),
  },
} as const satisfies EnvPreset;

export default defineEnv({
  ...preset,
});
