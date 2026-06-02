import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { Link, rootRouteId, useMatch, useRouter } from "@tanstack/react-router";
import type { ErrorComponentProps } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/shadcn/accordion";
import { Alert, AlertDescription, AlertTitle } from "@workspace/ui/components/shadcn/alert";
import { Button } from "@workspace/ui/components/shadcn/button";
import { AlertTriangleIcon } from "lucide-react";
import { useEffect } from "react";

import { getIsDev } from "#lib/helpers.isomorphic";

export function DefaultError(props: ErrorComponentProps) {
  const router = useRouter();
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  });

  const isDev = getIsDev();

  const queryClientErrorBoundary = useQueryErrorResetBoundary();

  useEffect(() => {
    queryClientErrorBoundary.reset();
  }, [queryClientErrorBoundary]);

  return (
    <div className="mt-8 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Alert variant="destructive">
          <AlertTriangleIcon className="size-4" />
          <AlertTitle>Oops! Something went wrong</AlertTitle>
          <AlertDescription>
            We&apos;re sorry, but we encountered an unexpected error.
          </AlertDescription>
        </Alert>

        <div className="mt-4 space-y-4">
          <Button
            className="w-full"
            onClick={async () => {
              await router.invalidate();
            }}
          >
            Try again
          </Button>
          <Button className="w-full" variant="outline">
            {isRoot ? (
              <Link to="/">Home</Link>
            ) : (
              <Link
                to="/"
                onClick={(e) => {
                  e.preventDefault();
                  window.history.back();
                }}
              >
                Go Back
              </Link>
            )}
          </Button>
          {isDev ? (
            <Accordion className="w-full">
              <AccordionItem value="error-details">
                <AccordionTrigger>View error details</AccordionTrigger>
                <AccordionContent>
                  <div className="rounded-md bg-muted p-4">
                    <h3 className="mb-2 font-semibold">Error Message:</h3>
                    <p className="mb-4 text-sm">{props.error.message}</p>
                    <h3 className="mb-2 font-semibold">Stack Trace:</h3>
                    <pre className="overflow-x-auto text-xs whitespace-pre-wrap">
                      {props.error.stack}
                    </pre>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ) : null}
        </div>
      </div>
    </div>
  );
}
