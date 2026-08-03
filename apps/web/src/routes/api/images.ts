import { createFileRoute } from "@tanstack/react-router";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "@workspace/auth";
import { images } from "@workspace/storage";
import { log } from "evlog";
import { FilesError } from "files-sdk";
import { createFilesRouter } from "files-sdk/api";
import { createRouteHandler } from "files-sdk/tanstack-start";
import { env } from "virtual:env/server";

/**
 * Ref: https://files-sdk.dev/docs/ui/server/tanstack-start
 */

const allowedOrigins = ["https://chakra.ai", "https://www.chakra.ai", env.VITE_BETTER_AUTH_URL];
if (import.meta.env.DEV) {
  allowedOrigins.push(
    "http://localhost:3000",
    "https://console-127-0-0-1.nip.io",
    "http://localhost:9000",
  );
}

const router = createFilesRouter({
  files: images as any,
  allowedOrigins,
  // defaultExpiresIn: 300, // Default 300
  secret: env.FILES_API_SECRET,
  authorize: async ({ key, operation, from, to }) => {
    log.info({ key, operation, from, to });
    /* throw to deny, or return a per-user constraint — see /ui/server/authorization */
    const headers = getRequestHeaders();
    const session = await auth.api.getSession({ headers });
    if (session?.user === undefined) {
      throw new FilesError("Unauthorized", "NOT_AUTHENTICATED");
    }

    if (session.session.activeOrganizationId === undefined) {
      throw new FilesError("Unauthorized", "NOT_MEMBER_OF_ORGANIZATION");
    }

    return { keyPrefix: `users/${session.user.id}/` }; // scope every key to this user
  },
});

export const Route = createFileRoute("/api/images")({
  server: { handlers: createRouteHandler(router) },
});
