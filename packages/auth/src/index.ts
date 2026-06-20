import { apiKey } from "@better-auth/api-key";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { oauthProvider } from "@better-auth/oauth-provider";
import { passkey } from "@better-auth/passkey";
import { and, db } from "@workspace/db";
import { getFirstMembership } from "@workspace/db/queries";
import { sendMail } from "@workspace/email";
import { InviteUserEmail } from "@workspace/email/invitation";
import { MagicLinkEmail } from "@workspace/email/magic-link";
import { ResetPasswordEmail } from "@workspace/email/reset-password";
import { VerifyEmail } from "@workspace/email/verify-email";
import { betterAuth } from "better-auth";
import {
  admin,
  captcha,
  deviceAuthorization,
  // haveIBeenPwned,
  jwt,
  lastLoginMethod,
  magicLink,
  multiSession,
  oneTap,
  openAPI,
  organization,
  testUtils,
} from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { env } from "virtual:env/server";

import { additionalUserFields } from "./additional-fields";
import { ac, roles } from "./permissions";

const MAGIC_LINK_EXPIRES_SECONDS = 300;
const from = env.EMAIL_FROM;
// const to = env.EMAIL_TO || "";
const adminUserIds = env.BETTER_AUTH_ADMINS as unknown as string[];

// HINT: update me for each product/deployment
const trustedOrigins = [
  "expo://",
  "mobile://",
  "exp://",
  /* Needed only for Apple ID authentication */
  "https://appleid.apple.com",
  "https://chakra.ai",
  "https://www.chakra.ai",
  "https://app.chakra.ai",
  "https://astra-console.vercel.app/",
];

if (import.meta.env.DEV) {
  trustedOrigins.push("http://localhost:3000", "https://console-127-0-0-1.nip.io");
}

export const auth = betterAuth({
  appName: "Chakra",
  database: drizzleAdapter(db, { provider: "pg" }),
  advanced: {
    database: {
      generateId: "uuid",
    },
    // crossSubDomainCookies: {
    //   enabled: isProduction(),
    //   domain: ".chakra.ai",
    // },
  },
  experimental: { joins: true },
  telemetry: { enabled: false },
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.VITE_BETTER_AUTH_URL,
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          // Sets the active organization for a user session
          // Finds the first organization the user is a member of and sets it as active
          const membership = await getFirstMembership(session.userId);
          return {
            data: {
              ...session,
              activeOrganizationId: membership?.organizationId,
            },
          };
        },
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    resetPasswordTokenExpiresIn: 60 * 60, // 1 hour
    async sendResetPassword({ user, url }) {
      await sendMail({
        from,
        to: user.email,
        subject: "Reset your password",
        react: ResetPasswordEmail({
          username: user.email,
          resetLink: url,
        }),
      });
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      const userName = user.name || (user.email.split("@")[0] as string);

      await sendMail({
        from,
        to: user.email,
        subject: "Verify your email address",
        react: VerifyEmail({
          userName,
          url,
        }),
      });
    },
    autoSignInAfterVerification: true,
    // sendOnSignIn: true, // sends a verification email on sign‑in if the user isn’t verified
    sendOnSignUp: true,
  },
  user: {
    changeEmail: {
      enabled: false,
      sendChangeEmailConfirmation: async ({ user, newEmail, url }) => {
        await sendMail({
          from,
          to: user.email, // Sent to the CURRENT email
          subject: "Approve email change",
          text: `Click the link to approve the change to ${newEmail}: ${url}`,
        });
      },
    },
    deleteUser: {
      enabled: false,
    },
    additionalFields: additionalUserFields,
  },
  account: {
    accountLinking: {
      trustedProviders: ["google", "github"],
      allowDifferentEmails: true,
    },
  },
  socialProviders: {
    ...(env.GITHUB_CLIENT_ID &&
      env.GITHUB_CLIENT_SECRET && {
        github: {
          clientId: env.GITHUB_CLIENT_ID,
          clientSecret: env.GITHUB_CLIENT_SECRET,
          scope: ["user:email", "read:user"],
        },
      }),
    ...(env.VITE_GOOGLE_CLIENT_ID &&
      env.GOOGLE_CLIENT_SECRET && {
        google: {
          clientId: env.VITE_GOOGLE_CLIENT_ID,
          clientSecret: env.GOOGLE_CLIENT_SECRET,
          scope: ["openid", "email", "profile"],
          requireEmailVerification: true,
        },
      }),
  },
  rateLimit: {
    window: 10, // time window in seconds
    max: 100, // max requests in the window
  },
  plugins: [
    lastLoginMethod({
      storeInDatabase: true,
    }),
    // FIXME: https://github.com/better-auth/better-auth/issues/9422
    deviceAuthorization({ schema: {} }),
    ...(env.VITE_GOOGLE_CLIENT_ID
      ? [
          oneTap({
            disableSignup: true,
            clientId: env.VITE_GOOGLE_CLIENT_ID,
          }),
        ]
      : []),
    jwt({
      jwt: {
        definePayload: async ({ user, session }) => {
          const member = await db.query.member.findFirst({
            // where: (mem, { eq }) => eq(mem.userId, user.id),
            where: (mem, { eq }) =>
              and(eq(mem.userId, user.id), eq(mem.organizationId, session.activeOrganizationId)),
          });

          // Only include essential user information for API authentication
          return {
            sub: user.id,
            name: user.name,
            roles: ["write-only", user.role], // for QueenMQ need `read-only` or `write-only` or `read-write` or `admin` roles
            banned: user.banned,
            email: user.email,
            emailVerified: user.emailVerified,
            orgId: member?.organizationId,
            orgRole: member?.role,
            orgMemberId: member?.id,
          };
        },
        expirationTime: env.BETTER_AUTH_JWT_EXPIRATION_TIME, // Extend from default 15 minutes to 1 hour for better UX
      },
    }),
    oauthProvider({
      loginPage: "/auth/sign-in",
      consentPage: "/auth/consent",
      scopes: ["openid", "profile", "email", "offline_access"] as const,
      // validAudiences: [env.API_SERVER_URL, `${env.API_SERVER_URL}/`],
      accessTokenExpiresIn: 3600, // (1 hour)
      refreshTokenExpiresIn: 2592000, // (30 days)
      responseTypes: ["authorization_code", "refresh_token"] as const,
      allowDynamicClientRegistration: true,
      clientReference: ({ session }) => {
        return (session?.activeOrganizationId as string | undefined) ?? undefined;
      },
      postLogin: {
        // Use the active organization as the consent reference
        // This makes consent org-scoped, not just user-scoped
        // Org selection is handled in the consent page, so never redirect to a separate page
        page: "/auth/consent",
        shouldRedirect: () => false,
        consentReferenceId: ({ session }) => {
          const activeOrganizationId = (session as { activeOrganizationId?: string })
            .activeOrganizationId;
          if (!activeOrganizationId) {
            throw new Error("Organization must be selected before consent");
          }
          return activeOrganizationId;
        },
      },
      // customIdTokenClaims: ({ user, scopes }) => {
      //   const claims: Record<string, any> = {};
      //   return claims;
      // },
      customAccessTokenClaims: ({ referenceId }) => ({
        organizationId: referenceId ?? undefined,
      }),
      silenceWarnings: {
        oauthAuthServerConfig: true,
        openidConfig: true,
      },
    }),
    multiSession(),
    magicLink({
      expiresIn: MAGIC_LINK_EXPIRES_SECONDS,
      sendMagicLink: async ({ email, url }) => {
        await sendMail({
          from,
          to: email,
          subject: "Sign in to Better Auth UI",
          text: `Sign in with this link (expires in ${String(MAGIC_LINK_EXPIRES_SECONDS / 60)} minutes): ${url}`,
          react: MagicLinkEmail({
            url,
            appName: "Chakra AI",
            email,
            expirationMinutes: MAGIC_LINK_EXPIRES_SECONDS / 60,
            poweredBy: true,
          }),
        });
      },
    }),
    organization({
      // schema: {
      //   organization: {
      //     additionalFields: {
      //       /* ... */
      //     },
      //   },
      //   member: {
      //     additionalFields: {
      //       /* ... */
      //     },
      //   },
      //   invitation: {
      //     additionalFields: {
      //       /* ... */
      //     },
      //   },
      //   team: { additionalFields: additionalTeamFields },
      // },
      ac, // Must be defined in order for dynamic access control to work
      roles,
      dynamicAccessControl: {
        enabled: true,
      },
      async allowUserToCreateOrganization(user) {
        console.info(user.name);
        // const subscription = await getSubscription(user.id)
        // return subscription.plan === "pro"
        return true;
      },
      membershipLimit: 100,
      organizationLimit: 5,
      teams: {
        enabled: true,
        maximumTeams: 10, // Optional: limit teams per organization
        allowRemovingAllTeams: false, // Optional: prevent removing the last team
      },
      async sendInvitationEmail(data) {
        await sendMail({
          from,
          to: data.email,
          subject: "You've been invited to join an organization",
          react: InviteUserEmail({
            username: data.email,
            invitedByUsername: data.inviter.user.name,
            invitedByEmail: data.inviter.user.email,
            teamName: data.organization.name,
            inviteLink: `${env.VITE_BETTER_AUTH_URL}/auth/accept-invitation?invitationId=${data.id}`,
          }),
        });
      },
      // organizationCreation: {
      //   disabled: true,
      // },
    }),
    /**
     * In the Better Auth admin plugin, you can define administrators in two distinct ways:
     * - by assigning the admin role to users in the database, or
     * - by listing their IDs in the `adminUserIds` configuration option
     * HINT: recommend to do both
     */
    admin({
      ac,
      roles,
      adminUserIds,
    }),
    /**
     * Permission: By default, organization **owners** have full access to all API key operations.
     * For other roles (like admin or member), you need to explicitly configure apiKey permissions in your organization plugin setup.
     */
    apiKey([
      {
        configId: "default",
        references: "user", // Default - owned by users
        enableSessionForAPIKeys: true, // Required for getSession to work with API Keys
        enableMetadata: true,
        defaultPrefix: "usr_",
        requireName: true,
        rateLimit: {
          enabled: false, // Disable rate limiting (if not needed)
        },
        permissions: {
          /**
           * NOTE: for now we will just grant all `member` permissions to all API keys
           *
           * If we'd like to allow granting "scopes" to API keys, we will need to implement a more complex API-key
           * permissions system/UI
           */
          defaultPermissions: {
            ...roles.member.statements,
          },
        },
      },
      {
        configId: "organization",
        references: "organization", // Owned by organizations
        // enableSessionForAPIKeys: true, // Required for getSession to work with API Keys
        enableMetadata: true,
        defaultPrefix: "org_",
        requireName: true,
        rateLimit: {
          enabled: false, // Disable rate limiting (if not needed)
        },
        permissions: {
          /**
           * NOTE: for now we will just grant all `member` permissions to all API keys
           *
           * If we'd like to allow granting "scopes" to API keys, we will need to implement a more complex API-key
           * permissions system/UI
           */
          defaultPermissions: {
            agents: ["read", "create", "update", "delete"],
          },
        },
      },
    ]),

    passkey({
      // rpID: env.WEB_BASE_URL,
      // rpName: 'astra',
      // origin: env.WEB_BASE_URL,
    }),
    openAPI(),
    // haveIBeenPwned({
    //   customPasswordCompromisedMessage: 'Please choose a more secure password.',
    // }),
    captcha({
      provider: "cloudflare-turnstile", // or google-recaptcha, hcaptcha, captchafox
      secretKey: env.TURNSTILE_SECRET_KEY,
      endpoints: [
        "/sign-up/email",
        "/sign-in/email",
        "/sign-in/username",
        "/request-password-reset",
      ],
    }),
    ...(process.env.VITEST === "true" ? [testUtils()] : []),
    tanstackStartCookies(), // make sure this is the last plugin in the array
  ],
  trustedOrigins,
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },
  // secondaryStorage: {
  //   // const redis = createClient();
  //   // await redis.connect();
  //   get: async (key) => {
  //     const value = await redis.get(key);
  //     return value ? value : null;
  //   },
  //   set: async (key, value, ttl) => {
  //     if (ttl) await redis.set(key, value, { EX: ttl });
  //     // or for ioredis:
  //     // if (ttl) await redis.set(key, value, 'EX', ttl)
  //     else await redis.set(key, value);
  //   },
  //   delete: async (key) => {
  //     await redis.del(key);
  //   },
  // },
});
