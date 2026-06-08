import { db } from ".";

export async function getFirstMembership(userId: string) {
  const firstMembership = await db.query.member.findFirst({
    where: (member, { and, eq }) => and(eq(member.userId, userId)),
    orderBy: (member, { desc }) => desc(member.createdAt),
  });
  return firstMembership;
}

export async function getActiveOrganization(userId: string) {
  const memberUser = await db.query.member.findFirst({
    where: (member, { and, eq }) => and(eq(member.userId, userId)),
    orderBy: (member, { desc }) => desc(member.createdAt),
  });

  if (!memberUser) {
    return null;
  }

  const activeOrganization = await db.query.organization.findFirst({
    where: (organization, { and, eq }) => and(eq(organization.id, memberUser.organizationId)),
  });

  return activeOrganization;
}
