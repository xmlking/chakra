import type { ReactNode } from "react";

import { Select, SelectContent, SelectTrigger, SelectValue } from "#components/shadcn/select";

import { BaseField, type FieldControlProps } from "./base-field";
import { useFieldContext } from "./context";

type SelectFieldProps = React.ComponentProps<typeof Select> &
  React.ComponentProps<typeof SelectValue> &
  FieldControlProps;

export function SelectField({
  label,
  description,
  classNames,
  placeholder,
  children,
  tooltip,
  tooltipSide,
  ...props
}: SelectFieldProps & { children: ReactNode }) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <BaseField
      classNames={classNames}
      description={description}
      label={label}
      tooltip={tooltip}
      tooltipSide={tooltipSide}
    >
      <Select
        id={field.name}
        name={field.name}
        onValueChange={(value) => field.handleChange(value as string)}
        value={field.state.value ?? undefined}
        {...props}
      >
        <SelectTrigger aria-invalid={isInvalid} id={field.name} onBlur={field.handleBlur}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
    </BaseField>
  );
}
