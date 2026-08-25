// oxlint-disable react-doctor/jsx-no-new-array-as-prop react-doctor/jsx-no-new-function-as-prop react-doctor/no-unstable-nested-components react-doctor/jsx-no-new-object-as-prop react-doctor/jsx-max-depth
// "use client";

import { captchaPlugin } from "@better-auth-ui/react/plugins/captcha";
import { oneTapPlugin } from "@better-auth-ui/react/plugins/one-tap";
import { Link, useNavigate /* useRouter */ } from "@tanstack/react-router";
import { authClient } from "@workspace/auth/client";
import { AuthProvider } from "@workspace/ui/components/auth/auth-provider";
import { Toaster as SonnerToster } from "@workspace/ui/components/shadcn/sonner";
import { Toaster } from "@workspace/ui/components/shadcn/toast";
import { TooltipProvider } from "@workspace/ui/components/shadcn/tooltip";
import { ThemeProvider } from "@workspace/ui/components/theme-provider";
import { adminPlugin } from "@workspace/ui/lib/auth/admin-plugin";
import { apiKeyPlugin } from "@workspace/ui/lib/auth/api-key-plugin";
import { deleteUserPlugin } from "@workspace/ui/lib/auth/delete-user-plugin";
import { lastLoginMethodPlugin } from "@workspace/ui/lib/auth/last-login-method-plugin";
import { magicLinkPlugin } from "@workspace/ui/lib/auth/magic-link-plugin";
import { multiSessionPlugin } from "@workspace/ui/lib/auth/multi-session-plugin";
import { organizationPlugin } from "@workspace/ui/lib/auth/organization-plugin";
import { passkeyPlugin } from "@workspace/ui/lib/auth/passkey-plugin";
import { domAnimation, LazyMotion, MotionConfig } from "motion/react";
import { Suspense, type ReactNode } from "react";

import { MetaTheme } from "#components/meta-theme";
import { TurnstileWidget } from "#components/turnstile-widget";

import { KBar } from "./kbar";
import { RouteProgressController, RouteProgressProvider } from "./layout/route-progress";

export function Providers({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  // const router = useRouter();

  return (
    <ThemeProvider>
      <LazyMotion strict features={domAnimation}>
        <MotionConfig reducedMotion="user">
          <RouteProgressProvider>
            <KBar>
              <TooltipProvider>
                <AuthProvider
                  basePaths={{
                    settings: "/user",
                  }}
                  // onSessionChange={() => {
                  //   queryClient.invalidateQueries({ queryKey: authQueryKeys.all })
                  // }}
                  // onSessionChange={async () => {
                  //   await router.invalidate();
                  // }}
                  // @ts-ignore : FIXME
                  authClient={authClient}
                  redirectTo="/dashboard"
                  socialProviders={["github", "google" /*"microsoft"*/]}
                  multipleAccountsPerProvider={false}
                  emailAndPassword={{
                    requireEmailVerification: true,
                    confirmPassword: true,
                    rememberMe: true,
                  }}
                  // @ts-ignore : FIXME
                  navigate={navigate}
                  plugins={[
                    adminPlugin({
                      // defaultRole: "member",
                      // impersonationRedirectTo: "/",
                      // pageSize: 25,
                      // roles: ["member", "support", "admin"],
                      // showIpAddress: false,
                    }),
                    lastLoginMethodPlugin(),
                    magicLinkPlugin(),
                    oneTapPlugin(),
                    passkeyPlugin(),
                    apiKeyPlugin({
                      organization: true,
                      keyExpiration: {
                        intervals: [7, 30, 90],
                        defaultInterval: 30,
                        allowNever: true,
                      },
                      configurations: [
                        { id: "default", label: "Personal", organization: false },
                        { id: "organization", label: "Organization", organization: true },
                      ],
                      pageSize: 20,
                      // permissions: [{ resource: "webhooks", actions: ["read", "write"] }],
                    }),
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
                        auth: { acceptInvitation: "accept-invitation" },
                        settings: { organizations: "organizations" },
                        organization: { settings: "settings", people: "people" },
                      },
                      localization: {
                        createOrganization: "Create Organization",
                      },
                      // Disable logo upload, or customize the resize / size.
                      // logo: { enabled: false },
                      // Add labels for custom server roles without redefining built-ins.
                      additionalRoles: { billing: "Billing" },
                      teams: true,
                      // Limit invitations and members to one role.
                      allowMultipleRoles: false,
                    }),
                    captchaPlugin({ render: TurnstileWidget }),
                  ]}
                  Link={({ href, ...props }) => <Link to={href} {...props} />}
                >
                  <RouteProgressController />
                  {children}
                </AuthProvider>
                <MetaTheme />
                <Suspense fallback={null}>
                  <Toaster />
                  <SonnerToster
                    // HINT: without this, the toaster will not fit correctly
                    // className="flex justify-center"
                    // duration={10_000}
                    position="bottom-right"
                    richColors
                    // toastOptions={{ style: { width: "fit-content" } }}
                  />
                </Suspense>
              </TooltipProvider>
            </KBar>
          </RouteProgressProvider>
        </MotionConfig>
      </LazyMotion>
    </ThemeProvider>
  );
}
