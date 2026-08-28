import { Button } from "@workspace/ui/components/shadcn/button";
import { Field, FieldTitle } from "@workspace/ui/components/shadcn/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from "@workspace/ui/components/shadcn/input-group";
import { Item, ItemMedia } from "@workspace/ui/components/shadcn/item";
import { Spinner } from "@workspace/ui/components/shadcn/spinner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@workspace/ui/components/shadcn/tooltip";
import { cn } from "@workspace/ui/lib/utils";
import { InfoIcon, PencilIcon, XIcon, CheckIcon } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

interface EditableDetailRowProps {
  label: string;
  hint?: string;
  editing?: boolean;
  display: ReactNode;
  renderEdit?: (active: boolean) => ReactNode;
  align?: "center" | "start";
  actionsDisabled?: boolean;
  saving?: boolean;
  onEdit?: () => void;
  onCancel?: () => void;
  onSave?: () => void;
}

function RowHint({ label, children }: { label: string; children: string }) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="-my-1 shrink-0 text-muted-foreground hover:text-foreground"
            aria-label={label}
          />
        }
      >
        <InfoIcon aria-hidden="true" />
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-64 text-xs leading-relaxed">
        {children}
      </TooltipContent>
    </Tooltip>
  );
}

export function EditableDetailRow({
  label,
  hint,
  editing = false,
  display,
  renderEdit,
  align = "center",
  actionsDisabled = false,
  saving = false,
  onEdit,
  onCancel,
  onSave,
}: EditableDetailRowProps) {
  const editable = Boolean(renderEdit && onEdit && onCancel && onSave);
  const controlsDisabled = actionsDisabled || saving;
  const controlActive = !controlsDisabled;
  const editActionsDisabled = !editing || controlsDisabled;
  const editRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editing) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      const control = editRef.current?.querySelector<HTMLElement>(
        [
          "[data-slot='input-group-control']:not(:disabled)",
          "[data-slot='combobox-chip-input']:not(:disabled)",
          "button:not(:disabled)",
          "input:not(:disabled)",
        ].join(","),
      );

      control?.focus({ preventScroll: true });
    });

    return () => cancelAnimationFrame(frame);
  }, [editing]);

  return (
    <Field
      className={cn(
        "group/row grid gap-x-2 gap-y-0.5 px-4 py-0.5 sm:grid-cols-[minmax(7.75rem,0.5fr)_minmax(0,1.5fr)] sm:gap-x-4",
        align === "start" ? "sm:items-start" : "sm:items-center",
      )}
    >
      <FieldTitle
        className={cn(
          "flex min-w-0 items-center gap-1 text-sm font-normal text-muted-foreground",
          align === "start" && "sm:min-h-8",
        )}
      >
        <span className="min-w-0 truncate">{label}</span>
        {hint ? <RowHint label={`${label} info`}>{hint}</RowHint> : null}
      </FieldTitle>

      {renderEdit ? (
        <div
          className={cn(
            "relative col-start-1 row-start-2 min-h-8 min-w-0 sm:col-start-2 sm:row-start-1",
            align === "start" ? "items-start" : "items-center",
          )}
        >
          <button
            type="button"
            disabled={!editable || controlsDisabled || editing}
            aria-label={`Edit ${label}`}
            aria-hidden={editing}
            className={cn(
              "group/value flex w-full min-w-0 rounded-md border border-transparent px-2.5 text-left transition-[opacity,color,background-color] duration-150 outline-none",
              align === "start" ? "h-auto min-h-8 items-start py-1" : "h-8 items-center",
              editable &&
                "hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring/50 active:bg-muted/40 sm:group-hover/row:bg-muted/40",
              controlsDisabled && "pointer-events-none",
              editing
                ? "pointer-events-none absolute inset-x-0 top-0 opacity-0"
                : "relative opacity-100",
            )}
            onClick={onEdit}
          >
            <span
              className={cn("flex min-w-0", align === "start" ? "items-start" : "items-center")}
            >
              {display}
            </span>
            {editable ? (
              <Item
                render={<span />}
                className={cn(
                  "p-0",
                  "ml-1.5 flex size-5 shrink-0 items-center justify-center text-muted-foreground opacity-100 transition-opacity sm:opacity-0 sm:group-hover/row:opacity-100 sm:group-focus-visible/value:opacity-100",
                  controlsDisabled && "invisible opacity-0 sm:opacity-0",
                )}
              >
                <ItemMedia variant="icon" className="size-auto">
                  <PencilIcon className="size-3.5" aria-hidden="true" />
                </ItemMedia>
              </Item>
            ) : null}
          </button>

          <div
            ref={editRef}
            aria-hidden={!editing}
            inert={!editing ? true : undefined}
            className={cn(
              "min-w-0 transition-opacity duration-150",
              editing
                ? "relative opacity-100"
                : "pointer-events-none absolute inset-x-0 top-0 opacity-0",
            )}
          >
            <InputGroup
              className={cn(
                "box-border w-full has-[[data-slot=input-group-control]:focus-visible]:border-input! has-[[data-slot=input-group-control]:focus-visible]:shadow-none! has-[[data-slot=input-group-control]:focus-visible]:ring-0!",
                align === "start" ? "h-auto! min-h-8! items-start" : "h-8",
              )}
            >
              {renderEdit(controlActive)}
              {editable ? (
                <InputGroupAddon
                  align="inline-end"
                  className={cn("gap-1 pr-2", align === "start" && "self-start pt-1")}
                >
                  <InputGroupButton
                    size="icon-xs"
                    aria-label={`Discard ${label}`}
                    disabled={editActionsDisabled}
                    onClick={onCancel}
                  >
                    <XIcon className="size-4" aria-hidden="true" />
                  </InputGroupButton>
                  <InputGroupButton
                    size="icon-xs"
                    aria-label={saving ? `Saving ${label}` : `Save ${label}`}
                    disabled={editActionsDisabled}
                    onClick={onSave}
                  >
                    {saving ? (
                      <Spinner className="size-3.5" />
                    ) : (
                      <CheckIcon className="size-4" aria-hidden="true" />
                    )}
                  </InputGroupButton>
                </InputGroupAddon>
              ) : null}
            </InputGroup>
          </div>
        </div>
      ) : (
        <div className="col-start-1 row-start-2 flex min-h-8 min-w-0 items-center px-2.5 sm:col-start-2 sm:row-start-1">
          {display}
        </div>
      )}
    </Field>
  );
}
