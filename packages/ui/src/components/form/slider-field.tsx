import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "#components/shadcn/field";
import { Slider } from "#components/shadcn/slider";
import { cn } from "#lib/utils";

import type { FieldControlProps } from "./base-field";
import { useFieldContext } from "./context";

type SliderFieldProps = React.ComponentProps<typeof Slider> &
  FieldControlProps & {
    showValue?: boolean;
  };

export function SliderField({
  label,
  description,
  classNames,
  min = 0,
  max = 100,
  step = 1,
  showValue = true,
  ...props
}: SliderFieldProps) {
  const field = useFieldContext<number>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field className={classNames?.base} data-invalid={isInvalid}>
      <FieldContent>
        <FieldLabel
          className={cn("flex w-full items-center justify-between", classNames?.label)}
          htmlFor={field.name}
        >
          {label}
          {showValue && (
            <span className="text-sm font-medium text-gray-500">
              {field.state.value}/{max}
            </span>
          )}
        </FieldLabel>
        {description && (
          <FieldDescription className={classNames?.description}>{description}</FieldDescription>
        )}
      </FieldContent>
      <Slider
        aria-invalid={isInvalid}
        id={field.name}
        max={max}
        min={min}
        name={field.name}
        onBlur={field.handleBlur}
        onValueChange={(value) => {
          if (value[0] !== undefined) {
            field.handleChange(value[0]);
          }
        }}
        step={step}
        value={[field.state.value || 0]}
        {...props}
      />
      {isInvalid && <FieldError className={classNames?.error} errors={field.state.meta.errors} />}
    </Field>
  );
}
