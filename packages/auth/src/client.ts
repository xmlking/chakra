import { apiKeyClient } from "@better-auth/api-key/client";
import { oauthProviderClient } from "@better-auth/oauth-provider/client";
import { passkeyClient } from "@better-auth/passkey/client";
import {
  adminClient,
  deviceAuthorizationClient,
  inferAdditionalFields,
  lastLoginMethodClient,
  magicLinkClient,
  multiSessionClient,
  oneTapClient,
  jwtClient,
  organizationClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { inboxClient } from "better-inbox/client";
import env from "virtual:env/client";

import type { auth } from ".";
import { additionalUserFields } from "./additional-fields";
import { ac, roles } from "./permissions";

export const authClient = createAuthClient({
  baseURL: env.VITE_BETTER_AUTH_URL,
  // sessionOptions: {
  //   refetchOnWindowFocus: false,
  // },
  fetchOptions: {
    onSuccess: (ctx) => {
      const jwtToken = ctx.response.headers.get("set-auth-jwt");
      if (jwtToken) {
        // oxlint-disable-next-line react-doctor/auth-token-in-web-storage : FIXME
        localStorage.setItem("jwtToken:v1", JSON.stringify(jwtToken));
      }
    },
  },
  plugins: [
    inboxClient(),
    lastLoginMethodClient(),
    passkeyClient(),
    oauthProviderClient(),
    deviceAuthorizationClient(),
    ...(env.VITE_GOOGLE_CLIENT_ID
      ? [
          oneTapClient({
            // HINT: https://developers.google.com/identity/sign-in/web/gsi-with-fedcm
            clientId: env.VITE_GOOGLE_CLIENT_ID,
            // Optional client configuration:
            autoSelect: false,
            cancelOnTapOutside: true,
            context: "signin",
            additionalOptions: {
              // Any extra options for the Google initialize method
            },
            // Configure prompt behavior and exponential backoff:
            promptOptions: {
              baseDelay: 1000, // Base delay in ms (default: 1000)
              maxAttempts: 3, // Maximum number of attempts before triggering onPromptNotification (default: 5)
            },
          }),
        ]
      : []),
    apiKeyClient(),
    jwtClient(),
    adminClient({
      ac,
      roles,
    }),
    organizationClient({
      ac, // Must be defined in order for dynamic access control to work
      roles,
      dynamicAccessControl: {
        enabled: true,
      },
      teams: {
        enabled: true,
      },
      // schema: {
      //   team: { additionalFields: additionalTeamFields },
      // },
    }),
    multiSessionClient(),
    magicLinkClient(),
    inferAdditionalFields<typeof auth>({
      user: additionalUserFields,
    }),
  ],
});

// FIXME: workaround https://github.com/better-auth/better-auth/issues/3780
export type AuthClient = typeof authClient.$Infer;
export type Session = typeof authClient.$Infer.Session | null;
export type User = typeof authClient.$Infer.Session.user | null;
