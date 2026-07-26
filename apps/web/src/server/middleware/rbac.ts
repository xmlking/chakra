import { createMiddleware } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "@workspace/auth";
import { ForbiddenError } from "@workspace/shared/errors";

import { authMiddleware } from "./auth";

export const orgRequiredMiddleware = createMiddleware({ type: "function" })
  .middleware([authMiddleware])
  .server(({ next, context }) => {
    const activeOrgId = context.session.session.activeOrganizationId;
    if (!activeOrgId) {
      throw new ForbiddenError({ message: "No active organization" });
    }

    return next();
  });

export const memberRequiredMiddleware = createMiddleware({ type: "function" })
  .middleware([orgRequiredMiddleware])
  .server(async ({ next }) => {
    const headers = getRequestHeaders();
    const activeMember = await auth.api.getActiveMember({ headers });
    if (!activeMember) {
      throw new ForbiddenError({ message: "User don't have organization" });
    }
    return next({ context: { member: activeMember } });
  });

/**
 *
 * Usage:
 *
 * import { createServerFn } from "@tanstack/react-start";
 * import { permissionRequiredMiddleware } from "./middleware";
 * export const getClients = createServerFn()
 *  .middleware([
 *    permissionRequiredMiddleware({
 *      resource: ["create"],
 *    }),
 *  ])
 *  .handler(async ({ context }) => {
 *   return { message: "The user can read clients." };
 *  });
 *
 */

type Permissions = Record<string, string[]>;

export function permissionRequiredMiddleware(permissions: Permissions) {
  return createMiddleware({ type: "function" })
    .middleware([memberRequiredMiddleware])
    .server(async ({ next }) => {
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

export function roleRequiredMiddleware(roles: string | string[]) {
  return createMiddleware({ type: "function" })
    .middleware([memberRequiredMiddleware])
    .server(async ({ next, context }) => {
      const roleList = Array.isArray(roles) ? roles : [roles];
      const granted = roleList.includes(context.member.role);

      if (!granted) {
        throw new ForbiddenError({ message: "Forbidden: User don't have role" });
      }

      return next();
    });
}
