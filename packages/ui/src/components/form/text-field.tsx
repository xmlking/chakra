import { Input } from "#components/shadcn/input";

import { BaseField, type FieldControlProps } from "./base-field";
import { useFieldContext } from "./context";

type TextFieldProps = React.ComponentProps<typeof Input> &
  FieldControlProps & {
    type?: "text" | "email" | "url";
  };

export function TextField({
  label,
  description,
  tooltip,
  tooltipSide,
  classNames,
  type = "text",
  ...props
}: TextFieldProps) {
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
      <Input
        aria-invalid={isInvalid}
        className="placeholder:text-neutral-400"
        id={field.name}
        name={field.name}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        type={type}
        value={field.state.value ?? undefined}
        {...props}
      />
    </BaseField>
  );
}

/**
type MyState = {
  count: number; // like this
};

class TextField extends Component<TextFieldProps, MyState> {
  static displayName = 'TextField'

  render() {
    const field = useFieldContext<string>();
    const { label, placeholder, type, ...props } = this.props;

    return (
      <Field>
        <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
        <Input
          type={type}
          aria-invalid={field.state.meta.errors.length > 0}
          id={field.name}
          value={field.state.value ?? undefined}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          placeholder={placeholder}
          autoComplete="off"
          {...props}
        />
        <FieldError>
          {field.state.meta.errors.map((e) => e?.message).join(", ")}
        </FieldError>
      </Field>
    );
  }
}
*/
