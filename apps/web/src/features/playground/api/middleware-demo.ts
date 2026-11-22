import { createServerFn } from "@tanstack/react-start";

import { rateLimitMiddleware } from "#server/middleware/rate-limit";
import {
  roleRequiredMiddleware,
  systemPermissionRequiredMiddleware,
} from "#server/middleware/rbac";

export const demoRateLimitedFn = createServerFn({ method: "POST" })
  .middleware([rateLimitMiddleware])
  .handler(async () => ({ ok: true, message: "rate limit passed" }));

export const demoAdminOnlyFn = createServerFn({ method: "POST" })
  .middleware([roleRequiredMiddleware(["admin"])])
  .handler(async () => ({ ok: true, message: "admin access granted" }));

export const demoPermissionRequiredFn = createServerFn({ method: "POST" })
  .middleware([systemPermissionRequiredMiddleware({ inventory: ["create"] })])
  .handler(async () => ({ ok: true, message: "permission check passed" }));
