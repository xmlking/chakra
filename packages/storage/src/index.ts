import { log } from "evlog";
import { createFiles } from "files-sdk";
import { s3 } from "files-sdk/s3";
import { env } from "virtual:env/server";

export const images = createFiles({
  adapter: s3({ bucket: env.S3_IMAGES_BUCKET, region: env.S3_REGION }),
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
  adapter: s3({ bucket: env.S3_FILES_BUCKET, region: env.S3_REGION }),
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
