import { auth } from "@workspace/auth";
import { identifyUser } from "evlog/better-auth";
import { useLogger } from "evlog/nitro/v3";
import { definePlugin } from "nitro";
import type { NitroApp } from "nitro/types";

const exclude = [/^\/api\/auth/];

const isExcluded = (pathname: string, patterns: RegExp[]): boolean => {
  return patterns.some((pattern) => pattern.test(pathname));
};

/**
 * Nitro evlog plugin
 * Register in `vite.config.ts`
 */

// oxlint-disable-next-line import/no-default-export
export default definePlugin((nitroApp: NitroApp) => {
  nitroApp.hooks?.hook("request", async (event) => {
    const pathname = new URL(event.req.url).pathname;
    if (isExcluded(pathname, exclude)) {
      return;
    }

    // oxlint-disable-next-line react-doctor/rules-of-hooks
    const log = useLogger(event);
    const session = await auth.api.getSession({ headers: event.req.headers });
    if (session) {
      identifyUser(log, session);
    }
  });
});
