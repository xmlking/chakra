import { auth } from "@workspace/auth";
import { useLogger } from "evlog";
import { createAuthMiddleware } from "evlog/better-auth";
import type { BetterAuthInstance } from "evlog/better-auth";
import { defineEventHandler } from "nitro/h3";

type Identify = ReturnType<typeof createAuthMiddleware>;

let identify: Identify | undefined;

function getIdentify(): Identify {
  if (identify) {
    return identify;
  }

  identify = createAuthMiddleware(auth as unknown as BetterAuthInstance, {
    // Skip session resolution on auth flows and high-traffic public paths.
    exclude: ["/api/auth/**", "/api/_evlog/**", "api/health/**"],
    maskEmail: true,
    onAnonymous: (logger) => {
      logger.set({ anonymous: true });
    },
  });

  return identify;
}

// oxlint-disable-next-line import/no-default-export
export default defineEventHandler(async (event) => {
  // oxlint-disable-next-line react-doctor/rules-of-hooks
  const logger = useLogger(event);

  await getIdentify()(logger, event.headers, event.path);
});
