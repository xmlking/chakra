import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "#components/shadcn/input-group";

import { BaseField, type FieldControlProps } from "./base-field";
import { useFieldContext } from "./context";

type PasswordFieldProps = React.ComponentProps<typeof InputGroupInput> & FieldControlProps;

export function PasswordField({
  label,
  description,
  classNames,
  tooltip,
  tooltipSide,
  ...props
}: PasswordFieldProps) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  return (
    <BaseField
      classNames={classNames}
      description={description}
      label={label}
      tooltip={tooltip}
      tooltipSide={tooltipSide}
    >
      <InputGroup>
        <InputGroupInput
          aria-invalid={isInvalid}
          id={field.name}
          name={field.name}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          type={isVisible ? "text" : "password"}
          value={field.state.value ?? undefined}
          {...props}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton onClick={toggleVisibility} tabIndex={-1}>
            {isVisible ? <EyeOffIcon aria-hidden="true" /> : <EyeIcon aria-hidden="true" />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </BaseField>
  );
}
