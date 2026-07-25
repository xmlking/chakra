import type { DBFieldAttribute } from "better-auth/db";

/**
 * Better Auth config
 */

type AdditionalFields = Record<string, DBFieldAttribute>;

export const additionalUserFields = {
  role: { type: "string", required: false, defaultValue: "user" },
  lang: { type: "string", required: false, defaultValue: "en" },
} satisfies AdditionalFields;

export const additionalAccountFields = {
  username: { type: "string", required: false },
} satisfies AdditionalFields;

export const additionalSessionFields = {
  activeOrganizationId: {
    type: "string",
    required: false, // Set to true if every single session must have an org
    returned: true, // Must be true to expose it to the client/session object
  },
} satisfies AdditionalFields;
