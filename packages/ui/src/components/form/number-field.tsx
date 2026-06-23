import { Input } from "#components/shadcn/input";

import { BaseField, type FieldControlProps } from "./base-field";
import { useFieldContext } from "./context";

type NumberFieldProps = React.ComponentProps<typeof Input> &
  FieldControlProps & {
    type?: "number";
  };

export function NumberField({
  label,
  description,
  classNames,
  tooltip,
  tooltipSide,
  ...props
}: NumberFieldProps) {
  const field = useFieldContext<number>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <BaseField
      classNames={classNames}
      description={description}
      label={label}
      tooltip={tooltip}
      tooltipSide={tooltipSide}
    >
      <Input
        aria-invalid={isInvalid}
        id={field.name}
        name={field.name}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.valueAsNumber)}
        type="number"
        value={field.state.value}
        {...props}
      />
    </BaseField>
  );
}
