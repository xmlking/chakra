import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { m } from "@workspace/i18n/messages";
import { ForbiddenError, RateLimitError } from "@workspace/shared/errors";
import { Button } from "@workspace/ui/components/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/shadcn/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/shadcn/tabs";
import { toast } from "@workspace/ui/components/shadcn/toast";

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
      toast.add({ title: result.message, type: "success" });
    } catch (error) {
      if (error instanceof RateLimitError) {
        toast.add({ title: `Rate limited: ${error.message}`, type: "error" });
      } else {
        toast.add({
          title: error instanceof Error ? error.message : "Rate limit check failed",
          type: "error",
        });
      }
    }
  };

  const handleAdminDemo = async () => {
    try {
      const result = await demoAdminOnlyFn();
      toast.add({ title: result.message, type: "success" });
    } catch (error) {
      if (error instanceof ForbiddenError) {
        toast.add({ title: `Forbidden: ${error.message}`, type: "error" });
      } else {
        toast.add({
          title: error instanceof Error ? error.message : "Admin access check failed",
          type: "error",
        });
      }
    }
  };

  const handlePermissionDemo = async () => {
    try {
      const result = await demoPermissionRequiredFn();
      toast.add({ title: result.message, type: "success" });
    } catch (error) {
      if (error instanceof ForbiddenError) {
        toast.add({ title: `Forbidden: ${error.message}`, type: "error" });
      } else {
        toast.add({
          title: error instanceof Error ? error.message : "Permission check failed",
          type: "error",
        });
      }
    }
  };

  return (
    <div className="container-wrapper">
      <div className="mb-12 space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Playground</h1>
        <p className="text-lg text-muted-foreground">
          Test API integrations, error handling, and component behaviors
        </p>
      </div>

      <Tabs defaultValue="rpc" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="rpc">RPC Status</TabsTrigger>
          <TabsTrigger value="middleware">Middleware</TabsTrigger>
          <TabsTrigger value="errors">Errors</TabsTrigger>
          <TabsTrigger value="toast">Toast Examples</TabsTrigger>
        </TabsList>

        <TabsContent value="rpc" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{m.playground_page__api_status()}</CardTitle>
              <CardDescription>Current connection status to the API</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div
                  className={`h-3 w-3 rounded-full ${data && !isLoading ? `bg-success` : `bg-destructive`}`}
                />
                <span className="text-sm font-medium">
                  {isLoading
                    ? m.playground_page__checking()
                    : data
                      ? m.playground_page__connected()
                      : m.playground_page__disconnected()}
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="middleware" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Rate Limit Demo</CardTitle>
                <CardDescription>
                  Trigger repeatedly to exhaust the bucket and observe the 429-style error after 30
                  requests.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleRateLimitDemo}>Run rate-limit demo</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Admin Demo</CardTitle>
                <CardDescription>
                  This calls the admin-only middleware and should fail unless the current session is
                  an admin user.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleAdminDemo}>Run admin demo</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Permission Demo</CardTitle>
                <CardDescription>
                  This exercises the permission middleware with an example permission payload.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handlePermissionDemo}>Run permission demo</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="errors" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Throw Error</CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Test Toast</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="secondary"
                  onClick={() => {
                    toast.add({ title: m.playground_page__test_toast_message(), type: "info" });
                  }}
                >
                  {m.playground_page__test_toast()}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Not Found Page</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline">
                  {/* @ts-ignore : OK */}
                  <Link to="/playground/not-found">
                    {m.playground_page__visit_not_found_page()}
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Error Page</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="destructive">
                  <Link to="/playground/error">{m.playground_page__visit_error_page()}</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="toast" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Toast Types</CardTitle>
                <CardDescription>Success, Error, Info, Warning, Loading</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={() =>
                      toast.add({
                        title: "Success Toast",
                        description: "This is a success message",
                        type: "success",
                        timeout: 5000,
                      })
                    }
                  >
                    Success
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() =>
                      toast.add({
                        title: "Error Toast",
                        description: "Something went wrong",
                        type: "error",
                        timeout: 0,
                      })
                    }
                  >
                    Error
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      toast.add({
                        title: "Info Toast",
                        description: "Here is some information",
                        type: "info",
                        timeout: 5000,
                      })
                    }
                  >
                    Info
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      toast.add({
                        title: "Warning Toast",
                        description: "Please be careful",
                        type: "warning",
                        timeout: 5000,
                      })
                    }
                  >
                    Warning
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      toast.add({
                        title: "Loading Toast",
                        description: "Processing your request...",
                        type: "loading",
                        timeout: 0,
                      })
                    }
                  >
                    Loading
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Toast Durations</CardTitle>
                <CardDescription>Auto-dismiss timing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={() =>
                      toast.add({
                        title: "Short Duration (2s)",
                        type: "info",
                        timeout: 2000,
                      })
                    }
                  >
                    2 seconds
                  </Button>
                  <Button
                    size="sm"
                    onClick={() =>
                      toast.add({
                        title: "Long Duration (10s)",
                        type: "info",
                        timeout: 10000,
                      })
                    }
                  >
                    10 seconds
                  </Button>
                  <Button
                    size="sm"
                    onClick={() =>
                      toast.add({
                        title: "Persistent Toast",
                        description: "This will not auto-dismiss",
                        type: "info",
                        timeout: 0,
                        actionProps: {
                          children: "Dismiss",
                          onClick() {
                            toast.close();
                          },
                        },
                      })
                    }
                  >
                    Persistent
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">With Action Button</CardTitle>
                <CardDescription>Toast with custom action</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  size="sm"
                  onClick={() => {
                    const id = toast.add({
                      title: "Toast with Action",
                      description: "Click the action button to dismiss",
                      type: "info",
                      timeout: 0,
                      actionProps: {
                        children: "Dismiss",
                        onClick() {
                          toast.close(id);
                        },
                      },
                    });
                  }}
                >
                  Show Toast with Action
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Promise-based Toast</CardTitle>
                <CardDescription>Loading, success, and error states</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      void toast.promise(
                        new Promise((resolve) => {
                          setTimeout(() => resolve("Done!"), 2000);
                        }),
                        {
                          loading: { title: "Loading...", description: "Please wait" },
                          success: { title: "Success!", description: "Operation completed" },
                          error: { title: "Error", description: "Something failed" },
                        },
                      );
                    }}
                  >
                    Success Promise (2s)
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      void toast.promise(
                        new Promise((_resolve, reject) => {
                          setTimeout(() => reject(new Error("Failed")), 2000);
                        }),
                        {
                          loading: { title: "Loading...", description: "Please wait" },
                          success: { title: "Success!", description: "Operation completed" },
                          error: { title: "Error", description: "Something went wrong" },
                        },
                      );
                    }}
                  >
                    Error Promise (2s)
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Toast with Description</CardTitle>
                <CardDescription>Multi-line content example</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  size="sm"
                  onClick={() =>
                    toast.add({
                      title: "Detailed Toast",
                      description:
                        "This is a more detailed message that provides additional context about what happened. You can include multiple lines of text here.",
                      type: "info",
                      timeout: 8000,
                    })
                  }
                >
                  Show Detailed Toast
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
