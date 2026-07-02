import { defineRelations } from "drizzle-orm";

// oxlint-disable-next-line react-doctor/no-barrel-import
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  // TODO: Define your relations here
  // https://orm.drizzle.team/docs/relations-v2

  settings: {
    creator: r.one.member({
      from: r.settings.createdBy,
      to: r.member.id,
    }),
    organization: r.one.organization({
      from: r.settings.organizationId,
      to: r.organization.id,
    }),
    updater: r.one.member({
      from: r.settings.updatedBy,
      to: r.member.id,
    }),
  },
}));
