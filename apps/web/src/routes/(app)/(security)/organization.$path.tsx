import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { Organization } from "@workspace/ui/components/auth/organization/organization";
import { organizationPlugin } from "@workspace/ui/lib/auth/organization-plugin";

const validOrganizationPaths = Object.values(organizationPlugin().viewPaths.organization);

export const Route = createFileRoute("/(app)/(security)/organization/$path")({
  staticData: {
    breadcrumb: (match) => ["organization", `${match.params.path}`],
  },
  async beforeLoad({ params: { path }, context: { session }, location }) {
    if (!validOrganizationPaths.includes(path)) {
      throw notFound();
    }

    if (!session) {
      throw redirect({
        to: "/auth/$path",
        params: { path: "sign-in" },
        search: { redirectTo: location.href },
      });
    }

    return { session };
  },
  head: () => ({
    meta: [{ title: "User | Chakra" }],
  }),
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
