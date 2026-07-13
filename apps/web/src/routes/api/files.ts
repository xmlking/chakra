import { createFileRoute } from "@tanstack/react-router";
// import { files } from "@workspace/storage";
import { createFiles } from "files-sdk";
import { createFilesRouter } from "files-sdk/api";
import { s3 } from "files-sdk/s3";
import { createRouteHandler } from "files-sdk/tanstack-start";
import { env } from "virtual:env/server";

/**
 * Ref: https://files-sdk.dev/docs/ui/server/tanstack-start
 */

const allowedOrigins = ["https://chakra.ai", "https://www.chakra.ai", env.VITE_BETTER_AUTH_URL];
if (import.meta.env.DEV) {
  allowedOrigins.push("http://localhost:3000", "https://console-127-0-0-1.nip.io");
}

const router = createFilesRouter({
  // files,
  files: createFiles({ adapter: s3({ bucket: env.S3_FILES_BUCKET, region: env.S3_REGION }) }),
  allowedOrigins,
  // defaultExpiresIn: 300, // Default 300
  secret: env.FILES_API_SECRET,
  authorize: async ({ req: _req }) => {
    /* throw to deny, or return a per-user constraint — see /ui/server/authorization */
  },
});

export const Route = createFileRoute("/api/files")({
  server: { handlers: createRouteHandler(router) },
});
