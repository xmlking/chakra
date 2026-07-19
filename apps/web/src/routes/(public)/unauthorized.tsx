import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/shadcn/button";

export const Route = createFileRoute("/(public)/unauthorized")({
  staticData: {
    breadcrumb: "Unauthorised",
  },
  component: Unauthorised,
});

function Unauthorised() {
  const router = useRouter();
  return (
    <div className="h-svh">
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        <h1 className="text-[7rem] leading-tight font-bold">401</h1>
        <span className="font-medium">Unauthorized Access</span>
        <p className="text-center text-muted-foreground">
          Please log in with the appropriate credentials <br /> to access this resource.
        </p>
        <div className="mt-6 flex gap-4">
          <Button onClick={() => router.history.back()} variant="outline">
            Go Back
          </Button>
          <Button onClick={() => router.navigate({ to: "/" })}>Back to Home</Button>
          <Button
            onClick={() => router.navigate({ to: "/auth/$path", params: { path: "sign-in" } })}
          >
            Sign In
          </Button>
        </div>
      </div>
    </div>
  );
}
