/**
 * https://github.com/VivienSSS/ocampoapartments/blob/master/src/components/ui/forms/fields/checkbox-group.tsx
 * mode="array"
 */

import type React from "react";

import { Checkbox } from "#components/shadcn/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "#components/shadcn/field";

import type { FieldControlProps } from "./base-field";
import { useFieldContext } from "./context";

type CheckboxOption = { label: string; value: string; description?: string };

type CheckboxGroupFieldProps = React.ComponentProps<typeof Checkbox> &
  FieldControlProps & {
    options: Readonly<CheckboxOption[]>;
  };

export function CheckboxGroupField({
  label,
  description,
  classNames,
  options,
  ...props
}: CheckboxGroupFieldProps) {
  const field = useFieldContext<string[]>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FieldSet className={classNames?.base}>
      <FieldLegend className={classNames?.label}>{label}</FieldLegend>
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldGroup data-slot="checkbox-group">
        {options.map((option) => (
          <Field data-invalid={isInvalid} key={option.value} orientation="horizontal">
            <Checkbox
              aria-invalid={isInvalid}
              checked={(field.state.value || []).includes(option.value)}
              id={option.value}
              name={field.name}
              onCheckedChange={(checked) => {
                if (checked) {
                  field.pushValue(option.value);
                } else {
                  const index = (field.state.value || []).indexOf(option.value);
                  if (index > -1) {
                    field.removeValue(index);
                  }
                }
              }}
              {...props}
            />
            <FieldContent>
              <FieldLabel className={classNames?.label} htmlFor={option.value}>
                {option.label}
              </FieldLabel>
              {option.description && (
                <FieldDescription className={classNames?.description}>
                  {option.description}
                </FieldDescription>
              )}
            </FieldContent>
          </Field>
        ))}
      </FieldGroup>
      {isInvalid && <FieldError className={classNames?.error} errors={field.state.meta.errors} />}
    </FieldSet>
  );
}
