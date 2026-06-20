import { viewPaths } from "@better-auth-ui/core";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Auth } from "@workspace/ui/components/auth/auth";
import { magicLinkPlugin } from "@workspace/ui/lib/auth/magic-link-plugin";
import { z } from "zod";

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

export const Route = createFileRoute("/(public)/auth/$path")({
  validateSearch: (search: Record<string, unknown>) => authSearchSchema.parse(search),
  beforeLoad({ params: { path } }) {
    if (!validAuthPathSegments.has(path)) {
      throw redirect({ to: "/" });
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
    <div className="mx-auto flex justify-center p-4 md:p-6">
      <Auth path={path} />
    </div>
  );
}
