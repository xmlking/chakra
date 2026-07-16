import { log } from "evlog";
import { createFiles } from "files-sdk";
import { minio } from "files-sdk/minio";
import { env } from "virtual:env/server";

/**
 * TODO: create index.azure.ts, index.gcs.ts etc
 */
export const images = createFiles({
  adapter: minio({
    bucket: env.S3_IMAGES_BUCKET,
    endpoint: env.S3_ENDPOINT,
    accessKeyId: env.S3_ACCESS_KEY_ID,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY,
    region: env.S3_REGION,
  }),
  // prefix: "users", // every key resolves under users/
  timeout: 10_000, // default per-attempt timeout
  retries: 3, // retry provider failures
  hooks: {
    onAction(event) {
      log.info({ source: "files.images", ...event });
      log.info("files.images", "action");
    },
    onError(event) {
      log.error({ source: "files.images", ...event });
      log.error("files.images", "error");
    },
    onRetry(event) {
      log.error({ source: "files.images", ...event });
      log.warn("files.images", "retry");
    },
  },
});

export const files = createFiles({
  adapter: minio({
    bucket: env.S3_FILES_BUCKET,
    endpoint: env.S3_ENDPOINT,
    accessKeyId: env.S3_ACCESS_KEY_ID,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY,
    region: env.S3_REGION,
  }),
  // prefix: "users", // every key resolves under users/
  timeout: 10_000, // default per-attempt timeout
  retries: 3, // retry provider failures
  hooks: {
    onAction(event) {
      log.info({ source: "files.files", ...event });
      log.info("files.files", "action");
    },
    onError(event) {
      log.error({ source: "files.files", ...event });
      log.error("files.files", "error");
    },
    onRetry(event) {
      log.error({ source: "files.files", ...event });
      log.warn("files.files", "retry");
    },
  },
});
