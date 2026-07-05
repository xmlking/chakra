import { ToggleGroup, ToggleGroupItem } from "#components/shadcn/toggle-group";

import { BaseField, type FieldControlProps } from "./base-field";
import { useFieldContext } from "./context";

interface ToggleGroupOption<T extends string> {
  label: React.ReactNode;
  value: T;
}

type ToggleGroupFieldProps<T extends string> = React.ComponentProps<typeof ToggleGroup> &
  FieldControlProps & {
    options: ToggleGroupOption<T>[];
  };

export function ToggleGroupField<T extends string>({
  label,
  description,
  classNames,
  options,
  multiple = false,
  variant,
  size,
  spacing,
  className,
  disabled,
  ...props
}: ToggleGroupFieldProps<T>) {
  const field = useFieldContext<typeof multiple extends false ? string : string[]>();

  return (
    <BaseField classNames={classNames} description={description} label={label}>
      <ToggleGroup
        className={className}
        disabled={disabled}
        onBlur={field.handleBlur}
        onValueChange={field.handleChange}
        size={size}
        spacing={spacing}
        multiple={multiple}
        value={field.state.value}
        variant={variant}
        {...props}
      >
        {options.map((option) => (
          <ToggleGroupItem
            aria-label={
              typeof option.label === "string" ? `Toggle ${option.label}` : "Toggle option"
            }
            className="cursor-pointer"
            key={option.value}
            value={option.value}
          >
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </BaseField>
  );
}
