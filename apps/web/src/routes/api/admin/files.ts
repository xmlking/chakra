import { createFileRoute } from "@tanstack/react-router";
import { files } from "@workspace/storage";
import { createFilesRouter } from "files-sdk/api";
import { createRouteHandler } from "files-sdk/tanstack-start";

import { ENV } from "#env";
import { authorizeSystem, filesAllowedOrigins } from "#features/files/api/gateway";

/**
 * System File Browser: every operation on the whole container, for system `file:*` grants only.
 * See specifications/0009-file-access-control.
 *
 * Ref: https://files-sdk.dev/docs/ui/server/tanstack-start
 */

const router = createFilesRouter({
  files,
  allowedOrigins: filesAllowedOrigins(),
  secret: ENV.FILES_API_SECRET,
  authorize: authorizeSystem,
});

export const Route = createFileRoute("/api/admin/files")({
  server: { handlers: createRouteHandler(router) },
});
