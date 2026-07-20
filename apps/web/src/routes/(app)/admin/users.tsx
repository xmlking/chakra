import { createFileRoute, redirect } from "@tanstack/react-router";
// import { auth } from "@workspace/auth";

import { DashboardPageSkeleton } from "#features/dashboard/dashboard-page-skeleton.tsx";

export const Route = createFileRoute("/(app)/admin/users")({
  staticData: {
    breadcrumb: ["Admin", "Users"],
  },
  async beforeLoad({ context: { session }, location }) {
    if (!session) {
      throw redirect({
        to: "/auth/$path",
        params: { path: "sign-in" },
        search: { redirectTo: location.href },
      });
    }

    // Check if the user has the 'admin' role
    // @ts-ignore TODO
    if (session?.user.role !== "admin") {
      throw redirect({ to: "/forbidden" });
    }

    /**
     * Before performing any admin operations, the user must be authenticated with an admin account.
     * An admin is any user assigned the `admin` role or any user whose ID is included in the `adminUserIds` option.
     */
    // const canListUsers = await auth.api.userHasPermission({
    //   body: {
    //     userId: session.user.id,
    //     permissions: { user: ["list"] },
    //   },
    // });
    // if (!canListUsers.success) {
    //   throw redirect({ to: "/forbidden" });
    // }

    return { session };
  },
  head: () => ({
    meta: [{ title: "Users | Admin" }],
  }),
  pendingComponent: DashboardPageSkeleton,
  component: UsersPage,
});

function UsersPage() {
  return <div>Hello "/(app)/admin/users"!</div>;
}
