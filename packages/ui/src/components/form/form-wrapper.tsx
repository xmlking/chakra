import type * as React from "react";

import { FieldDescription, FieldLegend, FieldSet } from "#components/shadcn/field";

import { useFormContext } from "./context";

type FormWrapperProps = Omit<React.ComponentProps<"form">, "onSubmit"> & {
  label?: string;
  description?: string;
};

export function FormWrapper({ label, description, children, ...props }: FormWrapperProps) {
  const form = useFormContext();
  return (
    // oxlint-disable-next-line react-doctor/no-prevent-default
    <form
      id={form.formId}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        // oxlint-disable-next-line typescript/no-floating-promises
        form.handleSubmit();
      }}
      {...props}
    >
      <FieldSet>
        {label && <FieldLegend>{label}</FieldLegend>}
        {description && <FieldDescription>{description}</FieldDescription>}
        {children}
      </FieldSet>
    </form>
  );
}
