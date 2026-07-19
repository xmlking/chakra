import { createFileRoute } from "@tanstack/react-router";
import studioConfig from "@workspace/auth/studio.config";
import { betterAuthStudio } from "better-auth-studio/tanstack-start";

const handler = betterAuthStudio(studioConfig);

export const Route = createFileRoute("/api/studio/$")({
  server: {
    handlers: {
      GET: handler,
      POST: handler,
      PUT: handler,
      DELETE: handler,
      PATCH: handler,
    },
  },
});
