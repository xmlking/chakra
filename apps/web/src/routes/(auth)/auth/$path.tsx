import { viewPaths } from "@better-auth-ui/core";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { authClient } from "@workspace/auth/client";
import { Auth } from "@workspace/ui/components/auth/auth";
import { magicLinkPlugin } from "@workspace/ui/lib/auth/magic-link-plugin";
import { z } from "zod";

import { safeRedirect } from "#features/auth/safe-redirect.ts";

const validAuthPathSegments = new Set([
  ...Object.values(viewPaths.auth),
  magicLinkPlugin().viewPaths.auth.magicLink,
]);

const authPathTitles: Record<string, string> = {
  "forgot-password": "Forgot Password",
  "reset-password": "Reset Password",
  "sign-in": "Sign In",
  "sign-out": "Sign Out",
  "sign-up": "Sign Up",
};

const authSearchSchema = z.object({
  redirectTo: z.string().optional(),
});

export const Route = createFileRoute("/(auth)/auth/$path")({
  validateSearch: (search: Record<string, unknown>) => authSearchSchema.parse(search),
  ssr: false,
  async beforeLoad({ params: { path }, search }) {
    if (!validAuthPathSegments.has(path)) {
      throw redirect({ to: "/" });
    }

    const { data: session } = await authClient.getSession();

    if (path === viewPaths.auth.signOut && !session) {
      throw redirect({
        params: { path: viewPaths.auth.signIn },
        replace: true,
        to: "/auth/$path",
      });
    }

    if (path !== viewPaths.auth.signOut && session) {
      throw redirect({ replace: true, to: safeRedirect(search.redirectTo) });
    }
  },
  head: ({ params }) => ({
    meta: [{ title: `${authPathTitles[params.path] ?? "Authentication"} | Chakra` }],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { path } = Route.useParams();

  return (
    <div className="my-auto flex justify-center p-4 md:p-6">
      <Auth path={path} />
    </div>
  );
}
