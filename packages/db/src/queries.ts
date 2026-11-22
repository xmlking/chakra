import { db } from ".";

export async function getFirstMembership(userId: string) {
  const firstMembership = await db.query.member.findFirst({
    where: { userId },
    orderBy: (columns) => columns.createdAt,
  });
  return firstMembership;
}

/**
 * Resolve the `member` row (and thus `member.id`) for a user within a specific
 * organization. Use this whenever a `created_by`/`updated_by` audit column is
 * being set from a session, since those columns FK-reference `member.id`, not
 * `user.id`.
 */
export async function getMembership(userId: string, organizationId: string) {
  return db.query.member.findFirst({
    where: { userId, organizationId },
  });
}

export async function getActiveOrganization(userId: string) {
  const memberUser = await db.query.member.findFirst({
    where: { userId },
    orderBy: (columns) => columns.createdAt,
  });

  if (!memberUser) {
    return null;
  }

  const activeOrganization = await db.query.organization.findFirst({
    where: { id: memberUser.organizationId },
  });

  return activeOrganization;
}
