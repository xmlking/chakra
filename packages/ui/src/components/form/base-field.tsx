import { HelpCircle } from "lucide-react";
import type { ReactNode } from "react";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "#components/shadcn/field";
import { Tooltip, TooltipContent, TooltipTrigger } from "#components/shadcn/tooltip";

import { useFieldContext } from "./context";

/**
 * List of classes to change the classNames of the Field Slots.
 *
 * @example
 * ```ts
 * <form.AppField name="sourcePort" classNames={{
 *    base:"field-classes",
 *    label: "field-label-classes",
 *    input: "input-classes",
 *    error: "field-error-classes",
 *    description: "field-description-classes",
 * }} />
 * ``
 */
type ClassNameKeys = "base" | "label" | "input" | "error" | "description";

export type BaseFieldClassNames = Partial<Record<ClassNameKeys, string>>;

export type FieldControlProps = {
  label: string;
  classNames?: BaseFieldClassNames;
  description?: string;
  tooltip?: React.ReactNode;
  tooltipSide?: "top" | "right" | "bottom" | "left";
};

type BaseFieldProps = FieldControlProps & {
  children: ReactNode;
  orientation?: React.ComponentPropsWithoutRef<typeof Field>["orientation"];
};

export function BaseField({
  children,
  label,
  description,
  orientation,
  classNames,
  tooltip,
  tooltipSide = "top",
}: BaseFieldProps) {
  const field = useFieldContext();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field className={classNames?.base} data-invalid={isInvalid} orientation={orientation}>
      <FieldLabel className={classNames?.label} htmlFor={field.name}>
        {label}{" "}
        {tooltip && (
          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  className="inline-flex items-center justify-center"
                  tabIndex={-1}
                  type="button"
                >
                  <HelpCircle className="size-4 text-muted-foreground transition-colors hover:text-foreground" />
                </button>
              }
            />
            <TooltipContent side={tooltipSide}>{tooltip}</TooltipContent>
          </Tooltip>
        )}
      </FieldLabel>
      {children}
      {description && (
        <FieldDescription className={classNames?.description}>{description}</FieldDescription>
      )}
      {isInvalid && <FieldError className={classNames?.error} errors={field.state.meta.errors} />}
    </Field>
  );
}

export function BaseAltField({
  children,
  label,
  description,
  orientation,
  classNames,
  tooltip,
  tooltipSide = "top",
  controlFirst,
}: BaseFieldProps & { controlFirst?: boolean }) {
  const field = useFieldContext();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const fieldContent = (
    <FieldContent>
      <FieldLabel className={classNames?.label} htmlFor={field.name}>
        {label}{" "}
        {tooltip && (
          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  className="inline-flex items-center justify-center"
                  tabIndex={-1}
                  type="button"
                >
                  <HelpCircle className="size-4 text-muted-foreground transition-colors hover:text-foreground" />
                </button>
              }
            />
            <TooltipContent side={tooltipSide}>{tooltip}</TooltipContent>
          </Tooltip>
        )}
      </FieldLabel>
      {description && (
        <FieldDescription className={classNames?.description}>{description}</FieldDescription>
      )}
      {isInvalid && <FieldError className={classNames?.error} errors={field.state.meta.errors} />}
    </FieldContent>
  );

  return (
    <Field className={classNames?.base} data-invalid={isInvalid} orientation={orientation}>
      {controlFirst ? (
        <>
          {children}
          {fieldContent}
        </>
      ) : (
        <>
          {fieldContent}
          {children}
        </>
      )}
    </Field>
  );
}
