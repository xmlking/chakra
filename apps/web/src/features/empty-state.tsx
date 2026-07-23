import { IconStack } from "@workspace/ui/components/reui/icon-stack";
import { Button } from "@workspace/ui/components/shadcn/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/shadcn/empty";
import { FlagIcon, RotateCcwIcon } from "lucide-react";

type BacklogEmptyStateProps = {
  onRestore?: () => void;
};

export function BacklogEmptyState({ onRestore }: BacklogEmptyStateProps) {
  return (
    <div className="flex w-full justify-center py-10">
      <Empty className="max-w-md flex-none gap-6 rounded-none border-0 bg-transparent p-0 text-foreground">
        <EmptyHeader className="items-center gap-5 text-center">
          <EmptyMedia className="mb-0">
            <IconStack aria-hidden="true">
              <FlagIcon strokeWidth="1.9" aria-hidden="true" />
            </IconStack>
          </EmptyMedia>

          <div className="flex flex-col items-center gap-1.5">
            <EmptyTitle>Backlog Is Empty</EmptyTitle>
            <EmptyDescription className="max-w-80">
              Restore the seeded items to keep ranking sprint priorities.
            </EmptyDescription>
          </div>
        </EmptyHeader>

        {onRestore ? (
          <EmptyContent className="max-w-none items-center gap-0">
            <Button type="button" onClick={onRestore}>
              <RotateCcwIcon data-icon="inline-start" aria-hidden="true" />
              Restore backlog
            </Button>
          </EmptyContent>
        ) : null}
      </Empty>
    </div>
  );
}
