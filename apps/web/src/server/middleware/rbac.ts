import { createMiddleware } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "@workspace/auth";
import { ForbiddenError } from "@workspace/shared/errors";

import { authMiddleware } from "./auth";

/** Requires an authenticated session with an active organization. */
export const orgRequiredMiddleware = createMiddleware({ type: "function" })
  .middleware([authMiddleware])
  .server(({ next, context }) => {
    const activeOrgId = context.session.session.activeOrganizationId;
    if (!activeOrgId) {
      throw new ForbiddenError({ message: "No active organization" });
    }

    return next();
  });

/** Requires an active organization member and exposes it as `context.member`. */
export const memberRequiredMiddleware = createMiddleware({ type: "function" })
  .middleware([orgRequiredMiddleware])
  .server(async ({ next }) => {
    const headers = getRequestHeaders();
    const activeMember = await auth.api.getActiveMember({ headers });
    if (!activeMember) {
      throw new ForbiddenError({ message: "User doesn't have an organization" });
    }
    return next({ context: { member: activeMember } });
  });

/** Requires one of the authenticated user's system database roles. */
export function roleRequiredMiddleware(roles: string | string[]) {
  return createMiddleware({ type: "function" })
    .middleware([authMiddleware])
    .server(({ next, context }) => {
      const roleList = Array.isArray(roles) ? roles : [roles];
      if (!roleList.includes(context.session.user.role ?? "")) {
        throw new ForbiddenError({ message: "Forbidden: User doesn't have role" });
      }

      return next();
    });
}

/** Requires one of the active organization member's roles. */
export function orgRoleRequiredMiddleware(roles: string | string[]) {
  return createMiddleware({ type: "function" })
    .middleware([memberRequiredMiddleware])
    .server(async ({ next, context }) => {
      const roleList = Array.isArray(roles) ? roles : [roles];
      const granted = roleList.includes(context.member.role);

      if (!granted) {
        throw new ForbiddenError({ message: "Forbidden: User doesn't have organization role" });
      }

      return next();
    });
}

/**
 *
 * Usage for global admin/user permissions:
 *
 * import { createServerFn } from "@tanstack/react-start";
 * import { systemPermissionRequiredMiddleware } from "./middleware";
 * export const getClients = createServerFn()
 *  .middleware([
 *    systemPermissionRequiredMiddleware({
 *      resource: ["create"],
 *    }),
 *  ])
 *  .handler(async ({ context }) => {
 *   return { message: "The user can read clients." };
 *  });
 *
 */

type Permissions = Record<string, string[]>;

/** Checks Better Auth admin/user permissions without an active organization. */
export function systemPermissionRequiredMiddleware(permissions: Permissions) {
  return createMiddleware({ type: "function" })
    .middleware([authMiddleware])
    .server(async ({ next }) => {
      const { success } = await auth.api.userHasPermission({
        headers: getRequestHeaders(),
        body: { permissions },
      });

      if (!success) {
        throw new ForbiddenError({ message: "User don't have permission" });
      }

      return next();
    });
}

/** Checks organization-member permissions for the active organization. */
export function organizationPermissionRequiredMiddleware(permissions: Permissions) {
  return createMiddleware({ type: "function" })
    .middleware([memberRequiredMiddleware])
    .server(async ({ next }) => {
      // Better Auth evaluates this permission against the active organization member.
      const { success } = await auth.api.hasPermission({
        headers: getRequestHeaders(),
        body: { permissions },
      });
      if (!success) {
        throw new ForbiddenError({ message: "User don't have permission" });
      }

      return next();
    });
}

/** Allows global admins or active organization members with the permission. */
export function systemOrOrganizationPermissionRequiredMiddleware(permissions: Permissions) {
  return createMiddleware({ type: "function" })
    .middleware([authMiddleware])
    .server(async ({ next }) => {
      const headers = getRequestHeaders();
      const globalAccess = await auth.api.userHasPermission({
        headers,
        body: { permissions },
      });
      if (globalAccess.success) {
        return next();
      }

      const activeMember = await auth.api.getActiveMember({ headers });
      if (!activeMember) {
        throw new ForbiddenError({
          message: "User is not an admin or organization member",
        });
      }

      const organizationAccess = await auth.api.hasPermission({
        headers,
        body: { permissions },
      });
      if (!organizationAccess.success) {
        throw new ForbiddenError({ message: "User don't have permission" });
      }

      return next();
    });
}
