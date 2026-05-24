import { Link, type NotFoundRouteProps } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/shadcn/button";

export function NotFound(_props: NotFoundRouteProps) {
  return (
    <div className="space-y-2 p-2">
      <div className="text-gray-600 dark:text-gray-400">
        <p>The page you are looking for does not exist.</p>
      </div>
      <p className="flex flex-wrap items-center gap-2">
        <Button
          onClick={() => window.history.back()}
          className="rounded-sm bg-emerald-500 px-2 py-1 text-sm font-black text-white uppercase"
        >
          Go back
        </Button>
        <Link
          to="/"
          className="rounded-sm bg-cyan-600 px-2 py-1 text-sm font-black text-white uppercase"
        >
          Start Over
        </Link>
      </p>
    </div>
  );
}
