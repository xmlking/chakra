import { ThemeProvider, useTheme } from "@lonik/themer";
import { Link, useRouter, useParams, useNavigate } from "@tanstack/react-router";
import { authClient } from "@workspace/auth/client";
import { AuthProvider } from "@workspace/ui/components/auth/auth-provider";
import { Toaster } from "@workspace/ui/components/shadcn/sonner";
import { TooltipProvider } from "@workspace/ui/components/shadcn/tooltip";
import { apiKeyPlugin } from "@workspace/ui/lib/auth/api-key-plugin";
import { deleteUserPlugin } from "@workspace/ui/lib/auth/delete-user-plugin";
import { magicLinkPlugin } from "@workspace/ui/lib/auth/magic-link-plugin";
import { multiSessionPlugin } from "@workspace/ui/lib/auth/multi-session-plugin";
import { organizationPlugin } from "@workspace/ui/lib/auth/organization-plugin";
import { passkeyPlugin } from "@workspace/ui/lib/auth/passkey-plugin";
import { themePlugin } from "@workspace/ui/lib/auth/theme-plugin";
import { usernamePlugin } from "@workspace/ui/lib/auth/username-plugin";
import { Suspense, type ReactNode } from "react";
import env from "virtual:env/client";

import { MetaTheme } from "#components/meta-theme";
import { WelcomeToast } from "#components/welcome-toast";

const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();
  const navigate = useNavigate();
  const params = useParams({ strict: false, shouldThrow: false });
  const slug = params?.slug;

  return (
    <ThemeProvider defaultTheme="system" enableSystem>
      <TooltipProvider>
        <AuthProvider
          // @ts-ignore : FIXME
          authClient={authClient}
          redirectTo="/dashboard"
          socialProviders={["github", "google"]}
          navigate={navigate}
          captcha={{
            provider: "cloudflare-turnstile",
            siteKey: env.VITE_TURNSTILE_SITE_KEY,
          }}
          credentials={{
            passwordValidation: {
              minLength: 8,
              maxLength: 64,
              regex: PASSWORD_REGEX,
            },
            confirmPassword: true,
            rememberMe: true,
          }}
          deleteUser={{
            verification: true,
          }}
          emailVerification
          gravatar
          multiSession
          oneTap
          onSessionChange={async () => {
            // Clear router cache (protected routes)
            await router.invalidate(); // Triggers a re-render and re-runs route loaders
          }}
          optimistic
          organization={{
            logo: true,
            apiKey: true,
            personalPath: "/",
            customRoles: [{ role: "billing", label: "Billing" }],
            viewPaths: {
              SETTINGS: "settings",
              MEMBERS: "members",
              TEAMS: "teams",
              API_KEYS: "api-keys",
            },
          }}
          passkey
          // @ts-ignore : FIXME
          replace={(href) => navigate({ href, replace: true })}
          teams={{
            enabled: true,
            customRoles: [{ role: "billing", label: "Billing" }],
            colors: {
              count: 5,
              prefix: "team",
            },
          }}
          plugins={[
            usernamePlugin({
              maxUsernameLength: 8,
              minUsernameLength: 64,
            }),
            magicLinkPlugin(),
            passkeyPlugin(),
            apiKeyPlugin({ organization: true }),
            themePlugin({ useTheme }),
            multiSessionPlugin(),
            deleteUserPlugin(),
            organizationPlugin({
              slug: slug ?? null,
            }),
          ]}
          Link={Link}
        >
          {children}
        </AuthProvider>
        <MetaTheme />
        <Suspense fallback={null}>
          <Toaster
            // HINT: without this, the toaster will not fit correctly
            className="flex justify-center"
            duration={10_000}
            position="bottom-right"
            richColors
            toastOptions={{ style: { width: "fit-content" } }}
          />
          <WelcomeToast />
        </Suspense>
      </TooltipProvider>
    </ThemeProvider>
  );
}
