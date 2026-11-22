import { createFileRoute } from "@tanstack/react-router";
import { files } from "@workspace/storage";
import { createFilesRouter } from "files-sdk/api";
import { createRouteHandler } from "files-sdk/tanstack-start";

import { ENV } from "#env";
import { authorizePreview, filesAllowedOrigins } from "#features/files/api/gateway";

/**
 * Ref: https://files-sdk.dev/docs/ui/server/tanstack-start
 */

const router = createFilesRouter({
  // Hard gates that run before `authorize`: a hook bug still can't write or list.
  files: files.readonly(),
  operations: ["head", "exists", "url", "download"],
  allowedOrigins: filesAllowedOrigins(),
  // defaultExpiresIn: 300, // Default 300
  secret: ENV.FILES_API_SECRET,
  authorize: authorizePreview,
});

export const Route = createFileRoute("/api/files")({
  server: { handlers: createRouteHandler(router) },
});
