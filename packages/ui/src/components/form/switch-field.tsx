import { Switch } from "#components/shadcn/switch";

import { BaseAltField, type FieldControlProps } from "./base-field";
import { useFieldContext } from "./context";

type SwitchFieldProps = React.ComponentProps<typeof Switch> & FieldControlProps;

export function SwitchField({
  label,
  description,
  classNames,
  tooltip,
  tooltipSide,
  ...props
}: SwitchFieldProps) {
  const field = useFieldContext<boolean>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <BaseAltField
      classNames={classNames}
      description={description}
      label={label}
      orientation="horizontal"
      tooltip={tooltip}
      tooltipSide={tooltipSide}
    >
      <Switch
        aria-invalid={isInvalid}
        checked={field.state.value}
        id={field.name}
        name={field.name}
        onBlur={field.handleBlur}
        onCheckedChange={(value) => field.handleChange(!!value)}
        {...props}
      />
    </BaseAltField>
  );
}
