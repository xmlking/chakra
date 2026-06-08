import type { DBFieldAttribute } from "better-auth/db";

/**
 * Better Auth config
 */

type AdditionalFields = Record<string, DBFieldAttribute>;

export const additionalUserFields = {
  lang: { type: "string", required: false, defaultValue: "en" },
} satisfies AdditionalFields;

export const additionalAccountFields = {
  username: { type: "string", required: false },
} satisfies AdditionalFields;
