import { Textarea } from "#components/shadcn/textarea";

import { BaseField, type FieldControlProps } from "./base-field";
import { useFieldContext } from "./context";

type TextareaFieldProps = React.ComponentProps<typeof Textarea> & FieldControlProps;

export function TextareaField({
  label,
  description,
  classNames,
  tooltip,
  tooltipSide,
  ...props
}: TextareaFieldProps) {
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
      <Textarea
        aria-invalid={isInvalid}
        id={field.name}
        name={field.name}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        value={field.state.value ?? undefined}
        {...props}
      />
    </BaseField>
  );
}
