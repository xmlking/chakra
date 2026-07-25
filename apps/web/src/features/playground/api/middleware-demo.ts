import { createServerFn } from "@tanstack/react-start";

import { adminRequiredMiddleware } from "#server/middleware/admin";
import { rateLimitMiddleware } from "#server/middleware/rate-limit";
import { permissionRequiredMiddleware } from "#server/middleware/rbac";

export const demoRateLimitedFn = createServerFn({ method: "POST" })
  .middleware([rateLimitMiddleware])
  .handler(async () => ({ ok: true, message: "rate limit passed" }));

export const demoAdminOnlyFn = createServerFn({ method: "POST" })
  .middleware([adminRequiredMiddleware])
  .handler(async () => ({ ok: true, message: "admin access granted" }));

export const demoPermissionRequiredFn = createServerFn({ method: "POST" })
  .middleware([permissionRequiredMiddleware({ inventory: ["create"] })])
  .handler(async () => ({ ok: true, message: "permission check passed" }));
