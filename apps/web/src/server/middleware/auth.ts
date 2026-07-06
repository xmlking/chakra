import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "@workspace/auth";
import type { RequestLogger } from "evlog";
import { identifyUser } from "evlog/better-auth";
// Aliased: `useRequest` is a Nitro ALS accessor, not a React hook — oxlint
// rules-of-hooks flags it by name.
import { useRequest as getNitroRequest } from "nitro/context";

// Tag evlog wide event with user/session + org id/role. SYNCHRONOUS by design:
// any `await` loses the tag — TanStack Start streams, evlog emits the wide event
// when the stream opens, later tags are dropped ("log.set() after wide event").
// `plan` not tagged for the same reason (needs async DB read) — slice by
// activeOrganizationId and join the plan column out-of-band. No-op without evlog
// or null session.
const tagLoggerWithSession = (
  session: { user: Record<string, unknown>; session: Record<string, unknown> } | null,
) => {
  if (!session) return;
  const log = getNitroRequest().context?.log as RequestLogger | undefined;
  if (!log) return;

  // Ref: https://www.evlog.dev/use-cases/better-auth/identify-user
  identifyUser(log, session, {
    // omitted — PII, no observability value.
    maskEmail: true,
    extend: () => ({
      ipAddress: session.session.ipAddress,
      userAgent: session.session.userAgent,
      organization: session.user.activeOrganization,
      role: session.user.role,
    }),
  });
};

/**
 * Usage:
 * export const openOrgBillingPortal = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(v.object({ orgId: v.string() }))
  .handler(async ({ data, context }) => {
 */

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const headers = getRequestHeaders();
  const session = await auth.api.getSession({ headers });

  if (!session) {
    throw redirect({
      to: "/auth/$path",
      params: { path: "sign-in" },
      search: { redirectTo: location.href },
    });
  }

  tagLoggerWithSession(session);

  return next({
    context: {
      session,
    },
  });
});

// API variant: JSON 401 not a redirect — consumers want a status, not HTML;
// useObject/fetch can't follow a 302 to HTML and recover.
export const apiAuthMiddleware = createMiddleware().server(async ({ next }) => {
  const headers = getRequestHeaders();
  const session = await auth.api.getSession({ headers });

  if (!session) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  tagLoggerWithSession(session);

  return next({ context: { session } });
});
