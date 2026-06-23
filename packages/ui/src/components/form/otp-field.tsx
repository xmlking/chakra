import React from "react";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "#components/shadcn/input-otp";

import { BaseField, type FieldControlProps } from "./base-field";
import { useFieldContext } from "./context";

type OTPFieldProps = Omit<React.ComponentProps<typeof InputOTP>, "render"> & FieldControlProps;

const groupSize = 3;
export function OTPField({
  label,
  description,
  classNames,
  tooltip,
  tooltipSide,
  maxLength,
  ...props
}: OTPFieldProps) {
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
      <InputOTP
        aria-invalid={isInvalid}
        id={field.name}
        maxLength={maxLength}
        name={field.name}
        onBlur={field.handleBlur}
        onChange={(value) => field.handleChange(value)}
        value={field.state.value ?? undefined}
        {...props}
      >
        {Array.from({ length: Math.ceil(maxLength / groupSize) }).map((_, groupIndex) => {
          const startIndex = groupIndex * groupSize;
          const endIndex = Math.min(startIndex + groupSize, maxLength);
          return (
            <React.Fragment key={groupIndex}>
              <InputOTPGroup>
                {Array.from({ length: endIndex - startIndex }).map((_slot, slotIndex) => (
                  <InputOTPSlot index={startIndex + slotIndex} key={slotIndex} />
                ))}
              </InputOTPGroup>
              {endIndex < maxLength && <InputOTPSeparator />}
            </React.Fragment>
          );
        })}
      </InputOTP>
    </BaseField>
  );
}
