import type * as React from "react";

import { DateTimePicker } from "#components/sumo/datetime-picker";

import { BaseField, type FieldControlProps } from "./base-field";
import { useFieldContext } from "./context";

export type DateTimeFieldProps = Omit<
  React.ComponentProps<typeof DateTimePicker>,
  "value" | "onChange"
> &
  FieldControlProps;

export function DateTimeField({
  label,
  description,
  classNames,
  tooltip,
  tooltipSide,
  ...props
}: DateTimeFieldProps) {
  // The `Field` infers that it should have a `value` type of `Date`
  const field = useFieldContext<Date | undefined>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <BaseField
      classNames={classNames}
      description={description}
      label={label}
      tooltip={tooltip}
      tooltipSide={tooltipSide}
    >
      <DateTimePicker
        aria-invalid={isInvalid}
        onChange={field.handleChange}
        value={field.state.value}
        {...props}
      />
    </BaseField>
  );
}
