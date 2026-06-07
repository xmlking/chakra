import { relations } from "drizzle-orm/relations";

import { member, organization } from "./schema/auth";
import { settings } from "./schema/settings";

export const settingsRelations = relations(settings, ({ one }) => ({
  createdBy: one(member, {
    fields: [settings.createdBy],
    references: [member.id],
    relationName: "settings_createdBy_member_id",
  }),
  organization: one(organization, {
    fields: [settings.organizationId],
    references: [organization.id],
  }),
  updatedBy: one(member, {
    fields: [settings.updatedBy],
    references: [member.id],
    relationName: "settings_updatedBy_member_id",
  }),
}));
