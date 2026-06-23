import { ensureSession as ensureSessionClient } from "@better-auth-ui/react";
import { ensureSession as ensureSessionServer } from "@better-auth-ui/react/server";
import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "@workspace/auth";
import { authClient } from "@workspace/auth/client";
import { Organization } from "@workspace/ui/components/auth/organization/organization";
import { organizationPlugin } from "@workspace/ui/lib/auth/organization-plugin";

const validOrganizationPaths = Object.values(organizationPlugin().viewPaths.organization);

export const Route = createFileRoute("/(app)/organization/$slug/$path")({
  async beforeLoad({ params: { path }, context: { queryClient }, location }) {
    if (!validOrganizationPaths.includes(path)) {
      throw notFound();
    }

    const ensureSession = createIsomorphicFn()
      .server(() => ensureSessionServer(queryClient, auth, { headers: getRequestHeaders() }))
      // @ts-ignore : TODO
      .client(() => ensureSessionClient(queryClient, authClient));

    const session = await ensureSession();

    if (!session) {
      throw redirect({
        to: "/auth/$path",
        params: { path: "sign-in" },
        search: { redirectTo: location.href },
      });
    }

    return { session };
  },
  component: OrganizationPage,
});

function OrganizationPage() {
  const { path } = Route.useParams();

  return (
    <div className="container-wrapper">
      <div className="mx-auto w-full max-w-3xl p-4 md:p-6">
        <Organization path={path} />
      </div>
    </div>
  );
}
