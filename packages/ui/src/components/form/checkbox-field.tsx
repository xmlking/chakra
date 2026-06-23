import { Checkbox } from "#components/shadcn/checkbox";
import { FieldLabel } from "#components/shadcn/field";

import { BaseAltField, type FieldControlProps } from "./base-field";
import { useFieldContext } from "./context";

type CheckboxFieldProps = React.ComponentProps<typeof Checkbox> & FieldControlProps;

export function CheckboxField({
  label,
  description,
  tooltip,
  classNames,
  tooltipSide,
  ...props
}: CheckboxFieldProps) {
  const field = useFieldContext<boolean>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FieldLabel className={classNames?.base} htmlFor={field.name}>
      <BaseAltField
        classNames={classNames}
        controlFirst
        description={description}
        label={label}
        orientation="horizontal"
        tooltip={tooltip}
        tooltipSide={tooltipSide}
      >
        <Checkbox
          aria-invalid={isInvalid}
          checked={field.state.value}
          id={field.name}
          name={field.name}
          onBlur={field.handleBlur}
          onCheckedChange={(value) => field.handleChange(!!value)}
          {...props}
        />
      </BaseAltField>
    </FieldLabel>
  );
}
