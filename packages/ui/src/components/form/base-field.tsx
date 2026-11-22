import { HelpCircle } from "lucide-react";
import type { ReactNode } from "react";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "#components/shadcn/field";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "#components/shadcn/hover-card";
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
  tooltipAlign?: "start" | "center" | "end";
};

type BaseFieldProps = FieldControlProps & {
  children: ReactNode;
  orientation?: React.ComponentPropsWithoutRef<typeof Field>["orientation"];
};

const hintTrigger = (
  <button
    aria-label="More information"
    className="inline-flex items-center justify-center"
    type="button"
  >
    <HelpCircle
      aria-hidden="true"
      className="size-4 text-muted-foreground transition-colors hover:text-foreground"
    />
  </button>
);

/** Plain-text hints render as a Tooltip; rich (ReactNode) hints render as a HoverCard. */
function FieldHint({
  tooltip,
  side,
  align,
}: {
  tooltip: ReactNode;
  side: FieldControlProps["tooltipSide"];
  align: FieldControlProps["tooltipAlign"];
}) {
  if (typeof tooltip === "string") {
    return (
      <Tooltip>
        <TooltipTrigger render={hintTrigger} />
        <TooltipContent align={align} side={side}>{tooltip}</TooltipContent>
      </Tooltip>
    );
  }
  return (
    <HoverCard>
      <HoverCardTrigger closeDelay={100} delay={120} render={hintTrigger} />
      <HoverCardContent align={align} className="w-80" side={side}>{tooltip}</HoverCardContent>
    </HoverCard>
  );
}

export function BaseField({
  children,
  label,
  description,
  orientation,
  classNames,
  tooltip,
  tooltipSide = "top",
  tooltipAlign = "center",
}: BaseFieldProps) {
  const field = useFieldContext();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field className={classNames?.base} data-invalid={isInvalid} orientation={orientation}>
      <FieldLabel className={classNames?.label} htmlFor={field.name}>
        {label}{" "}
        {tooltip && (
          <FieldHint align={tooltipAlign} side={tooltipSide} tooltip={tooltip} />
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
  tooltipAlign = "center",
  controlFirst,
}: BaseFieldProps & { controlFirst?: boolean }) {
  const field = useFieldContext();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const fieldContent = (
    <FieldContent>
      <FieldLabel className={classNames?.label} htmlFor={field.name}>
        {label}{" "}
        {tooltip && (
          <FieldHint align={tooltipAlign} side={tooltipSide} tooltip={tooltip} />
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
