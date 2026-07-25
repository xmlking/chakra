"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@workspace/ui/components/shadcn/alert-dialog";
import type { Button } from "@workspace/ui/components/shadcn/button";
import { Spinner } from "@workspace/ui/components/shadcn/spinner";
import type { ComponentProps, ReactNode } from "react";

export interface ConfirmationDialogProps {
  open: boolean;
  title: ReactNode;
  description: ReactNode;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
  cancelLabel?: ReactNode;
  confirmLabel?: ReactNode;
  confirmVariant?: ComponentProps<typeof Button>["variant"];
  icon?: ReactNode;
  isPending?: boolean;
  size?: "default" | "sm";
  children?: ReactNode;
}

export function ConfirmationDialog({
  open,
  title,
  description,
  onOpenChange,
  onConfirm,
  cancelLabel = "Cancel",
  confirmLabel = "Confirm",
  confirmVariant = "default",
  icon,
  isPending = false,
  size = "default",
  children,
}: ConfirmationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent size={size}>
        <AlertDialogHeader>
          {icon ? <AlertDialogMedia>{icon}</AlertDialogMedia> : null}
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        {children}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            type="button"
            variant={confirmVariant}
            disabled={isPending}
            onClick={onConfirm}
          >
            {isPending ? <Spinner data-icon="inline-start" /> : null}
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
