/**
 * Source: https://github.com/mantinedev/mantine/blob/master/packages/%40mantine/core/src/components/JsonInput/JsonInput.tsx
 */

import type React from "react";
import { useEffect, useState } from "react";

import { Textarea } from "#components/shadcn/textarea";

import { BaseField, type FieldControlProps } from "./base-field";
import { useFieldContext } from "./context";

type JSONFieldProps = React.ComponentProps<typeof Textarea> & FieldControlProps;

export function JSONField({
  label,
  description,
  classNames,
  tooltip,
  tooltipSide,
  ...props
}: JSONFieldProps) {
  const field = useFieldContext<Record<string, unknown> | undefined>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const [text, setText] = useState(() =>
    field.state.value ? JSON.stringify(field.state.value, null, 2) : "",
  );

  useEffect(() => {
    const value = field.state.value;
    const next = value ? JSON.stringify(value, null, 2) : "";
    setText(next);
  }, [field.state.value]);

  const applyChange = () => {
    const trimmed = text.trim();
    if (!trimmed) {
      field.handleChange(undefined);
      field.setErrorMap({ onBlur: undefined });
      return;
    }

    try {
      const parsed = JSON.parse(trimmed);
      if (!parsed || typeof parsed !== "object") {
        throw new Error("Invalid JSON");
      }
      field.handleChange(parsed as Record<string, unknown>);
      field.setErrorMap({ onBlur: undefined });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid JSON";
      field.setErrorMap({ onBlur: message });
    }
  };

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
        className="field-sizing-fixed min-h-0"
        id={field.name}
        name={field.name}
        onBlur={() => {
          applyChange();
          field.handleBlur();
        }}
        onChange={(event) => setText(event.target.value)}
        value={text}
        {...props}
      />
    </BaseField>
  );
}
