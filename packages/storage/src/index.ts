import { log } from "evlog";
import { createFiles } from "files-sdk";
import { s3Fetch } from "files-sdk/s3-fetch";
import { signedUrlPolicy } from "files-sdk/signed-url-policy";
import { softDelete } from "files-sdk/soft-delete";

import { ENV } from "../env";

/**
 * TODO: create index.azure.ts, index.gcs.ts etc
 */
export const images = createFiles({
  adapter: s3Fetch({
    bucket: ENV.S3_IMAGES_BUCKET,
    endpoint: ENV.S3_ENDPOINT,
    accessKeyId: ENV.S3_ACCESS_KEY_ID,
    secretAccessKey: ENV.S3_SECRET_ACCESS_KEY,
    region: ENV.S3_REGION,
    // MinIO does not provide per-bucket DNS for virtual-hosted addressing.
    forcePathStyle: true,
  }),
  plugins: [
    signedUrlPolicy({
      maxExpiresIn: 15 * 60, // no URL lives longer than 15 minutes
      maxUploadSize: 10 * 1024 * 1024, // every signed upload caps at 10 MiB
    }),
    softDelete(),
  ],
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
  adapter: s3Fetch({
    bucket: ENV.S3_FILES_BUCKET,
    endpoint: ENV.S3_ENDPOINT,
    accessKeyId: ENV.S3_ACCESS_KEY_ID,
    secretAccessKey: ENV.S3_SECRET_ACCESS_KEY,
    region: ENV.S3_REGION,
    // MinIO does not provide per-bucket DNS for virtual-hosted addressing.
    forcePathStyle: true,
  }),
  plugins: [
    signedUrlPolicy({
      maxExpiresIn: 15 * 60, // no URL lives longer than 15 minutes
      maxUploadSize: 10 * 1024 * 1024, // every signed upload caps at 10 MiB
    }),
    softDelete(),
  ],
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
