// "use client";

import { captchaPlugin } from "@better-auth-ui/react/plugins";
import { Link, useNavigate } from "@tanstack/react-router";
import { authClient } from "@workspace/auth/client";
import { AuthProvider } from "@workspace/ui/components/auth/auth-provider";
import { Toaster } from "@workspace/ui/components/shadcn/sonner";
import { TooltipProvider } from "@workspace/ui/components/shadcn/tooltip";
import { ThemeProvider } from "@workspace/ui/components/theme-provider";
import { apiKeyPlugin } from "@workspace/ui/lib/auth/api-key-plugin";
import { deleteUserPlugin } from "@workspace/ui/lib/auth/delete-user-plugin";
import { magicLinkPlugin } from "@workspace/ui/lib/auth/magic-link-plugin";
import { multiSessionPlugin } from "@workspace/ui/lib/auth/multi-session-plugin";
import { organizationPlugin } from "@workspace/ui/lib/auth/organization-plugin";
import { passkeyPlugin } from "@workspace/ui/lib/auth/passkey-plugin";
import { domAnimation, LazyMotion, MotionConfig } from "motion/react";
import { Suspense, type ReactNode } from "react";

import { MetaTheme } from "#components/meta-theme";
import { TurnstileWidget } from "#components/turnstile-widget";

import { KBar } from "./kbar";

export function Providers({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  return (
    <ThemeProvider>
      <LazyMotion strict features={domAnimation}>
        <MotionConfig reducedMotion="user">
          <KBar>
            <TooltipProvider>
              <AuthProvider
                // @ts-ignore : FIXME
                authClient={authClient}
                redirectTo="/dashboard"
                socialProviders={["github", "google"]}
                emailAndPassword={{
                  requireEmailVerification: true,
                  confirmPassword: true,
                  rememberMe: true,
                }}
                navigate={navigate}
                plugins={[
                  magicLinkPlugin(),
                  passkeyPlugin(),
                  apiKeyPlugin({ organization: true }),
                  // themePlugin({ useTheme }), // NOTE: we use tweakcn switcher
                  multiSessionPlugin({
                    // Override any of the plugin's localization strings.
                    localization: {
                      switchAccount: "Switch Account",
                      addAccount: "Add Account",
                      manageAccounts: "Manage Accounts",
                    },
                  }),
                  deleteUserPlugin(),
                  organizationPlugin({
                    // Override path segments (defaults shown).
                    viewPaths: {
                      settings: { organizations: "organizations" },
                      organization: { settings: "settings", people: "people" },
                    },
                    localization: {
                      createOrganization: "Create Organization",
                    },
                    // Add labels for custom server roles without redefining built-ins.
                    additionalRoles: { billing: "Billing" },
                  }),
                  captchaPlugin({ render: TurnstileWidget }),
                ]}
                Link={({ href, ...props }) => <Link to={href} {...props} />}
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
              </Suspense>
            </TooltipProvider>
          </KBar>
        </MotionConfig>
      </LazyMotion>
    </ThemeProvider>
  );
}
