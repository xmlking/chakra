import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/shadcn/card";
import { cn } from "@workspace/ui/lib/utils";
import { type ReactNode } from "react";

interface RenewalsCommandCardProps {
  title: string;
  description?: ReactNode;
  meta?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function RenewalsCommandCard({
  title,
  description,
  meta,
  action,
  children,
  footer,
  className,
  contentClassName,
}: RenewalsCommandCardProps) {
  return (
    <Card className={cn("w-full gap-0 p-0", className)}>
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between gap-4 border-b px-5 py-4">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <CardTitle>{title}</CardTitle>
          {description ? (
            <CardDescription className="text-xs">{description}</CardDescription>
          ) : null}
          {meta ? <div className="flex flex-wrap items-center gap-2">{meta}</div> : null}
        </div>
        {action ? <CardAction className="self-center">{action}</CardAction> : null}
      </CardHeader>

      {/* Content */}
      <CardContent className={cn("p-0", contentClassName)}>{children}</CardContent>

      {footer ? <CardFooter className="border-t px-5 py-3">{footer}</CardFooter> : null}
    </Card>
  );
}
