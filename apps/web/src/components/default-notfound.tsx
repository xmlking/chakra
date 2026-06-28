import { Link, type NotFoundRouteProps } from "@tanstack/react-router";
import { m } from "@workspace/i18n/messages";
import { Button, buttonVariants } from "@workspace/ui/components/shadcn/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@workspace/ui/components/shadcn/empty";
import { Home } from "lucide-react";

export function DefaultNotFound(_props: NotFoundRouteProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Empty>
        <EmptyHeader>
          <EmptyTitle className="mask-b-from-20% mask-b-to-80% text-9xl font-extrabold">
            {m.error_404__title()}
          </EmptyTitle>
          <EmptyDescription className="-mt-8 text-nowrap text-foreground/80">
            {m.error_404__description_line_1()} <br />
            {m.error_404__description_line_2()}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Button onClick={() => window.history.back()} size="lg">
              Go back
            </Button>
            <Link to="/" className={buttonVariants({ size: "lg" })}>
              <Home data-icon="inline-start" />
              {m.error_404__go_home()}
            </Link>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  );
}
