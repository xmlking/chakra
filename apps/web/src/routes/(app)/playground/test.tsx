import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { m } from "@workspace/i18n/messages";
import { Button } from "@workspace/ui/components/shadcn/button";
import { toast } from "sonner";

import {
  demoAdminOnlyFn,
  demoPermissionRequiredFn,
  demoRateLimitedFn,
} from "#features/playground/api/middleware-demo";
import { liveHealthQueryOptions } from "#features/playground/api/queries";

export const Route = createFileRoute("/(app)/playground/test")({
  staticData: {
    breadcrumb: ["Playground", "Test"],
  },
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(liveHealthQueryOptions);

    return null;
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isLoading } = useQuery(liveHealthQueryOptions);

  const handleRateLimitDemo = async () => {
    try {
      const result = await demoRateLimitedFn();
      toast.success(result.message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Rate limit check failed");
    }
  };

  const handleAdminDemo = async () => {
    try {
      const result = await demoAdminOnlyFn();
      toast.success(result.message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Admin access check failed");
    }
  };

  const handlePermissionDemo = async () => {
    try {
      const result = await demoPermissionRequiredFn();
      toast.success(result.message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Permission check failed");
    }
  };

  return (
    <div className="container-wrapper">
      <section className="mb-8">
        <h2 className="font-display mb-8 text-4xl">{m.playground_page__test_rpc()}</h2>
        <div className="rounded-lg border p-4">
          <h3 className="mb-2 font-medium">{m.playground_page__api_status()}</h3>
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${data && !isLoading ? `bg-success` : `bg-destructive`}`}
            />
            <span className="text-sm text-muted-foreground">
              {isLoading
                ? m.playground_page__checking()
                : data
                  ? m.playground_page__connected()
                  : m.playground_page__disconnected()}
            </span>
          </div>
        </div>
      </section>
      <section className="mb-8">
        <h2 className="font-display mb-8 text-4xl">Middleware demos</h2>
        <div className="space-y-4 rounded-lg border p-4">
          <div>
            <p className="mb-3 text-sm text-muted-foreground">
              Trigger the server function below repeatedly to exhaust the bucket and observe the
              429-style rate-limit error after 30 requests.
            </p>
            <Button onClick={handleRateLimitDemo}>Run rate-limit demo</Button>
          </div>
          <div>
            <p className="mb-3 text-sm text-muted-foreground">
              This calls the admin-only middleware and should fail unless the current session is an
              admin user.
            </p>
            <Button onClick={handleAdminDemo}>Run admin demo</Button>
          </div>
          <div>
            <p className="mb-3 text-sm text-muted-foreground">
              This exercises the permission middleware with an example permission payload.
            </p>
            <Button onClick={handlePermissionDemo}>Run permission demo</Button>
          </div>
        </div>
      </section>
      <section className="mb-8">
        <h2 className="font-display mb-8 text-4xl">{m.playground_page__test_error_handling()}</h2>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => {
              console.debug("playground", "Throwing test error from playground page...");
              throw new Error("Test error");
              // oxlint-disable-next-line no-unreachable
              console.debug("playground", "Error thrown!");
            }}
          >
            {m.playground_page__throw_error()}
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              toast.info(m.playground_page__test_toast_message);
            }}
          >
            {m.playground_page__test_toast()}
          </Button>
          <Button variant="outline">
            {/* @ts-ignore : OK */}
            <Link to="/playground/not-found">{m.playground_page__visit_not_found_page()}</Link>
          </Button>
          <Button variant="destructive">
            <Link to="/playground/error">{m.playground_page__visit_error_page()}</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
