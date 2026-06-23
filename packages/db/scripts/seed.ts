// import { auth } from "@workspace/auth";
import { reset, seed } from "drizzle-seed";
import { env } from "virtual:env/server";

import { db } from "../src";
import {
  account,
  member,
  organization,
  session,
  team,
  user,
  verification,
} from "../src/schema/auth";
import { settings } from "../src/schema/settings";
import { hashPassword } from "./password";

const pool = db.$client;
const superAdminPasswordHash = await hashPassword(env.BETTER_AUTH_ADMIN_PASSWORD as string);
// const authCtx = await auth.$context;
// const superAdminPasswordHash = authCtx.password.hash(env.BETTER_AUTH_ADMIN_PASSWORD as string)

const settingKeys = [
  "THEME_COLOR",
  "ITEMS_PER_PAGE",
  "NOTIFICATIONS_ENABLED",
  "USER_NOTIFICATIONS_ENABLED",
  "COMMUNICATION_PREFERENCES",
  "AGENT_VERSION",
  "FEATURE_SHOW_MAGIC_LINK_LOGIN",
  "FEATURE_SHOW_SOCIAL_LOGIN",
];

async function run() {
  console.log("🌱 Seeding...");
  console.time("🌱 Database has been seeded");

  console.time("🧹 Cleaned up the database...");

  await reset(db, {
    account,
    member,
    organization,
    session,
    team,
    user,
    verification,
    settings,
  });
  console.timeEnd("🧹 Cleaned up the database...");

  await seed(db, {
    account,
    member,
    organization,
    session,
    team,
    user,
    verification,
    settings,
  }).refine((f) => ({
    user: {
      columns: {
        id: f.default({ defaultValue: env.BETTER_AUTH_ADMINS[0] }),
        name: f.default({ defaultValue: "Super User" }),
        email: f.default({
          defaultValue: env.BETTER_AUTH_ADMIN_EMAIL as string,
        }),
        emailVerified: f.default({ defaultValue: true }),
        image: f.default({ defaultValue: "/avatars/shadcn.jpg" }),
        lastLoginMethod: f.default({ defaultValue: "email" }),
        stripeCustomerId: f.string({ isUnique: true }),
        role: f.default({ defaultValue: "admin" }),
        banned: f.default({ defaultValue: false }),
        banReason: f.default({ defaultValue: null }),
        banExpires: f.default({ defaultValue: null }),
        lang: f.valuesFromArray({ values: ["en", "es", "de"] }),
      },
      count: 1,
      with: {
        account: 1,
      },
    },
    account: {
      columns: {
        providerId: f.default({ defaultValue: "credential" }),
        accessToken: f.default({ defaultValue: null }),
        refreshToken: f.default({ defaultValue: null }),
        idToken: f.default({ defaultValue: null }),
        accessTokenExpiresAt: f.default({ defaultValue: null }),
        refreshTokenExpiresAt: f.default({ defaultValue: null }),
        scope: f.default({ defaultValue: null }),
        password: f.default({ defaultValue: superAdminPasswordHash }),
      },
    },
    organization: {
      columns: {
        id: f.default({ defaultValue: env.SHARED_ORGANIZATION_ID }),
        name: f.default({ defaultValue: "Chakra" }),
        slug: f.default({ defaultValue: "chakra-inc" }),
        logo: f.default({ defaultValue: null }),
        metadata: f.default({ defaultValue: null }),
      },
      count: 1,
    },
    member: {
      columns: {
        role: f.default({ defaultValue: "owner" }),
      },
      count: 1,
    },
    team: {
      count: 3,
    },
    settings: {
      columns: {
        key: f.valuesFromArray({
          values: settingKeys,
          isUnique: true,
        }),
      },
      count: settingKeys.length,
    },
  }));
  console.timeEnd("🌱 Database has been seeded");
}

try {
  await run();
} catch (e) {
  console.error(e);
  process.exit(1);
} finally {
  await pool.end();
}
