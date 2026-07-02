import { db } from ".";

export async function getFirstMembership(userId: string) {
  const firstMembership = await db.query.member.findFirst({
    where: { userId },
    orderBy: (columns) => columns.createdAt,
  });
  return firstMembership;
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
