import { Files } from "files-sdk";
import { createFiles } from "files-sdk";
import { s3 } from "files-sdk/s3";
import { env } from "virtual:env/server";

export const images = new Files({
  adapter: s3({ bucket: env.S3_IMAGES_BUCKET, region: env.S3_REGION }),
  // prefix: "users", // every key resolves under users/
  timeout: 10_000, // default per-attempt timeout
  retries: 3, // retry provider failures
  hooks: {
    onAction(event) {
      console.info("files", event.type, event.status, event.key ?? event.keys);
    },
    onError(event) {
      console.error(event.error, { action: event.type, key: event.key });
    },
    onRetry(event) {
      console.warn("files.retry", { action: event.type });
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
      console.info("files", event.type, event.status, event.key ?? event.keys);
    },
    onError(event) {
      console.error(event.error, { action: event.type, key: event.key });
    },
    onRetry(event) {
      console.warn("files.retry", { action: event.type });
    },
  },
});

export { FilesError } from "files-sdk";
