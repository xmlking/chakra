/**
 * Source: https://github.com/VivienSSS/ocampoapartments/blob/master/src/components/ui/forms/fields/radio-group.tsx
 * https://www.shadcn.io/components/forms/choicebox
 * HINT(orientation):  add `className="grid grid-cols-3 gap-2"` to `<field.RadioCardField` for horizontal orientation
 */
import type React from "react";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "#components/shadcn/field";
import { RadioGroup, RadioGroupItem } from "#components/shadcn/radio-group";

import type { FieldControlProps } from "./base-field";
import { useFieldContext } from "./context";

type RadioOption = { label: string; value: string; description?: string };

type RadioFieldProps = React.ComponentProps<typeof RadioGroup> &
  FieldControlProps & {
    options: Readonly<RadioOption[]>;
  };

export function RadioGroupField({
  label,
  description,
  classNames,
  options,
  ...props
}: RadioFieldProps) {
  const field = useFieldContext<string>();

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FieldSet className={classNames?.base}>
      <FieldLegend className={classNames?.label}>{label}</FieldLegend>
      {description && (
        <FieldDescription className={classNames?.description}>{description}</FieldDescription>
      )}
      <RadioGroup
        aria-invalid={isInvalid}
        name={field.name}
        onValueChange={field.handleChange}
        value={field.state.value ?? undefined}
        {...props}
      >
        {options.map((option) => (
          <Field data-invalid={isInvalid} key={option.label} orientation="horizontal">
            <RadioGroupItem aria-invalid={isInvalid} id={option.value} value={option.value} />
            <FieldLabel className="font-normal" htmlFor={option.value}>
              {option.label}{" "}
              {option.description && <FieldDescription> {option.description}</FieldDescription>}
            </FieldLabel>
          </Field>
        ))}
      </RadioGroup>
      {isInvalid && <FieldError className={classNames?.error} errors={field.state.meta.errors} />}
    </FieldSet>
  );
}

export function RadioCardField({
  label,
  description,
  classNames,
  options,
  ...props
}: RadioFieldProps) {
  const field = useFieldContext<string>();

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FieldSet className={classNames?.base}>
      <FieldLegend className={classNames?.label}>{label}</FieldLegend>
      {description && (
        <FieldDescription className={classNames?.description}>{description}</FieldDescription>
      )}
      <RadioGroup
        aria-invalid={isInvalid}
        name={field.name}
        onValueChange={field.handleChange}
        value={field.state.value ?? undefined}
        {...props}
      >
        {options.map((option) => (
          <FieldLabel className="cursor-pointer" htmlFor={option.value} key={option.value}>
            <Field data-invalid={isInvalid} orientation="horizontal">
              <FieldContent>
                <FieldTitle>{option.label}</FieldTitle>
                {option.description && <FieldDescription>{option.description}</FieldDescription>}
              </FieldContent>
              <RadioGroupItem aria-invalid={isInvalid} id={option.value} value={option.value} />
            </Field>
          </FieldLabel>
        ))}
      </RadioGroup>
      {isInvalid && <FieldError className={classNames?.error} errors={field.state.meta.errors} />}
    </FieldSet>
  );
}
